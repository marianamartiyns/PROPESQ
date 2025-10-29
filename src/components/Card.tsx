import React from 'react'

type CardProps = {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function Card({ title, children, actions, className }: CardProps) {
  return (
    <section className={`card ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-ufpb-dark">{title}</h2>
        {actions}
      </div>
      <div>{children}</div>
    </section>
  )
}
