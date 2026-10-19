import { loginUser } from '../lib/userStore.js';

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
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'ඊමේල් සහ මුරපදය අවශ්‍යයි.' });
    }

    const result = await loginUser({ email, password });

    if (result.error) {
      return res.status(result.status || 401).json({ success: false, message: result.error });
    }

    return res.status(200).json({
      success: true,
      message: 'සාර්ථකව ප්‍රවේශ වූහ!',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'සේවාදායකයේ දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.',
    });
  }
}
