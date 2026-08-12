import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { detectUrl } from '../lib/urlDetect'
import { fetchYoutubeOEmbed, fetchWebsitePreview } from '../lib/metadata'

export default function AddItemModal({ shelves, activeShelfId, onClose, onSave }) {
  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('')
  const [shelfId, setShelfId] = useState(activeShelfId)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!raw.trim()) return

    const detected = detectUrl(raw)
    if (detected.type === 'invalid') {
      setStatus('error')
      setErrorMsg("That doesn't look like a link yet — paste a full URL.")
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      if (detected.type === 'youtube-video') {
        const meta = await fetchYoutubeOEmbed(detected.url.href).catch(() => null)
        await onSave({
          type: 'youtube-video',
          videoId: detected.videoId,
          sourceUrl: detected.url.href,
          title: meta?.title || 'Untitled video',
          subtitle: meta?.author || '',
          thumbnail: meta?.thumbnail || `https://i.ytimg.com/vi/${detected.videoId}/mqdefault.jpg`,
          shelfId,
        })
      } else if (detected.type === 'youtube-playlist') {
        const meta = await fetchYoutubeOEmbed(detected.url.href).catch(() => null)
        await onSave({
          type: 'youtube-playlist',
          playlistId: detected.playlistId,
          sourceUrl: detected.url.href,
          title: meta?.title || 'Untitled playlist',
          subtitle: meta?.author || '',
          thumbnail: meta?.thumbnail || null,
          shelfId,
        })
      } else {
        const meta = await fetchWebsitePreview(detected.url.href).catch(() => null)
        await onSave({
          type: 'website',
          sourceUrl: detected.url.href,
          title: meta?.title || detected.url.hostname,
          subtitle: meta?.siteName || detected.url.hostname,
          thumbnail: meta?.image || null,
          shelfId,
        })
      }
      setRaw('')
      onClose()
    } catch (err) {
      setStatus('error')
      setErrorMsg('Could not save that link. Try again in a moment.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-ink/40 p-4 pt-20 sm:pt-4">
      <div className="card-index w-full max-w-md p-6 pl-8 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-ink">Add to the shelf</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-xs font-mono uppercase tracking-wider text-ink-soft mb-1.5">
              Paste a link
            </label>
            <input
              id="url"
              type="text"
              autoFocus
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="youtube.com/watch?v=… or any web page"
              className="w-full bg-paper border border-line px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-moss"
            />
            <p className="text-xs text-ink-soft mt-1.5">
              A single video, a full YouTube playlist, or any website.
            </p>
          </div>

          {shelves.length > 0 && (
            <div>
              <label htmlFor="shelf" className="block text-xs font-mono uppercase tracking-wider text-ink-soft mb-1.5">
                Shelf
              </label>
              <select
                id="shelf"
                value={shelfId}
                onChange={(e) => setShelfId(Number(e.target.value))}
                className="w-full bg-paper border border-line px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-moss"
              >
                {shelves.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {status === 'error' && (
            <p className="text-xs text-rust">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-moss text-card py-2.5 text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-ink transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Filing it away…
              </>
            ) : (
              'Save to shelf'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
