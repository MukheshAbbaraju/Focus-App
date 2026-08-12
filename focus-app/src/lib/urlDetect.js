// Figures out what kind of thing a pasted URL points to, so the
// app can route it to the right saver + the right in-app viewer.

function safeParse(raw) {
  try {
    return new URL(raw.trim())
  } catch {
    // People often paste bare domains ("youtube.com/watch?v=...") without a scheme.
    try {
      return new URL(`https://${raw.trim()}`)
    } catch {
      return null
    }
  }
}

const YT_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'])
const YT_SHORT_HOSTS = new Set(['youtu.be'])

export function detectUrl(raw) {
  const url = safeParse(raw)
  if (!url) return { type: 'invalid', url: null }

  const host = url.hostname.toLowerCase()

  if (YT_SHORT_HOSTS.has(host)) {
    const videoId = url.pathname.replace('/', '')
    if (videoId) return { type: 'youtube-video', videoId, url }
  }

  if (YT_HOSTS.has(host)) {
    const playlistId = url.searchParams.get('list')
    const videoId = url.searchParams.get('v')

    if (url.pathname.startsWith('/playlist') && playlistId) {
      return { type: 'youtube-playlist', playlistId, url }
    }
    if (videoId) {
      // A watch URL can carry both a video id and a list id (played from within
      // a playlist). Treat it as a single video save — playlists are saved
      // explicitly via /playlist links so the intent is unambiguous.
      return { type: 'youtube-video', videoId, url }
    }
    if (url.pathname.startsWith('/shorts/')) {
      const id = url.pathname.split('/')[2]
      if (id) return { type: 'youtube-video', videoId: id, url }
    }
  }

  return { type: 'website', url }
}
