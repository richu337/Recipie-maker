import { useState, useEffect, useCallback, useMemo } from 'react'
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
import Dashboard from './components/Dashboard.jsx'
import Filters from './components/Filters.jsx'
import SaveProjects from './components/SaveProjects.jsx'
import ShoppingList from './components/ShoppingList.jsx'
import ProgressTracker from './components/ProgressTracker.jsx'
import ItemDetailPopup from './components/ItemDetailPopup.jsx'
import { getItemMeta } from './data/itemMeta.js'

const TABS = [
  { key: 'calculator', label: 'Calculator', icon: '🔧' },
  { key: 'items', label: 'Items', icon: '📦' },
  { key: 'recipes', label: 'Recipes', icon: '📖' },
]

function loadFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem('recipe-maker-favorites') || '[]')) } catch { return new Set() }
}

function saveFavorites(set) { localStorage.setItem('recipe-maker-favorites', JSON.stringify([...set])) }

function loadOwned() {
  try { return JSON.parse(localStorage.getItem('recipe-maker-owned') || '{}') } catch { return {} }
}

function saveOwned(obj) { localStorage.setItem('recipe-maker-owned', JSON.stringify(obj)) }

export default function App() {
  const {
    ready,
    fetchItems, fetchRecipes, fetchRecipeIngredients,
    addItem, updateItem, deleteItem,
    addRecipe, deleteRecipe,
    seedInitialData,
  } = useFirebase()
  const { items, recipes, ingredients, loading, loadData, calculate } = useCalculator()

  const [tab, setTab] = useState('calculator')
  const [selections, setSelections] = useState([])
  const [favorites, setFavorites] = useState(loadFavorites)
  const [owned, setOwned] = useState(loadOwned)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [filters, setFilters] = useState({
    craftableOnly: false,
    rawOnly: false,
    missingOnly: false,
    favoritesOnly: false,
    rareOnly: false,
  })
  const [showShoppingList, setShowShoppingList] = useState(false)

  const configured = isConfigured()
  const hasData = items.length > 0
  const craftableCount = items.filter((i) => i.craftable).length

  const itemMap = useMemo(() => new Map(items.map(i => [i.id, i])), [items])

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

  const handleLoadSelections = useCallback((sels) => {
    setSelections(sels)
  }, [])

  const handleToggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavorites(next)
      return next
    })
  }, [])

  const handleOwnedChange = useCallback((id, value) => {
    setOwned(prev => {
      const next = { ...prev, [id]: value }
      saveOwned(next)
      return next
    })
  }, [])

  const handleItemClick = useCallback((id) => {
    setSelectedItemId(id)
  }, [])

  const result = useMemo(() => calculate(selections), [calculate, selections])

  const filteredRaw = useMemo(() => {
    let list = result.raw || []
    if (filters.craftableOnly) list = list.filter(r => r.craftable)
    if (filters.rawOnly) list = list.filter(r => !r.craftable)
    if (filters.missingOnly) list = list.filter(r => (owned[r.id] || 0) < r.quantity)
    if (favorites.size > 0 && filters.favoritesOnly) list = list.filter(r => favorites.has(r.id))
    if (filters.rareOnly) {
      list = list.filter(r => ['rare', 'epic', 'legendary'].includes(getItemMeta(r.name).rarity))
    }
    return list
  }, [result.raw, filters, owned, favorites])

  const selectedItem = selectedItemId ? itemMap.get(selectedItemId) : null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-craft-accent to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-craft-accent/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-craft-text m-0">Recipe Calculator</h1>
          {configured && !loading && (
            <span className="ml-auto text-xs text-craft-text-muted/50">
              {items.length} items · {craftableCount} craftable
            </span>
          )}
        </div>

        {configured && !loading && (
          <div className="max-w-6xl mx-auto px-4">
            <nav className="flex gap-1 -mb-px">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition-all ${
                    tab === t.key ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-4">
        {!configured && <SetupGuide />}

        {configured && loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-craft-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {configured && !loading && !hasData && (
          <SeedBanner onSeed={handleSeed} />
        )}

        {configured && !loading && hasData && tab === 'calculator' && (
          <>
            {craftableCount === 0 && (
              <div className="card border-craft-accent/20 bg-craft-accent/5">
                <p className="text-craft-text-muted text-sm">
                  No craftable items found. Go to the <button onClick={() => setTab('items')} className="text-craft-accent underline cursor-pointer">Items</button> or <button onClick={() => setTab('recipes')} className="text-craft-accent underline cursor-pointer">Recipes</button> tab to add some, or <button onClick={handleSeed} className="text-craft-accent underline cursor-pointer">seed the database</button> with default data.
                </p>
              </div>
            )}

            {craftableCount > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[280px]">
                  <RecipeSearch
                    items={items}
                    favorites={favorites}
                    onSelect={handleSelect}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
                <SaveProjects selections={selections} onLoad={handleLoadSelections} />
              </div>
            )}

            {selections.length > 0 && (
              <>
                <Dashboard selections={selections} items={items} raw={result.raw} steps={result.steps} />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Filters filters={filters} onChange={setFilters} />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowShoppingList(!showShoppingList)}
                      className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <span>🛒</span>
                      Shopping List
                    </button>
                    {result.raw && result.raw.length > 0 && (
                      <span className="text-xs text-craft-text-muted/50">
                        {result.raw.reduce((s, r) => s + Math.round(r.quantity * 100) / 100, 0)} total materials
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            <SelectedItems
              selections={selections}
              items={items}
              favorites={favorites}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onClear={handleClear}
              onToggleFavorite={handleToggleFavorite}
            />

            <MaterialBreakdown
              steps={result.steps}
              raw={filteredRaw}
              items={items}
              recipes={recipes}
              ingredients={ingredients}
              onItemClick={handleItemClick}
            />

            {showShoppingList && (
              <ShoppingList raw={result.raw} owned={owned} />
            )}

            {result.raw && result.raw.length > 0 && (
              <ProgressTracker raw={result.raw} owned={owned} onOwnedChange={handleOwnedChange} />
            )}

            {selections.length === 0 && (
              <div className="card text-center py-8 animate-fade-in">
                <p className="text-craft-text-muted/50">
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
            <p className="text-craft-text-muted/50">
              No data in the database yet. Use the Seed Database button above to populate it.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-4 text-center text-xs text-craft-text-muted/30">
        Game Recipe &amp; Material Calculator
      </footer>

      {selectedItem && (
        <ItemDetailPopup
          item={selectedItem}
          items={items}
          recipes={recipes}
          ingredients={ingredients}
          onClose={() => setSelectedItemId(null)}
        />
      )}
    </div>
  )
}
