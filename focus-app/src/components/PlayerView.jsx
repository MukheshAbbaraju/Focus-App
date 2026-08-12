import { ArrowLeft, ExternalLink, ShieldAlert } from 'lucide-react'
import YouTubePlayer from './YouTubePlayer'

export default function PlayerView({ item, onBack }) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-40 bg-ink flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 bg-ink text-card border-b border-ink-soft/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-card/80 hover:text-card"
        >
          <ArrowLeft size={16} /> Back to shelf
        </button>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-card/60 hover:text-card"
        >
          Open original <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {item.type === 'youtube-video' && (
          <YouTubePlayer videoId={item.videoId} />
        )}
        {item.type === 'youtube-playlist' && (
          <YouTubePlayer playlistId={item.playlistId} />
        )}
        {item.type === 'website' && (
          <div className="flex-1 bg-card relative">
            <iframe
              src={item.sourceUrl}
              title={item.title}
              className="w-full h-full min-h-[70vh] border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-start gap-2 text-xs text-ink-soft bg-paper-dim px-4 py-2.5 border-t border-line">
              <ShieldAlert size={13} className="mt-0.5 shrink-0" />
              <span>
                Some sites refuse to load inside another page. If this looks blank, use "Open original" above.
              </span>
            </div>
          </div>
        )}

        <div className="bg-card px-6 py-5 max-w-2xl">
          <span className="font-mono text-[10px] tracking-wider text-rust uppercase">
            {item.callNumber}
          </span>
          <h1 className="font-display text-xl text-ink mt-1">{item.title}</h1>
          {item.subtitle && <p className="text-sm text-ink-soft mt-1">{item.subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
