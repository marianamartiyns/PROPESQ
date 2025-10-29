import React from 'react'
import Card from '@/components/Card'

const etapas = [
  { nome: 'Submissão', data: '2025-09-01', done: true },
  { nome: 'Avaliação', data: '2025-10-10', done: true },
  { nome: 'Vigência', data: '2025-10-20', done: false },
  { nome: 'Encerramento', data: '2026-08-31', done: false },
]

export default function Monitoring() {
  return (
    <Card title="Acompanhamento e Vigência">
      <ol className="relative border-s-2 border-ufpb-blue/20 pl-6 space-y-4">
        {etapas.map((e, i) => (
          <li key={i}>
            <div className={`absolute -left-2 top-0 h-4 w-4 rounded-full ${e.done ? 'bg-ufpb-gold' : 'bg-gray-300'}`} />
            <div className="text-sm font-medium">{e.nome}</div>
            <div className="text-xs text-gray-500">{e.data}</div>
          </li>
        ))}
      </ol>
      <div className="mt-4 text-sm text-gray-600">Histórico de alterações disponível no detalhe do projeto.</div>
    </Card>
  )
}
