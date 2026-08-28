import { useState } from 'react'
import { Plus, LibraryBig, Clock } from 'lucide-react'

export default function Sidebar({
  shelves,
  activeShelfId,
  itemCounts,
  onSelect,
  onCreateShelf,
  isOpen,
  showTimeTable,
  onToggleTimeTable,
}) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  function submitNewShelf(e) {
    e.preventDefault()
    if (!name.trim()) return
    onCreateShelf(name.trim())
    setName('')
    setCreating(false)
  }

  return (
    <aside
      className={`${isOpen ? 'flex' : 'hidden'} md:flex w-full md:w-60 shrink-0 flex-col border-r border-line bg-paper-dim/60 md:h-screen md:sticky md:top-0 px-5 py-6`}
    >
      <div className="flex items-center gap-2 mb-8">
        <LibraryBig size={19} className="text-moss" strokeWidth={1.5} />
        <span className="font-display text-lg tracking-tight">Focus</span>
      </div>

      <button
        onClick={onToggleTimeTable}
        className={`text-left px-2.5 py-1.5 mb-6 text-sm flex items-center gap-2 ${
          showTimeTable ? 'bg-moss text-card' : 'text-ink hover:bg-line-soft'
        }`}
      >
        <Clock size={15} strokeWidth={1.75} />
        <span>Time Table</span>
      </button>

      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Shelves</span>
        <button
          onClick={() => setCreating((v) => !v)}
          className="text-ink-soft hover:text-moss p-0.5"
          aria-label="New shelf"
        >
          <Plus size={15} />
        </button>
      </div>

      <nav className="flex flex-col gap-0.5">
        <button
          onClick={() => onSelect(null)}
          className={`text-left px-2.5 py-1.5 text-sm flex items-center justify-between group ${
            activeShelfId === null && !showTimeTable ? 'bg-moss text-card' : 'text-ink hover:bg-line-soft'
          }`}
        >
          <span>All items</span>
        </button>
        {shelves.map((shelf) => (
          <button
            key={shelf.id}
            onClick={() => onSelect(shelf.id)}
            className={`text-left px-2.5 py-1.5 text-sm flex items-center justify-between ${
              activeShelfId === shelf.id && !showTimeTable ? 'bg-moss text-card' : 'text-ink hover:bg-line-soft'
            }`}
          >
            <span className="truncate">{shelf.name}</span>
            <span
              className={`font-mono text-[10px] ${
                activeShelfId === shelf.id && !showTimeTable ? 'text-card/70' : 'text-ink-soft/70'
              }`}
            >
              {itemCounts[shelf.id] || 0}
            </span>
          </button>
        ))}
      </nav>

      {creating && (
        <form onSubmit={submitNewShelf} className="mt-2 px-2.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => !name.trim() && setCreating(false)}
            placeholder="Shelf name"
            className="w-full bg-card border border-line px-2 py-1.5 text-sm focus:outline-none focus:border-moss"
          />
        </form>
      )}

      <div className="mt-auto pt-6 border-t border-line-soft">
        <p className="text-[11px] text-ink-soft leading-relaxed">
          Everything here is stored on this device only. No accounts, no feed, no autoplay into someone else's video.
        </p>
      </div>
    </aside>
  )
}
