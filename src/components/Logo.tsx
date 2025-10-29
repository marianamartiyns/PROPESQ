import React from 'react'

export default function Logo({ short = false }: { short?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-ufpb-gold" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-white">UFPB</span>
        {!short && <span className="text-[10px] text-white/80">PROPESQ</span>}
      </div>
    </div>
  )
}
