import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Calls the /api/assistant serverless function, forwarding recent chat
// history so replies stay on-topic across turns.
export async function sendAssistantMessage(message, history = []) {
  const { data } = await axios.post(
    `${BASE_URL}/api/assistant`,
    { message, history },
    { timeout: 20000 }
  );
  return data.reply;
}