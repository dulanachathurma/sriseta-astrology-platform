import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, isMongoConfigured } from './mongodb.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sriseta_super_secret_jwt_key_2026';

// Local file fallback for development when MongoDB Atlas is not yet connected
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isServerless ? '/tmp' : path.resolve(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureLocalDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
    }
  } catch (err) {
    console.warn('Could not init local data file:', err.message);
  }
}

function getLocalUsers() {
  try {
    ensureLocalDataFile();
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch {
    return [];
  }
  return [];
}

function saveLocalUsers(users) {
  try {
    ensureLocalDataFile();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save local users:', err.message);
  }
}

/**
 * Register a user either via MongoDB or via persistent local store
 */
export async function registerUser({ email, password, name }) {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Try MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await connectToDatabase();
      if (db) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return { error: 'මෙම ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත.', status: 409 };
        }

        const user = await User.create({
          email: normalizedEmail,
          password,
          name: name?.trim() || '',
        });

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
          success: true,
          token,
          user: { id: user._id, email: user.email, name: user.name },
        };
      }
    } catch (dbErr) {
      console.warn('MongoDB connection failed, falling back to local storage:', dbErr.message);
    }
  }

  // 2. Persistent Local Storage Fallback
  const users = getLocalUsers();
  const existing = users.find((u) => u.email === normalizedEmail);
  if (existing) {
    return { error: 'මෙම ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත.', status: 409 };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = {
    id: 'usr_' + Date.now(),
    email: normalizedEmail,
    password: hashedPassword,
    name: name?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
  };
}

/**
 * Authenticate a user via MongoDB or local store
 */
export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Try MongoDB if configured
  if (isMongoConfigured()) {
    try {
      const db = await connectToDatabase();
      if (db) {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
          return { error: 'ඊමේල් හෝ මුරපදය වැරදිය.', status: 401 };
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return { error: 'ඊමේල් හෝ මුරපදය වැරදිය.', status: 401 };
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return {
          success: true,
          token,
          user: { id: user._id, email: user.email, name: user.name },
        };
      }
    } catch (dbErr) {
      console.warn('MongoDB query failed, falling back to local storage:', dbErr.message);
    }
  }

  // 2. Local Storage Fallback
  const users = getLocalUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return { error: 'ඊමේල් හෝ මුරපදය වැරදිය.', status: 401 };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: 'ඊමේල් හෝ මුරපදය වැරදිය.', status: 401 };
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
}
