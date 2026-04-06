'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'
import { MoodData, ImageData } from '@/lib/types'

export function usePartners(code: string | null) {
  const [moods, setMoods] = useState<Record<string, MoodData>>({})
  const [images, setImages] = useState<Record<string, ImageData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    const moodsRef = ref(db, `homes/${code}/moods`)
    const imagesRef = ref(db, `homes/${code}/images`)

    const unsubMoods = onValue(moodsRef, snap => {
      setMoods(snap.val() || {})
      setLoading(false)
    })
    const unsubImages = onValue(imagesRef, snap => {
      setImages(snap.val() || {})
    })

    return () => {
      unsubMoods()
      unsubImages()
    }
  }, [code])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const aw = w.AndroidWidget as { updateMoodFull?: (e: string, l: string, t: string, s: string) => void; updateMood?: (e: string, l: string, t: string) => void } | undefined
    if (!aw) return
    const entries = Object.entries(moods)
    if (!entries.length) return
    const [, d] = entries[0]
    const dt = `${d.dateStr || ''} ${d.timeStr || ''}`
    if (aw.updateMoodFull) aw.updateMoodFull(d.emoji, d.label, dt, d.senderName || '')
    else if (aw.updateMood) aw.updateMood(d.emoji, d.label, dt)
  }, [moods])

  return { moods, images, loading }
}
