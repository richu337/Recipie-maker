import { FiChevronRight, FiCircle } from 'react-icons/fi'

export default function MaterialBreakdown({ breakdown, itemsMap, recipeMap, selected }) {
  if (breakdown.length === 0) return null

  const selectedIds = selected.map((s) => s.itemId)

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-dark-600">
        <h2 className="font-semibold">Crafting Breakdown</h2>
      </div>
      <div className="divide-y divide-dark-600/50 max-h-80 overflow-y-auto">
        {breakdown.map((step, i) => {
          const item = itemsMap.get(step.itemId)
          if (!item) return null
          const isTopLevel = selectedIds.includes(step.itemId)

          if (step.type === 'raw') {
            return (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <FiCircle size={8} className="text-success shrink-0" />
                <span className="text-success text-sm font-medium">{Math.round(step.quantity * 100) / 100}x</span>
                <span className="text-sm">{item.name}</span>
                <span className="text-dark-300 text-xs ml-auto">raw</span>
              </div>
            )
          }

          return (
            <div key={i} className={`px-5 py-3 ${isTopLevel ? 'bg-accent-muted' : ''}`}>
              <div className="flex items-center gap-3">
                <FiChevronRight size={14} className="text-accent shrink-0" />
                <span className="text-accent text-sm font-medium">{Math.round(step.quantity * 100) / 100}x</span>
                <span className="text-sm">{item.name}</span>
                <span className="text-dark-300 text-xs ml-auto">
                  {step.recipe.ingredients.length} ingredient{step.recipe.ingredients.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="ml-9 mt-1.5 space-y-1">
                {step.recipe.ingredients.map((ing, j) => {
                  const ingItem = itemsMap.get(ing.itemId)
                  const qtyPerCraft = (ing.quantity / step.recipe.outputQuantity) * step.quantity
                  return (
                    <div key={j} className="flex items-center gap-2 text-xs text-dark-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-dark-400" />
                      {Math.round(qtyPerCraft * 100) / 100}x {ingItem?.name || '???'}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
