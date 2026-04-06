'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import SketchButton from '@/components/ui/SketchButton'
import SketchInput from '@/components/ui/SketchInput'
import ColorGrid from '@/components/ui/ColorGrid'
import { useApp } from '@/lib/AppContext'
import { COLORS } from '@/lib/constants'
import { Mood } from '@/lib/types'
import * as storage from '@/lib/storage'

interface Props {
  isOpen: boolean
  onClose: () => void
  editingIdx: number | null
  baseMoods: Mood[]
  allMoods: Mood[]
  baseLen: number
}

export default function AddMoodModal({ isOpen, onClose, editingIdx, baseMoods, allMoods: allM, baseLen }: Props) {
  const { state, dispatch, toast } = useApp()
  const { user, customMoods, customDefaultMoods } = state
  const [emoji, setEmoji] = useState('')
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('#ff6b9d')

  useEffect(() => {
    if (isOpen) {
      if (editingIdx !== null && allM[editingIdx]) {
        const m = allM[editingIdx]
        setEmoji(m.emoji)
        setLabel(m.label)
        setColor(m.color)
      } else {
        setEmoji('')
        setLabel('')
        setColor('#ff6b9d')
      }
    }
  }, [isOpen, editingIdx, allM])

  function save() {
    if (!user) return
    const e = emoji.trim() || '😊'
    const l = label.trim()
    if (!l) { toast('Escribe el nombre 🌸'); return }
    const col = COLORS.find(c => c.c === color) || COLORS[0]
    const mood: Mood = { emoji: e, label: l, color: col.c, bg: col.bg }

    if (editingIdx === null) {
      const newMoods = [...customMoods, mood]
      dispatch({ type: 'SET_CUSTOM_MOODS', payload: newMoods })
      storage.saveCustomMoods(user.userId, newMoods)
    } else if (editingIdx < baseLen) {
      const key = user.gender + '_' + editingIdx
      const newDefaults = { ...customDefaultMoods, [key]: { emoji: e, label: l } }
      dispatch({ type: 'SET_CUSTOM_DEFAULT_MOODS', payload: newDefaults })
      storage.saveCustomDefaultMoods(user.userId, newDefaults)
    } else {
      const newMoods = [...customMoods]
      newMoods[editingIdx - baseLen] = mood
      dispatch({ type: 'SET_CUSTOM_MOODS', payload: newMoods })
      storage.saveCustomMoods(user.userId, newMoods)
    }
    toast('Estado guardado 🌟')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingIdx !== null ? 'Editar estado ✏️' : 'Nuevo estado 🌟'}>
      <div className="font-caveat text-base text-muted text-center mb-1">Emoji (cópialo de WhatsApp y pégalo)</div>
      <input
        className="w-full px-3 py-2.5 border-2 border-ink bg-[#fffef9] text-center text-[1.8rem] rounded-xl outline-none focus:border-rose mb-1.5"
        maxLength={10} placeholder="😊" value={emoji} onChange={e => setEmoji(e.target.value)}
      />
      <div className="font-caveat text-xs text-muted text-center mb-3">Pega cualquier emoji o sticker aquí</div>
      <SketchInput label="Nombre del estado" placeholder="ej: Con antojo... 🍕" maxLength={20} value={label} onChange={e => setLabel(e.target.value)} />
      <div className="h-3" />
      <div className="font-caveat text-base text-muted mb-1">Color</div>
      <ColorGrid selected={color} onChange={setColor} />
      <div className="flex gap-2.5">
        <SketchButton variant="ghost" onClick={onClose} className="flex-1">Cancelar</SketchButton>
        <SketchButton variant="primary" onClick={save} className="flex-1">Guardar 💕</SketchButton>
      </div>
    </Modal>
  )
}
