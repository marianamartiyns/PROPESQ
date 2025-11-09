// src/pages/EvaluationDetail.tsx - 

import React, { useState } from 'react'
import Card from '@/components/Card'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

export default function EvaluationDetail() {
  const { id } = useParams<{id: string}>()
  const [nota, setNota] = useState(8)
  const [parecer, setParecer] = useState('Projeto bem estruturado, metodologia adequada.')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title={`Projeto ${id} — Avaliação`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="label">Parecer qualitativo</div>
              <textarea className="input min-h-[140px]" value={parecer} onChange={e=>setParecer(e.target.value)}/>
            </div>
            <div>
              <div className="label">Nota (0–10)</div>
              <input type="number" className="input" min={0} max={10} value={nota} onChange={e=>setNota(+e.target.value)}/>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-gold">Salvar</button>
                <button className="btn btn-primary">Enviar parecer</button>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Documento submetido (PDF)">
          <div className="h-40 grid place-items-center bg-gray-50 rounded-xl">Pré‑visualização simulada</div>
        </Card>
      </div>
      <div>
        <Card title="Status">
          <div className="space-x-2">
            <span className="badge badge-blue">Em análise</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
