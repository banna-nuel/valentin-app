'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import SketchCard from '@/components/ui/SketchCard'
import SketchButton from '@/components/ui/SketchButton'
import SketchInput from '@/components/ui/SketchInput'
import ColorGrid from '@/components/ui/ColorGrid'
import { useApp } from '@/lib/AppContext'

export default function LoginScreen() {
  const { dispatch, toast } = useApp()
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'mujer' | 'hombre' | 'otro' | null>(null)
  const [color, setColor] = useState('#ff6b9d')

  const genders = [
    { id: 'mujer' as const, emoji: '🌸', label: 'Mujer' },
    { id: 'hombre' as const, emoji: '🌿', label: 'Hombre' },
    { id: 'otro' as const, emoji: '🦋', label: 'Otro' },
  ]

  function doLogin() {
    if (!name.trim()) { toast('Escribe tu nombre 🌸'); return }
    if (!gender) { toast('Elige cómo te identificas 💕'); return }
    const userId = name.toLowerCase().replace(/\s/g, '_') + '_' + Date.now()
    dispatch({ type: 'SET_USER', payload: { name: name.trim(), gender, userId, color } })
    dispatch({ type: 'SET_SCREEN', payload: 'home' })
    localStorage.setItem('val_sess', JSON.stringify({
      name: name.trim(), gender, uid: userId, color, code: null, role: null,
    }))
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <Image src="/logo.jpg" alt="Valentin" width={68} height={68} className="object-contain mb-0.5 animate-wiggle" />
      <div className="font-caveat text-[2.6rem] text-rose text-center leading-none">Valentin</div>
      <div className="font-caveat text-base text-muted text-center mb-5">donde dos corazones se encuentran 💕</div>
      <SketchCard>
        <SketchInput label="¿Cómo te llamas?" placeholder="Tu nombre" maxLength={20} value={name} onChange={e => setName(e.target.value)} />
        <div className="h-3" />
        <div className="font-caveat text-base text-muted mb-1">¿Cómo te identificas?</div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {genders.map(g => (
            <button
              key={g.id}
              className={`py-3 px-1.5 border-2 border-ink rounded-xl text-center cursor-pointer transition-all ${gender === g.id ? 'bg-[#ffe0ec] border-rose' : 'bg-[#fffef9]'}`}
              style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
              onClick={() => setGender(g.id)}
            >
              <span className="text-[1.7rem] block mb-0.5">{g.emoji}</span>
              <span className="font-caveat text-sm text-muted">{g.label}</span>
            </button>
          ))}
        </div>
        <div className="font-caveat text-base text-muted mb-1">Tu color de perfil</div>
        <ColorGrid selected={color} onChange={setColor} />
        <div className="h-3.5" />
        <SketchButton variant="primary" onClick={doLogin}>Continuar 💕</SketchButton>
      </SketchCard>
    </div>
  )
}
