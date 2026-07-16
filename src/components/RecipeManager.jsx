import { useState } from 'react'

export default function RecipeManager({ items, recipes, ingredients, onAddRecipe, onDeleteRecipe, onRefresh }) {
  const [outputId, setOutputId] = useState('')
  const [outputQty, setOutputQty] = useState(1)
  const [recipeIngredients, setRecipeIngredients] = useState([{ itemId: '', quantity: 1 }])
  const [adding, setAdding] = useState(false)

  const itemMap = new Map(items.map((i) => [i.id, i]))

  const craftableItems = items.filter((i) => i.craftable)
  const allItems = items

  const recipeOutputItems = recipes.map((r) => r.outputItemId)
  const recipesWithIngredients = recipes.map((r) => ({
    ...r,
    outputName: itemMap.get(r.outputItemId)?.name || r.outputItemId,
    ingredients: ingredients
      .filter((ing) => ing.recipeId === r.id)
      .map((ing) => ({
        ...ing,
        name: itemMap.get(ing.ingredientItemId)?.name || ing.ingredientItemId,
      })),
  }))

  function addIngredientRow() {
    setRecipeIngredients((prev) => [...prev, { itemId: '', quantity: 1 }])
  }

  function removeIngredientRow(idx) {
    setRecipeIngredients((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateIngredient(idx, field, value) {
    setRecipeIngredients((prev) =>
      prev.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing))
    )
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!outputId || outputQty < 1) return
    const validIngs = recipeIngredients.filter((ing) => ing.itemId && ing.quantity > 0)
    if (validIngs.length === 0) return

    setAdding(true)
    try {
      await onAddRecipe(outputId, outputQty, validIngs)
      setOutputId('')
      setOutputQty(1)
      setRecipeIngredients([{ itemId: '', quantity: 1 }])
      await onRefresh()
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(recipeId) {
    await onDeleteRecipe(recipeId)
    await onRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-craft-text mb-4">Add New Recipe</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-craft-muted mb-1">Output Item</label>
              <select
                value={outputId}
                onChange={(e) => setOutputId(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select craftable item...</option>
                {craftableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs text-craft-muted mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={outputQty}
                onChange={(e) => setOutputQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="input-field text-center"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-craft-muted">Ingredients</label>
              <button type="button" onClick={addIngredientRow} className="text-xs text-craft-blue hover:text-blue-400 transition-colors">
                + Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {recipeIngredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={ing.itemId}
                    onChange={(e) => updateIngredient(idx, 'itemId', e.target.value)}
                    className="input-field flex-1 text-sm py-1.5"
                    required
                  >
                    <option value="">Select item...</option>
                    {allItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.craftable ? '(craftable)' : '(raw)'}
                      </option>
                    ))}
                  </select>
                  <span className="text-craft-muted text-sm">×</span>
                  <input
                    type="number"
                    min="1"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="input-field w-20 text-center text-sm py-1.5"
                  />
                  {recipeIngredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientRow(idx)}
                      className="text-craft-muted hover:text-craft-accent transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={adding || !outputId || recipeIngredients.every((ing) => !ing.itemId)}
            className="btn-primary w-full"
          >
            {adding ? 'Adding...' : 'Add Recipe'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-craft-text mb-4">
          All Recipes ({recipesWithIngredients.length})
        </h2>

        {recipesWithIngredients.length === 0 && (
          <p className="text-craft-muted text-sm text-center py-4">No recipes yet.</p>
        )}

        <div className="space-y-3">
          {recipesWithIngredients.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-craft-bg rounded-lg p-3 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-craft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold text-craft-text">
                    {recipe.outputName}
                  </span>
                  <span className="text-craft-muted text-sm">×{recipe.outputQuantity}</span>
                </div>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="text-craft-muted hover:text-craft-accent transition-colors"
                  title="Delete recipe"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {recipe.ingredients.length > 0 && (
                <div className="ml-6 space-y-1">
                  {recipe.ingredients.map((ing) => {
                    const ingItem = itemMap.get(ing.ingredientItemId)
                    const isCraftable = ingItem?.craftable
                    return (
                      <div key={ing.id} className="flex items-center gap-2 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCraftable ? 'bg-craft-purple' : 'bg-craft-blue'}`} />
                        <span className={isCraftable ? 'text-purple-300' : 'text-blue-300'}>
                          {ing.name}
                        </span>
                        <span className="text-craft-muted">×{ing.quantity}</span>
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
    </div>
  )
}
