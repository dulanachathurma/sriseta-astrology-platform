export const SITE = {
  titleSi: 'ශ්‍රී සෙත ජ්‍යොතිෂ සේවය',
  subtitleSi: 'ඔබ සැම සාදරයෙන් පිළිගනිමු',
  whatsappNumber: '94718865119',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61584368804841',
  hours: 'සේවා කාලය: උදේ 9.00 - හවස 4.00',
  everyDay: 'සෑම දිනකම',
  copyright: '© 2026 ශ්‍රී සෙත ජ්‍යොතිෂ සේවය. සියලු හිමිකම් ඇවිරිණි.',
};

export const astrologer = {
  nameTitle: 'ජ්‍යොතිෂවේදිනී',
  nameMain: 'ශ්‍රියාණි සමරවීර',
  experience: 'වසර 10 ක අත්දැකීම් සහිත පළපුරුද්ද',
  addresses: ['බෙලිඅත්ත', 'ගැටමාන්න'],
  photo: '/images/profile_picture.jpg',
};

export const services = [
  {
    id: 'porondam',
    icon: 'Handshake',
    title: 'පොරොන්දම් බැලීම',
    description: 'මනාලයා සහ මනාලියගේ ගුණාත්මක බව අධ්‍යයනය',
    detail: 'මනාලයා සහ මනාලියගේ ජන්ම ලග්න, රාශි, නක්ෂත්‍ර ආදිය විශ්ලේෂණය කර ගුණාත්මක බව අධ්‍යයනය කිරීම.',
    images: ['/images/service_porondam_011.jpg', '/images/service_porondam_012.jpg'],
  },
  {
    id: 'handahan',
    icon: 'ScrollText',
    title: 'හඳහන් සෑදීම',
    description: 'උපන් වේලාව, දිනය, ස්ථානය අනුව හදහන් සකස් කිරීම',
    detail: 'උපන්(වේලාව, දිනය, ස්ථානය) අනුව පූර්ණ ජාතක හඳහන සකස් කිරීම.',
    images: ['/images/service_handahan_001.jpg', '/images/service_handahan_02.jpg'],
  },
  {
    id: 'palapala',
    icon: 'Star',
    title: 'පලාපල විස්තර',
    description: 'ලග්නය අනුව විස්තරාත්මක පුරෝකථන',
    detail: 'ලග්නය අනුව වාර්ෂික, මාසික, සතිමය, දෛනික පලාපල විස්තර.',
    images: ['/images/palapala_01.jpg', '/images/palapala_02.jpg'],
  },
  {
    id: 'nakath', // අලුතින් එකතු කළ සේවාව
    icon: 'Star', 
    title: 'විවාහ මංගල නැකැත් ඇතුලු සියලුම සුබ නැකැත් සෑදීම',
    description: 'සියලුම ශුභ කටයුතු සඳහා පාරම්පරික ක්‍රමවේදයන්ට අනුව නිවැරදිම සුබ නැකැත් සෑදීම',
    detail: 'ඔබගේ උපන් වේලාවට සහ ජන්ම පත්‍රයට ගැළපෙන පරිදි විවාහ මංගල්‍යය, නිවාස සෑදීම, ගෙවදීම, ව්‍යාපාර ආරම්භය ඇතුළු සෑම විශේෂ අවස්ථාවකටම අදාළ සියලුම සුබ නැකැත් නිවැරදිව සාදා දෙනු ලැබේ.',
    images: ['/images/nakath_01.jpg', '/images/nakath_02.jpg'], // ඔබට අවශ්‍ය පරිදි පින්තූර වල නම් වෙනස් කරගන්න
  }
];

export const serviceTypeOptions = [
  { value: '', label: 'තෝරන්න' },
  { value: 'porondam', label: 'පොරොන්දම් බැලීම' },
  { value: 'handahan', label: 'හඳහන් සෑදීම' },
  { value: 'palapala', label: 'පලාපල විස්තර' },
  { value: 'nakath', label: 'විවාහ මංගල නැකැත් ඇතුළු සියලුම සුබ නැකැත් සෑදීම' }, 
];

export function serviceName(value) {
  const found = serviceTypeOptions.find((s) => s.value === value);
  return found ? found.label : 'තෝරාගත් සේවාව';
}
