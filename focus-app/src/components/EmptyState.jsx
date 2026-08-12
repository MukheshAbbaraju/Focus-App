import { BookOpen } from 'lucide-react'

export default function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <BookOpen size={28} className="text-line mb-4" strokeWidth={1.2} />
      <h2 className="font-display text-xl text-ink mb-1.5">The shelf is empty</h2>
      <p className="text-sm text-ink-soft max-w-xs mb-5">
        Paste a video, a playlist, or a page you keep meaning to get back to.
      </p>
      <button
        onClick={onAdd}
        className="bg-moss text-card text-sm px-4 py-2 hover:bg-ink transition-colors"
      >
        Add your first item
      </button>
    </div>
  )
}
