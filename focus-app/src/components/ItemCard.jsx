import { useState } from 'react'
import { PlayCircle, ListVideo, Globe, Trash2 } from 'lucide-react'

const TYPE_ICON = {
  'youtube-video': PlayCircle,
  'youtube-playlist': ListVideo,
  website: Globe,
}

const TYPE_LABEL = {
  'youtube-video': 'video',
  'youtube-playlist': 'playlist',
  website: 'page',
}

export default function ItemCard({ item, onOpen, onDelete }) {
  const Icon = TYPE_ICON[item.type] || Globe
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <button
      onClick={() => onOpen(item)}
      className="card-index text-left w-full pl-6 pr-4 py-4 flex gap-4 items-start hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-line)] transition-all duration-150 group"
    >
      <div className="w-24 h-16 shrink-0 bg-paper-dim border border-line overflow-hidden flex items-center justify-center">
        {item.thumbnail && !imgFailed ? (
          <img
            src={item.thumbnail}
            alt=""
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover grayscale-[15%]"
          />
        ) : (
          <Icon size={22} className="text-ink-soft" strokeWidth={1.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-1 whitespace-nowrap overflow-hidden">
          <span className="font-mono text-[10px] tracking-wider text-rust uppercase shrink-0">
            {item.callNumber}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-ink-soft/70 uppercase shrink-0">
            · {TYPE_LABEL[item.type]}
          </span>
        </div>
        <h3 className="font-display text-[15px] leading-snug text-ink truncate">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-xs text-ink-soft mt-0.5 truncate">{item.subtitle}</p>
        )}
      </div>

      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(item)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation()
            onDelete(item)
          }
        }}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity shrink-0 p-1.5 text-ink-soft hover:text-rust"
        aria-label={`Remove ${item.title}`}
      >
        <Trash2 size={15} strokeWidth={1.5} />
      </span>
    </button>
  )
}
