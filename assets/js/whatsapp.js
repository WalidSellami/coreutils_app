/**
 * CoreUtils Web Suite - Direct WhatsApp Opener Engine
 * Generates direct wa.me chat links with country code validation, 
 * universal domestic prefix handling, and masked recent history.
 */

export const COUNTRY_CODES = [
  { code: "+213", country: "Algeria", countryAr: "الجزائر", flag: "🇩🇿", priority: true },
  { code: "+1", country: "United States / Canada", countryAr: "الولايات المتحدة / كندا", flag: "🇺🇸" },
  { code: "+33", country: "France", countryAr: "فرنسا", flag: "🇫🇷" },
  { code: "+966", country: "Saudi Arabia", countryAr: "المملكة العربية السعودية", flag: "🇸🇦" },
  { code: "+971", country: "United Arab Emirates", countryAr: "الإمارات العربية المتحدة", flag: "🇦🇪" },
  { code: "+212", country: "Morocco", countryAr: "المغرب", flag: "🇲🇦" },
  { code: "+216", country: "Tunisia", countryAr: "تونس", flag: "🇹🇳" },
  { code: "+20", country: "Egypt", countryAr: "مصر", flag: "🇪🇬" },
  { code: "+974", country: "Qatar", countryAr: "قطر", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", countryAr: "الكويت", flag: "🇰🇼" },
  { code: "+44", country: "United Kingdom", countryAr: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "+49", country: "Germany", countryAr: "ألمانيا", flag: "🇩🇪" },
  { code: "+34", country: "Spain", countryAr: "إسبانيا", flag: "🇪🇸" },
  { code: "+39", country: "Italy", countryAr: "إيطاليا", flag: "🇮🇹" },
  { code: "+90", country: "Turkey", countryAr: "تركيا", flag: "🇹🇷" },
  { code: "+91", country: "India", countryAr: "الهند", flag: "🇮🇳" },
  { code: "+86", country: "China", countryAr: "الصين", flag: "🇨🇳" },
  { code: "+81", country: "Japan", countryAr: "اليابان", flag: "🇯🇵" },
  { code: "+55", country: "Brazil", countryAr: "البرازيل", flag: "🇧🇷" },
  { code: "+7", country: "Russia", countryAr: "روسيا", flag: "🇷🇺" }
];

const HISTORY_STORAGE_KEY = "coreutils_wa_history";

export const COUNTRY_RULES = {
  '+213': {
    // Algeria: 05, 06, 07 (10 digits) OR 5, 6, 7 (9 digits)
    regex: /^(?:0)?([567]\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneAlgeria'
  },
  '+1': {
    // US / Canada: 10 digits (NANP area code 2-9, exchange 2-9)
    regex: /^(?:1|0)?([2-9]\d{2}[2-9]\d{6})$/,
    errorKey: 'toastErrorInvalidPhoneUS'
  },
  '+33': {
    // France: 9 digits after 0 (mobile 6 or 7, or general 1-9)
    regex: /^(?:0)?([67]\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneFR'
  },
  '+966': {
    // Saudi Arabia: 05xxxxxxxx (9 digits after 0)
    regex: /^(?:0)?(5\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneSA'
  },
  '+971': {
    // UAE: 05xxxxxxxx (9 digits after 0)
    regex: /^(?:0)?(5\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneUAE'
  },
  '+212': {
    // Morocco: 06/07 (9 digits after 0)
    regex: /^(?:0)?([67]\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneMA'
  },
  '+216': {
    // Tunisia: 8 digits, mobiles 2, 4, 5, 9
    regex: /^(?:0)?([2-9]\d{7})$/,
    errorKey: 'toastErrorInvalidPhoneTN'
  },
  '+20': {
    // Egypt: 010, 011, 012, 015 (10 digits after 0)
    regex: /^(?:0)?(1[0125]\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneEG'
  },
  '+974': {
    // Qatar: 8 digits, mobiles 3, 5, 6, 7
    regex: /^(?:0)?([3567]\d{7})$/,
    errorKey: 'toastErrorInvalidPhoneQA'
  },
  '+965': {
    // Kuwait: 8 digits, mobiles 5, 6, 9
    regex: /^(?:0)?([569]\d{7})$/,
    errorKey: 'toastErrorInvalidPhoneKW'
  },
  '+44': {
    // UK: 10 digits after 0, mobiles 7
    regex: /^(?:0)?(7\d{9})$/,
    errorKey: 'toastErrorInvalidPhoneUK'
  },
  '+49': {
    // Germany: 10-11 digits after 0, mobiles 15, 16, 17
    regex: /^(?:0)?(1[567]\d{8,9})$/,
    errorKey: 'toastErrorInvalidPhoneDE'
  },
  '+34': {
    // Spain: 9 digits, mobiles 6, 7
    regex: /^(?:0)?([67]\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneES'
  },
  '+39': {
    // Italy: 9-10 digits, mobiles 3
    regex: /^(?:0)?(3\d{8,9})$/,
    errorKey: 'toastErrorInvalidPhoneIT'
  },
  '+90': {
    // Turkey: 10 digits after 0, mobiles 5
    regex: /^(?:0)?(5\d{9})$/,
    errorKey: 'toastErrorInvalidPhoneTR'
  },
  '+91': {
    // India: 10 digits, mobiles 6, 7, 8, 9
    regex: /^(?:0)?([6-9]\d{9})$/,
    errorKey: 'toastErrorInvalidPhoneIN'
  },
  '+86': {
    // China: 11 digits, mobiles 13-19
    regex: /^(?:0)?(1[3-9]\d{9})$/,
    errorKey: 'toastErrorInvalidPhoneCN'
  },
  '+81': {
    // Japan: 10 digits after 0, mobiles 70, 80, 90
    regex: /^(?:0)?([789]0\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneJP'
  },
  '+55': {
    // Brazil: 11 digits (DDD 2 digits + 9 + 8 digits)
    regex: /^(?:0)?([1-9]{2}9\d{8})$/,
    errorKey: 'toastErrorInvalidPhoneBR'
  },
  '+7': {
    // Russia/Kazakhstan: 10 digits, mobiles 9, entered with 8 or 0 locally
    regex: /^(?:8|0)?(9\d{9})$/,
    errorKey: 'toastErrorInvalidPhoneRU'
  }
};

/**
 * Clean and strictly validate phone numbers using country-specific regular expressions.
 * Handles domestic leading zero stripping, international prefixes (+, 00), and formatting.
 * @param {string} rawInput 
 * @param {string} dialCode E.g. "+213", "+1", "+44", "+33"
 * @returns {{ fullNumber: string, displayMasked: string, isValid: boolean, errorKey?: string }}
 */
export function sanitizePhoneNumber(rawInput, dialCode = "+213") {
  if (!rawInput || typeof rawInput !== 'string') {
    return { fullNumber: '', displayMasked: '', isValid: false, errorKey: 'toastErrorInvalidPhone' };
  }

  let str = rawInput.trim();
  const rawDialDigits = dialCode.replace(/\D/g, '');

  let digits = str.replace(/\D/g, '');
  if (!digits) {
    return { fullNumber: '', displayMasked: '', isValid: false, errorKey: 'toastErrorInvalidPhone' };
  }

  // Handle international prefix (+... or 00...) if typed directly into the field
  if (str.startsWith('+') || str.startsWith('00')) {
    let intl = str.startsWith('00') ? str.substring(2) : str.substring(1);
    const intlDigits = intl.replace(/\D/g, '');
    if (intlDigits.startsWith(rawDialDigits)) {
      digits = intlDigits.substring(rawDialDigits.length);
    }
  } else if (digits.startsWith(rawDialDigits) && digits.length >= rawDialDigits.length + 7) {
    digits = digits.substring(rawDialDigits.length);
  }

  let isValid = false;
  let localNormalized = '';
  let errorKey = 'toastErrorInvalidPhone';

  const rule = COUNTRY_RULES[dialCode] || COUNTRY_RULES[`+${rawDialDigits}`];

  if (rule) {
    const match = digits.match(rule.regex);
    if (match) {
      isValid = true;
      localNormalized = match[1];
    } else {
      errorKey = rule.errorKey;
    }
  } else {
    // Standard ITU-T E.164 universal mobile validation: 7 to 15 digits
    let trimmed = digits.startsWith('0') ? digits.substring(1) : digits;
    if (/^[1-9]\d{6,14}$/.test(trimmed)) {
      isValid = true;
      localNormalized = trimmed;
    }
  }

  if (!isValid) {
    return { fullNumber: '', displayMasked: '', isValid: false, errorKey };
  }

  // Normalized international digits: country code + local number without leading zero
  const fullNumber = rawDialDigits + localNormalized;
  const displayMasked = formatMaskedNumber(fullNumber);

  return {
    fullNumber,
    displayMasked,
    isValid: true
  };
}

/**
 * Builds the wa.me deep link
 * @param {string} fullNumberDigits 
 * @param {string} message 
 * @returns {string}
 */
export function buildWhatsAppUrl(fullNumberDigits, message = '') {
  const cleanDigits = fullNumberDigits.replace(/\D/g, '');
  if (!cleanDigits) return '';
  const trimmedMsg = message ? message.trim() : '';
  const encodedMsg = trimmedMsg ? encodeURIComponent(trimmedMsg) : '';
  return `https://wa.me/${cleanDigits}${encodedMsg ? '?text=' + encodedMsg : ''}`;
}

/**
 * Formats a phone number with privacy masking
 * E.g. 213555123489 -> +213 5•• ••• •89
 */
export function formatMaskedNumber(cleanDigits) {
  if (cleanDigits.length < 6) return `+${cleanDigits}`;
  const prefix = cleanDigits.slice(0, 4);
  const suffix = cleanDigits.slice(-2);
  const middleLen = cleanDigits.length - 6;
  const maskedMiddle = '•'.repeat(Math.min(middleLen, 6));
  return `+${prefix} ${maskedMiddle} ${suffix}`;
}

/**
 * Retrieves the last 5 recent numbers from localStorage
 * @returns {Array<{ number: string, masked: string, timestamp: number }>}
 */
export function getRecentNumbers() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a phone number to recent numbers (maximum 5, unique)
 * @param {string} cleanDigits 
 */
export function saveRecentNumber(cleanDigits) {
  if (!cleanDigits || cleanDigits.length < 8) return;
  try {
    let list = getRecentNumbers();
    // Remove if already exists
    list = list.filter(item => item.number !== cleanDigits);
    // Add to front
    list.unshift({
      number: cleanDigits,
      masked: formatMaskedNumber(cleanDigits),
      timestamp: Date.now()
    });
    // Cap at 5
    list = list.slice(0, 5);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save recent number:", err);
  }
}

/**
 * Clears recent history
 */
export function clearRecentHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}
