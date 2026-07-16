import { useEffect } from 'react'
import { getItemMeta, getRarityStyle, CATEGORIES } from '../data/itemMeta.js'

export default function ItemDetailPopup({ item, items, recipes, ingredients, onClose }) {
  useEffect(() => {
    if (!item) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [item, onClose])

  if (!item) return null

  const meta = getItemMeta(item.name)
  const rarity = getRarityStyle(meta.rarity)
  const cat = CATEGORIES.find(c => c.id === meta.category)

  const recipe = recipes.find(r => r.outputItemId === item.id)
  const recipeIngs = recipe
    ? ingredients.filter(i => i.recipeId === recipe.id)
    : []

  const usedInRecipes = recipes.filter(r => {
    const ings = ingredients.filter(i => i.recipeId === r.id)
    return ings.some(i => i.ingredientItemId === item.id)
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border bg-craft-surface/90 backdrop-blur-xl p-6 shadow-2xl animate-scale-in"
        style={{ borderColor: rarity.border.replace('border-', '') }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-craft-text-muted hover:text-craft-text transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 flex items-center justify-center text-3xl rounded-2xl ${rarity.bg} ${rarity.border} border`}>
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-craft-text">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={rarity.color}>{rarity.label}</span>
              {cat && (
                <span className="text-craft-text-muted text-sm">
                  {cat.icon} {cat.label}
                </span>
              )}
              {item.craftable ? (
                <span className="badge-crafted">Craftable</span>
              ) : (
                <span className="badge-raw">Raw</span>
              )}
            </div>
          </div>
        </div>

        {meta.desc && (
          <p className="text-sm text-craft-text-muted mb-4 leading-relaxed">{meta.desc}</p>
        )}

        {recipe && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-craft-text mb-2">📋 Recipe</h3>
            <div className="rounded-xl bg-craft-bg/60 border border-white/5 p-3 space-y-1.5">
              {recipeIngs.map((ing) => {
                const ingItem = items.find(i => i.id === ing.ingredientItemId)
                const ingMeta = getItemMeta(ingItem?.name || '')
                return (
                  <div key={ing.id} className="flex items-center gap-2 text-sm">
                    <span>{ingMeta.icon}</span>
                    <span className="text-craft-text">{ingItem?.name || ing.ingredientItemId}</span>
                    <span className="text-craft-text-muted font-mono">×{ing.quantity}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {usedInRecipes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-craft-text mb-2">🔨 Used In</h3>
            <div className="rounded-xl bg-craft-bg/60 border border-white/5 p-3 space-y-1.5">
              {usedInRecipes.map((r) => {
                const outItem = items.find(i => i.id === r.outputItemId)
                const outMeta = getItemMeta(outItem?.name || '')
                return (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <span>{outMeta.icon}</span>
                    <span className="text-craft-text">{outItem?.name || r.outputItemId}</span>
                    <span className="text-craft-text-muted font-mono">×{r.outputQuantity}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
