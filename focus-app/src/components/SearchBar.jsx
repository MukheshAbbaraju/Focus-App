import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xs">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your shelf…"
        className="w-full bg-card border border-line pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-moss"
      />
    </div>
  )
}
