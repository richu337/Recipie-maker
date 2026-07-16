export default function SelectedItems({ selections, items, onQuantityChange, onRemove, onClear }) {
  const itemMap = new Map(items.map((i) => [i.id, i]))

  if (selections.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-craft-text m-0">Selected Items</h2>
        <button onClick={onClear} className="btn-ghost text-sm py-1 px-3">
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {selections.map((sel, idx) => {
          const item = itemMap.get(sel.itemId)
          return (
            <div
              key={`${sel.itemId}-${idx}`}
              className="flex items-center gap-3 bg-craft-bg rounded-lg p-3"
            >
              <span className="w-2 h-2 rounded-full bg-craft-accent shrink-0" />

              <span className="font-medium text-craft-text flex-1 min-w-0 truncate">
                {item?.name || sel.itemId}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-sm text-craft-muted">x</span>
                <input
                  type="number"
                  min="1"
                  value={sel.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    onQuantityChange(idx, isNaN(v) || v < 1 ? 1 : v)
                  }}
                  className="input-field w-20 text-center text-sm py-1"
                />
              </div>

              <button
                onClick={() => onRemove(idx)}
                className="text-craft-muted hover:text-craft-accent transition-colors p-1"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
