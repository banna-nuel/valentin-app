'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import SketchButton from '@/components/ui/SketchButton'
import { useApp } from '@/lib/AppContext'
import { DAYS } from '@/lib/constants'
import * as storage from '@/lib/storage'

export default function PhrasesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch, toast } = useApp()
  const { user, customPhrases } = state
  const [phrases, setPhrases] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) setPhrases({ ...customPhrases })
  }, [isOpen, customPhrases])

  function save() {
    if (!user) return
    dispatch({ type: 'SET_CUSTOM_PHRASES', payload: phrases })
    storage.saveCustomPhrases(user.userId, phrases)
    toast('Frases guardadas 💕')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Frases del nido 💬">
      <div className="font-caveat text-sm text-muted text-center mb-4 leading-relaxed">
        Personaliza la frase para cada día de la semana.<br />
        Si dejas un día vacío, se usará una frase por defecto.
      </div>
      {DAYS.map(day => (
        <div key={day} className="flex items-center gap-2 mb-2.5">
          <span className="font-caveat text-base text-text w-20 shrink-0">
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </span>
          <input
            className="flex-1 px-2.5 py-2 border border-border rounded-xl bg-[#fffef9] font-sans text-sm text-text outline-none focus:border-rose"
            type="text" placeholder={`Frase del ${day}...`} maxLength={80}
            value={phrases[day] || ''}
            onChange={e => setPhrases({ ...phrases, [day]: e.target.value })}
          />
        </div>
      ))}
      <div className="flex gap-2.5 mt-2">
        <SketchButton variant="ghost" onClick={onClose} className="flex-1">Cancelar</SketchButton>
        <SketchButton variant="primary" onClick={save} className="flex-1">Guardar 💕</SketchButton>
      </div>
    </Modal>
  )
}
