'use client'

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'
import { User, NestState, Mood, SavedNest } from './types'
import * as storage from './storage'

type Screen = 'splash' | 'login' | 'home' | 'create' | 'waiting' | 'created' | 'app'

interface AppState {
  user: User | null
  nest: NestState
  customMoods: Mood[]
  customPhrases: Record<string, string>
  customDefaultMoods: Record<string, { emoji: string; label: string }>
  savedNests: SavedNest[]
  currentScreen: Screen
  editMode: boolean
  toastMessage: string | null
}

const initialNest: NestState = {
  code: null, role: null, name: 'Nuestro nido', cat: 'pareja',
  maxM: 2, members: {}, mood: null, img: null,
}

const initialState: AppState = {
  user: null, nest: initialNest, customMoods: [], customPhrases: {},
  customDefaultMoods: {}, savedNests: [], currentScreen: 'splash',
  editMode: false, toastMessage: null,
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'SET_NEST'; payload: Partial<NestState> }
  | { type: 'RESET_NEST' }
  | { type: 'SET_CUSTOM_MOODS'; payload: Mood[] }
  | { type: 'SET_CUSTOM_PHRASES'; payload: Record<string, string> }
  | { type: 'SET_CUSTOM_DEFAULT_MOODS'; payload: Record<string, { emoji: string; label: string }> }
  | { type: 'SET_SAVED_NESTS'; payload: SavedNest[] }
  | { type: 'ADD_SAVED_NEST'; payload: SavedNest }
  | { type: 'REMOVE_SAVED_NEST'; payload: string }
  | { type: 'UPDATE_SAVED_NEST'; payload: { code: string; key: string; val: string } }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'SET_MOOD'; payload: number | null }
  | { type: 'SET_IMG'; payload: string | null }
  | { type: 'TOAST'; payload: string | null }
  | { type: 'LOAD_SESSION'; payload: AppState }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload }
    case 'SET_NEST':
      return { ...state, nest: { ...state.nest, ...action.payload } }
    case 'RESET_NEST':
      return { ...state, nest: initialNest }
    case 'SET_CUSTOM_MOODS':
      return { ...state, customMoods: action.payload }
    case 'SET_CUSTOM_PHRASES':
      return { ...state, customPhrases: action.payload }
    case 'SET_CUSTOM_DEFAULT_MOODS':
      return { ...state, customDefaultMoods: action.payload }
    case 'SET_SAVED_NESTS':
      return { ...state, savedNests: action.payload }
    case 'ADD_SAVED_NEST': {
      const idx = state.savedNests.findIndex(n => n.code === action.payload.code)
      const nests = [...state.savedNests]
      if (idx >= 0) nests[idx] = action.payload
      else nests.push(action.payload)
      return { ...state, savedNests: nests }
    }
    case 'REMOVE_SAVED_NEST':
      return { ...state, savedNests: state.savedNests.filter(n => n.code !== action.payload) }
    case 'UPDATE_SAVED_NEST': {
      const nests = state.savedNests.map(n =>
        n.code === action.payload.code ? { ...n, [action.payload.key]: action.payload.val } : n
      )
      return { ...state, savedNests: nests }
    }
    case 'TOGGLE_EDIT_MODE':
      return { ...state, editMode: !state.editMode }
    case 'SET_MOOD':
      return { ...state, nest: { ...state.nest, mood: action.payload } }
    case 'SET_IMG':
      return { ...state, nest: { ...state.nest, img: action.payload } }
    case 'TOAST':
      return { ...state, toastMessage: action.payload }
    case 'LOAD_SESSION':
      return action.payload
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  toast: (msg: string) => void
  saveSess: (code?: string | null, role?: string | null) => void
  addSavedNest: (code: string, name: string, cat: string, role: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const toast = useCallback((msg: string) => {
    dispatch({ type: 'TOAST', payload: msg })
    setTimeout(() => dispatch({ type: 'TOAST', payload: null }), 3500)
  }, [])

  const saveSess = useCallback((code?: string | null, role?: string | null) => {
    if (state.user) {
      storage.saveSession(state.user, code ?? null, role ?? null)
    }
  }, [state.user])

  const addSavedNest = useCallback((code: string, name: string, cat: string, role: string) => {
    const nest: SavedNest = { code, name, cat, role }
    dispatch({ type: 'ADD_SAVED_NEST', payload: nest })
    if (state.user) {
      const idx = state.savedNests.findIndex(n => n.code === code)
      const nests = [...state.savedNests]
      if (idx >= 0) nests[idx] = nest
      else nests.push(nest)
      storage.saveSavedNests(state.user.userId, nests)
    }
  }, [state.user, state.savedNests])

  return (
    <AppContext.Provider value={{ state, dispatch, toast, saveSess, addSavedNest }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
