'use client'
import React, { useCallback } from 'react'
import SketchCard from '@/components/ui/SketchCard'
import SketchButton from '@/components/ui/SketchButton'
import { useApp } from '@/lib/AppContext'
import { useApprovalListener } from '@/hooks/useRequests'
import { db } from '@/lib/firebase'
import { ref, set, get } from 'firebase/database'

export default function WaitingScreen() {
  const { state, dispatch, toast, addSavedNest } = useApp()
  const { nest, user } = state

  const onAccepted = useCallback(async () => {
    if (!nest.code) return
    try {
      const snap = await get(ref(db, `homes/${nest.code}`))
      if (snap.exists()) {
        const d = snap.val()
        dispatch({ type: 'SET_NEST', payload: { name: d.name || 'Nuestro nido', cat: d.category || 'pareja', maxM: d.maxMembers || 2, members: d.members || {} } })
      }
    } catch { /* ignore */ }
    addSavedNest(nest.code, nest.name, nest.cat, 'member')
    dispatch({ type: 'SET_SCREEN', payload: 'app' })
  }, [nest.code, nest.name, nest.cat, dispatch, addSavedNest])

  const onRejected = useCallback(() => {
    toast('Tu solicitud fue rechazada 🥺')
    dispatch({ type: 'SET_SCREEN', payload: 'home' })
  }, [toast, dispatch])

  useApprovalListener(nest.code, user?.userId || null, onAccepted, onRejected)

  async function cancelReq() {
    if (nest.code && user) {
      await set(ref(db, `homes/${nest.code}/requests/${user.userId}`), null)
    }
    dispatch({ type: 'SET_SCREEN', payload: 'home' })
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4">
      <SketchCard>
        <div className="text-center py-4">
          <div className="text-[3.8rem] mb-2.5 animate-float">💌</div>
          <div className="font-caveat text-2xl text-rose mb-2">Solicitud enviada</div>
          <div className="font-caveat text-base text-muted leading-relaxed">Espera con el corazón abierto 🌸</div>
          <div className="font-caveat text-sm text-muted text-center mt-3 mb-0.5">código del nido</div>
          <div className="bg-[#fff0f5] border-2 border-rose rounded-xl px-4 py-2 my-3 font-caveat text-xl tracking-wider text-center text-rose cursor-pointer"
            onClick={() => { navigator.clipboard?.writeText(nest.code || ''); toast('Código copiado 📋') }}>
            {nest.code}
          </div>
          <SketchButton variant="ghost" onClick={cancelReq} className="mt-2.5">Cancelar solicitud</SketchButton>
          <SketchButton variant="back" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })} className="mt-2 justify-center w-full">
            ← Mis nidos
          </SketchButton>
        </div>
      </SketchCard>
    </div>
  )
}
