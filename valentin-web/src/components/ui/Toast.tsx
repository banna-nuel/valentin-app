'use client'
import React from 'react'
import { useApp } from '@/lib/AppContext'

export default function Toast() {
  const { state } = useApp()
  if (!state.toastMessage) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-full font-caveat text-base z-[300] whitespace-nowrap animate-toastIn pointer-events-none">
      {state.toastMessage}
    </div>
  )
}
