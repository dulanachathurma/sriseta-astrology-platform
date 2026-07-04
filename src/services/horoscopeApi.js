import axios from 'axios';

// On Vercel, /api/* is served by the same deployment (relative URL works
// for both preview and production). VITE_API_BASE_URL lets you point the
// dev server at a different host if you ever split the API out.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchWeeklyHoroscope() {
  const { data } = await axios.get(`${BASE_URL}/api/weekly-horoscope`, {
    timeout: 15000,
  });
  return data;
}
