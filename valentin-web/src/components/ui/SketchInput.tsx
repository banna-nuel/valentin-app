'use client'
import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function SketchInput({ label, className = '', ...props }: Props) {
  return (
    <div>
      {label && <div className="font-caveat text-base text-muted mb-1">{label}</div>}
      <input
        className={`w-full px-3 py-2.5 border-2 border-ink bg-[#fffef9] text-text font-sans text-[0.95rem] outline-none transition-colors focus:border-rose ${className}`}
        style={{
          borderRadius: '12px 10px 14px 10px / 10px 14px 10px 12px',
          boxShadow: '2px 2px 0 rgba(45,27,27,0.1)',
        }}
        {...props}
      />
    </div>
  )
}
