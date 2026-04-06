'use client'
import React, { useState, useCallback, useRef } from 'react'
import { useApp } from '@/lib/AppContext'
import { usePartners } from '@/hooks/usePartners'
import { useRequests } from '@/hooks/useRequests'
import { useNestMeta } from '@/hooks/useNestMeta'
import { defaultMoods, nestCategories, DAYS, DEFAULT_PHRASES } from '@/lib/constants'
import { db } from '@/lib/firebase'
import { ref, set } from 'firebase/database'
import * as storage from '@/lib/storage'
import SketchButton from '@/components/ui/SketchButton'
import AddMoodModal from '@/components/modals/AddMoodModal'
import NestConfigModal from '@/components/modals/NestConfigModal'
import UserConfigModal from '@/components/modals/UserConfigModal'
import PhrasesModal from '@/components/modals/PhrasesModal'
import { Mood } from '@/lib/types'

export default function AppScreen() {
  const { state, dispatch, toast, saveSess, addSavedNest } = useApp()
  const { user, nest, customMoods, customPhrases, customDefaultMoods, savedNests, editMode } = state
  const { moods, images, loading } = usePartners(nest.code)
  const { requests, acceptReq, rejectReq } = useRequests(nest.code)
  useNestMeta(nest.code)

  const [addMoodOpen, setAddMoodOpen] = useState(false)
  const [nestCfgOpen, setNestCfgOpen] = useState(false)
  const [userCfgOpen, setUserCfgOpen] = useState(false)
  const [phrasesOpen, setPhrasesOpen] = useState(false)
  const [editingMoodIdx, setEditingMoodIdx] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const catEmoji = (id: string) => nestCategories.find(x => x.id === id)?.emoji || '🏡'
  const catLabel = (id: string) => nestCategories.find(x => x.id === id)?.label || 'Nido'

  function getBaseMoods(): Mood[] {
    if (!user) return []
    const base = JSON.parse(JSON.stringify(defaultMoods[user.gender] || defaultMoods['otro']))
    base.forEach((m: Mood, i: number) => {
      const key = user.gender + '_' + i
      if (customDefaultMoods[key]) {
        if (customDefaultMoods[key].emoji) m.emoji = customDefaultMoods[key].emoji
        if (customDefaultMoods[key].label) m.label = customDefaultMoods[key].label
      }
    })
    return base
  }
  const allMoods = () => [...getBaseMoods(), ...customMoods]
  const baseLen = () => getBaseMoods().length

  function getPhrase() {
    const day = new Date().getDay()
    const dayName = DAYS[day]
    const custom = customPhrases[dayName]
    if (custom?.trim()) return custom.trim()
    return DEFAULT_PHRASES[day % DEFAULT_PHRASES.length]
  }

  function selMood(i: number) {
    dispatch({ type: 'SET_MOOD', payload: nest.mood === i ? null : i })
  }

  function toggleEdit() {
    dispatch({ type: 'TOGGLE_EDIT_MODE' })
  }

  function delMood(i: number) {
    if (!user) return
    const newMoods = [...customMoods]
    newMoods.splice(i - baseLen(), 1)
    dispatch({ type: 'SET_CUSTOM_MOODS', payload: newMoods })
    storage.saveCustomMoods(user.userId, newMoods)
    if (nest.mood === i) dispatch({ type: 'SET_MOOD', payload: null })
  }

  function onImg(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) { toast('Imagen muy grande, máx 8MB'); return }
    const reader = new FileReader()
    reader.onerror = () => toast('Error leyendo imagen 😢')
    reader.onload = ev => {
      const img = new Image()
      img.onerror = () => toast('Error cargando imagen 😢')
      img.onload = () => {
        try {
          const c = document.createElement('canvas')
          let w = img.width, h = img.height
          const max = 600
          if (w > max || h > max) {
            if (w > h) { h = Math.round(h * max / w); w = max }
            else { w = Math.round(w * max / h); h = max }
          }
          c.width = w; c.height = h
          c.getContext('2d')!.drawImage(img, 0, 0, w, h)
          dispatch({ type: 'SET_IMG', payload: c.toDataURL('image/jpeg', 0.65) })
        } catch { toast('Error procesando imagen 😢') }
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function send() {
    if (nest.mood == null) { toast('Elige cómo late tu corazón 💕'); return }
    if (!user || !nest.code) return
    setSending(true)
    const m = allMoods()[nest.mood]
    const now = new Date()
    const data = {
      emoji: m.emoji, label: m.label, color: m.color, bg: m.bg,
      timestamp: Date.now(),
      timeStr: now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      dateStr: now.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' }),
      senderName: user.name, senderColor: user.color,
    }
    try {
      await set(ref(db, `homes/${nest.code}/moods/${user.userId}`), data)
      if (nest.img) {
        await set(ref(db, `homes/${nest.code}/images/${user.userId}`), { img: nest.img, timestamp: Date.now() })
      } else {
        await set(ref(db, `homes/${nest.code}/images/${user.userId}`), null)
      }
      toast('Enviado con amor 💕')
    } catch (err) { toast('Error: ' + (err as Error).message) }
    setSending(false)
  }

  function goHome() {
    saveSess(null, null)
    dispatch({ type: 'SET_SCREEN', payload: 'home' })
    dispatch({ type: 'SET_MOOD', payload: null })
    dispatch({ type: 'SET_IMG', payload: null })
  }

  async function openNest(i: number) {
    const n = savedNests[i]
    dispatch({ type: 'SET_NEST', payload: { code: n.code, role: n.role as 'creator' | 'guest' | 'member', name: n.name, cat: n.cat } })
    const { get: fbGet } = await import('firebase/database')
    try {
      const snap = await fbGet(ref(db, `homes/${n.code}`))
      if (snap.exists()) {
        const d = snap.val()
        dispatch({ type: 'SET_NEST', payload: { name: d.name, cat: d.category, maxM: d.maxMembers, members: d.members } })
      }
    } catch { /* ignore */ }
    dispatch({ type: 'SET_MOOD', payload: null })
    dispatch({ type: 'SET_IMG', payload: null })
    saveSess(n.code, n.role)
  }

  // Partner entries excluding current user
  const partnerEntries = Object.entries(moods).filter(([uid]) => uid !== user?.userId)
  const moodsList = allMoods()

  // --- RENDER SECTIONS ---
  const nestsPanel = (
    <div className="h-full overflow-y-auto p-3">
      <div className="font-caveat text-xl text-rose mb-3">Mis nidos</div>
      {savedNests.map((n, i) => (
        <div key={n.code}
          className={`flex items-center gap-2 bg-[#fffef9] border-2 rounded-xl px-3 py-2 mb-2 cursor-pointer transition-all ${nest.code === n.code ? 'border-rose bg-[#ffe0ec]' : 'border-ink'}`}
          style={{ boxShadow: nest.code === n.code ? '2px 2px 0 #c44569' : '2px 2px 0 #2d1b1b' }}
          onClick={() => openNest(i)}
        >
          <span className="text-xl">{catEmoji(n.cat)}</span>
          <div className="flex-1 min-w-0">
            <div className="font-caveat text-sm truncate">{n.name}</div>
            <div className="text-[0.65rem] text-muted">{catLabel(n.cat)}</div>
          </div>
        </div>
      ))}
      <SketchButton variant="primary" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'create' })} className="mt-2 text-sm !py-2">
        🏡 Crear nido
      </SketchButton>
      <SketchButton variant="ghost" onClick={goHome} className="mt-2 text-sm">← Inicio</SketchButton>
    </div>
  )

  const partnersPanel = (
    <div className="h-full overflow-y-auto p-3">
      <div className="text-center font-caveat text-base text-muted mb-2 cursor-pointer hover:text-rose transition-colors"
        onClick={() => setPhrasesOpen(true)}>
        {getPhrase()} ✏️
      </div>
      <div className="font-caveat text-base text-muted mb-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#6bcb77] inline-block animate-pulse" />
        Corazones del nido
      </div>
      {partnerEntries.length === 0 ? (
        <div className="border-[2.5px] border-ink rounded-2xl p-3.5 text-center bg-[#fff5f7] min-h-[90px] flex items-center justify-center"
          style={{ boxShadow: '3px 3px 0 #2d1b1b' }}>
          <div className="text-muted font-caveat text-base">Nadie ha compartido cómo se siente... 🌙</div>
        </div>
      ) : (
        <div className="md:grid md:grid-cols-2 md:gap-3 space-y-2 md:space-y-0">
          {partnerEntries.map(([uid, d]) => {
            const imgObj = images[uid]
            return (
              <div key={uid}
                className="border-[2.5px] border-ink rounded-2xl p-3.5 flex flex-col items-center text-center min-h-[90px] md:min-h-[140px] justify-center transition-colors"
                style={{ background: d.bg || '#fff5f7', boxShadow: '3px 3px 0 #2d1b1b', borderRadius: '16px 14px 18px 14px' }}
              >
                <div className="font-caveat text-xs mb-1" style={{ color: d.senderColor || '#ff6b9d' }}>
                  {d.senderName || 'Tu persona'}
                </div>
                {imgObj?.img && (
                  <img src={imgObj.img} alt="" className="w-full max-h-[110px] md:max-h-[160px] rounded-xl object-cover border-2 border-ink mb-2" />
                )}
                <div className="text-[2.4rem] md:text-[3rem] mb-1 animate-pop">{d.emoji}</div>
                <div className="font-caveat text-base font-semibold mb-0.5">{d.label}</div>
                <div className="text-xs text-muted">
                  {d.dateStr && d.timeStr ? `${d.dateStr} · ${d.timeStr}` : ''}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {requests.length > 0 && nest.role === 'creator' && (
        <div className="bg-[#fff0f5] border-2 border-rose rounded-xl p-2.5 mt-3 text-left">
          <div className="font-caveat text-base text-rose mb-2">💌 Solicitudes ({requests.length})</div>
          {requests.map(r => (
            <div key={r.userId} className="flex items-center justify-between mb-2 gap-2">
              <span className="font-caveat text-sm flex-1" style={{ color: r.color || '#ff6b9d' }}>
                {r.name} {r.gender === 'mujer' ? '🌸' : r.gender === 'hombre' ? '🌿' : '🦋'}
              </span>
              <div className="flex gap-1.5 shrink-0">
                <button className="bg-[#e8f8ec] border border-[#6bcb77] text-[#27ae60] px-2.5 py-1 rounded-lg font-caveat text-sm"
                  onClick={() => { acceptReq(r.userId, r.name, r.gender, r.color); toast(r.name + ' se unió 💕') }}>✓</button>
                <button className="bg-[#ffeaea] border border-[#ff7675] text-[#d63031] px-2.5 py-1 rounded-lg font-caveat text-sm"
                  onClick={() => rejectReq(r.userId)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const sendPanel = (
    <div className="h-full overflow-y-auto p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-caveat text-base text-muted">¿Cómo late tu corazón?</div>
        <button className="bg-[#fffef9] border border-ink text-muted font-caveat text-sm px-2.5 py-0.5 rounded-lg cursor-pointer"
          style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
          onClick={toggleEdit}>
          {editMode ? '✅ Listo' : '✏️ Editar'}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {moodsList.map((m, i) => (
          <button key={i}
            className={`aspect-square border-2 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all relative ${nest.mood === i ? 'border-rose' : 'border-ink'}`}
            style={{
              background: nest.mood === i ? m.color + '22' : '#fffef9',
              borderColor: nest.mood === i ? m.color : undefined,
              boxShadow: '2px 2px 0 #2d1b1b',
            }}
            onClick={() => !editMode && selMood(i)}
          >
            <span className="text-xl leading-none">{m.emoji}</span>
            <span className="font-caveat text-[0.6rem] text-muted text-center leading-tight px-0.5 max-w-full overflow-hidden">{m.label}</span>
            {editMode && (
              <button className="absolute -top-1.5 -left-1.5 w-[18px] h-[18px] rounded-full bg-[#74b9ff] border border-ink text-white text-[0.55rem] flex items-center justify-center z-10"
                onClick={(e) => { e.stopPropagation(); setEditingMoodIdx(i); setAddMoodOpen(true) }}>✎</button>
            )}
            {editMode && i >= baseLen() && (
              <button className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#ff7675] border border-ink text-white text-[0.55rem] flex items-center justify-center z-10"
                onClick={(e) => { e.stopPropagation(); delMood(i) }}>✕</button>
            )}
          </button>
        ))}
        <button
          className="aspect-square border-2 border-dashed border-rose rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          onClick={() => { setEditingMoodIdx(null); setAddMoodOpen(true) }}
        >
          <span className="text-xl text-rose leading-none">＋</span>
          <span className="font-caveat text-[0.6rem] text-rose">Nuevo</span>
        </button>
      </div>

      <div className="font-caveat text-base text-muted mb-2">Imagen (opcional)</div>
      {nest.img ? (
        <div className="relative w-full mb-3">
          <img src={nest.img} alt="" className="w-full max-h-[140px] rounded-xl object-cover border-2 border-ink" />
          <button className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#fffef9] border-2 border-ink cursor-pointer text-xs flex items-center justify-center"
            onClick={() => dispatch({ type: 'SET_IMG', payload: null })}>✕</button>
        </div>
      ) : (
        <label htmlFor="fi"
          className="flex flex-col border-2 border-dashed border-rose rounded-[14px] p-3.5 text-center cursor-pointer items-center gap-1 mb-3 bg-[#fff8fb] active:bg-[#ffe0ec]"
        >
          <div className="text-[1.7rem]">🖼️</div>
          <div className="font-caveat text-base text-muted">Toca para subir una foto</div>
        </label>
      )}
      <input type="file" id="fi" ref={fileRef} accept="image/*" className="hidden" onChange={onImg} />

      <button
        className="w-full px-4 py-3.5 border-[2.5px] border-ink bg-rose text-white font-caveat text-xl cursor-pointer flex items-center justify-center gap-2 transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: '14px 12px 16px 12px', boxShadow: '4px 4px 0 #2d1b1b' }}
        onClick={send}
        disabled={sending}
      >
        {sending ? 'Enviando... 💌' : 'Enviarle mi sentir 💕'}
      </button>

      <SketchButton variant="ghost" onClick={goHome} className="mt-2 md:hidden">← Mis nidos</SketchButton>
    </div>
  )

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-border bg-cream/90 backdrop-blur-sm shrink-0">
        <button className="w-9 h-9 border-2 border-ink rounded-full bg-[#fffef9] items-center justify-center cursor-pointer text-base hidden md:flex"
          style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
          onClick={goHome}>🏠</button>
        <button className="w-9 h-9 border-2 border-ink rounded-full bg-[#fffef9] flex md:hidden items-center justify-center cursor-pointer text-base"
          style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
          onClick={goHome}>🏠</button>
        <div className="font-caveat text-2xl text-rose flex-1 text-center">Valentin</div>
        <div className="flex items-center gap-2 bg-[#fff0f5] border-2 border-rose rounded-xl px-2 py-1 mx-2 max-w-[200px]">
          <span className="text-lg">{catEmoji(nest.cat)}</span>
          <div className="flex-1 min-w-0">
            <div className="font-caveat text-sm text-rose truncate">{nest.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 border-2 border-ink rounded-full bg-[#fffef9] flex items-center justify-center cursor-pointer text-base"
            style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
            onClick={() => setNestCfgOpen(true)}>⚙️</button>
          <button className="w-9 h-9 border-2 border-ink rounded-full bg-[#fffef9] flex items-center justify-center cursor-pointer text-base"
            style={{ boxShadow: '2px 2px 0 #2d1b1b' }}
            onClick={() => setUserCfgOpen(true)}>👤</button>
        </div>
      </div>

      {/* BODY */}
      {/* MOBILE LAYOUT */}
      <div className="flex-1 overflow-y-auto md:hidden">
        <div className="w-full max-w-[430px] mx-auto px-3.5 pt-2 pb-16">
          {partnersPanel}
          <div className="mt-4">{sendPanel}</div>
        </div>
      </div>

      {/* DESKTOP LAYOUT — 3 columns */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-64 border-r-2 border-border shrink-0 bg-cream/50">{nestsPanel}</div>
        <div className="flex-1 overflow-hidden">{partnersPanel}</div>
        <div className="w-80 border-l-2 border-border shrink-0 bg-cream/50">{sendPanel}</div>
      </div>

      {/* MODALS */}
      <AddMoodModal
        isOpen={addMoodOpen}
        onClose={() => { setAddMoodOpen(false); setEditingMoodIdx(null) }}
        editingIdx={editingMoodIdx}
        baseMoods={getBaseMoods()}
        allMoods={allMoods()}
        baseLen={baseLen()}
      />
      <NestConfigModal isOpen={nestCfgOpen} onClose={() => setNestCfgOpen(false)} requests={requests} acceptReq={acceptReq} rejectReq={rejectReq} />
      <UserConfigModal isOpen={userCfgOpen} onClose={() => setUserCfgOpen(false)} />
      <PhrasesModal isOpen={phrasesOpen} onClose={() => setPhrasesOpen(false)} />
    </div>
  )
}
