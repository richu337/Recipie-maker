import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

let app = null
let db = null
let auth = null

export function isConfigured() {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId
}

export function initFirebase() {
  if (!isConfigured()) return null
  if (app) return { app, db, auth }

  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  auth = getAuth(app)
  return { app, db, auth }
}

export function signIn() {
  if (!auth) return Promise.resolve(null)
  return signInAnonymously(auth).catch(() => null)
}

export function onAuth(callback) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  db,
}
