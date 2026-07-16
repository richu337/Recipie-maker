import { getItemMeta, getRarityStyle } from '../data/itemMeta.js'

export default function SelectedItems({ selections, items, favorites, onQuantityChange, onRemove, onClear, onToggleFavorite }) {
  const itemMap = new Map(items.map((i) => [i.id, i]))

  if (selections.length === 0) return null

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-craft-text flex items-center gap-2 m-0">
          <span>📋</span>
          Selected Recipes
          <span className="text-sm font-normal text-craft-text-muted">({selections.length})</span>
        </h2>
        <button onClick={onClear} className="btn-ghost text-xs py-1.5 px-3">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {selections.map((sel, idx) => {
          const item = itemMap.get(sel.itemId)
          const meta = getItemMeta(item?.name || '')
          const rarity = getRarityStyle(meta.rarity)
          const isFav = item && favorites.has(item.id)

          return (
            <div
              key={`${sel.itemId}-${idx}`}
              className="group flex items-center gap-3 bg-craft-bg/40 border border-white/5 rounded-xl p-3 transition-all duration-200 hover:border-white/10 hover:bg-craft-bg/60 animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`item-icon text-xl shrink-0 ${rarity.bg} ${rarity.border} border rounded-lg`}>
                {meta.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-craft-text truncate">
                    {item?.name || sel.itemId}
                  </span>
                  {item?.craftable && <span className="badge-crafted text-[10px]">crafted</span>}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-craft-text-muted">×</span>
                  <input
                    type="number"
                    min="1"
                    value={sel.quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10)
                      onQuantityChange(idx, isNaN(v) || v < 1 ? 1 : v)
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg w-16 text-center text-sm py-0.5 text-craft-text focus:outline-none focus:border-craft-accent/30 transition-colors tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                {item && (
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-craft-gold' : 'text-craft-text-muted/30 opacity-0 group-hover:opacity-100 hover:text-craft-text-muted/60'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => onRemove(idx)}
                  className="p-1.5 rounded-lg text-craft-text-muted/30 hover:text-craft-accent opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
