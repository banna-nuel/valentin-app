'use client'
import { useEffect } from 'react'
import { db } from '@/lib/firebase'
import { ref, onValue } from 'firebase/database'
import { useApp } from '@/lib/AppContext'

export function useNestMeta(code: string | null) {
  const { dispatch } = useApp()

  useEffect(() => {
    if (!code) return
    const nameRef = ref(db, `homes/${code}/name`)
    const catRef = ref(db, `homes/${code}/category`)
    const membersRef = ref(db, `homes/${code}/members`)

    const unsub1 = onValue(nameRef, snap => {
      if (snap.val()) dispatch({ type: 'SET_NEST', payload: { name: snap.val() } })
    })
    const unsub2 = onValue(catRef, snap => {
      if (snap.val()) dispatch({ type: 'SET_NEST', payload: { cat: snap.val() } })
    })
    const unsub3 = onValue(membersRef, snap => {
      if (snap.val()) dispatch({ type: 'SET_NEST', payload: { members: snap.val() } })
    })

    return () => { unsub1(); unsub2(); unsub3() }
  }, [code, dispatch])
}
