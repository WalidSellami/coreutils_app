/**
 * CoreUtils Web Suite - Clean Link & URL Disinfector Engine
 * High-performance, client-side URL sanitization engine (< 1ms).
 * Strips surveillance, affiliate, and tracking tokens client-side while ensuring
 * that destination links remain 100% syntactically valid and functionally working.
 */

// Comprehensive tracking parameter blacklist covering Google, Meta, TikTok, Twitter/X,
// Amazon, Affiliate networks (HasOffers, Impact, ShareASale, CJ, Rakuten, Awin),
// Email/CRM suites (Mailchimp, HubSpot, Klaviyo, Marketo, Vero), and analytics.
export const GLOBAL_TRACKING_PARAMS = [
  // Google / Ads / Analytics / Search telemetry
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
  'gclid', 'gclsrc', 'dclid', 'ga_source', 'ga_medium', 'ga_term',
  'gad_source', 'gbraid', 'wbraid',
  'sxsrf', 'cshid', 'biw', 'bih', 'uact', 'oq', 'gs_lcp', 'sourceid', 'ved', 'ei', 'sa',

  // Meta / Facebook / Instagram / Threads
  'fbclid', 'igshid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_comment_id', 'fb_ref',
  'hsa_cam', 'hsa_grp', 'hsa_mt', 'hsa_src', 'hsa_ad', 'hsa_acc', 'hsa_net', 'hsa_kw', 'hsa_tgt', 'hsa_ver',

  // TikTok & ByteDance
  '_t', '_r', 'tt_medium', 'tt_content', 'tt_source', 'sender_device', 'is_from_webapp', 'sender_web_id',

  // Twitter / X
  'ref_src', 'ref_url', 'twclid',

  // YouTube telemetry (timestamps 't' and video 'v' are strictly preserved)
  'si', 'feature', 'pp', 'embeds_referring_euri', 'embeds_referring_origin',

  // Amazon & E-Commerce Telemetry
  'ref', 'ref_', 'tag', 'linkCode', 'camp', 'creative', 'creativeASIN', 'ascsubtag',
  'pf_rd_r', 'pf_rd_m', 'pf_rd_t', 'pf_rd_i', 'pf_rd_p',
  'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sr', 'sprefix', 'crid',

  // AliExpress & eBay & Marketplace Tracking
  'spm', 'scm', 'algo_pvid', 'algo_expid', 'btsid', 'ws_ab_test',
  '_trkparms', '_trksid', 'amdata', 'mkevt', 'mkcid', 'mkrid',

  // Affiliate Networks (HasOffers, Impact Radius, ShareASale, Commission Junction, Rakuten, Awin)
  'aff_id', 'aff_sub', 'aff_sub2', 'aff_sub3', 'aff_sub4', 'aff_sub5', 'aff_c', 'offer_id',
  'irclickid', 'irgwc', 'clickid', 'zanpid', 'subid', 'subid2', 'sscid', 'sharedid',
  'ranMID', 'ranEAID', 'ranSiteID', 'cvosrc', 'cvo_campaign', 'cvo_crid', 'partner_id',

  // Mail / CRM / Marketing Automation (Mailchimp, HubSpot, Klaviyo, Marketo, Vero, ActiveCampaign)
  'mc_eid', 'mc_cid', 'msclkid', 'yclid', '_hsenc', '_hsmi', 'hsCtaTracking', 'mkt_tok',
  '_kx', 'vero_id', 'vero_conv', 'wickedid', 'icid', 'ncid', 'rb_clickid', 'trk_contact', 'trk_msg',

  // Spotify & Media tracking
  'context', 'nd',

  // General attribution & surveillance tokens
  'trackingId', 'refId', 'midToken', 'trk', 'trkEmail'
];

// Pre-compiled Set for O(1) lookup speed
const TRACKING_PARAM_SET = new Set(GLOBAL_TRACKING_PARAMS.map((p) => p.toLowerCase()));

// Dynamic tracking parameter prefix pattern
const TRACKING_PREFIX_REGEX = /^(utm_|fb_|hsa_|ga_|twclid|igshid|_hs|mc_)/i;

// Essential query parameters that must NEVER be stripped as tracking params
const ESSENTIAL_QUERY_WHITELIST = new Set([
  'q', 'query', 'search', 'k', 'p', 'page', 'id', 'v', 't', 'list', 'index',
  'lang', 'language', 'locale', 'tab', 'sort', 'filter', 'view', 'th', 'psc', 'smid', 'channel'
]);

/**
 * Strict regular expression that only accepts URLs starting with http:// or https://
 * with a valid domain (FQDN with recognized TLD) and optional port/path/query/hash.
 */
export const STRICT_URL_REGEX = /^https?:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:[/?#]\S*)?$/i;

/**
 * Domain-only regular expression to detect bare domains when protocol was omitted by user.
 * (e.g. "amazon.com/dp/B08X...", "youtube.com/watch?v=...")
 */
export const BARE_DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:[/?#]\S*)?$/i;

/**
 * Validates whether the given string is a strict HTTP/HTTPS URL.
 * @param {string} url
 * @returns {boolean}
 */
export function isValidStrictUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return STRICT_URL_REGEX.test(url.trim());
}

/**
 * Checks if a string can be processed as a valid URL (either strictly or with auto-protocol).
 * @param {string} rawInput 
 * @returns {boolean}
 */
export function isAcceptableUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return false;
  const normalized = normalizeUrlInput(rawInput).cleanInput;
  return STRICT_URL_REGEX.test(normalized);
}

/**
 * Intelligently extracts and normalizes URLs from common user inputs
 * (stripping surrounding quotes, angle brackets, markdown links, and adding https:// if missing).
 * @param {string} rawInput 
 * @returns {{ cleanInput: string, wasAutoFixed: boolean }}
 */
export function normalizeUrlInput(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { cleanInput: '', wasAutoFixed: false };
  }

  let text = rawInput.trim();

  // Strip wrapping markdown link format: [Title](https://...)
  const mdMatch = text.match(/^\[.*?\]\((https?:\/\/[^\s)]+)\)$/i);
  if (mdMatch && mdMatch[1]) {
    text = mdMatch[1].trim();
  }

  // Strip wrapping angle brackets: <https://...>
  if (text.startsWith('<') && text.endsWith('>')) {
    text = text.slice(1, -1).trim();
  }

  // Strip wrapping quotes: "https://..." or 'https://...'
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1).trim();
  }

  // Disallow unsafe schemes (javascript:, data:, file:, etc.)
  const lower = text.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    return { cleanInput: text, wasAutoFixed: false };
  }

  // If already starts with http:// or https://
  if (/^https?:\/\//i.test(text)) {
    return { cleanInput: text, wasAutoFixed: false };
  }

  // If starts with another scheme like ftp://, keep it as-is so strict validator rejects it
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(text)) {
    return { cleanInput: text, wasAutoFixed: false };
  }

  // Check if it's a bare domain without protocol (e.g. "example.com/page?utm=1")
  if (BARE_DOMAIN_REGEX.test(text)) {
    return { cleanInput: `https://${text}`, wasAutoFixed: true };
  }

  return { cleanInput: text, wasAutoFixed: false };
}

/**
 * Attempts to unwrap known tracking redirect intermediaries to reach the canonical destination URL.
 * Handles Google Search (/url?q=), Facebook (/l.php?u=), Reddit (out.reddit.com), Outlook SafeLinks, and Slack redirects.
 * @param {URL} urlObj 
 * @returns {{ unwrapped: boolean, targetUrl?: string, redirectSource?: string }}
 */
export function tryUnwrapRedirect(urlObj) {
  const hostname = urlObj.hostname.toLowerCase();
  const pathname = urlObj.pathname.toLowerCase();

  // 1. Google Search Redirect: google.*/url?q=TARGET_URL or ?url=TARGET_URL
  if (hostname.includes('google.') && pathname === '/url') {
    const target = urlObj.searchParams.get('q') || urlObj.searchParams.get('url');
    if (target && /^https?:\/\//i.test(target)) {
      return { unwrapped: true, targetUrl: decodeURIComponent(target), redirectSource: 'Google Redirect' };
    }
  }

  // 2. Facebook Link Shim: (l.facebook.com or lm.facebook.com)/l.php?u=TARGET_URL
  if ((hostname === 'l.facebook.com' || hostname === 'lm.facebook.com' || hostname === 'facebook.com') && pathname === '/l.php') {
    const target = urlObj.searchParams.get('u');
    if (target && /^https?:\/\//i.test(target)) {
      return { unwrapped: true, targetUrl: decodeURIComponent(target), redirectSource: 'Facebook Link Shim' };
    }
  }

  // 3. Reddit Outbound Redirect: out.reddit.com/url?url=TARGET_URL
  if (hostname === 'out.reddit.com') {
    const target = urlObj.searchParams.get('url');
    if (target && /^https?:\/\//i.test(target)) {
      return { unwrapped: true, targetUrl: decodeURIComponent(target), redirectSource: 'Reddit Outbound' };
    }
  }

  // 4. Microsoft Outlook SafeLinks: safelinks.protection.outlook.com/?url=TARGET_URL
  if (hostname.includes('safelinks.protection.outlook.com')) {
    const target = urlObj.searchParams.get('url');
    if (target && /^https?:\/\//i.test(target)) {
      return { unwrapped: true, targetUrl: decodeURIComponent(target), redirectSource: 'Outlook SafeLinks' };
    }
  }

  // 5. Slack Redirect: slack-redir.net/link?url=TARGET_URL
  if (hostname === 'slack-redir.net') {
    const target = urlObj.searchParams.get('url');
    if (target && /^https?:\/\//i.test(target)) {
      return { unwrapped: true, targetUrl: decodeURIComponent(target), redirectSource: 'Slack Redirect' };
    }
  }

  return { unwrapped: false };
}

/**
 * Disinfects a URL by stripping tracking parameters, unwrapping redirects, and applying smart platform rules.
 * @param {string} rawInput 
 * @param {{ autoHeal?: boolean }} [options] Default: { autoHeal: true }
 * @returns {{
 *   originalUrl: string,
 *   cleanUrl: string,
 *   removedParams: string[],
 *   isValid: boolean,
 *   unwrapped?: boolean,
 *   redirectSource?: string,
 *   wasAutoFixed?: boolean,
 *   errorKey?: string
 * }}
 */
export function disinfectUrl(rawInput, options = { autoHeal: true }) {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      originalUrl: '',
      cleanUrl: '',
      removedParams: [],
      isValid: false,
      errorKey: 'fieldUrlEmpty'
    };
  }

  const { cleanInput, wasAutoFixed } = options.autoHeal !== false
    ? normalizeUrlInput(rawInput)
    : { cleanInput: rawInput.trim(), wasAutoFixed: false };

  // Validate strict URL requirement
  if (!STRICT_URL_REGEX.test(cleanInput)) {
    return {
      originalUrl: rawInput,
      cleanUrl: '',
      removedParams: [],
      isValid: false,
      errorKey: 'toastErrorInvalidUrlProtocol'
    };
  }

  let urlObj;
  try {
    urlObj = new URL(cleanInput);
  } catch {
    return {
      originalUrl: rawInput,
      cleanUrl: '',
      removedParams: [],
      isValid: false,
      errorKey: 'toastErrorInvalidUrlProtocol'
    };
  }

  const removedParams = [];
  let unwrapped = false;
  let redirectSource = '';

  // Check and unwrap redirect intermediaries (e.g. google.com/url?q=..., l.facebook.com/l.php?u=...)
  const redirectCheck = tryUnwrapRedirect(urlObj);
  if (redirectCheck.unwrapped && redirectCheck.targetUrl) {
    try {
      urlObj = new URL(redirectCheck.targetUrl);
      unwrapped = true;
      redirectSource = redirectCheck.redirectSource || 'Redirect Wrapper';
      removedParams.push(`redirect_wrapper (${redirectSource})`);
    } catch {
      // If parsing unwrapped URL failed, continue with original
    }
  }

  const hostname = urlObj.hostname.toLowerCase();

  // -------------------------------------------------------------
  // Platform Rule 1: Amazon Product Canonicalization & Variant Protection
  // Canonical format: https://amazon.{tld}/dp/{ASIN}
  // Essential variant params (th, psc, language, smid) are preserved.
  // -------------------------------------------------------------
  if (hostname.includes('amazon.')) {
    const asinMatch = urlObj.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    if (asinMatch && asinMatch[1]) {
      const asin = asinMatch[1].toUpperCase();
      const cleanPath = `/dp/${asin}`;
      urlObj.pathname = cleanPath;

      // Essential Amazon parameters to preserve if present
      const amazonKeepKeys = ['th', 'psc', 'language', 'smid'];
      const preservedPairs = [];
      for (const [k, v] of urlObj.searchParams.entries()) {
        const lowerK = k.toLowerCase();
        if (amazonKeepKeys.includes(lowerK)) {
          preservedPairs.push([k, v]);
        } else {
          removedParams.push(k);
        }
      }

      // Rebuild search params with only preserved keys
      urlObj.search = '';
      preservedPairs.forEach(([k, v]) => urlObj.searchParams.set(k, v));

      return {
        originalUrl: rawInput,
        cleanUrl: urlObj.toString().replace(/\/$/, ''),
        removedParams,
        isValid: true,
        unwrapped,
        redirectSource,
        wasAutoFixed
      };
    }
  }

  // -------------------------------------------------------------
  // Platform Rule 2: YouTube Tracking & Timestamp/Playlist Protection
  // Preserves: video ID 'v', timestamp 't', playlist 'list', and position 'index'.
  // -------------------------------------------------------------
  const isYouTube = hostname.includes('youtube.com') || hostname.includes('youtu.be');
  let preservedTimestamp = null;
  if (isYouTube) {
    if (urlObj.searchParams.has('t')) {
      preservedTimestamp = urlObj.searchParams.get('t');
    } else if (urlObj.searchParams.has('time_continue')) {
      preservedTimestamp = urlObj.searchParams.get('time_continue');
    }
  }

  // -------------------------------------------------------------
  // General Parameter Cleaning (O(1) Set Lookup + Dynamic Prefix Matching)
  // -------------------------------------------------------------
  const keysToRemove = [];
  for (const [key] of urlObj.searchParams.entries()) {
    const lowerKey = key.toLowerCase();

    // Guard essential parameters
    if (ESSENTIAL_QUERY_WHITELIST.has(lowerKey)) {
      continue;
    }

    // Check if key is a known tracking parameter or matches prefix patterns
    const isTracking =
      TRACKING_PARAM_SET.has(lowerKey) ||
      TRACKING_PREFIX_REGEX.test(lowerKey) ||
      (lowerKey === 's' && (hostname.includes('twitter.com') || hostname.includes('x.com'))) ||
      (lowerKey === 't' && (hostname.includes('twitter.com') || hostname.includes('x.com')));

    if (isTracking) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    removedParams.push(key);
    urlObj.searchParams.delete(key);
  });

  // Re-inject YouTube clean timestamp parameter 't' if one was present
  if (isYouTube && preservedTimestamp && !urlObj.searchParams.has('t')) {
    urlObj.searchParams.set('t', preservedTimestamp);
  }

  // Normalize path (collapse consecutive slashes)
  urlObj.pathname = urlObj.pathname.replace(/\/{2,}/g, '/');

  // Clean empty hash or useless solitary hash
  if (urlObj.hash === '#' || urlObj.hash === '') {
    urlObj.hash = '';
  }

  // Clean trailing question mark if searchParams is empty
  let cleanUrl = urlObj.toString();
  if (cleanUrl.endsWith('?')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }

  return {
    originalUrl: rawInput,
    cleanUrl,
    removedParams,
    isValid: true,
    unwrapped,
    redirectSource,
    wasAutoFixed
  };
}
