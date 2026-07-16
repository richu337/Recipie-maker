import { useMemo } from 'react'

export default function Dashboard({ selections, raw, steps }) {
  const stats = useMemo(() => {
    const totalSelected = selections.reduce((s, x) => s + x.quantity, 0)
    const uniqueItems = new Set(selections.map(s => s.itemId))
    const rawCount = raw.length
    const craftedCount = steps.filter(s => s.itemName).length

    let totalRawQty = 0
    for (const r of raw) totalRawQty += r.quantity

    let totalCraftedQty = 0
    for (const s of steps) totalCraftedQty += s.quantity

    return {
      totalSelected,
      uniqueItems: uniqueItems.size,
      rawCount,
      craftedCount,
      totalRawQty: Math.round(totalRawQty * 100) / 100,
      totalCraftedQty: Math.round(totalCraftedQty * 100) / 100,
    }
  }, [selections, raw, steps])

  if (selections.length === 0) return null

  const cards = [
    { label: 'Selected Recipes', value: stats.totalSelected, icon: '📋', color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20' },
    { label: 'Unique Materials', value: stats.uniqueItems, icon: '🧩', color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20' },
    { label: 'Raw Materials', value: stats.rawCount, icon: '🪨', color: 'from-amber-500/20 to-amber-600/5 border-amber-500/20' },
    { label: 'Crafted Materials', value: stats.craftedCount, icon: '⚒️', color: 'from-green-500/20 to-green-600/5 border-green-500/20' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`rounded-2xl p-4 bg-gradient-to-br ${card.color} border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{card.icon}</span>
            <span className="text-xs text-craft-text-muted/80">{card.label}</span>
          </div>
          <div className="text-2xl font-bold text-craft-text tabular-nums">
            {card.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
