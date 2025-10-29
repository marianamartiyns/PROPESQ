import React from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import { projetos } from '@/mock/data'
import { Link } from 'react-router-dom'
import '@/styles/Evaluations.css'

export default function Evaluations() {
  const atribuídos = projetos.filter(p =>
    ['Em análise', 'Enviado', 'Rascunho'].includes(p.status)
  )

  return (
    <div className="page-evaluations">
      <Card title="Avaliação de Projetos">
          <Table
            data={atribuídos.map(p => ({
              ...p,
              titulo: 'Título oculto',
              orientador: '—',
              discente: '—',
            }))}
            cols={[
              { key: 'id', header: 'ID' },
              { key: 'titulo', header: 'Projeto' },
              {
                key: 'status',
                header: 'Status',
                render: (r: any) => (
                  <span className="badge badge-gray">{r.status}</span>
                ),
              },
              { key: 'area', header: 'Área' },
              { key: 'centro', header: 'Centro' },
              {
                key: 'id',
                header: 'Ação',
                render: (r: any) => (
                  <Link className="btn btn-gold" to={`/avaliacoes/${r.id}`}>
                    Avaliar
                  </Link>
                ),
              },
            ]}
          />
      </Card>
    </div>
  )
}
