'use client'
import React, { useState } from 'react'
import SketchCard from '@/components/ui/SketchCard'
import SketchButton from '@/components/ui/SketchButton'
import SketchInput from '@/components/ui/SketchInput'
import { useApp } from '@/lib/AppContext'
import { nestCategories } from '@/lib/constants'
import { db } from '@/lib/firebase'
import { ref, get } from 'firebase/database'

export default function HomeScreen() {
  const { state, dispatch, toast, addSavedNest } = useApp()
  const [joinCode, setJoinCode] = useState('')
  const { user, savedNests } = state

  async function openNest(i: number) {
    const n = savedNests[i]
    dispatch({ type: 'SET_NEST', payload: { code: n.code, role: n.role as 'creator' | 'guest' | 'member', name: n.name, cat: n.cat } })
    try {
      const snap = await get(ref(db, `homes/${n.code}`))
      if (snap.exists()) {
        const d = snap.val()
        dispatch({ type: 'SET_NEST', payload: { name: d.name || 'Nuestro nido', cat: d.category || 'pareja', maxM: d.maxMembers || 2, members: d.members || {} } })
      }
    } catch { /* ignore */ }
    dispatch({ type: 'SET_SCREEN', payload: 'app' })
    if (user) {
      localStorage.setItem('val_sess', JSON.stringify({ name: user.name, gender: user.gender, uid: user.userId, color: user.color, code: n.code, role: n.role }))
    }
  }

  async function joinNest() {
    const code = joinCode.trim()
    if (!code) { toast('Escribe el código 🌸'); return }
    if (!user) return
    try {
      const snap = await get(ref(db, `homes/${code}`))
      if (!snap.exists()) { toast('Ese nido no existe 🥺'); return }
      const d = snap.val()
      if (Object.keys(d.members || {}).length >= (d.maxMembers || 2)) { toast('El nido está lleno 🥺'); return }
      const { set: fbSet } = await import('firebase/database')
      await fbSet(ref(db, `homes/${code}/requests/${user.userId}`), {
        name: user.name, gender: user.gender, userId: user.userId, color: user.color, status: 'pending',
      })
      dispatch({ type: 'SET_NEST', payload: { code, role: 'guest', name: d.name || 'Nido', cat: d.category || 'pareja' } })
      dispatch({ type: 'SET_SCREEN', payload: 'waiting' })
    } catch (e) { toast('Error: ' + (e as Error).message) }
  }

  function catEmoji(id: string) {
    return nestCategories.find(x => x.id === id)?.emoji || '🏡'
  }
  function catLabel(id: string) {
    return nestCategories.find(x => x.id === id)?.label || 'Nido'
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <SketchCard style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <div className="font-caveat text-2xl text-rose">Hola, {user?.name} 💕</div>
            <div className="font-caveat text-sm text-muted">Mis nidos</div>
          </div>
          <button
            className="w-9 h-9 border-2 border-ink rounded-full bg-[#fffef9] flex items-center justify-center cursor-pointer text-base"
            style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'app' })}
          >👤</button>
        </div>

        <div className="mb-3">
          {savedNests.length === 0 ? (
            <div className="font-caveat text-sm text-muted text-center py-2.5">
              Aún no tienes nidos 🥺<br />¡Crea o únete a uno!
            </div>
          ) : (
            savedNests.map((n, i) => (
              <div
                key={n.code}
                className="flex items-center gap-2.5 bg-[#fffef9] border-2 border-ink rounded-[14px] px-3 py-2.5 mb-2 cursor-pointer transition-transform active:translate-x-[1px] active:translate-y-[1px]"
                style={{ boxShadow: '3px 3px 0 #2d1b1b' }}
                onClick={() => openNest(i)}
              >
                <span className="text-[1.7rem]">{catEmoji(n.cat)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-caveat text-base text-text truncate">{n.name || 'Nido'}</div>
                  <div className="text-xs text-muted">{catLabel(n.cat)} · {n.code}</div>
                </div>
                <span className="text-muted">→</span>
              </div>
            ))
          )}
        </div>

        <SketchButton variant="primary" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'create' })} className="mb-2.5">
          🏡 Crear nuevo nido
        </SketchButton>

        <div className="flex items-center gap-2.5 my-3 text-muted font-caveat text-base">
          <div className="flex-1 h-[1.5px] bg-border" />o<div className="flex-1 h-[1.5px] bg-border" />
        </div>

        <SketchInput label="Unirme con un código" placeholder="Código del nido" maxLength={24} value={joinCode}
          onChange={e => setJoinCode(e.target.value.toLowerCase().replace(/\s/g, ''))} />
        <div className="h-2.5" />
        <SketchButton variant="secondary" onClick={joinNest}>Solicitar ingreso 💌</SketchButton>
      </SketchCard>
    </div>
  )
}
