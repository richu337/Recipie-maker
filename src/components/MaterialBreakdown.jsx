export default function MaterialBreakdown({ steps, raw, items }) {
  const itemMap = new Map(items.map((i) => [i.id, i]))

  if (steps.length === 0 && raw.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-craft-muted">Select items and set quantities to see material requirements.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {steps.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-craft-text mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-craft-gold shrink-0" />
            Crafting Breakdown
          </h2>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="bg-craft-bg rounded-lg p-3 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-craft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold text-craft-text">
                    {step.itemName}
                  </span>
                  <span className="text-craft-muted text-sm">×{Math.round(step.quantity * 100) / 100}</span>
                </div>

                {step.ingredients.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {step.ingredients.map((ing, j) => {
                      const ingItem = itemMap.get(ing.itemId)
                      const isCraftable = ingItem?.craftable
                      return (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCraftable ? 'bg-craft-purple' : 'bg-craft-blue'}`} />
                          <span className={isCraftable ? 'text-purple-300' : 'text-blue-300'}>
                            {ing.itemName}
                          </span>
                          <span className="text-craft-muted">×{Math.round(ing.quantity * 100) / 100}</span>
                          <span className={`text-xs ${isCraftable ? 'badge-crafted' : 'badge-raw'}`}>
                            {isCraftable ? 'crafted' : 'raw'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {raw.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-craft-text mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-craft-green shrink-0" />
            Raw Material Totals
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-craft-muted text-sm">
                  <th className="pb-2 font-medium">Material</th>
                  <th className="pb-2 font-medium text-right">Total Needed</th>
                </tr>
              </thead>
              <tbody>
                {raw.map((mat, i) => (
                  <tr key={mat.id} className="border-b border-gray-800/50 last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-craft-blue shrink-0" />
                      <span className="text-craft-text">{mat.name}</span>
                      {mat.craftable && <span className="badge-crafted">crafted</span>}
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-craft-gold font-mono font-bold text-lg">
                        {Math.round(mat.quantity * 100) / 100}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between text-sm text-craft-muted">
            <span>Total different materials</span>
            <span className="text-craft-text font-semibold">{raw.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
