'use client'
import React from 'react'
import SketchCard from '@/components/ui/SketchCard'
import SketchButton from '@/components/ui/SketchButton'
import { useApp } from '@/lib/AppContext'
import { useRequests } from '@/hooks/useRequests'

export default function CreatedScreen() {
  const { state, dispatch, toast } = useApp()
  const { nest, user } = state
  const { requests, acceptReq, rejectReq } = useRequests(nest.code)

  function copyCode() {
    navigator.clipboard?.writeText(nest.code || '').then(() => toast('Código copiado 📋'))
  }

  function enterApp() {
    if (user) {
      localStorage.setItem('val_sess', JSON.stringify({ name: user.name, gender: user.gender, uid: user.userId, color: user.color, code: nest.code, role: nest.role }))
    }
    dispatch({ type: 'SET_SCREEN', payload: 'app' })
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4">
      <SketchCard>
        <div className="text-center py-4">
          <div className="text-[3.8rem] mb-2.5 animate-float">🏡</div>
          <div className="font-caveat text-2xl text-rose mb-2">🏡 {nest.name}</div>
          <div className="font-caveat text-base text-muted">Comparte el código 💕</div>
          <div className="font-caveat text-sm text-muted text-center mt-3 mb-0.5">código del nido</div>
          <div className="bg-[#fff0f5] border-2 border-rose rounded-xl px-4 py-2 my-2 font-caveat text-xl tracking-wider text-center text-rose cursor-pointer" onClick={copyCode}>
            {nest.code}
          </div>
          <div className="font-caveat text-xs text-muted">Toca para copiar</div>

          {requests.length > 0 && (
            <div className="bg-[#fff0f5] border-2 border-rose rounded-xl p-2.5 mt-3 text-left">
              <div className="font-caveat text-base text-rose mb-2">💌 Solicitudes ({requests.length})</div>
              {requests.map(r => (
                <div key={r.userId} className="flex items-center justify-between mb-2 gap-2">
                  <span className="font-caveat text-sm flex-1" style={{ color: r.color || '#ff6b9d' }}>
                    {r.name} {r.gender === 'mujer' ? '🌸' : r.gender === 'hombre' ? '🌿' : '🦋'}
                  </span>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="bg-[#e8f8ec] border border-[#6bcb77] text-[#27ae60] px-2.5 py-1 rounded-lg cursor-pointer font-caveat text-sm"
                      onClick={() => { acceptReq(r.userId, r.name, r.gender, r.color); toast(r.name + ' se unió 💕') }}>✓</button>
                    <button className="bg-[#ffeaea] border border-[#ff7675] text-[#d63031] px-2.5 py-1 rounded-lg cursor-pointer font-caveat text-sm"
                      onClick={() => rejectReq(r.userId)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <SketchButton variant="secondary" onClick={enterApp} className="mt-2.5 mb-2">
            Entrar al nido →
          </SketchButton>
          <SketchButton variant="back" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })} className="justify-center w-full">
            ← Mis nidos
          </SketchButton>
        </div>
      </SketchCard>
    </div>
  )
}
