'use client'
import React from 'react'
import { nestCategories } from '@/lib/constants'

interface Props {
  selected: string
  onChange: (id: string) => void
}

export default function CategoryGrid({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {nestCategories.map(c => (
        <button
          key={c.id}
          className={`py-3 px-1.5 border-2 border-ink rounded-xl text-center cursor-pointer transition-all ${c.id === selected ? 'bg-[#ffe0ec] border-rose' : 'bg-[#fffef9]'}`}
          style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
          onClick={() => onChange(c.id)}
        >
          <span className="text-2xl block mb-0.5">{c.emoji}</span>
          <span className="font-caveat text-sm text-muted">{c.label}</span>
        </button>
      ))}
    </div>
  )
}
