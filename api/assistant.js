// Vercel Serverless Function: POST /api/assistant
//
// Wired up to call Anthropic's Claude API directly. Add ANTHROPIC_API_KEY to
// your environment (see below) and this works out of the box — no other
// code changes needed.
//
// LOCAL DEV: create a `.env.local` file in the project root with:
//   ANTHROPIC_API_KEY=sk-ant-...
// then run `vercel dev` (NOT `npm run dev` — plain Vite doesn't run /api
// routes at all, see README/DEPLOYMENT.md).
//
// PRODUCTION: add ANTHROPIC_API_KEY under
// Vercel Project Settings → Environment Variables, then redeploy.

const SYSTEM_PROMPT = `ඔබ "ශ්‍රී සෙත ජ්‍යොතිෂ්‍ය සේවය" වෙබ් අඩවියේ AI සහායකයා. ඔබ ජ්‍යොතිෂවේදිනී ශ්‍රියාණි සමරවීර මහත්මිය විසින් සපයන පොරොන්දම් බැලීම, හඳහන් සෑදීම සහ පලාපල විස්තර සේවා ගැන ගනුදෙනුකරුවන්ට කෙටියෙන්, මිත්‍රශීලීව, සිංහලෙන් උදව් කරයි.
ලග්න/රාශි පිළිබඳ සාමාන්‍ය ජ්‍යොතිෂ දැනුම (ගුණාංග, ලක්ෂණ) කෙටියෙන් පැහැදිලි කළ හැක, නමුත් පුද්ගලික අනාවැකි/පලාපල ලබා දිය නොහැක — ඒ සඳහා සේවා අයදුම්පත හරහා (WhatsApp) සම්බන්ධ වන ලෙස යෝජනා කරන්න. පිළිතුරු කෙටි හා පැහැදිලි වන්න.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    res.status(200).json({
      reply:
        'AI සහායක සේවාව මෙම මොහොතේ සකස් වෙමින් පවතී (ANTHROPIC_API_KEY සකසා නොමැත). ඉක්මන් සහයක් සඳහා කරුණාකර WhatsApp හරහා අප හා සම්බන්ධ වන්න.',
      provider: null,
    });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          // Keep a short rolling history so replies stay on-topic across turns.
          ...history.slice(-6).map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text,
          })),
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const reply = data.content?.find((b) => b.type === 'text')?.text || 'සමාවන්න, පිළිතුරක් ලබා ගැනීමට නොහැකි විය.';

    res.status(200).json({ reply, provider: 'anthropic' });
  } catch (err) {
    res.status(502).json({
      reply: 'සමාවන්න, AI සහායක සේවාව සමඟ සම්බන්ධ වීමේදී දෝෂයක් ඇති විය. කරුණාකර WhatsApp හරහා අප හා සම්බන්ධ වන්න.',
      error: err.message,
      provider: 'anthropic',
    });
  }
}