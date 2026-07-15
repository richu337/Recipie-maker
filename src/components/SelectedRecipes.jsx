import { FiTrash2, FiPackage } from 'react-icons/fi'

export default function SelectedRecipes({ selected, itemsMap, onQuantityChange, onRemove }) {
  if (selected.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-dark-600 rounded-xl p-8 text-center">
        <FiPackage className="mx-auto text-3xl text-dark-400 mb-2" />
        <p className="text-dark-300">No items selected</p>
        <p className="text-dark-400 text-sm mt-1">Search and add items above</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-dark-600 flex items-center justify-between">
        <h2 className="font-semibold">Selected Items</h2>
        <span className="text-sm text-dark-300">{selected.length} item{selected.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="divide-y divide-dark-600">
        {selected.map((sel) => {
          const item = itemsMap.get(sel.itemId)
          if (!item) return null
          return (
            <div key={sel.itemId} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center">
                  <button
                    onClick={() => onQuantityChange(sel.itemId, sel.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-dark-600 hover:bg-dark-500 rounded-l-lg transition-colors text-sm font-medium"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={sel.quantity}
                    onChange={(e) => onQuantityChange(sel.itemId, Number(e.target.value))}
                    className="w-16 h-8 bg-dark-700 text-center text-sm border-x border-dark-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => onQuantityChange(sel.itemId, sel.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-dark-600 hover:bg-dark-500 rounded-r-lg transition-colors text-sm font-medium"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemove(sel.itemId)}
                  className="w-8 h-8 flex items-center justify-center text-dark-300 hover:text-danger hover:bg-dark-600 rounded-lg transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
