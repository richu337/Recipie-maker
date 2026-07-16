import { useState, useCallback, useMemo, useRef } from 'react'

function buildMaps(items, recipes, ingredients) {
  const itemMap = new Map()
  for (const item of items) {
    itemMap.set(item.id, item)
  }

  const recipeByOutput = new Map()
  for (const r of recipes) {
    recipeByOutput.set(r.outputItemId, r)
  }

  const ingredientsByRecipe = new Map()
  for (const ing of ingredients) {
    if (!ingredientsByRecipe.has(ing.recipeId)) {
      ingredientsByRecipe.set(ing.recipeId, [])
    }
    ingredientsByRecipe.get(ing.recipeId).push(ing)
  }

  return { itemMap, recipeByOutput, ingredientsByRecipe }
}

function calcItem(itemId, quantity, itemMap, recipeByOutput, ingredientsByRecipe, depth = 0) {
  if (depth > 50) {
    return { raw: {}, steps: [] }
  }

  const item = itemMap.get(itemId)
  const recipe = recipeByOutput.get(itemId)

  if (!recipe) {
    return { raw: { [itemId]: quantity }, steps: [] }
  }

  const ings = ingredientsByRecipe.get(recipe.id) || []
  const multiplier = quantity / recipe.outputQuantity

  const raw = {}
  const steps = []

  for (const ing of ings) {
    const needed = ing.quantity * multiplier
    const ingItem = itemMap.get(ing.ingredientItemId)

    if (ingItem && ingItem.craftable) {
      const sub = calcItem(ing.ingredientItemId, needed, itemMap, recipeByOutput, ingredientsByRecipe, depth + 1)
      for (const [id, qty] of Object.entries(sub.raw)) {
        raw[id] = (raw[id] || 0) + qty
      }
      steps.push(...sub.steps)
    } else {
      raw[ing.ingredientItemId] = (raw[ing.ingredientItemId] || 0) + needed
    }
  }

  steps.push({
    itemId,
    itemName: item?.name || itemId,
    quantity,
    ingredients: ings.map((ing) => ({
      itemId: ing.ingredientItemId,
      itemName: itemMap.get(ing.ingredientItemId)?.name || ing.ingredientItemId,
      quantity: ing.quantity * multiplier,
    })),
  })

  return { raw, steps }
}

export function useCalculator() {
  const [items, setItems] = useState([])
  const [recipes, setRecipes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const cacheRef = useRef(new Map())

  const maps = useMemo(() => buildMaps(items, recipes, ingredients), [items, recipes, ingredients])

  const loadData = useCallback(async (fetchItems, fetchRecipes, fetchIngredients) => {
    setLoading(true)
    try {
      const [it, rec, ing] = await Promise.all([
        fetchItems(),
        fetchRecipes(),
        fetchIngredients(),
      ])
      setItems(it)
      setRecipes(rec)
      setIngredients(ing)
    } finally {
      setLoading(false)
    }
  }, [])

  const calculate = useCallback(
    (selections) => {
      const cacheKey = JSON.stringify(selections)
      if (cacheRef.current.has(cacheKey)) {
        return cacheRef.current.get(cacheKey)
      }

      const { itemMap, recipeByOutput, ingredientsByRecipe } = maps

      const allRaw = {}
      const allSteps = []

      for (const { itemId, quantity } of selections) {
        if (quantity <= 0) continue
        const result = calcItem(itemId, quantity, itemMap, recipeByOutput, ingredientsByRecipe)
        for (const [id, qty] of Object.entries(result.raw)) {
          allRaw[id] = (allRaw[id] || 0) + qty
        }
        allSteps.push(...result.steps)
      }

      const enrichedRaw = Object.entries(allRaw).map(([id, qty]) => ({
        id,
        name: itemMap.get(id)?.name || id,
        quantity: qty,
        craftable: !!recipeByOutput.has(id),
      }))

      const result = { raw: enrichedRaw, steps: allSteps }
      cacheRef.current.set(cacheKey, result)
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value
        cacheRef.current.delete(firstKey)
      }
      return result
    },
    [maps]
  )

  return { items, recipes, ingredients, loading, loadData, calculate }
}
