# discord-alternative

Modern single-page site for self hosted voice chat - Mumble and TeamSpeak on a VPS you own.

**Live site:** https://discord-alternative.com

![discord-alternative.com](screenshot.png)

## What it is

Ditch Discord. A VPS and ten minutes gets you a Mumble or TeamSpeak server you actually own - no data harvesting, no Electron bloat, no account bans, no outages. This site covers:

- **Why Discord loses** - the case for self hosting, condensed
- **Comparison table** - Discord vs Mumble vs TeamSpeak 3 vs TeamSpeak 6
- **Setup guides** - step by step installs for all three servers, with copyable commands
- **VPS host picks** - Contabo and Kamatera, with specs and pricing
- **FAQ** - the common questions answered

## Tech

- Vanilla HTML + CSS + JS - zero frameworks, zero trackers, no build step
- Single page with tabbed setup guides and deep-linkable sections
- Self-hosted fonts (Inter Variable, JetBrains Mono) - no external requests except lazy-loaded YouTube thumbnails
- Versioned assets (`styles-vN.css`, `main-vN.js`) for cache-busting behind Cloudflare
- JSON-LD structured data (WebSite + FAQPage) for search rich results

## Deploy

Static site - copy the files to any web root. The live setup:

1. nginx serves `/var/www/discord-alternative`
2. `/assets/` cached 30 days (immutable), HTML served dynamic
3. Legacy sub-page URLs 301 to their single-page sections
4. Behind Cloudflare proxy (full strict)

## Rollback

The current site is a complete single-page rewrite. If you ever want the original
multi-page site back, restore the files and the nginx redirects from an older state.
