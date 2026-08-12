import Dexie from 'dexie'

// A single local database. Everything lives on-device — this app
// makes no accounts, so there is nothing to leak and nothing to sync
// unless the user adds that themselves later.
export const db = new Dexie('focus-shelf')

db.version(1).stores({
  // callNumber is a human-facing id, not the primary key
  items: '++id, type, shelfId, title, addedAt, callNumber',
  shelves: '++id, name, createdAt, sortIndex',
})

db.on('populate', async () => {
  const generalId = await db.shelves.add({
    name: 'General',
    createdAt: Date.now(),
    sortIndex: 0,
  })
  return generalId
})

export async function ensureDefaultShelf() {
  const count = await db.shelves.count()
  if (count === 0) {
    return db.shelves.add({ name: 'General', createdAt: Date.now(), sortIndex: 0 })
  }
  const first = await db.shelves.orderBy('sortIndex').first()
  return first.id
}
