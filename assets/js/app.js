/**
 * CoreUtils Web Suite - Main Application Controller
 * Coordinates UI tabs, animated sliding indicator, theme toggling with smooth transitions, 
 * bilingual i18n morphing, clipboard API, and modules.
 */

import { getCurrentLanguage, setLanguage, applyLanguage, t } from './i18n.js?v=1788950916441';
import { disinfectUrl, isAcceptableUrl, normalizeUrlInput } from './disinfector.js?v=1788950916441';
import {
  COUNTRY_CODES,
  sanitizePhoneNumber,
  buildWhatsAppUrl,
  getRecentNumbers,
  saveRecentNumber,
  clearRecentHistory
} from './whatsapp.js?v=1788950916441';

// DOM Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

// Language Controls
const langBtnEn = document.getElementById('langBtnEn');
const langBtnAr = document.getElementById('langBtnAr');
const mainAppContent = document.getElementById('mainAppContent');
const navIndicator = document.getElementById('navIndicator');

// Tab Navigation & Sliding Indicator
const tabContainer = document.getElementById('tabContainer');
const tabDisinfector = document.getElementById('tabDisinfector');
const tabWhatsApp = document.getElementById('tabWhatsApp');
const panelDisinfector = document.getElementById('panelDisinfector');
const panelWhatsApp = document.getElementById('panelWhatsApp');

// Disinfector DOM
const inputUrl = document.getElementById('inputUrl');
const urlFeedback = document.getElementById('urlFeedback');
const btnQuickPaste = document.getElementById('btnQuickPaste');
const btnCleanUrl = document.getElementById('btnCleanUrl');
const btnClearUrl = document.getElementById('btnClearUrl');
const disinfectorResult = document.getElementById('disinfectorResult');
const outputCleanUrl = document.getElementById('outputCleanUrl');
const btnOpenCleanUrl = document.getElementById('btnOpenCleanUrl');
const btnCopyCleanUrl = document.getElementById('btnCopyCleanUrl');
const badgeUnwrappedTag = document.getElementById('badgeUnwrappedTag');
const badgeAutoFixedTag = document.getElementById('badgeAutoFixedTag');
const copyIcon = document.getElementById('copyIcon');
const copyLabel = document.getElementById('copyLabel');
const speedStat = document.getElementById('speedStat');
const paramChipsList = document.getElementById('paramChipsList');
const sampleButtons = document.querySelectorAll('.sample-link-btn');

// WhatsApp DOM
const countrySelect = document.getElementById('countrySelect');
const inputPhone = document.getElementById('inputPhone');
const phoneFeedback = document.getElementById('phoneFeedback');
const btnOpenWhatsApp = document.getElementById('btnOpenWhatsApp');
const btnCopyWaLink = document.getElementById('btnCopyWaLink');
const copyWaIcon = document.getElementById('copyWaIcon');
const copyWaLabel = document.getElementById('copyWaLabel');
const recentNumbersList = document.getElementById('recentNumbersList');
const recentNumbersEmpty = document.getElementById('recentNumbersEmpty');
const btnClearWaHistory = document.getElementById('btnClearWaHistory');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

/* ==========================================================================
   Tactile Haptic Feedback Utility (Mobile Browsers)
   ========================================================================== */
export function triggerHaptic(type = 'error') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (type === 'error') {
        // Distinct subtle double-pulse for error
        navigator.vibrate([40, 50, 40]);
      } else if (type === 'success') {
        // Crisp single tap for success
        navigator.vibrate(25);
      } else if (type === 'tab') {
        // Light subtle tick for tab swipe
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration error if restricted by device policy
    }
  }
}

/* ==========================================================================
   Universal Mobile & Desktop Clipboard Copy Helper
   ========================================================================== */
export async function copyTextToClipboard(text) {
  if (!text) return false;

  // 1. Try modern asynchronous Clipboard API if supported and in secure context
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to DOM fallback
    }
  }

  // 2. Universal iOS / Android / Desktop fallback via invisible textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Essential for mobile Safari
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
export function showToast(message, type = 'success') {
  if (type === 'error') {
    triggerHaptic('error');
  } else if (type === 'success') {
    triggerHaptic('success');
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success' ? 'bi-check-circle-fill text-emerald-400' : 'bi-exclamation-triangle-fill text-red-400';
  toast.innerHTML = `
    <i class="bi ${iconName} text-lg flex-shrink-0"></i>
    <span class="flex-1 text-sm font-medium">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px) scale(0.95)';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

/* ==========================================================================
   Theme Management with Smooth Premium Animation & Browser Default Detection
   ========================================================================== */
const THEME_STORAGE_KEY = 'coreutils_theme';

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const mediaQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  const prefersDark = mediaQuery ? mediaQuery.matches : false;
  // Strictly depend on the user's browser setting if no manual selection has been made
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme, false);

  // Automatically adapt if user changes system/browser theme mode
  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  }
}

function applyTheme(theme, animate = true) {
  if (animate) {
    document.documentElement.classList.add('theme-transitioning');
    themeIcon.classList.add('theme-spin-icon');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      themeIcon.classList.remove('theme-spin-icon');
    }, 450);
  }

  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'dark') {
    themeIcon.className = 'bi bi-sun text-amber-400 text-lg';
    themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
  } else {
    themeIcon.className = 'bi bi-moon-stars text-slate-800 text-lg';
    themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark', true);
});

/* ==========================================================================
   Language (i18n) Management with Morphing Transition
   ========================================================================== */
function initLanguage() {
  const currentLang = getCurrentLanguage();
  applyLanguage(currentLang);
  updateLangSwitchState(currentLang);
  initCountrySelect(currentLang);
}

function updateLangSwitchState(currentLang) {
  if (currentLang === 'en') {
    langBtnEn.classList.add('active');
    langBtnAr.classList.remove('active');
  } else {
    langBtnAr.classList.add('active');
    langBtnEn.classList.remove('active');
  }
}

function triggerLanguageChange(nextLang) {
  // Trigger morphing animation on main container
  mainAppContent.classList.remove('lang-morph-anim');
  void mainAppContent.offsetWidth; // Reflow
  mainAppContent.classList.add('lang-morph-anim');

  setLanguage(nextLang);
  updateLangSwitchState(nextLang);
  initCountrySelect(nextLang);
  renderRecentNumbers();

  if (inputUrl && inputUrl.value.trim()) {
    validateUrlLive(false);
  }
  if (inputPhone && inputPhone.value.trim()) {
    validatePhoneLive(false);
  }
}

langBtnEn.addEventListener('click', () => triggerLanguageChange('en'));
langBtnAr.addEventListener('click', () => triggerLanguageChange('ar'));

/* ==========================================================================
   Physical Sliding Tab Navigation (Immediate Tab Switching Without Auto-Scroll)
   ========================================================================== */
function switchTab(target) {
  if (target === 'disinfector') {
    tabContainer.classList.remove('tab-second-active');

    tabDisinfector.classList.add('active');
    tabDisinfector.setAttribute('aria-selected', 'true');
    tabWhatsApp.classList.remove('active');
    tabWhatsApp.setAttribute('aria-selected', 'false');

    panelDisinfector.classList.remove('hidden');
    panelWhatsApp.classList.add('hidden');

    panelDisinfector.classList.remove('panel-transition');
    void panelDisinfector.offsetWidth; // Reflow
    panelDisinfector.classList.add('panel-transition');

    inputUrl.focus();
  } else {
    tabContainer.classList.add('tab-second-active');

    tabWhatsApp.classList.add('active');
    tabWhatsApp.setAttribute('aria-selected', 'true');
    tabDisinfector.classList.remove('active');
    tabDisinfector.setAttribute('aria-selected', 'false');

    panelWhatsApp.classList.remove('hidden');
    panelDisinfector.classList.add('hidden');

    panelWhatsApp.classList.remove('panel-transition');
    void panelWhatsApp.offsetWidth; // Reflow
    panelWhatsApp.classList.add('panel-transition');

    inputPhone.focus();
    // Auto scroll disabled when WhatsApp tab is selected as requested
  }
}

tabDisinfector.addEventListener('click', () => switchTab('disinfector'));
tabWhatsApp.addEventListener('click', () => switchTab('whatsapp'));

/* ==========================================================================
   Tactile Validation & Micro-interaction Helpers
   ========================================================================== */
function shakeElement(el) {
  if (!el) return;
  el.classList.remove('shake-field');
  void el.offsetWidth; // Force DOM reflow
  el.classList.add('shake-field');
  setTimeout(() => el.classList.remove('shake-field'), 450);
}

function setUrlFeedback(status, message = '') {
  if (!urlFeedback) return;
  urlFeedback.className = 'inline-field-feedback';
  inputUrl.classList.remove('input-valid', 'input-invalid', 'border-red-500', 'border-emerald-500');

  if (status === 'valid') {
    urlFeedback.classList.add('show', 'feedback-valid');
    urlFeedback.innerHTML = `<i class="bi bi-check-circle-fill text-xs flex-shrink-0"></i><span>${message || t('validUrlNotice')}</span>`;
    inputUrl.classList.add('input-valid');
  } else if (status === 'invalid') {
    urlFeedback.classList.add('show', 'feedback-invalid');
    urlFeedback.innerHTML = `<i class="bi bi-exclamation-circle-fill text-xs flex-shrink-0"></i><span>${message || t('fieldUrlInvalid')}</span>`;
    inputUrl.classList.add('input-invalid');
  } else {
    urlFeedback.classList.remove('show');
    urlFeedback.innerHTML = '';
  }
}

function validateUrlLive(showEmptyError = false) {
  const raw = inputUrl.value.trim();
  if (!raw) {
    if (showEmptyError) {
      setUrlFeedback('invalid', t('fieldUrlEmpty'));
      shakeElement(inputUrl);
    } else {
      setUrlFeedback('neutral');
    }
    return false;
  }

  // Accept valid strict URLs or auto-healable domains
  if (!isAcceptableUrl(raw)) {
    setUrlFeedback('invalid', t('toastErrorInvalidUrlProtocol'));
    if (showEmptyError) shakeElement(inputUrl);
    return false;
  }

  const { wasAutoFixed } = normalizeUrlInput(raw);
  const result = disinfectUrl(raw);
  if (result.isValid) {
    const noticeMsg = wasAutoFixed
      ? t('validUrlNoticeAutoFixed')
      : t('validUrlNotice');
    setUrlFeedback('valid', noticeMsg);
    return true;
  } else {
    setUrlFeedback('invalid', t(result.errorKey || 'toastErrorInvalidUrlProtocol'));
    if (showEmptyError) shakeElement(inputUrl);
    return false;
  }
}

function setPhoneFeedback(status, message = '') {
  if (!phoneFeedback) return;
  phoneFeedback.className = 'inline-field-feedback';
  inputPhone.classList.remove('input-valid', 'input-invalid', 'border-red-500', 'border-emerald-500');

  if (status === 'valid') {
    phoneFeedback.classList.add('show', 'feedback-valid');
    phoneFeedback.innerHTML = `<i class="bi bi-check-circle-fill text-xs flex-shrink-0"></i><span>${message || t('validPhoneNotice')}</span>`;
    inputPhone.classList.add('input-valid');
  } else if (status === 'invalid') {
    phoneFeedback.classList.add('show', 'feedback-invalid');
    phoneFeedback.innerHTML = `<i class="bi bi-exclamation-circle-fill text-xs flex-shrink-0"></i><span>${message}</span>`;
    inputPhone.classList.add('input-invalid');
  } else {
    phoneFeedback.classList.remove('show');
    phoneFeedback.innerHTML = '';
  }
}

function validatePhoneLive(showEmptyError = false) {
  const dialCode = countrySelect.value;
  const raw = inputPhone.value.trim();
  if (!raw) {
    if (showEmptyError) {
      setPhoneFeedback('invalid', t('fieldPhoneEmpty'));
      shakeElement(inputPhone);
    } else {
      setPhoneFeedback('neutral');
    }
    return false;
  }

  const sanitized = sanitizePhoneNumber(raw, dialCode);
  if (sanitized.isValid) {
    const validMsg = (dialCode === '+213')
      ? t('validPhoneNoticeAlgeria')
      : t('validPhoneNotice');
    setPhoneFeedback('valid', validMsg);
    return true;
  } else {
    const errorMsg = t(sanitized.errorKey || 'toastErrorInvalidPhone');
    setPhoneFeedback('invalid', errorMsg);
    if (showEmptyError) shakeElement(inputPhone);
    return false;
  }
}

/* ==========================================================================
   URL Disinfector Controller with Full Auto-Scroll to Results
   ========================================================================== */
function handleDisinfect() {
  const raw = inputUrl.value.trim();
  if (!raw) {
    validateUrlLive(true);
    inputUrl.focus();
    return;
  }

  if (!isAcceptableUrl(raw)) {
    setUrlFeedback('invalid', t('toastErrorInvalidUrlProtocol'));
    shakeElement(inputUrl);
    showToast(t('toastErrorInvalidUrlProtocol'), 'error');
    disinfectorResult.classList.add('hidden');
    btnClearUrl.classList.add('hidden');
    inputUrl.focus();
    return;
  }

  const startTime = performance.now();
  const result = disinfectUrl(raw);
  const duration = (performance.now() - startTime).toFixed(1);

  if (!result.isValid) {
    setUrlFeedback('invalid', t(result.errorKey || 'toastErrorInvalidUrlProtocol'));
    shakeElement(inputUrl);
    showToast(t(result.errorKey || 'toastErrorInvalidUrlProtocol'), 'error');
    disinfectorResult.classList.add('hidden');
    btnClearUrl.classList.add('hidden');
    inputUrl.focus();
    return;
  }

  const noticeMsg = result.wasAutoFixed ? t('validUrlNoticeAutoFixed') : t('validUrlNotice');
  setUrlFeedback('valid', noticeMsg);
  outputCleanUrl.value = result.cleanUrl;
  speedStat.textContent = `⚡ ${duration}ms`;

  // Update Open Clean URL action
  if (btnOpenCleanUrl) {
    btnOpenCleanUrl.href = result.cleanUrl;
  }

  // Update Unwrapped Redirect Badge
  if (badgeUnwrappedTag) {
    if (result.unwrapped) {
      badgeUnwrappedTag.classList.remove('hidden');
    } else {
      badgeUnwrappedTag.classList.add('hidden');
    }
  }

  // Update Auto-Fixed Protocol Badge
  if (badgeAutoFixedTag) {
    if (result.wasAutoFixed) {
      badgeAutoFixedTag.classList.remove('hidden');
    } else {
      badgeAutoFixedTag.classList.add('hidden');
    }
  }

  // Render stripped chips with staggered animations
  paramChipsList.innerHTML = '';
  if (result.removedParams && result.removedParams.length > 0) {
    result.removedParams.forEach((param, idx) => {
      const chip = document.createElement('span');
      chip.className = 'param-chip';
      chip.style.animationDelay = `${idx * 45}ms`;
      chip.innerHTML = `<i class="bi bi-shield-x text-xs"></i> <span>${escapeHtml(param)}</span>`;
      paramChipsList.appendChild(chip);
    });
  } else {
    const emptyNotice = document.createElement('span');
    emptyNotice.className = 'text-xs text-brand-accent font-semibold flex items-center gap-1.5 py-1';
    emptyNotice.innerHTML = `<i class="bi bi-shield-check text-sm"></i> <span>${t('statsNone')}</span>`;
    paramChipsList.appendChild(emptyNotice);
  }

  // Reveal results container and display the clear button
  disinfectorResult.classList.remove('hidden');
  disinfectorResult.classList.remove('result-reveal-anim');
  void disinfectorResult.offsetWidth; // Reflow
  disinfectorResult.classList.add('result-reveal-anim');

  // Display Clear URL button strictly after result is displayed
  btnClearUrl.classList.remove('hidden');

  // Flash speed badge
  speedStat.classList.remove('speed-flash-anim');
  void speedStat.offsetWidth; // Reflow
  speedStat.classList.add('speed-flash-anim');

  showToast(t('toastCleaned'), 'success');

  // Decisive smooth auto-scroll: positions Cleaned URL and stripped parameter badges in full clear view
  setTimeout(() => {
    const navbar = document.querySelector('.navbar-glass');
    const navHeight = navbar ? navbar.offsetHeight : 70;
    const rect = disinfectorResult.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = scrollTop + rect.top - navHeight - 20;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }, 100);
}

btnCleanUrl.addEventListener('click', handleDisinfect);

btnClearUrl.addEventListener('click', () => {
  inputUrl.value = '';
  outputCleanUrl.value = '';
  if (btnOpenCleanUrl) btnOpenCleanUrl.href = '#';
  if (badgeUnwrappedTag) badgeUnwrappedTag.classList.add('hidden');
  if (badgeAutoFixedTag) badgeAutoFixedTag.classList.add('hidden');
  setUrlFeedback('neutral');
  disinfectorResult.classList.add('hidden');
  btnClearUrl.classList.add('hidden');
  inputUrl.focus();
});

btnQuickPaste.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      inputUrl.value = text.trim();
      handleDisinfect();
    } else {
      showToast(t('toastClipboardDenied'), 'error');
    }
  } catch {
    showToast(t('toastClipboardDenied'), 'error');
  }
});

// Interactive Copy Button with Animated Success State & Universal Fallback
btnCopyCleanUrl.addEventListener('click', async () => {
  if (!outputCleanUrl.value) return;

  const originalLabel = copyLabel.textContent;
  const copied = await copyTextToClipboard(outputCleanUrl.value);

  if (copied) {
    copyIcon.className = 'bi bi-check2 text-emerald-200 text-sm';
    copyLabel.textContent = t('btnCopied');
    btnCopyCleanUrl.classList.add('ring-2', 'ring-emerald-400');
    showToast(t('toastCopied'), 'success');

    setTimeout(() => {
      copyIcon.className = 'bi bi-copy';
      copyLabel.textContent = originalLabel;
      btnCopyCleanUrl.classList.remove('ring-2', 'ring-emerald-400');
    }, 2000);
  } else {
    showToast(t('toastClipboardDenied'), 'error');
  }
});

// Sample links testing including TikTok
const SAMPLE_URLS = {
  utm: "https://marketing-hub.org/special-offer?utm_source=spring_sale&utm_medium=email&utm_campaign=retargeting&utm_content=promo_banner&item_id=8842",
  youtube: "https://youtu.be/dQw4w9WgXcQ?si=k9Z1qLw38XoP&t=42s",
  amazon: "https://www.amazon.com/Apple-AirPods-Charging-Case-Renewed/dp/B07SKBL7V4/ref=sr_1_1?dchild=1&keywords=airpods&qid=1612345678&sr=8-1",
  tiktok: "https://www.tiktok.com/@techinsider/video/7345678901234567890?is_from_webapp=1&sender_device=pc&_r=1&utm_source=share"
};

sampleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    if (SAMPLE_URLS[type]) {
      inputUrl.value = SAMPLE_URLS[type];
      handleDisinfect();
    }
  });
});

inputUrl.addEventListener('input', () => {
  validateUrlLive(false);
  // Strictly hide result and clear button until user disinfects new input
  disinfectorResult.classList.add('hidden');
  btnClearUrl.classList.add('hidden');
});

inputUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    inputUrl.blur();
    handleDisinfect();
  }
});

/* ==========================================================================
   WhatsApp Direct Opener Controller
   ========================================================================== */
function initCountrySelect(lang = getCurrentLanguage()) {
  const currentVal = countrySelect.value || '+213';
  countrySelect.innerHTML = '';
  COUNTRY_CODES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    const displayName = (lang === 'ar' && c.countryAr) ? c.countryAr : c.country;
    opt.textContent = `${c.flag} ${displayName} (${c.code})`;
    if (c.code === currentVal) {
      opt.selected = true;
    }
    countrySelect.appendChild(opt);
  });
}

async function handleWhatsAppAction(actionType) {
  const dialCode = countrySelect.value;
  const rawNumber = inputPhone.value.trim();

  if (!rawNumber) {
    validatePhoneLive(true);
    inputPhone.focus();
    return;
  }

  const sanitized = sanitizePhoneNumber(rawNumber, dialCode);

  if (!sanitized.isValid) {
    const errorMsg = t(sanitized.errorKey || 'toastErrorInvalidPhone');
    setPhoneFeedback('invalid', errorMsg);
    shakeElement(inputPhone);
    inputPhone.focus();
    return;
  }

  setPhoneFeedback('valid');

  // Save to recent numbers in localStorage
  saveRecentNumber(sanitized.fullNumber);
  renderRecentNumbers();

  const waUrl = buildWhatsAppUrl(sanitized.fullNumber);

  if (actionType === 'open') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  } else if (actionType === 'copy') {
    const originalLabel = copyWaLabel.textContent;
    const copied = await copyTextToClipboard(waUrl);

    if (copied) {
      copyWaIcon.className = 'bi bi-check2 text-brand-accent text-lg';
      copyWaLabel.textContent = t('btnCopied');
      showToast(t('toastLinkCopied'), 'success');

      setTimeout(() => {
        copyWaIcon.className = 'bi bi-link-45deg text-lg';
        copyWaLabel.textContent = originalLabel;
      }, 2000);
    } else {
      showToast(t('toastClipboardDenied'), 'error');
    }
  }
}

// Real-time phone number format validation
inputPhone.addEventListener('input', () => validatePhoneLive(false));

countrySelect.addEventListener('change', () => {
  validatePhoneLive(false);
});

btnOpenWhatsApp.addEventListener('click', () => handleWhatsAppAction('open'));
btnCopyWaLink.addEventListener('click', () => handleWhatsAppAction('copy'));

// Desktop Enter key & Mobile OK / Done virtual keyboard action
inputPhone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault();
    inputPhone.blur(); // Dismisses mobile virtual keyboard smoothly
    handleWhatsAppAction('open');
  }
});

function renderRecentNumbers() {
  const recents = getRecentNumbers();
  recentNumbersList.innerHTML = '';

  if (recents.length === 0) {
    recentNumbersEmpty.classList.remove('hidden');
    recentNumbersList.appendChild(recentNumbersEmpty);
    btnClearWaHistory.classList.add('hidden');
    return;
  }

  recentNumbersEmpty.classList.add('hidden');
  btnClearWaHistory.classList.remove('hidden');

  recents.forEach(item => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'recent-chip';
    chip.innerHTML = `<i class="bi bi-phone text-brand-accent"></i> <span>${escapeHtml(item.masked)}</span>`;
    chip.title = "Click to re-use this number";

    chip.addEventListener('click', () => {
      // Match country code
      let matchedCode = '+213';
      for (const c of COUNTRY_CODES) {
        const rawCode = c.code.replace(/\D/g, '');
        if (item.number.startsWith(rawCode)) {
          matchedCode = c.code;
          break;
        }
      }
      countrySelect.value = matchedCode;
      const codeDigits = matchedCode.replace(/\D/g, '');
      const localPart = item.number.substring(codeDigits.length);
      inputPhone.value = localPart;
      inputPhone.focus();
      showToast(`${item.masked} loaded`, 'success');
    });

    recentNumbersList.appendChild(chip);
  });
}

btnClearWaHistory.addEventListener('click', () => {
  clearRecentHistory();
  renderRecentNumbers();
  showToast("History cleared", 'success');
});

/* ==========================================================================
   Helpers
   ========================================================================== */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Global Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!panelDisinfector.classList.contains('hidden')) {
      btnClearUrl.click();
    }
  }
});

/* ==========================================================================
   Mobile Touch Swipe Gesture Navigation (LTR & RTL aware)
   ========================================================================== */
function initSwipeNavigation() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  const minSwipeDistance = 45; // Minimum px for swipe
  const maxSwipeDuration = 550; // Maximum ms for swipe

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].screenX;
      touchStartY = e.touches[0].screenY;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const elapsed = Date.now() - touchStartTime;

      // Ignore if user tapped a select, input, or textarea
      const targetTag = e.target ? (e.target.tagName || '').toLowerCase() : '';
      if (targetTag === 'select' || targetTag === 'option') {
        return;
      }

      // Check horizontal swipe dominance over vertical scroll
      if (
        elapsed <= maxSwipeDuration &&
        Math.abs(deltaX) >= minSwipeDistance &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.35
      ) {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const isDisinfectorActive = tabDisinfector.classList.contains('active');

        if (!isRtl) {
          // LTR: Swipe Left (deltaX < 0) -> Next Tab (WhatsApp)
          // LTR: Swipe Right (deltaX > 0) -> Prev Tab (Disinfector)
          if (deltaX < 0 && isDisinfectorActive) {
            switchTab('whatsapp');
            triggerHaptic('tab');
          } else if (deltaX > 0 && !isDisinfectorActive) {
            switchTab('disinfector');
            triggerHaptic('tab');
          }
        } else {
          // RTL: Swipe Left (deltaX < 0) -> Prev Tab (Disinfector)
          // RTL: Swipe Right (deltaX > 0) -> Next Tab (WhatsApp)
          if (deltaX < 0 && !isDisinfectorActive) {
            switchTab('disinfector');
            triggerHaptic('tab');
          } else if (deltaX > 0 && isDisinfectorActive) {
            switchTab('whatsapp');
            triggerHaptic('tab');
          }
        }
      }
    }
  }, { passive: true });
}

// App Initialization (handles both pre- and post-DOMContentLoaded module execution)
function initApp() {
  initTheme();
  initLanguage();
  renderRecentNumbers();
  initSwipeNavigation();
  // Ensure Clear URL button is hidden on initial load
  if (btnClearUrl) {
    btnClearUrl.classList.add('hidden');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
