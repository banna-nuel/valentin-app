'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import SketchButton from '@/components/ui/SketchButton'
import SketchInput from '@/components/ui/SketchInput'
import CategoryGrid from '@/components/ui/CategoryGrid'
import { useApp } from '@/lib/AppContext'
import { RequestData } from '@/lib/types'
import { db } from '@/lib/firebase'
import { ref, update, set } from 'firebase/database'
import * as storage from '@/lib/storage'

interface Props {
  isOpen: boolean
  onClose: () => void
  requests: RequestData[]
  acceptReq: (uid: string, name: string, gender: string, color: string) => Promise<void>
  rejectReq: (uid: string) => Promise<void>
}

export default function NestConfigModal({ isOpen, onClose, requests, acceptReq, rejectReq }: Props) {
  const { state, dispatch, toast } = useApp()
  const { nest, user, savedNests } = state
  const [name, setName] = useState(nest.name)
  const [cat, setCat] = useState(nest.cat)
  const [maxM, setMaxM] = useState(nest.maxM)

  useEffect(() => {
    if (isOpen) {
      setName(nest.name)
      setCat(nest.cat)
      setMaxM(nest.maxM)
    }
  }, [isOpen, nest.name, nest.cat, nest.maxM])

  async function save() {
    const nm = name.trim() || nest.name
    if (nest.code) {
      await update(ref(db, `homes/${nest.code}`), { name: nm, category: cat, maxMembers: maxM })
    }
    dispatch({ type: 'SET_NEST', payload: { name: nm, cat, maxM } })
    dispatch({ type: 'UPDATE_SAVED_NEST', payload: { code: nest.code!, key: 'name', val: nm } })
    if (user) storage.saveSavedNests(user.userId, savedNests.map(n => n.code === nest.code ? { ...n, name: nm } : n))
    toast('Nido actualizado 💕')
    onClose()
  }

  function copyCode() {
    navigator.clipboard?.writeText(nest.code || '').then(() => toast('Código copiado 📋'))
  }

  async function leaveNest() {
    if (!confirm('¿Seguro que quieres abandonar este nido?')) return
    if (nest.code && user) {
      await set(ref(db, `homes/${nest.code}/members/${user.userId}`), null)
    }
    dispatch({ type: 'REMOVE_SAVED_NEST', payload: nest.code! })
    if (user) {
      const nests = savedNests.filter(n => n.code !== nest.code)
      storage.saveSavedNests(user.userId, nests)
    }
    onClose()
    dispatch({ type: 'SET_SCREEN', payload: 'home' })
    toast('Saliste del nido 🥺')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajustes del nido ⚙️">
      <SketchInput label="Nombre del nido" maxLength={32} value={name} onChange={e => setName(e.target.value)} />
      <div className="h-3" />
      <div className="font-caveat text-base text-muted mb-1">Categoría</div>
      <CategoryGrid selected={cat} onChange={setCat} />

      <div className="font-caveat text-base text-muted mb-1">Código para invitar</div>
      <div className="bg-[#fff0f5] border-2 border-rose rounded-xl px-4 py-2 my-2 font-caveat text-xl tracking-wider text-center text-rose cursor-pointer"
        onClick={copyCode}>{nest.code || '—'}</div>
      <div className="font-caveat text-xs text-muted text-center mb-3">Toca para copiar 📋</div>

      <div className="font-caveat text-base text-muted mb-1">Integrantes del nido</div>
      <div className="flex flex-wrap mb-2.5">
        {Object.values(nest.members || {}).map(m => (
          <span key={m.userId} className="inline-flex items-center gap-1 border rounded-full px-2.5 py-1 m-0.5 font-caveat text-sm"
            style={{ borderColor: m.color || '#ff6b9d', color: m.color || '#ff6b9d', background: '#fff0f5' }}>
            {m.name} {m.gender === 'mujer' ? '🌸' : m.gender === 'hombre' ? '🌿' : '🦋'}
          </span>
        ))}
        {Object.keys(nest.members || {}).length === 0 && (
          <span className="font-caveat text-muted text-sm">Solo tú</span>
        )}
      </div>

      <div className="font-caveat text-base text-muted mb-1">Máx. personas: {maxM}</div>
      <input type="range" min={2} max={10} step={1} value={maxM}
        className="w-full mb-4 accent-rose"
        onChange={e => setMaxM(parseInt(e.target.value))} />

      {requests.length > 0 && nest.role === 'creator' && (
        <div className="bg-[#fff0f5] border-2 border-rose rounded-xl p-2.5 mb-3 text-left">
          <div className="font-caveat text-base text-rose mb-2">💌 Solicitudes ({requests.length})</div>
          {requests.map(r => (
            <div key={r.userId} className="flex items-center justify-between mb-2 gap-2">
              <span className="font-caveat text-sm flex-1" style={{ color: r.color }}>
                {r.name} {r.gender === 'mujer' ? '🌸' : r.gender === 'hombre' ? '🌿' : '🦋'}
              </span>
              <div className="flex gap-1.5">
                <button className="bg-[#e8f8ec] border border-[#6bcb77] text-[#27ae60] px-2.5 py-1 rounded-lg font-caveat text-sm"
                  onClick={() => { acceptReq(r.userId, r.name, r.gender, r.color); toast(r.name + ' se unió 💕') }}>✓</button>
                <button className="bg-[#ffeaea] border border-[#ff7675] text-[#d63031] px-2.5 py-1 rounded-lg font-caveat text-sm"
                  onClick={() => rejectReq(r.userId)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2.5 mb-2.5">
        <SketchButton variant="ghost" onClick={onClose} className="flex-1">Cancelar</SketchButton>
        <SketchButton variant="primary" onClick={save} className="flex-1">Guardar 💕</SketchButton>
      </div>
      <SketchButton variant="danger" onClick={leaveNest}>🚪 Abandonar este nido</SketchButton>
    </Modal>
  )
}
