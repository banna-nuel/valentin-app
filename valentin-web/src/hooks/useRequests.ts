'use client'
import { useEffect, useState, useCallback } from 'react'
import { db } from '@/lib/firebase'
import { ref, onValue, set, update } from 'firebase/database'
import { RequestData, Member } from '@/lib/types'

export function useRequests(code: string | null) {
  const [requests, setRequests] = useState<RequestData[]>([])

  useEffect(() => {
    if (!code) return
    const reqRef = ref(db, `homes/${code}/requests`)
    const unsub = onValue(reqRef, snap => {
      const reqs = snap.val() || {}
      setRequests(Object.values(reqs).filter((r: unknown) =>
        (r as RequestData).status === 'pending'
      ) as RequestData[])
    })
    return () => unsub()
  }, [code])

  const acceptReq = useCallback(async (uid: string, name: string, gender: string, color: string) => {
    if (!code) return
    const member: Member = { name, gender, userId: uid, color, role: 'member' }
    await update(ref(db, `homes/${code}`), {
      [`members/${uid}`]: member,
      [`requests/${uid}/status`]: 'accepted',
    })
  }, [code])

  const rejectReq = useCallback(async (uid: string) => {
    if (!code) return
    await set(ref(db, `homes/${code}/requests/${uid}/status`), 'rejected')
  }, [code])

  return { requests, acceptReq, rejectReq }
}

export function useApprovalListener(code: string | null, userId: string | null, onAccepted: () => void, onRejected: () => void) {
  useEffect(() => {
    if (!code || !userId) return
    const statusRef = ref(db, `homes/${code}/requests/${userId}/status`)
    const unsub = onValue(statusRef, snap => {
      const st = snap.val()
      if (st === 'accepted') onAccepted()
      if (st === 'rejected') onRejected()
    })
    return () => unsub()
  }, [code, userId, onAccepted, onRejected])
}
