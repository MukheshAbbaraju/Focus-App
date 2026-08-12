import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Menu } from 'lucide-react'
import { db, ensureDefaultShelf } from './lib/db'
import { makeCallNumber } from './lib/callNumber'
import Sidebar from './components/Sidebar'
import SearchBar from './components/SearchBar'
import ItemCard from './components/ItemCard'
import EmptyState from './components/EmptyState'
import AddItemModal from './components/AddItemModal'
import PlayerView from './components/PlayerView'

export default function App() {
  const [activeShelfId, setActiveShelfId] = useState(null) // null = all items
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [openItem, setOpenItem] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const shelves = useLiveQuery(() => db.shelves.orderBy('sortIndex').toArray(), [], [])
  const allItems = useLiveQuery(() => db.items.orderBy('addedAt').reverse().toArray(), [], [])

  const itemCounts = useMemo(() => {
    const counts = {}
    for (const item of allItems || []) {
      counts[item.shelfId] = (counts[item.shelfId] || 0) + 1
    }
    return counts
  }, [allItems])

  const visibleItems = useMemo(() => {
    let items = allItems || []
    if (activeShelfId !== null) {
      items = items.filter((i) => i.shelfId === activeShelfId)
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      items = items.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.subtitle?.toLowerCase().includes(q) ||
          i.callNumber?.toLowerCase().includes(q)
      )
    }
    return items
  }, [allItems, activeShelfId, query])

  async function handleSave(draft) {
    let targetShelfId = draft.shelfId
    if (!targetShelfId) {
      targetShelfId = await ensureDefaultShelf()
    }
    const sequence = ((allItems?.length || 0) + 1)
    await db.items.add({
      ...draft,
      shelfId: targetShelfId,
      callNumber: makeCallNumber(draft.type, sequence),
      addedAt: Date.now(),
    })
  }

  async function handleDelete(item) {
    await db.items.delete(item.id)
  }

  async function handleCreateShelf(name) {
    const sortIndex = (shelves?.length || 0)
    const id = await db.shelves.add({ name, createdAt: Date.now(), sortIndex })
    setActiveShelfId(id)
  }

  const activeShelfName = activeShelfId
    ? shelves?.find((s) => s.id === activeShelfId)?.name
    : 'All items'

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar
        shelves={shelves || []}
        activeShelfId={activeShelfId}
        itemCounts={itemCounts}
        onSelect={(id) => {
          setActiveShelfId(id)
          setSidebarOpen(false)
        }}
        onCreateShelf={handleCreateShelf}
        isOpen={sidebarOpen}
      />

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-paper/95 backdrop-blur-sm border-b border-line-soft px-5 md:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-ink-soft"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle shelves"
            >
              <Menu size={19} />
            </button>
            <h1 className="font-display text-lg md:text-xl text-ink truncate">{activeShelfName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar value={query} onChange={setQuery} />
            <button
              onClick={() => setModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-moss text-card text-sm px-3.5 py-2 hover:bg-ink transition-colors shrink-0"
            >
              <Plus size={15} /> Add
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="sm:hidden bg-moss text-card p-2"
              aria-label="Add item"
            >
              <Plus size={17} />
            </button>
          </div>
        </header>

        <div className="paper-grain px-5 md:px-8 py-6">
          {visibleItems.length === 0 ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onOpen={setOpenItem}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <AddItemModal
          shelves={shelves || []}
          activeShelfId={activeShelfId || shelves?.[0]?.id}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {openItem && <PlayerView item={openItem} onBack={() => setOpenItem(null)} />}
    </div>
  )
}
