import { useState } from 'react'
import { getItemMeta } from '../data/itemMeta.js'

function TreeNode({ ingredient, depth = 0, allItems, allRecipes, allIngredients }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const meta = getItemMeta(ingredient.itemName)
  const recipe = allRecipes.find(r => r.outputItemId === ingredient.itemId)
  const ings = recipe
    ? allIngredients
        .filter(i => i.recipeId === recipe.id)
        .map(i => ({
          ...i,
          itemName: allItems.find(it => it.id === i.ingredientItemId)?.name || i.ingredientItemId,
          itemId: i.ingredientItemId,
        }))
    : []
  const hasChildren = ings.length > 0

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 py-1.5 px-2 rounded-xl transition-colors hover:bg-white/[0.02] ${depth > 0 ? 'ml-6' : ''}`}>
        {depth > 0 && (
          <div className="absolute left-3 top-0 bottom-1/2 w-px bg-white/5" />
        )}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors shrink-0 text-xs text-craft-text-muted"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
        )}
        <span className="text-base shrink-0">{meta.icon}</span>
        <span className="text-sm text-craft-text">{ingredient.itemName}</span>
        <span className="text-sm text-craft-text-muted font-mono">
          ×{Math.round(ingredient.quantity * 100) / 100}
        </span>
        {hasChildren && (
          <span className="text-xs text-craft-text-muted/50">
            ({ings.length} ingredients)
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="border-l border-white/5 ml-[1.625rem] pl-1">
          {ings.map((ing, i) => (
            <TreeNode
              key={`${ing.itemId}-${i}`}
              ingredient={ing}
              depth={depth + 1}
              allItems={allItems}
              allRecipes={allRecipes}
              allIngredients={allIngredients}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CraftingTree({ steps, items, recipes, ingredients, allItems }) {
  const [globalExpanded, setGlobalExpanded] = useState(true)

  if (!steps || steps.length === 0) return null

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-craft-text flex items-center gap-2">
          <span>🌳</span>
          Crafting Tree
        </h2>
        <button
          onClick={() => setGlobalExpanded(!globalExpanded)}
          className="btn-ghost text-xs py-1 px-3"
        >
          {globalExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-1">
        {steps.map((step, i) => {
          const meta = getItemMeta(step.itemName)
          return (
            <div key={i} className="rounded-xl bg-craft-bg/40 border border-white/5 p-3 transition-all duration-200 hover:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{meta.icon}</span>
                <span className="font-semibold text-craft-text">{step.itemName}</span>
                <span className="text-sm text-craft-text-muted font-mono">×{Math.round(step.quantity * 100) / 100}</span>
              </div>
              <div className="border-l border-white/5 ml-4 pl-1">
                {step.ingredients.map((ing, j) => (
                  <TreeNode
                    key={j}
                    ingredient={ing}
                    depth={0}
                    allItems={allItems || items}
                    allRecipes={recipes}
                    allIngredients={ingredients}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
