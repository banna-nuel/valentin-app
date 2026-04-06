'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface Props { onFinish: () => void }

export default function Splash({ onFinish }: Props) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 2300)
    const t2 = setTimeout(onFinish, 2950)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFinish])

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream transition-opacity duration-[650ms] ${out ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <Image
        src="/logo.jpg"
        alt="Valentin"
        width={150}
        height={150}
        className="object-contain animate-spBounce"
        priority
      />
      <div className="font-caveat text-[3.6rem] text-rose animate-fadeUp leading-none" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        Valentin
      </div>
      <div className="font-caveat text-lg text-muted animate-fadeUp" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
        donde dos corazones se encuentran 💕
      </div>
    </div>
  )
}
