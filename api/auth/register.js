import { registerUser } from '../lib/userStore.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body || {};

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'ඊමේල් සහ මුරපදය අවශ්‍යයි.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'මුරපදය අක්ෂර 6කට වඩා දිගු විය යුතුය.' });
    }

    const result = await registerUser({ email, password, name });

    if (result.error) {
      return res.status(result.status || 400).json({ success: false, message: result.error });
    }

    return res.status(201).json({
      success: true,
      message: 'ගිණුම සාර්ථකව නිර්මාණය කරන ලදී!',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'සේවාදායකයේ දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    });
  }
}
