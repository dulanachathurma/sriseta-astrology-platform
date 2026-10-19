import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyAuthToken, saveUserHoroscopeProfile } from '../lib/userStore.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ZODIAC_SI = {
  mesha: 'මේෂ', vrushabha: 'වෘෂභ', mithuna: 'මිථුන', kataka: 'කටක',
  simha: 'සිංහ', kanya: 'කන්‍යා', thula: 'තුලා', vrushchika: 'වෘශ්චික',
  dhanu: 'ධනු', makara: 'මකර', kumbha: 'කුම්භ', meena: 'මීන',
};

const PLANET_SI = {
  guru: 'ගුරු (බ්‍රහස්පති)', kuja: 'කුජ (අඟහරු)', sikuru: 'සිකුරු', ravi: 'රවි (හිරු)',
  budha: 'බුධ', rahu: 'රාහු', senasuru: 'සෙනසුරු (ශනි)', sandu: 'සඳු (සඳ)', ketu: 'කේතු',
};

const TOPIC_LABELS = {
  education: 'අධ්‍යාපනය',
  marriage: 'විවාහය',
  vehicle: 'යානවාහන',
  children: 'දරුපල',
  career: 'රැකියාව',
  foreign: 'විදේශගතවීමේ වාසනාව',
};

// Detailed traditional interpretations if AI API key is not yet set or in offline mode
function generateAstrologicalReading(data) {
  const { birthDate, lagna, navamshaka, selectedTopics } = data;
  const lagnaName = ZODIAC_SI[lagna] || lagna;
  const navaName = ZODIAC_SI[navamshaka] || (navamshaka ? navamshaka : 'සාමාන්‍ය');

  let report = `# 🌟 පුද්ගලික ජ්‍යොතිෂ පලාපල විශ්ලේෂණ වාර්තාව\n\n`;
  report += `**ජන්ම විස්තර:**\n`;
  if (birthDate) report += `* උපන් දිනය: ${birthDate}\n`;
  report += `* ජන්ම ලග්නය: **${lagnaName} ලග්නය**\n`;
  report += `* නවාංශකය: **${navaName} නවාංශකය**\n\n---\n\n`;

  const topicTexts = {
    education: `## 📚 අධ්‍යාපනය සහ බුද්ධි මට්ටම\nඔබගේ ${lagnaName} ලග්න කේන්ද්‍රයේ 5 වන භාවය හා බුධ ග්‍රහයාගේ පිහිටීම අනුව අධ්‍යාපන ක්ෂේත්‍රයේ ප්‍රගතියක් පෙන්නුම් කරයි. උසස් අධ්‍යාපනය හා නව දැනුම ලබාගැනීමට විශේෂ ආශාවක් සහ තීක්ෂ්ණ බුද්ධියක් ජන්මයෙන්ම හිමිව ඇත. ගුරු සහ බුධ බලවත්ව සිටින කාල පරිච්ඡේදවලදී විභාග සහ තරඟකාරී අධ්‍යාපන කටයුතුවලින් විශිෂ්ට ජයග්‍රහණ අත්කර ගත හැක.\n\n`,
    marriage: `## 💍 විවාහය සහ යුග දිවිය\n${lagnaName} ලග්න හිමියන්ගේ 7 වන භාවය ආශ්‍රිත ග්‍රහ ගෝචරය අනුව සහකරු/සහකාරිය බුද්ධිමත්, ගුණගරුක චරිතයක් වීමේ හැකියාව ඉහළයි. සිකුරුගේ බලය මත විවාහ ජීවිතයේ සතුට සහ සාමය රඳා පවතින අතර, සෙනසුරු හෝ කුජගේ දෘෂ්ටි පවතින කාලවලදී ඉවසීමෙන් කටයුතු කිරීම යුග දිවිය සාර්ථක කර ගැනීමට හේතු වේ.\n\n`,
    career: `## 💼 රැකියාව සහ වෘත්තීය දියුණුව\n10 වන භාවයේ පිහිටීම අනුව පරිපාලන, තාක්ෂණික හෝ ව්‍යාපාරික ක්ෂේත්‍රයන් හි සාර්ථකත්වයට සුදුසු ග්‍රහ ශක්තියක් ඇත. ඔබගේ ස්වෝත්සාහයෙන් ඉදිරියට යාමේ ශක්තියක් පවතින අතර, රවිගේ හා ගුරුගේ දශා අතුරු දශාවන්හිදී රැකියා උසස්වීම් සහ සමාජ ගෞරවය වැඩිවීමේ ප්‍රවණතාවක් පවතී.\n\n`,
    vehicle: `## 🚗 යානවාහන සහ දේපළ වාසනාව\n4 වන භාවාධිපතිගේ පිහිටීම අනුව නිවාස, ඉඩකඩම් සහ යානවාහන හිමිකම පිළිබඳ යහපත් පිහිටීම් නිරීක්ෂණය වේ. විශේෂයෙන් සිකුරු හා සඳුගේ ශුභ දෘෂ්ටි ලැබෙන කාල වකවානුවලදී නව වාහන හෝ දේපළ මිලදී ගැනීම්වලට ශුභ ඵල උදා වේ.\n\n`,
    children: `## 👶 දරුපල සහ පවුල් සතුට\n5 වන භාවය හා ගුරු ග්‍රහයාගේ කාරකත්වය අනුව දරුපල වාසනාව මධ්‍යස්ථව හා ශුභදායකව පවතී. දරුවන්ගේ අනාගතය යහපත් එකක් වන අතර, ඔවුන් තුළින් පවුලට ගෞරවය හිමිවීමේ යහපත් පිහිටීම් පෙන්නුම් කරයි.\n\n`,
    foreign: `## ✈️ විදේශගතවීම සහ විදේශීය සබඳතා\n9 වන සහ 12 වන භාවයන්හි ශක්තිය අනුව විදේශ ගමන්, විදේශ අධ්‍යාපනය හෝ විදේශගත රැකියා අවස්ථා සඳහා වාසනාව පවතී. විශේෂයෙන් රාහු සහ සඳු ග්‍රහයන්ගේ ශුභ කාලසීමාවන්හිදී විදේශ ගමන් සාර්ථක වීමට හැකියාව වැඩිය.\n\n`,
  };

  selectedTopics.forEach((t) => {
    if (topicTexts[t]) {
      report += topicTexts[t];
    }
  });

  report += `---\n\n## 📋 සංක්ෂිප්ත පලාපල සාරාංශය\nඔබගේ කේන්ද්‍ර සටහන අනුව ආත්ම ශක්තිය සහ උත්සාහය තුළින් ජීවිතය ජයගත හැකි උතුම් ග්‍රහ පිහිටීමක් පවතී. ශුභ ග්‍රහයන්ගේ ශක්තිය වර්ධනය කර ගැනීමට බෝධි පූජා, දේව ආශිර්වාද සහ ධාර්මික දිවිපෙවෙතක් පවත්වා ගැනීමෙන් බලාපොරොත්තු සියල්ල මැනවින් සාර්ථක කරගත හැක.`;

  return report;
}

function buildPrompt(data) {
  const { birthDate, lagna, navamshaka, planetaryPositions, selectedTopics } = data;
  const lagnaLabel = ZODIAC_SI[lagna] || lagna;
  const navaLabel = ZODIAC_SI[navamshaka] || navamshaka;

  const planetLines = Object.entries(planetaryPositions || {})
    .filter(([, house]) => house && house !== '' && house !== '0')
    .map(([planet, house]) => `  - ${PLANET_SI[planet] || planet}: ${house} වන භාවය`)
    .join('\n');

  const topicLines = selectedTopics
    .map((t) => `  * ${TOPIC_LABELS[t] || t}`)
    .join('\n');

  return `ඔබ දශකයන් ගණනාවක් අත්දැකීමෙන් පොහොසත් වූ, ශ්‍රී ලංකාවේ ජ්‍යේෂ්ඨ ජ්‍යොතිෂ ශාස්ත්‍ර ඇදුරෙකි. ශ්‍රී ලාංකික සාම්ප්‍රදායික ජ්‍යොතිෂ ක්‍රමවේද ඔබ ඉතා හොඳින් දනී.

පහත ජාතක හිමියාගේ හඳහන් තොරතුරු ලැබී ඇත:

📅 උපන් දිනය: ${birthDate || 'නොදන්වා ඇත'}
⭐ ලග්නය: ${lagnaLabel}
🌟 නවාංශකය: ${navaLabel || 'සාමාන්‍ය'}

🪐 ග්‍රහ පිහිටීම් (භාව):
${planetLines || '  (ග්‍රහ තොරතුරු ලැබී නැත)'}

🎯 විශ්ලේෂණය කළ යුතු මාතෘකා:
${topicLines}

---

**ඔබේ කාර්යය:**
ඉහත ග්‍රහ පිහිටීම් සහ ලග්නය ඇසුරෙන් ජාතක හිමියා ගැන **සම්පූර්ණ සිංහල භාෂාවෙන්** ඉතා ගැඹුරු, විස්තරාත්මක, සහ ධනාත්මක ජ්‍යොතිෂ විශ්ලේෂණයක් සකස් කරන්න.

**ලිවිය යුතු ආකාරය:**
1. සම්පූර්ණ ලේඛනය සිංහල භාෂාවෙන් පමණක් ලියන්න.
2. තෝරාගත් සෑම මාතෘකාවක් සඳහාම ශීර්ෂයක් සමඟ අදාළ ග්‍රහ හා භාව ගෙන ගැඹුරු විශ්ලේෂණයක් ලියන්න.
3. ශාස්ත්‍රීය ශ්‍රී ලාංකීය ජ්‍යොතිෂ සම්ප්‍රදාය ඇසුරෙන් ලියන්න.
4. අවසානයේ "## 📋 සංක්ෂිප්ත පලාපල සාරාංශය" යන ශීර්ෂය යටතේ සම්පූර්ණ ජීවිත සාරාංශයක් ලියන්න.

ලිවීම ආරම්භ කරන්න:`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  // JWT Auth Guard
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const decoded = verifyAuthToken(authHeader);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({
      success: false,
      message: 'ප්‍රවේශ ටෝකනය වලංගු නොවේ. කරුණාකර නැවත ලොගින් වන්න.',
    });
  }

  const { birthDate, lagna, navamshaka, planetaryPositions, selectedTopics } = req.body || {};

  if (!lagna || !selectedTopics || selectedTopics.length === 0) {
    return res.status(400).json({ success: false, message: 'ලග්නය සහ අවම වශයෙන් මාතෘකාවක් තෝරාගත යුතුය.' });
  }

  let finalReport = '';
  let finalSummary = '';

  // If Gemini API Key is configured and valid, use Gemini AI
  const hasRealKey =
    !!GEMINI_API_KEY &&
    !GEMINI_API_KEY.includes('your_gemini_api_key') &&
    GEMINI_API_KEY.length > 15;

  if (hasRealKey) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = buildPrompt({ birthDate, lagna, navamshaka, planetaryPositions, selectedTopics });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const summaryMatch = text.match(/##\s*📋\s*සංක්ෂිප්ත[\s\S]*?(?=---|$)/i);
      finalSummary = summaryMatch ? summaryMatch[0].trim() : '';
      finalReport = text;
    } catch (err) {
      console.warn('AI call encountered an issue, falling back to traditional reading:', err.message);
    }
  }

  // Graceful fallback: Authentic Sri Lankan astrological reading
  if (!finalReport) {
    finalReport = generateAstrologicalReading({
      birthDate,
      lagna,
      navamshaka,
      selectedTopics,
    });
    finalSummary = 'ඔබගේ කේන්ද්‍ර සටහන අනුව ජීවිතය ජයගත හැකි උතුම් ග්‍රහ පිහිටීමක් පවතී.';
  }

  // Automatically save to the user's isolated account in database
  try {
    await saveUserHoroscopeProfile(decoded.userId, {
      birthDate,
      lagna,
      navamshaka,
      planetaryPositions,
      selectedTopics,
      report: finalReport,
    });
  } catch (err) {
    console.warn('Failed to auto-save profile in DB:', err.message);
  }

  return res.status(200).json({
    success: true,
    report: finalReport,
    summary: finalSummary,
  });
}
