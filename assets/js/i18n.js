/**
 * CoreUtils Web Suite - Internationalization (i18n) & RTL Engine
 * Zero-dependency client-side dictionary for English and Arabic.
 */

export const translations = {
  en: {
    appTitle: "CoreUtils",
    appSubtitle: "Ultra-fast utilities with zero tracking and 100% client-side processing.",
    badgePrivacy: "100% Client-Side",
    badgeZeroLogs: "Zero Server Logs",
    tabDisinfector: "URL Disinfector",
    tabWhatsApp: "Direct WhatsApp",

    // Disinfector
    categoryPrivacy: "Privacy Sanitizer",
    disinfectorHeading: "Sanitize & Strip Tracking Parameters",
    disinfectorDesc: "Remove surveillance tokens (utm_*, fbclid, gclid, TikTok, YouTube & other trackers) and e-commerce bloat in few seconds.",
    labelInputUrl: "Target Link / URL",
    inputUrlPlaceholder: "Paste any link here\n(e.g. https://example.com/page?utm_source=...)",
    btnPaste: "Paste Link",
    btnClean: "Disinfect URL",
    btnClear: "Clear",
    outputCleanUrlLabel: "Cleaned Safe URL",
    btnCopy: "Copy Clean URL",
    btnCopied: "Copied!",
    statsStripped: "Tracking parameters stripped:",
    statsNone: "No tracking parameters found. Your link was already clean!",
    sampleLinksTitle: "Try sample links:",
    sampleMarketing: "Marketing Link (UTM)",
    sampleSocial: "Social Link (Facebook/IG)",
    sampleYoutube: "YouTube",
    sampleAmazon: "Amazon Product",
    sampleTiktok: "TikTok",
    validPhoneNotice: "Valid mobile number",
    validUrlNotice: "Valid link ready to disinfect",

    // WhatsApp
    categoryMessenger: "Direct Messenger",
    whatsappHeading: "Open WhatsApp Chat Instantly",
    whatsappDesc: "Start a conversation directly without saving temporary contacts to your phone's address book.",
    labelCountry: "Country Code",
    searchCountryPlaceholder: "Search country or dial code...",
    labelPhone: "Phone Number",
    phonePlaceholder: "..........",
    phoneHint: "Enter your mobile number (e.g. 05, 06, or 07... or directly 5, 6, 7...). Country code is applied automatically.",
    labelMessage: "Optional Message",
    messagePlaceholder: "Type an optional pre-filled message...",
    btnOpenChat: "Open in WhatsApp",
    btnCopyLink: "Copy Direct Link",
    recentNumbersTitle: "Recent Numbers",
    recentNumbersEmpty: "No recent numbers yet. Your past 5 direct chats will be saved locally for quick reuse.",
    btnClearHistory: "Clear History",

    // Common & Alerts
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    langEn: "English",
    langAr: "العربية",
    toastCopied: "Copied to clipboard!",
    toastCleaned: "Link disinfected successfully!",
    toastLinkCopied: "Direct WhatsApp link copied!",
    toastErrorInvalidUrl: "Please enter a valid web URL (e.g. https://...)",
    toastErrorInvalidUrlProtocol: "URL must start with http:// or https:// with a valid domain format.",
    toastErrorInvalidPhone: "Please enter a valid phone number.",
    toastErrorInvalidPhoneAlgeria: "Algerian mobile numbers must start with 05, 06, or 07 (or 5, 6, 7) and contain 9 to 10 digits.",
    toastErrorInvalidPhoneUS: "US/Canada numbers must contain 10 digits.",
    toastErrorInvalidPhoneFR: "French mobile numbers must start with 6 or 7 and contain 9 digits.",
    toastErrorInvalidPhoneSA: "Saudi mobile numbers must start with 05 and contain 9 to 10 digits.",
    toastErrorInvalidPhoneUAE: "UAE mobile numbers must start with 05 and contain 9 to 10 digits.",
    toastErrorInvalidPhoneMA: "Moroccan mobile numbers must start with 06 or 07 and contain 9 to 10 digits.",
    toastErrorInvalidPhoneTN: "Tunisian mobile numbers must contain 8 digits.",
    toastErrorInvalidPhoneEG: "Egyptian mobile numbers must start with 01 and contain 10 to 11 digits.",
    toastErrorInvalidPhoneQA: "Qatari mobile numbers must start with 3, 5, 6, or 7 and contain 8 digits.",
    toastErrorInvalidPhoneKW: "Kuwaiti mobile numbers must start with 5, 6, or 9 and contain 8 digits.",
    toastErrorInvalidPhoneUK: "UK mobile numbers must start with 07 and contain 10 to 11 digits.",
    toastErrorInvalidPhoneDE: "German mobile numbers must start with 15, 16, or 17 and contain 10 to 11 digits.",
    toastErrorInvalidPhoneES: "Spanish mobile numbers must start with 6 or 7 and contain 9 digits.",
    toastErrorInvalidPhoneIT: "Italian mobile numbers must start with 3 and contain 9 to 10 digits.",
    toastErrorInvalidPhoneTR: "Turkish mobile numbers must start with 5 and contain 10 digits.",
    toastErrorInvalidPhoneIN: "Indian mobile numbers must start with 6, 7, 8, or 9 and contain 10 digits.",
    toastErrorInvalidPhoneCN: "Chinese mobile numbers must start with 1 and contain 11 digits.",
    toastErrorInvalidPhoneJP: "Japanese mobile numbers must start with 70, 80, or 90 and contain 10 to 11 digits.",
    toastErrorInvalidPhoneBR: "Brazilian mobile numbers must contain DDD + 9 digits (11 digits).",
    toastErrorInvalidPhoneRU: "Russian mobile numbers must start with 9 and contain 10 digits.",
    toastClipboardDenied: "Clipboard access denied or empty. Please paste manually.",
    validPhoneNoticeAlgeria: "Valid Algerian mobile number (05, 06, 07 or 5, 6, 7)",
    fieldUrlEmpty: "Please paste or type a web link.",
    fieldUrlInvalid: "Please enter a valid web URL (e.g. https://...)",
    fieldPhoneEmpty: "Please enter a phone number.",
    fieldPhoneInvalidDigits: "Please enter digits only.",
    footerText: "Pure Client-Side Execution",
    footerShield: "No links or numbers are ever sent to any server."
  },
  ar: {
    appTitle: "CoreUtils",
    appSubtitle: "أدوات فائقة السرعة بدون أي تتبع ومعالجة كاملة 100% داخل جهازك.",
    badgePrivacy: "معالجة محلية 100%",
    badgeZeroLogs: "بدون أي سجلات أو خوادم",
    tabDisinfector: "مُطهّر الروابط",
    tabWhatsApp: "واتساب مباشر",

    // Disinfector
    categoryPrivacy: "مُطهّر الخصوصية",
    disinfectorHeading: "تنظيف الروابط وإزالة لواحق التتبع",
    disinfectorDesc: "تجريد الروابط من رموز التعقب والمراقبة (utm_*، fbclid، gclid، معرفات يوتيوب وتيك توك) وزوائد المتاجر في غضون ثوانٍ قليلة.",
    labelInputUrl: "الرابط المراد تنظيفه",
    inputUrlPlaceholder: "الصق أي رابط هنا\n(مثال: https://example.com/page?utm_source=...)",
    btnPaste: "لصق الرابط",
    btnClean: "تطهير الرابط",
    btnClear: "مسح",
    outputCleanUrlLabel: "الرابط الآمن بعد التنظيف",
    btnCopy: "نسخ الرابط النظيف",
    btnCopied: "تم النسخ!",
    btnOpenLink: "فتح الرابط النظيف",
    tooltipOpenLink: "فتح الرابط المنظف في علامة تبويب جديدة بأمان",
    badgeUnwrapped: "تم فك توجيه التتبع",
    badgeAutoFixed: "تمت إضافة https:// تلقائياً",
    statsStripped: "المعلمات التي تم تجريدها:",
    statsNone: "لم يتم العثور على أي معلمات تعقب. الرابط نظيف بالفعل!",
    sampleLinksTitle: "جرّب روابط تجريبية:",
    sampleMarketing: "رابط تسويقي (UTM)",
    sampleSocial: "رابط تواصل (فيسبوك/إنستغرام)",
    sampleYoutube: "يوتيوب",
    sampleAmazon: "منتج أمازون",
    sampleTiktok: "تيك توك",
    validPhoneNotice: "رقم هاتف محمول صالح وجاهز",
    validUrlNotice: "رابط صالح وجاهز للتطهير",
    validUrlNoticeAutoFixed: "تم التعرف على النطاق (سيُضاف https:// تلقائياً)",

    // WhatsApp
    categoryMessenger: "المراسلة المباشرة",
    whatsappHeading: "محادثة واتساب مباشرة بدون حفظ الرقم",
    whatsappDesc: "ابدأ محادثة مباشرة وفورية دون الحاجة إلى تلويث دفتر عناوين هاتفك بجهات اتصال مؤقتة.",
    labelCountry: "رمز الدولة",
    searchCountryPlaceholder: "ابحث عن الدولة أو الرمز...",
    labelPhone: "رقم الهاتف",
    phonePlaceholder: "..........",
    phoneHint: "اكتب رقم هاتفك المحمول (مثال: 05 أو 06 أو 07... أو مباشرة 5، 6، 7...). يُضاف رمز الدولة تلقائياً.",
    labelMessage: "رسالة اختيارية مسبقة",
    messagePlaceholder: "اكتب رسالة تمهيدية اختيارية...",
    btnOpenChat: "فتح في واتساب",
    btnCopyLink: "نسخ الرابط المباشر",
    recentNumbersTitle: "الأرقام الأخيرة",
    recentNumbersEmpty: "لا توجد أرقام سابقة بعد. يتم حفظ آخر 5 أرقام محلياً في جهازك للوصول السريع.",
    btnClearHistory: "مسح السجل",

    // Common & Alerts
    themeDark: "الوضع الليلي",
    themeLight: "الوضع النهاري",
    langEn: "English",
    langAr: "العربية",
    toastCopied: "تم النسخ إلى الحافظة!",
    toastCleaned: "تم تطهير الرابط بنجاح!",
    toastLinkCopied: "تم نسخ رابط الواتساب المباشر!",
    toastErrorInvalidUrl: "يرجى إدخال رابط صالح (مثال: https://...)",
    toastErrorInvalidUrlProtocol: "يجب أن يبدأ الرابط بـ http:// أو https:// مع نطاق ومسار صالح.",
    toastErrorInvalidPhone: "يرجى إدخال رقم هاتف صحيح.",
    toastErrorInvalidPhoneAlgeria: "يجب أن يبدأ رقم الهاتف الجزائري بـ 05 أو 06 أو 07 (أو مباشرة 5، 6، 7) ويتكون من 9 إلى 10 أرقام.",
    toastErrorInvalidPhoneUS: "يجب أن يتكون رقم أمريكا / كندا من 10 أرقام.",
    toastErrorInvalidPhoneFR: "يجب أن يبدأ الرقم الفرنسي بـ 6 أو 7 ويتكون من 9 أرقام.",
    toastErrorInvalidPhoneSA: "يجب أن يبدأ الرقم السعودي بـ 05 ويتكون من 9 إلى 10 أرقام.",
    toastErrorInvalidPhoneUAE: "يجب أن يبدأ الرقم الإماراتي بـ 05 ويتكون من 9 إلى 10 أرقام.",
    toastErrorInvalidPhoneMA: "يجب أن يبدأ الرقم المغربي بـ 06 أو 07 ويتكون من 9 إلى 10 أرقام.",
    toastErrorInvalidPhoneTN: "يجب أن يتكون الرقم التونسي من 8 أرقام.",
    toastErrorInvalidPhoneEG: "يجب أن يبدأ الرقم المصري بـ 01 ويتكون من 10 إلى 11 رقماً.",
    toastErrorInvalidPhoneQA: "يجب أن يبدأ رقم الهاتف القطري بـ 3 أو 5 أو 6 أو 7 ويتكون من 8 أرقام.",
    toastErrorInvalidPhoneKW: "يجب أن يبدأ رقم الهاتف الكويتي بـ 5 أو 6 أو 9 ويتكون من 8 أرقام.",
    toastErrorInvalidPhoneUK: "يجب أن يبدأ رقم الهاتف البريطاني بـ 07 ويتكون من 10 إلى 11 رقماً.",
    toastErrorInvalidPhoneDE: "يجب أن يبدأ رقم الهاتف الألماني بـ 15 أو 16 أو 17 ويتكون من 10 إلى 11 رقماً.",
    toastErrorInvalidPhoneES: "يجب أن يبدأ رقم الهاتف الإسباني بـ 6 أو 7 ويتكون من 9 أرقام.",
    toastErrorInvalidPhoneIT: "يجب أن يبدأ رقم الهاتف الإيطالي بـ 3 ويتكون من 9 إلى 10 أرقام.",
    toastErrorInvalidPhoneTR: "يجب أن يبدأ رقم الهاتف التركي بـ 5 ويتكون من 10 أرقام.",
    toastErrorInvalidPhoneIN: "يجب أن يبدأ رقم الهاتف الهندي بـ 6، 7، 8، أو 9 ويتكون من 10 أرقام.",
    toastErrorInvalidPhoneCN: "يجب أن يبدأ رقم الهاتف الصيني بـ 1 ويتكون من 11 رقماً.",
    toastErrorInvalidPhoneJP: "يجب أن يبدأ رقم الهاتف الياباني بـ 70، 80، أو 90 ويتكون من 10 إلى 11 رقماً.",
    toastErrorInvalidPhoneBR: "يجب أن يتكون رقم الهاتف البرازيلي من رمز المنطقة و9 أرقام (11 رقماً).",
    toastErrorInvalidPhoneRU: "يجب أن يبدأ رقم الهاتف الروسي بـ 9 ويتكون من 10 أرقام.",
    toastClipboardDenied: "تعذر الوصول للحافظة أو أنها فارغة. يرجى اللصق يدوياً.",
    validPhoneNoticeAlgeria: "رقم هاتف جزائري صالح (يبدأ بـ 05، 06، 07 أو 5، 6، 7)",
    fieldUrlEmpty: "يرجى لصق أو كتابة رابط ويب.",
    fieldUrlInvalid: "يرجى إدخال رابط صالح (مثال: https://...)",
    fieldPhoneEmpty: "يرجى كتابة رقم الهاتف.",
    fieldPhoneInvalidDigits: "يرجى إدخال أرقام فقط.",
    footerText: "تنفيذ فوري ومحلي 100% داخل المتصفح",
    footerShield: "لا يتم إرسال أي رابط أو رقم هاتف إلى أي خادم نهائياً."
  }
};

const STORAGE_KEY = "coreutils_lang";

export function getCurrentLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && (saved === "en" || saved === "ar")) {
    return saved;
  }
  return "en";
}

export function setLanguage(lang) {
  if (lang !== "en" && lang !== "ar") lang = "en";
  localStorage.setItem(STORAGE_KEY, lang);
  applyLanguage(lang);
}

export function applyLanguage(lang) {
  const dict = translations[lang] || translations.en;

  // Set document dir and lang attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // Translate all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Translate placeholders with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });

  // Translate titles with data-i18n-title
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (dict[key]) {
      el.setAttribute("title", dict[key]);
    }
  });

  // Dispatch custom event for components that need re-rendering
  window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang, dict } }));
}

export function t(key) {
  const lang = getCurrentLanguage();
  return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}
