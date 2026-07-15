import { useState } from 'react'
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi'

export default function AddRecipeModal({ open, onClose, onCreated, supabase, items }) {
  const [outputItemId, setOutputItemId] = useState('')
  const [outputQuantity, setOutputQuantity] = useState(1)
  const [ingredients, setIngredients] = useState([{ itemId: '', quantity: 1 }])
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const craftableItems = items.filter((i) => i.craftable)
  const nonCraftableItems = items.filter((i) => !i.craftable)

  function addIngredient() {
    setIngredients((prev) => [...prev, { itemId: '', quantity: 1 }])
  }

  function removeIngredient(index) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  function updateIngredient(index, field, value) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!outputItemId || ingredients.some((ing) => !ing.itemId)) return

    setSaving(true)
    try {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({ output_item_id: Number(outputItemId), output_quantity: Number(outputQuantity) })
        .select()
        .single()
      if (recipeError) throw recipeError

      const ingredientRows = ingredients.map((ing) => ({
        recipe_id: recipe.id,
        ingredient_item_id: Number(ing.itemId),
        quantity: Number(ing.quantity),
      }))

      const { error: ingError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientRows)
      if (ingError) throw ingError

      onCreated()
      onClose()
      setOutputItemId('')
      setOutputQuantity(1)
      setIngredients([{ itemId: '', quantity: 1 }])
    } catch (e) {
      alert('Failed to add recipe: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600 shrink-0">
          <h2 className="font-semibold">Add New Recipe</h2>
          <button onClick={onClose} className="text-dark-300 hover:text-dark-50 transition-colors">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-dark-200 mb-1.5">Output Item</label>
              <select
                value={outputItemId}
                onChange={(e) => setOutputItemId(e.target.value)}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-dark-50 focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select item...</option>
                {craftableItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1.5">Output Quantity</label>
              <input
                type="number"
                min="1"
                value={outputQuantity}
                onChange={(e) => setOutputQuantity(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-dark-50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-dark-200">Ingredients</label>
              <button
                type="button"
                onClick={addIngredient}
                className="text-xs text-accent hover:text-accent-hover flex items-center gap-1"
              >
                <FiPlus size={12} /> Add Ingredient
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={ing.itemId}
                    onChange={(e) => updateIngredient(i, 'itemId', e.target.value)}
                    className="flex-1 px-3 py-2 bg-dark-700 border border-dark-500 rounded-lg text-dark-50 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Select ingredient...</option>
                    {[...nonCraftableItems, ...craftableItems].map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}{item.craftable ? ' (crafted)' : ''}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(i, 'quantity', Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-dark-700 border border-dark-500 rounded-lg text-dark-50 text-sm focus:outline-none focus:border-accent transition-colors text-center"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="px-2 py-2 text-dark-300 hover:text-danger rounded-lg transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !outputItemId || ingredients.some((ing) => !ing.itemId)}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><FiPlus /> Add Recipe</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
