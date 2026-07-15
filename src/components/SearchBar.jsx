import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiPlus } from 'react-icons/fi'

export default function SearchBar({ items, onSelect, selectedIds }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIds.includes(item.id),
  )

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(item) {
    onSelect(item.id)
    setQuery('')
    setFocused(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search craftable items..."
          className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-500 rounded-xl text-dark-50 placeholder-dark-300 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
        />
      </div>

      {focused && query && filtered.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 left-0 right-0 bg-dark-800 border border-dark-500 rounded-xl overflow-hidden shadow-xl z-20 max-h-60 overflow-y-auto"
        >
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-600 transition-colors text-left"
            >
              <FiPlus className="text-accent shrink-0" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      )}

      {focused && query && filtered.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-dark-800 border border-dark-500 rounded-xl p-4 text-center text-dark-300 text-sm">
          No items found
        </div>
      )}
    </div>
  )
}
