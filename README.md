# CoreUtils

A lightweight, zero-backend, privacy-centric utility web suite built with Vanilla ES6+ JavaScript, HTML5, and a custom CSS/Tailwind design system. Runs 100% client-side with sub-millisecond execution and zero telemetry.

**Live Testing App:** [https://coreutils.pages.dev](https://coreutils.pages.dev)

---

## Modules & Capabilities

### 1. URL Disinfector (`disinfector.js`)
*High-speed client-side URL sanitization engine (< 1ms).*

- **140+ Tracking Parameters Stripped ($O(1)$ Lookup):**
  - **Google & Analytics:** `utm_*`, `gclid`, `gclsrc`, `dclid`, `gad_source`, `gbraid`, `wbraid`, `sxsrf`, search telemetry (`cshid`, `ved`, `ei`).
  - **Meta / Social:** `fbclid`, `igshid`, `fb_ref`, `hsa_*` (complete Facebook Ads parameters).
  - **TikTok & ByteDance:** `_t`, `_r`, `tt_medium`, `tt_content`, `tt_source`, `sender_device`.
  - **Twitter / X:** `twclid`, `ref_src`, `ref_url`, plus contextual `s` and `t`.
  - **E-Commerce & Marketplaces:** Amazon (`ref`, `pf_rd_*`, `pd_rd_*`, `tag`, `qid`), AliExpress (`spm`, `scm`, `algo_pvid`), eBay (`_trkparms`, `_trksid`, `amdata`).
  - **Affiliates & Email/CRM:** HasOffers, Impact Radius, ShareASale, Awin, Mailchimp (`mc_eid`), HubSpot (`_hsenc`), Klaviyo (`_kx`), Marketo (`mkt_tok`).
- **Smart Auto-Healing:** Bare domains without protocol (e.g. `amazon.com/dp/...`) auto-prepend `https://`. Automatically strips accidental quotes (`"..."`), angle brackets (`<...>`), and markdown links (`[Title](URL)`).
- **Redirect Unwrapping:** Detects and unwraps tracking redirect intermediaries from Google Search (`google.com/url?q=...`), Facebook Link Shim (`l.facebook.com/l.php?u=...`), Reddit (`out.reddit.com`), Outlook SafeLinks, and Slack.
- **Platform State Protection:**
  - **Amazon:** Canonicalizes to `/dp/{ASIN}` while preserving product variants (`th=1`, `psc=1`, `language`). Preserves search query (`k`) on `/s` pages.
  - **YouTube:** Protects video ID (`v`), playlist ID (`list`), playlist index (`index`), and timestamps (`t` / `time_continue`).
  - **State Whitelist:** Critical parameters (`q`, `search`, `p`, `page`, `id`, `lang`, `tab`, `sort`, `filter`) are never stripped.
- **Actions:**
  - **Open Clean URL:** Instant 1-click testing in a safe new tab (`target="_blank" rel="noopener noreferrer"`).
  - **Copy Clean URL:** 1-click clipboard copy with animated feedback.
  - **Clear:** Strictly visible only after results are displayed; auto-resets when editing input.

### 2. Direct WhatsApp Opener (`whatsapp.js`)
*Initiate WhatsApp chats without polluting phone address books with temporary contacts.*

- **Carrier Formatting (+213 Algeria):** Strips leading zeros for domestic numbers (`05`, `06`, `07`) when international dial code `+213` is applied.
- **Global Country Selector:** Searchable dial codes for 20+ countries (+213, +1, +33, +966, +971, +212, +44, etc.).
- **Dual Actions:** "Open in WhatsApp" (`wa.me`) or "Copy Direct Link".
- **Masked Local History:** Privately caches the last 5 chats locally (`localStorage`) with masked digits (e.g., `+213 5•• ••• •89`).

### 3. Design System & Accessibility
- **Dual Theme Engine:** Dark Mode (default) & Light Mode with zero-flash pre-render initialization and `localStorage` sync.
- **Bilingual & RTL-Ready:** Full English (LTR) and Arabic (RTL) localization with typography pairing (**Plus Jakarta Sans** for English, **Cairo** for Arabic).
- **Compliant Aesthetics:** Emerald/slate palette (100% purple-free, WCAG AAA contrast ratios).

---

## Project Structure

```text
coreutils/
├── index.html              # Responsive tabbed UI with dual themes & bilingual support
├── assets/
│   ├── css/
│   │   └── styles.css      # Design tokens, glassmorphism, responsive styles, RTL rules
│   └── js/
│       ├── app.js          # Controller: tabs, clipboard, validation, toast alerts
│       ├── disinfector.js  # URL engine: 140+ trackers, unwrapper, platform protectors
│       ├── whatsapp.js     # Phone validator, country rules, masked history
│       └── i18n.js         # English/Arabic translations and layout coordinator
└── README.md
```

---

## Quick Start

Run any static HTTP server from the `coreutils` directory:

### Python 3
```bash
cd coreutils
python -m http.server 3000
```
Open `http://localhost:3000`.

### Node.js
```bash
npx serve coreutils
```
