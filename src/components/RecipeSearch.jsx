import { useState, useRef, useEffect } from 'react'

export default function RecipeSearch({ items, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const craftableItems = items.filter((i) => i.craftable)

  const filtered = query
    ? craftableItems.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase())
      )
    : craftableItems

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(item) {
    onSelect(item)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-craft-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search craftable items..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="input-field pl-10"
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-craft-surface border border-gray-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-gray-800 last:border-0"
            >
              <span className="w-2 h-2 rounded-full bg-craft-purple shrink-0" />
              <span className="text-craft-text font-medium">{item.name}</span>
              <span className="ml-auto text-xs text-craft-muted">Craftable</span>
            </button>
          ))}
        </div>
      )}

      {open && query && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-craft-surface border border-gray-700 rounded-xl shadow-2xl p-4 text-center text-craft-muted text-sm">
          No craftable items found
        </div>
      )}
    </div>
  )
}
