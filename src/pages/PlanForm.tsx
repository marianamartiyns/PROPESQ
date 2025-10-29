import React from 'react'
import Card from '@/components/Card'
import { projetos } from '@/mock/data'

export default function PlanForm() {
  return (
    <Card title="Cadastro de Plano de Trabalho (Discente)">
      <form className="space-y-3">
        <div>
          <label className="label">Projeto vinculado</label>
          <select className="input">
            {projetos.map(p => <option key={p.id} value={p.id}>{p.id} — {p.titulo}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Metas</label>
          <textarea className="input min-h-[100px]"/>
        </div>
        <div>
          <label className="label">Cronograma</label>
          <textarea className="input min-h-[100px]"/>
        </div>
        <div>
          <label className="label">Metodologia</label>
          <textarea className="input min-h-[100px]"/>
        </div>
        <div>
          <label className="label">Plano em PDF</label>
          <input type="file" className="input"/>
        </div>
        <button className="btn btn-primary">Enviar para aprovação</button>
      </form>
    </Card>
  )
}
