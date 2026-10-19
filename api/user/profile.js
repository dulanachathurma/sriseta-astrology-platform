import { verifyAuthToken, getUserProfile, saveUserHoroscopeProfile } from '../lib/userStore.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const decoded = verifyAuthToken(authHeader);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({
      success: false,
      message: 'වලංගු ප්‍රවේශ ටෝකනයක් නොමැත. කරුණාකර නැවත ලොගින් වන්න.',
    });
  }

  if (req.method === 'GET') {
    try {
      const user = await getUserProfile(decoded.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'පරිශීලකයා හමු නොවීය.' });
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ success: false, message: 'දෝෂයක් ඇති විය.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await saveUserHoroscopeProfile(decoded.userId, req.body || {});
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Profile save error:', error);
      return res.status(500).json({ success: false, message: 'දෝෂයක් ඇති විය.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
