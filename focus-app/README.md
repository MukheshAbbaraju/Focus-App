# Focus

A distraction-free shelf for the YouTube videos, playlists, and web pages you keep meaning to get back to. Everything plays inside the app itself — no homepage feed, no recommended-video rabbit hole, no algorithm.

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

The app is installable — `vite-plugin-pwa` generates the manifest and service worker on build, so once deployed, "Install app" / "Add to Home Screen" works in supporting browsers.

## How it works

- **Add anything by pasting a link.** `src/lib/urlDetect.js` tells a YouTube video apart from a YouTube playlist apart from any other website.
- **Videos and playlists** play through the official YouTube IFrame API (`src/components/YouTubePlayer.jsx`), loaded with `rel=0`, `modestbranding`, and no end-screen suggestions, and served from `youtube-nocookie.com`.
- **Websites** open in an in-app frame (`src/components/PlayerView.jsx`) with a link to open the original — some sites set headers that block being framed at all, which is a restriction the site itself sets, not something this app can override.
- **Storage is local-only**, via IndexedDB through Dexie (`src/lib/db.js`). Nothing leaves the device; there's no account and no backend.
- **Metadata** comes from two public, CORS-enabled endpoints: YouTube's own oEmbed endpoint for videos/playlists, and microlink.io for website title/preview. If either lookup fails (offline, rate-limited), the item still saves — just with a plainer title.

## Project layout

```
src/
  lib/
    db.js          Dexie schema (shelves + items)
    urlDetect.js    YouTube video / playlist / website detection
    metadata.js     oEmbed + microlink lookups
    callNumber.js   Generates the VID-2026-014 style index labels
  components/
    Sidebar.jsx       Shelves (collections) list
    SearchBar.jsx
    ItemCard.jsx      Library-index-card item display
    AddItemModal.jsx  Paste-a-link save flow
    EmptyState.jsx
    PlayerView.jsx    Full-screen video/website viewer
    YouTubePlayer.jsx IFrame API wrapper
  App.jsx
```

## Extending it

- **Focus sessions / timers** — a natural next step; hook a countdown into `PlayerView`.
- **Website reader mode** — strip a saved page down to just its article text (a Readability-style pass) instead of framing the live site.
- **Sync across devices** — everything is local by design right now. Adding Supabase/Firebase behind the same `db.js` interface would carry sync without changing the rest of the app.
- **Import from YouTube** — paste a "Watch Later" or channel playlist URL to bulk-import.

## Design notes

The visual language is a library card catalog, not a media dashboard: index cards with stamped call numbers (`VID-2026-014`), a shelf sidebar, paper and moss-green tones. The intent is that the app itself doesn't compete for attention the way the platforms it replaces do.
