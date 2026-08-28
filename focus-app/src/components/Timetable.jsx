import { useEffect, useMemo, useState } from 'react'

// Edit this array to change your schedule. Times are 24-hour "HH:MM".
const DEFAULT_SCHEDULE = [
  { start: '06:00', end: '08:00', subject: 'DSA & Programming for GATE and Placements' },
  { start: '09:00', end: '10:00', subject: 'Algorithms' },
  { start: '10:00', end: '13:00', subject: 'Engineering Maths' },
  { start: '14:00', end: '15:00', subject: 'TOC, Compiler Design' },
  { start: '15:00', end: '16:30', subject: 'Digital Logic, COA' },
  { start: '16:30', end: '17:15', subject: 'One Subject Mock' },
  { start: '19:00', end: '20:30', subject: 'OS + CN' },
  { start: '21:00', end: '22:30', subject: 'DBMS' },
]

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Only hours+minutes are read (the date is ignored on purpose) —
// that's what makes this reset itself at midnight with zero extra logic.
function nowInMinutes(date) {
  return date.getHours() * 60 + date.getMinutes()
}

function formatClock(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, '0')}${period}`
}

function formatDuration(mins) {
  if (mins <= 0) return 'now'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function getRowState(row, nowMin) {
  const start = toMinutes(row.start)
  const end = toMinutes(row.end)
  if (nowMin >= end) return { status: 'completed', label: 'Completed' }
  if (nowMin >= start) return { status: 'active', label: `In progress · ends in ${formatDuration(end - nowMin)}` }
  return { status: 'upcoming', label: `Begins in ${formatDuration(start - nowMin)}` }
}

export default function TimeTable({ schedule = DEFAULT_SCHEDULE }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000) // recheck every 30s
    return () => clearInterval(id)
  }, [])

  const nowMin = nowInMinutes(now)

  const rows = useMemo(
    () => schedule.map((row) => ({ ...row, ...getRowState(row, nowMin) })),
    [schedule, nowMin]
  )

  const dayLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-card border border-line-soft rounded">
      <div className="flex items-center justify-between px-5 py-3 border-b border-line-soft">
        <span className="font-display text-sm uppercase tracking-wide text-ink">Today's Schedule</span>
        <span className="text-xs text-ink-soft italic">{dayLabel}</span>
      </div>

      <div className="divide-y divide-line-soft">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-[auto,1fr] sm:grid-cols-[110px,1fr,200px] gap-x-4 gap-y-1 items-center px-5 py-3 transition-colors ${
              row.status === 'active' ? 'bg-moss/10' : ''
            }`}
          >
            <span className="font-mono text-xs text-ink-soft whitespace-nowrap">
              {formatClock(row.start)}<span className="mx-1 text-line-soft">–</span>{formatClock(row.end)}
            </span>

            <span
              className={`text-sm text-ink col-span-1 sm:col-span-1 ${
                row.status === 'completed' ? 'line-through text-ink-soft opacity-60' : ''
              }`}
            >
              {row.subject}
            </span>

            <span
              className={`col-span-2 sm:col-span-1 flex items-center gap-1.5 text-xs justify-start sm:justify-end ${
                row.status === 'active' ? 'text-moss font-semibold' : 'text-ink-soft'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  row.status === 'active'
                    ? 'bg-moss animate-pulse'
                    : row.status === 'completed'
                    ? 'bg-moss'
                    : 'bg-line-soft'
                }`}
              />
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
