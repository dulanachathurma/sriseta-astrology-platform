import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SOURCE_URL = 'https://www.divaina.lk/nakatha/84589';

// ලග්නවලට අදාළ කෙටි හඳුන්වාදීම්
const signIntroductions = {
  'මේෂ': 'මේෂ ලග්නය උත්සාහවන්ත බවත්, නිර්භීත බවත් සංකේතවත් කරයි.',
  'වෘෂභ': 'වෘෂභ ලග්නය ඉවසීම සහ ස්ථාවරත්වය මුල් කරගත් ලග්නයකි.',
  'මිථුන': 'මිථුන ලග්නය බුද්ධිමත් බවත්, සමාජශීලී බවත් විදහා දක්වයි.',
  'කටක': 'කටක ලග්නය හැඟීම්බර සහ සෙනෙහසින් පිරි ලග්නයකි.',
  'සිංහ': 'සිංහ ලග්නය ආත්ම විශ්වාසය සහ නායකත්ව ගුණාංගවලට උරුමකම් කියයි.',
  'කන්‍යා': 'කන්‍යා ලග්නය ඉතා ක්‍රමානුකූල සහ විශ්ලේෂණාත්මක ලග්නයකි.',
  'තුලා': 'තුලා ලග්නය සමබරතාවය සහ යුක්තිගරුක බව අගය කරයි.',
  'වෘශ්චික': 'වෘශ්චික ලග්නය තීක්ෂණ බුද්ධිය සහ අධිෂ්ඨානය සහිත ලග්නයකි.',
  'ධනු': 'ධනු ලග්නය නිදහස සහ සුභවාදී බව පිරුණු ලග්නයකි.',
  'මකර': 'මකර ලග්නය කැපවීම සහ අරමුණු ජයගැනීමේ හැකියාව සහිත ලග්නයකි.',
  'කුම්භ': 'කුම්භ ලග්නය නවීන සිතුවිලි සහ මානුෂීය ගුණාංග සහිත ලග්නයකි.',
  'මීන': 'මීන ලග්නය නිර්මාණශීලී සහ කරුණාවන්ත ලග්නයකි.'
};

async function rewriteWithAI(originalText, sign) {
  try {
    const prompt = `පහත දැක්වෙන '${sign}' ලග්නයේ පලාපල තොරතුරු ඉතා කෙටියෙන්, සරල සිංහලෙන් උපරිම වාක්‍ය 2කින් ලියන්න. මූලාශ්‍ර ගැන සඳහන් නොකරන්න. පලාපල පමණක් ලියන්න: "${originalText}"`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    return originalText.substring(0, 150) + "...";
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { data: html } = await axios.get(SOURCE_URL);
    const $ = cheerio.load(html);
    
    const paragraphs = [];
    $('article .entry-content p, .td-post-content p').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 10) paragraphs.push(text);
    });

    const RASHI_NAMES = ['මේෂ', 'වෘෂභ', 'මිථුන', 'කටක', 'සිංහ', 'කන්‍යා', 'තුලා', 'වෘශ්චික', 'ධනු', 'මකර', 'කුම්භ', 'මීන'];
    
    const finalItems = [];
    for (const sign of RASHI_NAMES) {
      const originalText = paragraphs.find(p => p.includes(sign));
      
      let shortText;
      if (originalText) {
        shortText = await rewriteWithAI(originalText, sign);
      } else {
        shortText = signIntroductions[sign] || "ඔබේ ලග්නයට සුබ සතියක් වේවා!";
      }
      
      finalItems.push({ sign, text: shortText });
    }

    res.status(200).json({ success: true, items: finalItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
