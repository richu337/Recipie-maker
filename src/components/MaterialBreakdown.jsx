import { useState } from 'react'
import { getItemMeta } from '../data/itemMeta.js'

function BreakdownRow({ name, quantity, ingredients, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const meta = getItemMeta(name)
  const hasChildren = ingredients && ingredients.length > 0

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-xl transition-colors hover:bg-white/[0.02] ${depth > 0 ? 'ml-6' : ''}`}
      >
        {depth > 0 && (
          <div className="absolute left-[1.125rem] top-0 bottom-1/2 w-px bg-white/5" />
        )}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors shrink-0 text-[10px] text-craft-text-muted"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        )}
        <span className="text-lg shrink-0">{meta.icon}</span>
        <span className="text-sm text-craft-text">{name}</span>
        <span className="text-sm text-craft-text-muted font-mono tabular-nums">×{Math.round(quantity * 100) / 100}</span>
        {hasChildren && (
          <>
            <span className="text-xs text-craft-text-muted/50">({ingredients.length})</span>
          </>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="border-l border-white/5 ml-[1.625rem] pl-1">
          {ingredients.map((ing, i) => (
            <BreakdownRow
              key={i}
              name={ing.itemName}
              quantity={ing.quantity}
              ingredients={ing.subIngredients}
              depth={depth + 1}
              itemMap={itemMap}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MaterialBreakdown({ steps, raw, items, recipes, ingredients, onItemClick }) {
  const itemMap = new Map(items.map((i) => [i.id, i]))

  if (steps.length === 0 && raw.length === 0) {
    return (
      <div className="card text-center py-8 animate-fade-in">
        <p className="text-craft-text-muted/50">Select items and set quantities to see material requirements.</p>
      </div>
    )
  }

  const treeSteps = steps.map(step => ({
    ...step,
    ingredients: step.ingredients.map(ing => {
      const subRecipe = recipes.find(r => r.outputItemId === ing.itemId)
      const subIngs = subRecipe
        ? ingredients.filter(i => i.recipeId === subRecipe.id).map(i => ({
            itemName: itemMap.get(i.ingredientItemId)?.name || i.ingredientItemId,
            quantity: i.quantity * (ing.quantity / (subRecipe.outputQuantity || 1)),
            subIngredients: [],
          }))
        : []
      return {
        ...ing,
        subIngredients: subIngs,
      }
    }),
  }))

  return (
    <div className="space-y-4">
      {steps.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="text-lg font-semibold text-craft-text mb-4 flex items-center gap-2">
            <span>📈</span>
            Expandable Breakdown
          </h2>

          <div className="space-y-1">
            {treeSteps.map((step, i) => (
              <div key={i} className="rounded-xl bg-craft-bg/40 border border-white/5 p-3 transition-all duration-200 hover:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getItemMeta(step.itemName).icon}</span>
                  <span className="font-semibold text-sm text-craft-text">{step.itemName}</span>
                  <span className="text-sm text-craft-text-muted font-mono">×{Math.round(step.quantity * 100) / 100}</span>
                </div>
                <div className="border-l border-white/5 ml-[1.125rem] pl-1">
                  {step.ingredients.map((ing, j) => (
                    <BreakdownRow
                      key={j}
                      name={ing.itemName}
                      quantity={ing.quantity}
                      ingredients={ing.subIngredients}
                      depth={0}
                      itemMap={itemMap}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {raw.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="text-lg font-semibold text-craft-text mb-4 flex items-center gap-2">
            <span>🪨</span>
            Raw Material Totals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {raw
              .sort((a, b) => b.quantity - a.quantity)
              .map((mat, i) => {
                const meta = getItemMeta(mat.name)
                const rarity = getRarityStyle(meta.rarity)
                return (
                  <div
                    key={mat.id}
                    onClick={() => onItemClick && onItemClick(mat.id)}
                    className="flex items-center gap-3 bg-craft-bg/40 border border-white/5 rounded-xl p-3 transition-all duration-200 hover:border-white/10 hover:bg-craft-bg/60 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className={`item-icon text-xl shrink-0 ${rarity.bg} ${rarity.border} border rounded-lg`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-craft-text truncate">{mat.name}</span>
                        {mat.craftable && <span className="badge-crafted text-[10px]">crafted</span>}
                      </div>
                      <div className="text-lg font-bold text-craft-gold font-mono tabular-nums mt-0.5">
                        {Math.round(mat.quantity * 100) / 100}
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${rarity.color}`}>{rarity.label}</div>
                  </div>
                )
              })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-craft-text-muted">Total different materials</span>
            <span className="text-craft-text font-semibold tabular-nums">{raw.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
