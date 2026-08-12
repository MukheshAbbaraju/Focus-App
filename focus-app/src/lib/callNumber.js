// Every saved item gets a stamped "call number" like a library index
// card, e.g. VID-2026-014, PLY-2026-002, WEB-2026-031. It is decorative
// but consistent — a quiet alternative to a big loud thumbnail grid.

const PREFIX = {
  'youtube-video': 'VID',
  'youtube-playlist': 'PLY',
  website: 'WEB',
}

export function makeCallNumber(type, sequence) {
  const year = new Date().getFullYear()
  const prefix = PREFIX[type] || 'ITM'
  return `${prefix}-${year}-${String(sequence).padStart(3, '0')}`
}
