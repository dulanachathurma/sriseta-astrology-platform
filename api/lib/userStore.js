import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, isMongoConfigured } from './mongodb.js';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sriseta_super_secret_jwt_key_2026';

// Persistent file fallback for local development only
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
 * Verify JWT token and extract user payload
 */
export function verifyAuthToken(token) {
  if (!token) return null;
  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    return jwt.verify(cleanToken, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Register a user via MongoDB Atlas (or local file store in local dev)
 */
export async function registerUser({ email, password, name }) {
  const normalizedEmail = (email || '').toLowerCase().trim();

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
          name: (name || '').trim(),
        });

        const token = jwt.sign(
          { userId: user._id.toString(), email: user.email },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        return {
          success: true,
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        };
      }
    } catch (dbErr) {
      console.error('MongoDB Atlas registration error:', dbErr.message);
      return {
        error: 'දත්ත ගබඩාව (Database) හා සම්බන්ධ වීමේ දෝෂයක්. කරුණාකර සුළු මොහොතකින් නැවත උත්සාහ කරන්න.',
        status: 500,
      };
    }
  }

  // If in production serverless without MongoDB configured
  if (isServerless) {
    return {
      error: 'MongoDB Atlas දත්ත ගබඩාව සම්බන්ධ කර නොමැත. කරුණාකර Vercel Environment Variables වල MONGODB_URI ඇතුළත් කරන්න.',
      status: 500,
    };
  }

  // Local development fallback
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
    name: (name || '').trim(),
    horoscopeProfile: null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  };
}

/**
 * Authenticate a user via MongoDB Atlas (or local file store in local dev)
 */
export async function loginUser({ email, password }) {
  const normalizedEmail = (email || '').toLowerCase().trim();

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
          { userId: user._id.toString(), email: user.email },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        return {
          success: true,
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            horoscopeProfile: user.horoscopeProfile || null,
          },
        };
      }
    } catch (dbErr) {
      console.error('MongoDB Atlas login error:', dbErr.message);
      return {
        error: 'දත්ත ගබඩාව හා සම්බන්ධ වීමේ දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න.',
        status: 500,
      };
    }
  }

  if (isServerless) {
    return {
      error: 'MongoDB Atlas දත්ත ගබඩාව සම්බන්ධ කර නොමැත. කරුණාකර Vercel Environment Variables වල MONGODB_URI ඇතුළත් කරන්න.',
      status: 500,
    };
  }

  // Local development fallback
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
    { expiresIn: '30d' }
  );

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      horoscopeProfile: user.horoscopeProfile || null,
    },
  };
}

/**
 * Retrieve user profile and horoscope data by userId
 */
export async function getUserProfile(userId) {
  if (!userId) return null;

  if (isMongoConfigured()) {
    try {
      const db = await connectToDatabase();
      if (db) {
        const user = await User.findById(userId).select('-password');
        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            horoscopeProfile: user.horoscopeProfile || null,
          };
        }
      }
    } catch (err) {
      console.error('Failed to get user profile from MongoDB:', err.message);
    }
  }

  if (!isServerless) {
    const users = getLocalUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        horoscopeProfile: user.horoscopeProfile || null,
      };
    }
  }

  return null;
}

/**
 * Save / Update user horoscope profile
 */
export async function saveUserHoroscopeProfile(userId, horoscopeData) {
  if (!userId) return null;

  if (isMongoConfigured()) {
    try {
      const db = await connectToDatabase();
      if (db) {
        const updated = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              horoscopeProfile: {
                birthDate: horoscopeData.birthDate || '',
                lagna: horoscopeData.lagna || '',
                navamshaka: horoscopeData.navamshaka || '',
                planetaryPositions: horoscopeData.planetaryPositions || {},
                selectedTopics: horoscopeData.selectedTopics || [],
                report: horoscopeData.report || '',
                updatedAt: new Date(),
              },
            },
          },
          { new: true }
        ).select('-password');

        if (updated) {
          return {
            id: updated._id.toString(),
            email: updated.email,
            name: updated.name,
            horoscopeProfile: updated.horoscopeProfile,
          };
        }
      }
    } catch (err) {
      console.error('Failed to update horoscope in MongoDB:', err.message);
    }
  }

  if (!isServerless) {
    const users = getLocalUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      users[idx].horoscopeProfile = {
        birthDate: horoscopeData.birthDate || '',
        lagna: horoscopeData.lagna || '',
        navamshaka: horoscopeData.navamshaka || '',
        planetaryPositions: horoscopeData.planetaryPositions || {},
        selectedTopics: horoscopeData.selectedTopics || [],
        report: horoscopeData.report || '',
        updatedAt: new Date().toISOString(),
      };
      saveLocalUsers(users);
      return {
        id: users[idx].id,
        email: users[idx].email,
        name: users[idx].name,
        horoscopeProfile: users[idx].horoscopeProfile,
      };
    }
  }

  return null;
}
