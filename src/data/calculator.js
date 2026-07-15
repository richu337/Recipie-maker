import { supabase } from '../lib/supabase'

export async function fetchItems() {
  const { data, error } = await supabase.from('items').select('*').order('name')
  if (error) throw error
  return data
}

export async function fetchRecipes() {
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .order('id')
  if (recipesError) throw recipesError

  const { data: ingredients, error: ingError } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .order('id')
  if (ingError) throw ingError

  const ingredientMap = {}
  for (const ing of ingredients) {
    if (!ingredientMap[ing.recipe_id]) ingredientMap[ing.recipe_id] = []
    ingredientMap[ing.recipe_id].push(ing)
  }

  return recipes.map((r) => ({
    ...r,
    recipe_ingredients: ingredientMap[r.id] || [],
  }))
}

export function buildRecipeMap(recipes) {
  const map = new Map()
  for (const recipe of recipes) {
    map.set(recipe.output_item_id, {
      outputItemId: recipe.output_item_id,
      outputQuantity: Number(recipe.output_quantity),
      ingredients: recipe.recipe_ingredients.map((ri) => ({
        itemId: ri.ingredient_item_id,
        quantity: Number(ri.quantity),
      })),
    })
  }
  return map
}

export function getRawMaterials(
  itemId,
  targetQuantity,
  recipeMap,
  itemsMap,
  ingredientTree = null,
) {
  const tree = ingredientTree || { materials: {}, breakdown: [] }

  const recipe = recipeMap.get(itemId)
  if (!recipe) {
    tree.materials[itemId] = (tree.materials[itemId] || 0) + targetQuantity
    tree.breakdown.push({
      itemId,
      quantity: targetQuantity,
      type: 'raw',
    })
    return tree
  }

  tree.breakdown.push({
    itemId,
    quantity: targetQuantity,
    type: 'crafted',
    recipe,
  })

  for (const ing of recipe.ingredients) {
    const totalIngredientQty = (ing.quantity / recipe.outputQuantity) * targetQuantity
    getRawMaterials(ing.itemId, totalIngredientQty, recipeMap, itemsMap, tree)
  }

  return tree
}

export function mergeMaterials(materials) {
  const merged = {}
  for (const [itemId, qty] of Object.entries(materials)) {
    merged[itemId] = (merged[itemId] || 0) + qty
  }
  return merged
}
