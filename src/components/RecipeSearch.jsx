import { useState, useRef, useEffect, useMemo } from 'react'
import { getItemMeta, getRarityStyle, CATEGORIES } from '../data/itemMeta.js'

const STORAGE_RECENT = 'recipe-maker-recent'

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_RECENT) || '[]') } catch { return [] }
}

function saveRecent(recent) {
  localStorage.setItem(STORAGE_RECENT, JSON.stringify(recent.slice(0, 10)))
}

export default function RecipeSearch({ items, favorites, onSelect, onToggleFavorite }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('all')
  const [recent, setRecent] = useState(loadRecent())
  const ref = useRef(null)
  const inputRef = useRef(null)

  const craftableItems = useMemo(() => items.filter((i) => i.craftable), [items])

  const grouped = useMemo(() => {
    let filtered = craftableItems

    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(i => i.name.toLowerCase().includes(q))
    }

    if (category !== 'all') {
      filtered = filtered.filter(i => getItemMeta(i.name).category === category)
    }

    const groups = {}
    for (const item of filtered) {
      const meta = getItemMeta(item.name)
      const cat = meta.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    }
    return groups
  }, [craftableItems, query, category])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  function handleSelect(item) {
    onSelect(item)
    const updated = [item.id, ...recent.filter(id => id !== item.id)]
    setRecent(updated)
    saveRecent(updated)
    setQuery('')
    setOpen(false)
  }

  const recentItems = useMemo(
    () => recent.map(id => items.find(i => i.id === id)).filter(Boolean),
    [recent, items]
  )

  const favoriteItems = useMemo(
    () => craftableItems.filter(i => favorites.has(i.id)),
    [craftableItems, favorites]
  )

  return (
    <div ref={ref} className="relative w-full">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full glass-card p-3 flex items-center gap-3 text-left transition-all duration-300 hover:border-craft-accent/30 group cursor-text"
        >
          <svg className="w-5 h-5 text-craft-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-craft-text-muted/50 group-hover:text-craft-text-muted/80 transition-colors">
            Search craftable items...
          </span>
          <kbd className="ml-auto text-xs text-craft-text-muted/30 bg-white/5 px-2 py-0.5 rounded-lg hidden sm:inline">
            /
          </kbd>
        </button>
      ) : (
        <div className="glass-card animate-slide-down overflow-hidden">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-craft-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search items..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              className="w-full bg-transparent border-0 border-b border-white/5 pl-12 pr-4 py-3.5 text-craft-text placeholder-craft-text-muted/30 focus:outline-none focus:border-craft-accent/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 overflow-x-auto">
            {CATEGORIES.slice(0, 7).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id === category ? 'all' : cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-craft-accent/10 text-craft-accent border border-craft-accent/20'
                    : 'text-craft-text-muted hover:text-craft-text hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {query === '' && category === 'all' && favoriteItems.length > 0 && (
              <div className="p-3 border-b border-white/5">
                <div className="text-xs text-craft-text-muted/50 mb-2 flex items-center gap-1.5">
                  <span>⭐</span> Favorites
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {favoriteItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-lg">{getItemMeta(item.name).icon}</span>
                      <span className="text-sm text-craft-text truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query === '' && category === 'all' && recentItems.length > 0 && (
              <div className="p-3 border-b border-white/5">
                <div className="text-xs text-craft-text-muted/50 mb-2 flex items-center gap-1.5">
                  <span>🕐</span> Recent
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-craft-text"
                    >
                      <span>{getItemMeta(item.name).icon}</span>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(grouped).length > 0 ? (
              Object.entries(grouped).map(([cat, catItems]) => (
                <div key={cat} className="border-b border-white/5 last:border-0">
                  <div className="px-3 py-2 text-xs text-craft-text-muted/50 flex items-center gap-1.5">
                    <span>{CATEGORIES.find(c => c.id === cat)?.icon || '📦'}</span>
                    {CATEGORIES.find(c => c.id === cat)?.label || cat}
                    <span className="ml-auto">{catItems.length}</span>
                  </div>
                  {catItems.map((item) => {
                    const meta = getItemMeta(item.name)
                    const rarity = getRarityStyle(meta.rarity)
                    const isFav = favorites.has(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <span className="text-xl shrink-0">{meta.icon}</span>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-craft-text truncate">{item.name}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${rarity.color}`}>{rarity.label}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id) }}
                          className={`p-1 rounded-lg transition-colors ${isFav ? 'text-craft-gold' : 'text-craft-text-muted/30 hover:text-craft-text-muted/60'}`}
                        >
                          <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </button>
                    )
                  })}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-craft-text-muted/50 text-sm">
                  {query ? `No items matching "${query}"` : 'No craftable items available'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
