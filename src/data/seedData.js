const rawItems = [
  'Wood', 'Stone', 'Paldium Fragment', 'Ore', 'Coal',
  'Sulfur', 'Quartz', 'Wool', 'Leather', 'Bone', 'Horn',
  'Pal Fluids', 'High Quality Pal Oil',
  'Berry', 'Berry Seeds', 'Egg', 'Lamball Meat',
  'Tomato', 'Lettuce', 'Flour', 'Milk', 'Honey', 'Red Berries',
  'Pal Metal Ore', 'Flame Organ',
].map((name) => ({ name, craftable: false }))

const craftableItems = [
  // Refined resources
  { name: 'Fiber', craftable: true },
  { name: 'Cloth', craftable: true },
  { name: 'Charcoal', craftable: true },
  { name: 'Ingot', craftable: true },
  { name: 'Nail', craftable: true },

  // Equipment
  { name: 'Stone Axe', craftable: true },
  { name: 'Stone Pickaxe', craftable: true },
  { name: 'Club', craftable: true },
  { name: 'Torch', craftable: true },
  { name: 'Old Bow', craftable: true },
  { name: 'Arrow', craftable: true },

  // Buildings
  { name: 'Primitive Workbench', craftable: true },
  { name: 'Campfire', craftable: true },
  { name: 'Crusher', craftable: true },
  { name: 'Primitive Furnace', craftable: true },
  { name: 'Wooden Chest', craftable: true },
  { name: 'Feed Box', craftable: true },
  { name: 'Ranch', craftable: true },
  { name: 'Berry Plantation', craftable: true },
  { name: 'Logging Site', craftable: true },
  { name: 'Stone Pit', craftable: true },

  // Food
  { name: 'Baked Berry', craftable: true },
  { name: 'Fried Egg', craftable: true },
  { name: 'Grilled Lamball', craftable: true },
  { name: 'Salad', craftable: true },
  { name: 'Cake', craftable: true },

  // Refined advanced
  { name: 'Refined Ingot', craftable: true },
  { name: 'Cement', craftable: true },
  { name: 'Gunpowder', craftable: true },
  { name: 'Polymer', craftable: true },
  { name: 'Carbon Fiber', craftable: true },
  { name: 'High Quality Cloth', craftable: true },
  { name: 'Pal Metal Ingot', craftable: true },
]

const recipes = [
  // Basic resource recipes
  { outputName: 'Fiber', outputQuantity: 2, ingredients: [{ name: 'Wood', quantity: 1 }] },
  { outputName: 'Cloth', outputQuantity: 1, ingredients: [{ name: 'Wool', quantity: 2 }] },
  { outputName: 'Charcoal', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 2 }] },
  { outputName: 'Ingot', outputQuantity: 1, ingredients: [{ name: 'Ore', quantity: 2 }] },
  { outputName: 'Nail', outputQuantity: 2, ingredients: [{ name: 'Ingot', quantity: 1 }] },

  // Equipment
  { outputName: 'Stone Axe', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 5 }, { name: 'Stone', quantity: 3 }] },
  { outputName: 'Stone Pickaxe', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 3 }, { name: 'Stone', quantity: 5 }] },
  { outputName: 'Club', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 5 }] },
  { outputName: 'Torch', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 3 }, { name: 'Stone', quantity: 1 }] },
  { outputName: 'Old Bow', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 10 }, { name: 'Fiber', quantity: 5 }, { name: 'Stone', quantity: 3 }] },
  { outputName: 'Arrow', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 1 }, { name: 'Stone', quantity: 1 }] },

  // Buildings
  { outputName: 'Primitive Workbench', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 10 }] },
  { outputName: 'Campfire', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 5 }, { name: 'Stone', quantity: 5 }] },
  { outputName: 'Crusher', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 20 }, { name: 'Stone', quantity: 10 }, { name: 'Paldium Fragment', quantity: 5 }] },
  { outputName: 'Primitive Furnace', outputQuantity: 1, ingredients: [{ name: 'Stone', quantity: 10 }, { name: 'Wood', quantity: 5 }, { name: 'Flame Organ', quantity: 2 }] },
  { outputName: 'Wooden Chest', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 15 }] },
  { outputName: 'Feed Box', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 10 }, { name: 'Fiber', quantity: 5 }] },
  { outputName: 'Ranch', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 30 }, { name: 'Stone', quantity: 20 }, { name: 'Fiber', quantity: 10 }] },
  { outputName: 'Berry Plantation', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 10 }, { name: 'Berry Seeds', quantity: 3 }] },
  { outputName: 'Logging Site', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 10 }, { name: 'Stone', quantity: 5 }] },
  { outputName: 'Stone Pit', outputQuantity: 1, ingredients: [{ name: 'Wood', quantity: 10 }, { name: 'Stone', quantity: 5 }] },

  // Food
  { outputName: 'Baked Berry', outputQuantity: 1, ingredients: [{ name: 'Berry', quantity: 1 }] },
  { outputName: 'Fried Egg', outputQuantity: 1, ingredients: [{ name: 'Egg', quantity: 1 }] },
  { outputName: 'Grilled Lamball', outputQuantity: 1, ingredients: [{ name: 'Lamball Meat', quantity: 1 }] },
  { outputName: 'Salad', outputQuantity: 1, ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Lettuce', quantity: 1 }] },
  { outputName: 'Cake', outputQuantity: 1, ingredients: [
    { name: 'Flour', quantity: 2 }, { name: 'Egg', quantity: 3 },
    { name: 'Milk', quantity: 2 }, { name: 'Honey', quantity: 2 },
    { name: 'Red Berries', quantity: 5 },
  ] },

  // Refined advanced
  { outputName: 'Refined Ingot', outputQuantity: 1, ingredients: [{ name: 'Ore', quantity: 2 }, { name: 'Coal', quantity: 1 }] },
  { outputName: 'Cement', outputQuantity: 1, ingredients: [{ name: 'Stone', quantity: 2 }, { name: 'Bone', quantity: 1 }, { name: 'Pal Fluids', quantity: 1 }] },
  { outputName: 'Gunpowder', outputQuantity: 1, ingredients: [{ name: 'Sulfur', quantity: 2 }, { name: 'Charcoal', quantity: 1 }] },
  { outputName: 'Polymer', outputQuantity: 1, ingredients: [{ name: 'High Quality Pal Oil', quantity: 2 }] },
  { outputName: 'Carbon Fiber', outputQuantity: 1, ingredients: [{ name: 'Charcoal', quantity: 2 }] },
  { outputName: 'High Quality Cloth', outputQuantity: 1, ingredients: [{ name: 'Cloth', quantity: 1 }, { name: 'High Quality Pal Oil', quantity: 1 }] },
  { outputName: 'Pal Metal Ingot', outputQuantity: 1, ingredients: [{ name: 'Pal Metal Ore', quantity: 2 }, { name: 'Paldium Fragment', quantity: 1 }] },
]

export function getSeedData() {
  const allItems = [...rawItems, ...craftableItems]
  return { items: allItems, recipes }
}
