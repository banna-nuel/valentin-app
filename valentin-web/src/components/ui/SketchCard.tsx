'use client'
import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function SketchCard({ children, className = '', style }: Props) {
  return (
    <div
      className={`bg-card border-[2.5px] border-ink p-5 w-full max-w-[390px] ${className}`}
      style={{
        borderRadius: '24px 20px 26px 22px / 22px 26px 20px 24px',
        boxShadow: '4px 4px 0 #2d1b1b',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
