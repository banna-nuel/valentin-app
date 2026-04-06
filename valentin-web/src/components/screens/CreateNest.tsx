'use client'
import React, { useState } from 'react'
import SketchCard from '@/components/ui/SketchCard'
import SketchButton from '@/components/ui/SketchButton'
import SketchInput from '@/components/ui/SketchInput'
import CategoryGrid from '@/components/ui/CategoryGrid'
import { useApp } from '@/lib/AppContext'
import { db } from '@/lib/firebase'
import { ref, set } from 'firebase/database'

export default function CreateNest() {
  const { state, dispatch, toast, addSavedNest } = useApp()
  const [nestName, setNestName] = useState('')
  const [cat, setCat] = useState('pareja')
  const [maxM, setMaxM] = useState('2')
  const { user } = state

  async function create() {
    if (!user) return
    const nm = nestName.trim() || user.name + "'s nido"
    const max = Math.min(10, Math.max(2, parseInt(maxM) || 2))
    const code = user.name.toLowerCase().replace(/\s/g, '').substring(0, 8) + Math.floor(1000 + Math.random() * 9000)

    const members = { [user.userId]: { name: user.name, gender: user.gender, userId: user.userId, color: user.color, role: 'creator' } }

    try {
      await set(ref(db, `homes/${code}`), {
        name: nm, category: cat, maxMembers: max,
        creator: { name: user.name, gender: user.gender, userId: user.userId, color: user.color },
        members, requests: {},
      })
    } catch (e) { toast('Error: ' + (e as Error).message); return }

    dispatch({ type: 'SET_NEST', payload: { code, role: 'creator', name: nm, cat, maxM: max, members } })
    addSavedNest(code, nm, cat, 'creator')
    dispatch({ type: 'SET_SCREEN', payload: 'created' })
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <SketchCard>
        <SketchButton variant="back" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          ← Volver
        </SketchButton>
        <div className="font-caveat text-xl text-rose mb-3.5">Nuevo nido 🏡</div>
        <SketchInput label="Nombre del nido" placeholder="ej: Mi amor eterno 💕" maxLength={32} value={nestName} onChange={e => setNestName(e.target.value)} />
        <div className="h-3" />
        <div className="font-caveat text-base text-muted mb-1">Categoría</div>
        <CategoryGrid selected={cat} onChange={setCat} />
        <SketchInput label="Máximo de personas (2–10)" placeholder="2" maxLength={2} value={maxM} onChange={e => setMaxM(e.target.value)} />
        <div className="h-3.5" />
        <SketchButton variant="primary" onClick={create}>Crear nido 💕</SketchButton>
      </SketchCard>
    </div>
  )
}
