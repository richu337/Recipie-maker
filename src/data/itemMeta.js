export const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '📋' },
  { id: 'raw', label: 'Raw Materials', icon: '🪨' },
  { id: 'crafting', label: 'Crafting', icon: '⚒️' },
  { id: 'tools', label: 'Tools', icon: '🪓' },
  { id: 'weapons', label: 'Weapons', icon: '⚔️' },
  { id: 'armor', label: 'Armor', icon: '🛡️' },
  { id: 'buildings', label: 'Buildings', icon: '🏠' },
  { id: 'food', label: 'Food', icon: '🍖' },
  { id: 'medicine', label: 'Medicine', icon: '💊' },
  { id: 'technology', label: 'Technology', icon: '🔬' },
  { id: 'machines', label: 'Machines', icon: '⚙️' },
  { id: 'ammo', label: 'Ammo', icon: '🎯' },
]

export const RARITIES = {
  common: { label: 'Common', color: 'text-gray-300', border: 'border-gray-500/20', bg: 'bg-gray-500/5', glow: '' },
  uncommon: { label: 'Uncommon', color: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/5', glow: 'shadow-green-500/10' },
  rare: { label: 'Rare', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5', glow: 'shadow-blue-500/10' },
  epic: { label: 'Epic', color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5', glow: 'shadow-purple-500/10' },
  legendary: { label: 'Legendary', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5', glow: 'shadow-orange-500/10' },
}

const META = {
  // Raw Materials
  'Wood': { icon: '🪵', category: 'raw', rarity: 'common', desc: 'Basic building material gathered from trees.' },
  'Stone': { icon: '🪨', category: 'raw', rarity: 'common', desc: 'Common mineral used for construction and tools.' },
  'Paldium Fragment': { icon: '💎', category: 'raw', rarity: 'rare', desc: 'Ancient crystalline fragments with mysterious properties.' },
  'Ore': { icon: '⛏️', category: 'raw', rarity: 'common', desc: 'Raw mineral ore that can be smelted into ingots.' },
  'Coal': { icon: '🪨', category: 'raw', rarity: 'common', desc: 'Carbon-rich mineral used as fuel and for refining.' },
  'Sulfur': { icon: '🟡', category: 'raw', rarity: 'uncommon', desc: 'Yellow mineral used in gunpowder production.' },
  'Quartz': { icon: '💠', category: 'raw', rarity: 'uncommon', desc: 'Hard crystal used in advanced crafting.' },
  'Wool': { icon: '🧶', category: 'raw', rarity: 'common', desc: 'Soft fiber sheared from pals.' },
  'Leather': { icon: '🥾', category: 'raw', rarity: 'common', desc: 'Treated animal hide used for armor and tools.' },
  'Bone': { icon: '🦴', category: 'raw', rarity: 'common', desc: 'Hard skeletal material from creatures.' },
  'Horn': { icon: '🦌', category: 'raw', rarity: 'uncommon', desc: 'Tough horn used in specialized crafting.' },
  'Pal Fluids': { icon: '💧', category: 'raw', rarity: 'uncommon', desc: 'Viscous fluids harvested from pals.' },
  'High Quality Pal Oil': { icon: '🛢️', category: 'raw', rarity: 'rare', desc: 'Refined pal oil used in advanced materials.' },
  'Berry': { icon: '🫐', category: 'food', rarity: 'common', desc: 'A small edible berry.' },
  'Berry Seeds': { icon: '🌱', category: 'food', rarity: 'common', desc: 'Seeds for planting berry bushes.' },
  'Egg': { icon: '🥚', category: 'food', rarity: 'common', desc: 'A fresh egg from a pal.' },
  'Lamball Meat': { icon: '🥩', category: 'food', rarity: 'common', desc: 'Fresh meat from a Lamball.' },
  'Tomato': { icon: '🍅', category: 'food', rarity: 'common', desc: 'A juicy red vegetable.' },
  'Lettuce': { icon: '🥬', category: 'food', rarity: 'common', desc: 'Crisp green leaves.' },
  'Flour': { icon: '🌾', category: 'food', rarity: 'common', desc: 'Ground grain used in baking.' },
  'Milk': { icon: '🥛', category: 'food', rarity: 'common', desc: 'Fresh milk from a pal.' },
  'Honey': { icon: '🍯', category: 'food', rarity: 'uncommon', desc: 'Sweet nectar collected by bees.' },
  'Red Berries': { icon: '🍓', category: 'food', rarity: 'common', desc: 'Tart red berries used in recipes.' },
  'Pal Metal Ore': { icon: '🔮', category: 'raw', rarity: 'epic', desc: 'Rare ore containing pal-infused metal.' },
  'Flame Organ': { icon: '🔥', category: 'raw', rarity: 'rare', desc: 'An organ that produces intense heat.' },

  // Crafting Components
  'Fiber': { icon: '🌿', category: 'crafting', rarity: 'common', desc: 'Plant fibers woven from wood.' },
  'Cloth': { icon: '👕', category: 'crafting', rarity: 'common', desc: 'Woven fabric made from wool.' },
  'Charcoal': { icon: '🔥', category: 'crafting', rarity: 'common', desc: 'Carbonized wood used in filtration and gunpowder.' },
  'Ingot': { icon: '🪙', category: 'crafting', rarity: 'common', desc: 'A basic metal ingot smelted from ore.' },
  'Nail': { icon: '📌', category: 'crafting', rarity: 'common', desc: 'Small metal spikes used in construction.' },
  'Refined Ingot': { icon: '🔩', category: 'crafting', rarity: 'uncommon', desc: 'High-grade metal alloy.' },
  'Cement': { icon: '🧱', category: 'crafting', rarity: 'uncommon', desc: 'Building cement made from stone and fluids.' },
  'Gunpowder': { icon: '💥', category: 'crafting', rarity: 'uncommon', desc: 'Explosive powder for ammunition.' },
  'Polymer': { icon: '🧪', category: 'crafting', rarity: 'rare', desc: 'Synthetic material from refined pal oil.' },
  'Carbon Fiber': { icon: '🧬', category: 'crafting', rarity: 'rare', desc: 'Ultra-strong lightweight material.' },
  'High Quality Cloth': { icon: '👗', category: 'crafting', rarity: 'rare', desc: 'Premium fabric for advanced gear.' },
  'Pal Metal Ingot': { icon: '💠', category: 'crafting', rarity: 'epic', desc: 'Legendary metal infused with pal energy.' },

  // Tools
  'Stone Axe': { icon: '🪓', category: 'tools', rarity: 'common', desc: 'Basic axe for chopping wood.' },
  'Stone Pickaxe': { icon: '⛏️', category: 'tools', rarity: 'common', desc: 'Basic pickaxe for mining stone.' },
  'Torch': { icon: '🔦', category: 'tools', rarity: 'common', desc: 'A simple light source.' },

  // Weapons
  'Club': { icon: '🏏', category: 'weapons', rarity: 'common', desc: 'A heavy wooden club.' },
  'Old Bow': { icon: '🏹', category: 'weapons', rarity: 'uncommon', desc: 'A ranged weapon made from wood and fiber.' },

  // Ammo
  'Arrow': { icon: '🎯', category: 'ammo', rarity: 'common', desc: 'Simple wooden arrows.' },

  // Buildings
  'Primitive Workbench': { icon: '🛠️', category: 'buildings', rarity: 'common', desc: 'Basic workbench for crafting.' },
  'Campfire': { icon: '🔥', category: 'buildings', rarity: 'common', desc: 'A simple campfire for cooking and warmth.' },
  'Crusher': { icon: '⚙️', category: 'machines', rarity: 'uncommon', desc: 'Crush stones into useful materials.' },
  'Primitive Furnace': { icon: '🔥', category: 'buildings', rarity: 'uncommon', desc: 'A furnace for smelting ores.' },
  'Wooden Chest': { icon: '📦', category: 'buildings', rarity: 'common', desc: 'Storage container for items.' },
  'Feed Box': { icon: '📦', category: 'buildings', rarity: 'common', desc: 'Feeding station for pals.' },
  'Ranch': { icon: '🏠', category: 'buildings', rarity: 'uncommon', desc: 'A ranch for raising pals.' },
  'Berry Plantation': { icon: '🌱', category: 'buildings', rarity: 'uncommon', desc: 'Automated berry farm.' },
  'Logging Site': { icon: '🪓', category: 'buildings', rarity: 'uncommon', desc: 'Automated wood harvesting site.' },
  'Stone Pit': { icon: '⛏️', category: 'buildings', rarity: 'uncommon', desc: 'Automated stone mining pit.' },

  // Food
  'Baked Berry': { icon: '🫐', category: 'food', rarity: 'common', desc: 'Warm baked berries.' },
  'Fried Egg': { icon: '🍳', category: 'food', rarity: 'common', desc: 'A simple fried egg.' },
  'Grilled Lamball': { icon: '🍖', category: 'food', rarity: 'common', desc: 'Grilled Lamball meat.' },
  'Salad': { icon: '🥗', category: 'food', rarity: 'common', desc: 'Fresh garden salad.' },
  'Cake': { icon: '🎂', category: 'food', rarity: 'rare', desc: 'A delicious celebratory cake.' },
}

export function getItemMeta(name) {
  return META[name] || { icon: '📦', category: 'crafting', rarity: 'common', desc: '' }
}

export function getCategoryIcon(categoryId) {
  const c = CATEGORIES.find(c => c.id === categoryId)
  return c ? c.icon : '📋'
}

export function getRarityClass(rarity) {
  const r = RARITIES[rarity]
  if (!r) return ''
  return `${r.color} ${r.border} ${r.bg}`
}

export function getRarityStyle(rarity) {
  return RARITIES[rarity] || RARITIES.common
}
