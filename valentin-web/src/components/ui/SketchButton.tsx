'use client'
import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'back'
  children: React.ReactNode
}

const sketchRadius = '12px 10px 14px 10px / 10px 14px 10px 12px'

export default function SketchButton({ variant = 'primary', children, className = '', style, ...props }: Props) {
  const base = 'flex items-center justify-center gap-2 w-full px-4 py-3 border-2 cursor-pointer font-caveat text-lg transition-transform active:translate-x-[2px] active:translate-y-[2px]'

  const variants: Record<string, string> = {
    primary: 'border-ink bg-rose text-white',
    secondary: 'border-ink bg-[#fffef9] text-text',
    ghost: 'border-dashed border-muted bg-transparent text-muted shadow-none text-base',
    danger: 'bg-[#fff0f0] border-[#ff7675] text-[#d63031]',
    back: 'border-none bg-transparent text-muted text-base p-1 shadow-none w-auto',
  }

  const shadow = variant === 'ghost' || variant === 'back'
    ? {}
    : variant === 'danger'
      ? { boxShadow: '3px 3px 0 #ff7675', borderRadius: sketchRadius }
      : { boxShadow: '3px 3px 0 #2d1b1b', borderRadius: sketchRadius }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={{ borderRadius: sketchRadius, ...shadow, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
