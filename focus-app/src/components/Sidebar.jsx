import { useState } from 'react'
import { Plus, LibraryBig, Clock, Trash2 } from 'lucide-react'

export default function Sidebar({
  shelves,
  activeShelfId,
  itemCounts,
  onSelect,
  onCreateShelf,
  onDeleteShelf,
  isOpen,
  onClose,
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

  function handleDeleteClick(e, shelf) {
    e.stopPropagation()
    const ok = window.confirm(`Delete "${shelf.name}"? Its items will move out of this shelf, not be deleted.`)
    if (ok) onDeleteShelf(shelf)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/30 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-line bg-paper-dim/95 px-5 py-6 flex transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 md:transition-none md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 md:bg-paper-dim/60`}
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
            className={`text-left px-2.5 py-1.5 text-sm flex items-center justify-between ${
              activeShelfId === null && !showTimeTable ? 'bg-moss text-card' : 'text-ink hover:bg-line-soft'
            }`}
          >
            <span>All items</span>
          </button>

          {shelves.map((shelf) => {
            const active = activeShelfId === shelf.id && !showTimeTable
            return (
              <div
                key={shelf.id}
                className={`flex items-center justify-between px-2.5 py-1.5 text-sm ${
                  active ? 'bg-moss text-card' : 'text-ink hover:bg-line-soft'
                }`}
              >
                <button onClick={() => onSelect(shelf.id)} className="flex-1 min-w-0 text-left truncate">
                  {shelf.name}
                </button>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className={`font-mono text-[10px] ${active ? 'text-card/70' : 'text-ink-soft/70'}`}>
                    {itemCounts[shelf.id] || 0}
                  </span>
                  <button
                    onClick={(e) => handleDeleteClick(e, shelf)}
                    className={`p-0.5 transition-colors ${
                      active ? 'text-card/60 hover:text-card' : 'text-ink-soft/60 hover:text-red-600'
                    }`}
                    aria-label={`Delete ${shelf.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
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
    </>
  )
}
