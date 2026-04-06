'use client'
import React from 'react'
import { COLORS } from '@/lib/constants'

interface Props {
  selected: string
  onChange: (color: string) => void
}

export default function ColorGrid({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-3">
      {COLORS.map(c => (
        <button
          key={c.c}
          className={`aspect-square rounded-[10px] cursor-pointer transition-transform ${c.c === selected ? 'border-[2.5px] border-ink scale-[1.18]' : 'border-[2.5px] border-transparent'}`}
          style={{ background: c.c, boxShadow: '2px 2px 0 rgba(45,27,27,0.12)' }}
          onClick={() => onChange(c.c)}
        />
      ))}
    </div>
  )
}
