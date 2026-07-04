import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SOURCE_URL = 'https://www.divaina.lk/nakatha/84589';

// AI මගින් කෙටි කර නැවත ලිවීම
async function rewriteWithAI(originalText, sign) {
  try {
    const prompt = `පහත දැක්වෙන '${sign}' ලග්නයේ පලාපල තොරතුරු ඉතා කෙටියෙන් (උපරිම වාක්‍ය 2කින්) සරල සිංහලෙන් නැවත ලියන්න. මූලාශ්‍ර ගැන සඳහන් නොකරන්න. පලාපල විතරක් ලියන්න: "${originalText}"`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    return originalText.substring(0, 150) + "..."; // AI වැඩ නොකළහොත් මුල් පිටපතෙන් කොටසක් ලබා දේ
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { data: html } = await axios.get(SOURCE_URL);
    const $ = cheerio.load(html);
    
    // මූලික දත්ත ලබා ගැනීම (ඔබේ පැරණි logic එක භාවිතා වේ)
    const paragraphs = [];
    $('article .entry-content p, .td-post-content p').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 20) paragraphs.push(text);
    });

    // මෙහිදී ලග්න අනුපිළිවෙලින් දත්ත වෙන් කර AI හරහා යවයි
    const RASHI_NAMES = ['මේෂ', 'වෘෂභ', 'මිථුන', 'කටක', 'සිංහ', 'කන්‍යා', 'තුලා', 'වෘශ්චික', 'ධනු', 'මකර', 'කුම්භ', 'මීන'];
    
    const finalItems = [];
    for (const sign of RASHI_NAMES) {
      const originalText = paragraphs.find(p => p.includes(sign)) || "මෙම සතියේ සාමාන්‍ය පලාපල ගෙන දෙයි.";
      const shortText = await rewriteWithAI(originalText, sign);
      finalItems.push({ sign, text: shortText });
    }

    res.status(200).json({ success: true, items: finalItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
