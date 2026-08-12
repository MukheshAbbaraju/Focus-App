// Metadata lookups. Both use public, CORS-enabled endpoints so this
// stays a pure front-end app with no server of its own.

export async function fetchYoutubeOEmbed(originalUrl) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(originalUrl)}&format=json`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error('oEmbed lookup failed')
  const data = await res.json()
  return {
    title: data.title,
    author: data.author_name,
    thumbnail: data.thumbnail_url,
  }
}

export async function fetchWebsitePreview(originalUrl) {
  const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(originalUrl)}&meta=true`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error('Preview lookup failed')
  const { data } = await res.json()
  return {
    title: data?.title || new URL(originalUrl).hostname,
    description: data?.description || '',
    image: data?.image?.url || data?.logo?.url || null,
    siteName: data?.publisher || new URL(originalUrl).hostname,
  }
}
