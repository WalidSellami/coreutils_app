# CoreUtils

> Ultra-fast, zero-backend, privacy-centric utility web suite. Runs 100% client-side with zero telemetry and sub-millisecond execution.

**Live Web App:** [https://coreutils.pages.dev](https://coreutils.pages.dev)

---

## Features

- **URL Disinfector**: Strips 140+ tracking parameters ($O(1)$ hash map: UTM, `fbclid`, `gclid`, TikTok, Amazon, YouTube) and unwraps redirect wrappers (Google, Facebook, SafeLinks) while preserving critical query state.
- **Direct WhatsApp Launcher**: Opens encrypted `wa.me` chats directly without saving temporary contacts to phone address books. Features smart country code detection (including Algerian `05/06/07` zero-stripping) and masked local history.
- **Zero-Data Privacy**: Executes entirely in browser memory. No backend, no cookies, no analytics beacons, and no external requests.
- **Bilingual & Dual-Theme UX**: English (LTR) and Arabic (RTL) localization with dark/light glassmorphic modes and tactile haptic feedback.
- **SEO & PWA Ready**: Complete Schema.org structured data (`WebApplication`, `FAQPage`), Open Graph / Twitter cards, `sitemap.xml`, `robots.txt`, and Progressive Web App manifest.

---

## Project Structure

```text
coreutils/
├── index.html              # Responsive tabbed UI with dual themes, bilingual RTL & SEO schema
├── manifest.webmanifest    # Progressive Web App manifest
├── robots.txt              # Search & AI crawler directives (GPTBot, Perplexity, Googlebot)
├── sitemap.xml             # Canonical sitemap with bilingual hreflang alternates
├── assets/
│   ├── css/
│   │   └── styles.css      # Design tokens, glassmorphism, responsive styles & RTL layout
│   ├── img/
│   │   ├── logo.png        # Brand icon
│   │   └── og-preview.jpg  # 1200x630 Social card preview
│   └── js/
│       ├── app.js          # Controller: tabs, clipboard, validation, toast notifications
│       ├── disinfector.js  # URL sanitization engine (140+ trackers & platform guards)
│       ├── whatsapp.js     # Phone validator, dial codes & masked local storage history
│       └── i18n.js         # English & Arabic dictionary with dynamic metadata synchronization
└── README.md
```

---

## Quick Start

Run any static server from the `coreutils` directory:

```bash
# Python 3
cd coreutils
python -m http.server 3000

# Node.js
npx serve coreutils
```

Visit `http://localhost:3000`.
