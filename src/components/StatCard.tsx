import React from 'react'

export default function StatCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-ufpb-blue">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </div>
  )
}
