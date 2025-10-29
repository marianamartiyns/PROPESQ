import React from 'react'

export default function Card({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-ufpb-dark">{title}</h2>
        {actions}
      </div>
      <div>{children}</div>
    </section>
  )
}
