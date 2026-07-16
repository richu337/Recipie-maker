import { useState, useEffect, useCallback } from 'react'
import {
  initFirebase,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  db,
  onAuth,
  signIn,
} from '../services/firebase.js'
import { getSeedData } from '../data/seedData.js'

export function useFirebase() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fb = initFirebase()
    if (!fb) {
      setReady(true)
      setUser(null)
      return
    }

    const unsub = onAuth((u) => {
      setUser(u)
      setReady(true)
    })

    signIn()

    return () => unsub?.()
  }, [])

  const fetchItems = useCallback(async () => {
    if (!db) return []
    const snap = await getDocs(query(collection(db, 'items'), orderBy('name')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }, [])

  const fetchRecipes = useCallback(async () => {
    if (!db) return []
    const snap = await getDocs(collection(db, 'recipes'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }, [])

  const fetchRecipeIngredients = useCallback(async () => {
    if (!db) return []
    const snap = await getDocs(collection(db, 'recipeIngredients'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }, [])

  const addItem = useCallback(async (name, craftable) => {
    if (!db) return
    const ref = await addDoc(collection(db, 'items'), { name, craftable })
    return ref.id
  }, [])

  const updateItem = useCallback(async (id, data) => {
    if (!db) return
    await updateDoc(doc(db, 'items', id), data)
  }, [])

  const deleteItem = useCallback(async (id) => {
    if (!db) return
    await deleteDoc(doc(db, 'items', id))
  }, [])

  const addRecipe = useCallback(async (outputItemId, outputQuantity, ingredients) => {
    if (!db) return
    const recipeRef = await addDoc(collection(db, 'recipes'), {
      outputItemId,
      outputQuantity,
    })
    const batch = writeBatch(db)
    for (const ing of ingredients) {
      const ref = doc(collection(db, 'recipeIngredients'))
      batch.set(ref, {
        recipeId: recipeRef.id,
        ingredientItemId: ing.itemId,
        quantity: ing.quantity,
      })
    }
    await batch.commit()
    return recipeRef.id
  }, [])

  const deleteRecipe = useCallback(async (recipeId) => {
    if (!db) return
    const ingSnap = await getDocs(
      query(collection(db, 'recipeIngredients'))
    )
    const batch = writeBatch(db)
    let found = false
    ingSnap.docs.forEach((d) => {
      if (d.data().recipeId === recipeId) {
        batch.delete(doc(db, 'recipeIngredients', d.id))
        found = true
      }
    })
    batch.delete(doc(db, 'recipes', recipeId))
    await batch.commit()
    return found
  }, [])

  const deleteAll = useCallback(async () => {
    if (!db) return
    for (const name of ['recipeIngredients', 'recipes', 'items']) {
      const snap = await getDocs(collection(db, name))
      const batch = writeBatch(db)
      snap.docs.forEach((d) => batch.delete(doc(db, name, d.id)))
      if (snap.docs.length > 0) await batch.commit()
    }
  }, [])

  const seedInitialData = useCallback(async () => {
    if (!db) return

    await deleteAll()

    const { items: allItems, recipes: allRecipes } = getSeedData()

    const itemRefs = {}
    const itemBatch = writeBatch(db)
    for (const item of allItems) {
      const ref = doc(collection(db, 'items'))
      itemBatch.set(ref, { name: item.name, craftable: item.craftable })
      itemRefs[item.name] = ref.id
    }
    await itemBatch.commit()

    const recipeBatch = writeBatch(db)
    for (const recipe of allRecipes) {
      const recipeRef = doc(collection(db, 'recipes'))
      recipeBatch.set(recipeRef, {
        outputItemId: itemRefs[recipe.outputName],
        outputQuantity: recipe.outputQuantity,
      })
      for (const ing of recipe.ingredients) {
        const ingRef = doc(collection(db, 'recipeIngredients'))
        recipeBatch.set(ingRef, {
          recipeId: recipeRef.id,
          ingredientItemId: itemRefs[ing.name],
          quantity: ing.quantity,
        })
      }
    }
    await recipeBatch.commit()
  }, [deleteAll])

  return {
    ready, user,
    fetchItems, fetchRecipes, fetchRecipeIngredients,
    addItem, updateItem, deleteItem,
    addRecipe, deleteRecipe,
    seedInitialData,
  }
}
