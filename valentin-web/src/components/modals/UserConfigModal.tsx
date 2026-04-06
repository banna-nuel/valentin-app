'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import SketchButton from '@/components/ui/SketchButton'
import SketchInput from '@/components/ui/SketchInput'
import ColorGrid from '@/components/ui/ColorGrid'
import { useApp } from '@/lib/AppContext'
import * as storage from '@/lib/storage'

export default function UserConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useApp()
  const { user, nest } = state
  const [name, setName] = useState(user?.name || '')
  const [gender, setGender] = useState(user?.gender || 'otro')
  const [color, setColor] = useState(user?.color || '#ff6b9d')

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name)
      setGender(user.gender)
      setColor(user.color)
    }
  }, [isOpen, user])

  const genders = [
    { id: 'mujer' as const, emoji: '🌸', label: 'Mujer' },
    { id: 'hombre' as const, emoji: '🌿', label: 'Hombre' },
    { id: 'otro' as const, emoji: '🦋', label: 'Otro' },
  ]

  function save() {
    if (!name.trim()) { toast('Escribe tu nombre 🌸'); return }
    if (!user) return
    const updatedUser = { ...user, name: name.trim(), gender, color }
    dispatch({ type: 'SET_USER', payload: updatedUser })
    storage.saveSession(updatedUser, nest.code, nest.role)
    toast('Perfil actualizado 💕')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi perfil 👤">
      <SketchInput label="Nombre" maxLength={20} value={name} onChange={e => setName(e.target.value)} />
      <div className="h-3" />
      <div className="font-caveat text-base text-muted mb-1">Género</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {genders.map(g => (
          <button key={g.id}
            className={`py-3 px-1.5 border-2 border-ink rounded-xl text-center cursor-pointer transition-all ${gender === g.id ? 'bg-[#ffe0ec] border-rose' : 'bg-[#fffef9]'}`}
            style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
            onClick={() => setGender(g.id)}
          >
            <span className="text-[1.7rem] block mb-0.5">{g.emoji}</span>
            <span className="font-caveat text-sm text-muted">{g.label}</span>
          </button>
        ))}
      </div>
      <div className="font-caveat text-base text-muted mb-1">Color de perfil</div>
      <ColorGrid selected={color} onChange={setColor} />
      <div className="flex gap-2.5">
        <SketchButton variant="ghost" onClick={onClose} className="flex-1">Cancelar</SketchButton>
        <SketchButton variant="primary" onClick={save} className="flex-1">Guardar 💕</SketchButton>
      </div>
    </Modal>
  )
}
