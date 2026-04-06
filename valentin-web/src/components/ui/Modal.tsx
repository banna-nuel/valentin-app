'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [startY, setStartY] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex md:items-center md:justify-center items-end justify-center backdrop-blur-[3px] transition-opacity"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={modalRef}
        className="bg-cream border-[2.5px] border-ink md:rounded-3xl rounded-t-3xl rounded-b-none p-5 w-full max-w-[430px] max-h-[90vh] overflow-y-auto touch-pan-y transition-transform"
        style={{
          boxShadow: '0 -4px 0 #2d1b1b',
          transform: isDragging && dragY > 0 ? `translateY(${dragY}px)` : undefined,
        }}
        onTouchStart={e => {
          if (!isTouch) return
          setStartY(e.touches[0].clientY)
          setIsDragging(true)
        }}
        onTouchMove={e => {
          if (!isDragging) return
          const dy = e.touches[0].clientY - startY
          if (dy > 0) setDragY(dy)
        }}
        onTouchEnd={e => {
          if (!isDragging) return
          setIsDragging(false)
          const dy = e.changedTouches[0].clientY - startY
          setDragY(0)
          if (dy > 100) onClose()
        }}
      >
        {isTouch && (
          <div className="w-10 h-1.5 bg-[#ddc0c0] rounded-full mx-auto mb-4 cursor-grab" />
        )}
        <div className="font-caveat text-2xl text-center mb-4 text-rose">{title}</div>
        {children}
      </div>
    </div>
  )
}
