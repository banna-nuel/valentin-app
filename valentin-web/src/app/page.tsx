'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { AppProvider, useApp } from '@/lib/AppContext'
import * as storage from '@/lib/storage'
import Splash from '@/components/Splash'
import LoginScreen from '@/components/screens/LoginScreen'
import HomeScreen from '@/components/screens/HomeScreen'
import CreateNest from '@/components/screens/CreateNest'
import WaitingScreen from '@/components/screens/WaitingScreen'
import CreatedScreen from '@/components/screens/CreatedScreen'
import AppScreen from '@/components/screens/AppScreen'
import Toast from '@/components/ui/Toast'
import { db } from '@/lib/firebase'
import { ref, get } from 'firebase/database'

function AppContent() {
  const { state, dispatch } = useApp()
  const [showSplash, setShowSplash] = useState(true)

  const onSplashFinish = useCallback(async () => {
    const sess = storage.loadSession()
    if (sess) {
      const user = {
        name: sess.name,
        gender: sess.gender as 'mujer' | 'hombre' | 'otro',
        userId: sess.uid,
        color: sess.color || '#ff6b9d',
      }
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_SAVED_NESTS', payload: storage.loadSavedNests(sess.uid) })
      dispatch({ type: 'SET_CUSTOM_MOODS', payload: storage.loadCustomMoods(sess.uid) })
      dispatch({ type: 'SET_CUSTOM_PHRASES', payload: storage.loadCustomPhrases(sess.uid) })
      dispatch({ type: 'SET_CUSTOM_DEFAULT_MOODS', payload: storage.loadCustomDefaultMoods(sess.uid) })

      if (sess.code) {
        dispatch({ type: 'SET_NEST', payload: { code: sess.code, role: sess.role as 'creator' | 'guest' | 'member' } })
        try {
          const snap = await get(ref(db, `homes/${sess.code}`))
          if (snap.exists()) {
            const d = snap.val()
            dispatch({ type: 'SET_NEST', payload: {
              name: d.name || 'Nuestro nido', cat: d.category || 'pareja',
              maxM: d.maxMembers || 2, members: d.members || {},
            }})
          }
        } catch { /* ignore */ }
        dispatch({ type: 'SET_SCREEN', payload: 'app' })
      } else {
        dispatch({ type: 'SET_SCREEN', payload: 'home' })
      }
    } else {
      dispatch({ type: 'SET_SCREEN', payload: 'login' })
    }
    setShowSplash(false)
  }, [dispatch])

  const screens: Record<string, React.ReactNode> = {
    login: <LoginScreen />,
    home: <HomeScreen />,
    create: <CreateNest />,
    waiting: <WaitingScreen />,
    created: <CreatedScreen />,
    app: <AppScreen />,
  }

  return (
    <>
      {showSplash && <Splash onFinish={onSplashFinish} />}
      {!showSplash && screens[state.currentScreen]}
      <Toast />
    </>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
