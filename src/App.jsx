import { useState, useEffect, useCallback } from 'react'
import { useFirebase } from './hooks/useFirebase.js'
import { useCalculator } from './hooks/useCalculator.js'
import { isConfigured } from './services/firebase.js'
import RecipeSearch from './components/RecipeSearch.jsx'
import SelectedItems from './components/SelectedItems.jsx'
import MaterialBreakdown from './components/MaterialBreakdown.jsx'
import ItemManager from './components/ItemManager.jsx'
import RecipeManager from './components/RecipeManager.jsx'
import SeedBanner from './components/SeedBanner.jsx'
import SetupGuide from './components/SetupGuide.jsx'

const TABS = [
  { key: 'calculator', label: 'Calculator', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'items', label: 'Items', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { key: 'recipes', label: 'Recipes', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
]

export default function App() {
  const {
    ready, user,
    fetchItems, fetchRecipes, fetchRecipeIngredients,
    addItem, updateItem, deleteItem,
    addRecipe, deleteRecipe,
    seedInitialData,
  } = useFirebase()
  const { items, recipes, ingredients, loading, loadData, calculate } = useCalculator()

  const [tab, setTab] = useState('calculator')
  const [selections, setSelections] = useState([])

  const configured = isConfigured()
  const hasData = items.length > 0
  const craftableCount = items.filter((i) => i.craftable).length

  useEffect(() => {
    if (ready && configured) {
      loadData(fetchItems, fetchRecipes, fetchRecipeIngredients)
    }
  }, [ready, configured, fetchItems, fetchRecipes, fetchRecipeIngredients, loadData])

  const handleRefresh = useCallback(async () => {
    await loadData(fetchItems, fetchRecipes, fetchRecipeIngredients)
  }, [loadData, fetchItems, fetchRecipes, fetchRecipeIngredients])

  const handleSeed = useCallback(async () => {
    await seedInitialData()
    await handleRefresh()
  }, [seedInitialData, handleRefresh])

  const handleSelect = useCallback((item) => {
    setSelections((prev) => {
      const existing = prev.find((s) => s.itemId === item.id)
      if (existing) {
        return prev.map((s) =>
          s.itemId === item.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      }
      return [...prev, { itemId: item.id, quantity: 1 }]
    })
  }, [])

  const handleQuantityChange = useCallback((idx, quantity) => {
    setSelections((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], quantity }
      return next
    })
  }, [])

  const handleRemove = useCallback((idx) => {
    setSelections((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleClear = useCallback(() => {
    setSelections([])
  }, [])

  const result = calculate(selections)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 bg-craft-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-craft-accent flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-craft-text m-0">Recipe Calculator</h1>
          {configured && !loading && (
            <span className="ml-auto text-xs text-craft-muted">
              {items.length} items · {craftableCount} craftable
            </span>
          )}
        </div>

        {configured && !loading && (
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex gap-1 -mb-px">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                    tab === t.key
                      ? 'text-craft-accent border-craft-accent bg-craft-bg/50'
                      : 'text-craft-muted border-transparent hover:text-craft-text hover:border-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                  </svg>
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {!configured && <SetupGuide />}

        {configured && loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-craft-accent border-t-transparent rounded-full" />
          </div>
        )}

        {configured && !loading && !hasData && (
          <SeedBanner onSeed={handleSeed} />
        )}

        {configured && !loading && hasData && tab === 'calculator' && (
          <>
            {craftableCount === 0 && (
              <div className="card border-craft-accent/40 bg-craft-accent/5">
                <p className="text-craft-muted text-sm">
                  No craftable items found. Go to the <button onClick={() => setTab('items')} className="text-craft-blue underline cursor-pointer">Items</button> or <button onClick={() => setTab('recipes')} className="text-craft-blue underline cursor-pointer">Recipes</button> tab to add some, or <button onClick={handleSeed} className="text-craft-blue underline cursor-pointer">seed the database</button> with default data.
                </p>
              </div>
            )}

            {craftableCount > 0 && <RecipeSearch items={items} onSelect={handleSelect} />}

            <SelectedItems
              selections={selections}
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onClear={handleClear}
            />

            <MaterialBreakdown
              steps={result.steps}
              raw={result.raw}
              items={items}
            />

            {selections.length === 0 && (
              <div className="card text-center py-8">
                <p className="text-craft-muted">
                  {craftableCount > 0
                    ? 'Search and select craftable items above to begin calculating materials.'
                    : 'No craftable items available. Add items and recipes first.'}
                </p>
              </div>
            )}
          </>
        )}

        {configured && !loading && hasData && tab === 'items' && (
          <ItemManager
            items={items}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
            onRefresh={handleRefresh}
          />
        )}

        {configured && !loading && hasData && tab === 'recipes' && (
          <RecipeManager
            items={items}
            recipes={recipes}
            ingredients={ingredients}
            onAddRecipe={addRecipe}
            onDeleteRecipe={deleteRecipe}
            onRefresh={handleRefresh}
          />
        )}

        {configured && !loading && !hasData && tab !== 'calculator' && (
          <div className="card text-center py-8">
            <p className="text-craft-muted">
              No data in the database yet. Use the Seed Database button above to populate it.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-4 text-center text-xs text-craft-muted">
        Game Recipe &amp; Material Calculator
      </footer>
    </div>
  )
}
