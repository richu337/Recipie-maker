import { useState, useEffect, useMemo } from 'react'
import { fetchItems, fetchRecipes, buildRecipeMap, getRawMaterials, mergeMaterials } from './data/calculator'
import { supabase } from './lib/supabase'
import SearchBar from './components/SearchBar'
import SelectedRecipes from './components/SelectedRecipes'
import MaterialBreakdown from './components/MaterialBreakdown'
import TotalMaterials from './components/TotalMaterials'
import AddItemModal from './components/AddItemModal'
import AddRecipeModal from './components/AddRecipeModal'

export default function App() {
  const [items, setItems] = useState([])
  const [recipes, setRecipes] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddRecipe, setShowAddRecipe] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [itemsData, recipesData] = await Promise.all([fetchItems(), fetchRecipes()])
      setItems(itemsData)
      setRecipes(recipesData)
    } catch (e) {
      console.error('Failed to load data:', e)
    } finally {
      setLoading(false)
    }
  }

  const itemsMap = useMemo(() => {
    const map = new Map()
    for (const item of items) map.set(item.id, item)
    return map
  }, [items])

  const recipeMap = useMemo(() => buildRecipeMap(recipes), [recipes])

  const craftableItems = useMemo(
    () => items.filter((i) => i.craftable),
    [items],
  )

  const calculationResults = useMemo(() => {
    const allMaterials = {}
    let fullBreakdown = []

    for (const sel of selected) {
      const result = getRawMaterials(sel.itemId, sel.quantity, recipeMap, itemsMap)
      for (const [id, qty] of Object.entries(result.materials)) {
        allMaterials[id] = (allMaterials[id] || 0) + qty
      }
      fullBreakdown = [...fullBreakdown, ...result.breakdown]
    }

    const merged = mergeMaterials(allMaterials)

    return { merged, breakdown: fullBreakdown }
  }, [selected, recipeMap, itemsMap])

  function handleAddItem(itemId) {
    const existing = selected.find((s) => s.itemId === itemId)
    if (existing) {
      setSelected((prev) =>
        prev.map((s) =>
          s.itemId === itemId ? { ...s, quantity: s.quantity + 1 } : s,
        ),
      )
    } else {
      setSelected((prev) => [...prev, { itemId, quantity: 1 }])
    }
  }

  function handleQuantityChange(itemId, quantity) {
    setSelected((prev) =>
      prev.map((s) => (s.itemId === itemId ? { ...s, quantity: Math.max(0, quantity) } : s)),
    )
  }

  function handleRemoveItem(itemId) {
    setSelected((prev) => prev.filter((s) => s.itemId !== itemId))
  }

  function handleAddItemToDb(name, craftable) {
    setItems((prev) => [...prev, { id: Date.now(), name, craftable }])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-dark-200 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50">
      <header className="border-b border-dark-600 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-accent">Recipe Calculator</h1>
            <p className="text-sm text-dark-200">Material &amp; Crafting Calculator</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddRecipe(true)}
              className="px-3 py-1.5 text-sm bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors"
            >
              + Recipe
            </button>
            <button
              onClick={() => setShowAddItem(true)}
              className="px-3 py-1.5 text-sm bg-accent/20 text-accent hover:bg-accent/30 rounded-lg transition-colors"
            >
              + Item
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SearchBar
          items={craftableItems}
          onSelect={handleAddItem}
          selectedIds={selected.map((s) => s.itemId)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SelectedRecipes
              selected={selected}
              itemsMap={itemsMap}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />

            <MaterialBreakdown
              breakdown={calculationResults.breakdown}
              itemsMap={itemsMap}
              recipeMap={recipeMap}
              selected={selected}
            />
          </div>

          <div className="space-y-6">
            <TotalMaterials
              materials={calculationResults.merged}
              itemsMap={itemsMap}
            />
          </div>
        </div>
      </main>

      <AddItemModal
        open={showAddItem}
        onClose={() => setShowAddItem(false)}
        onCreated={handleAddItemToDb}
        supabase={supabase}
        items={items}
      />

      <AddRecipeModal
        open={showAddRecipe}
        onClose={() => setShowAddRecipe(false)}
        onCreated={() => loadData()}
        supabase={supabase}
        items={items}
      />
    </div>
  )
}
