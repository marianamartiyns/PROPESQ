import React, { useMemo } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import { projetos } from '@/mock/data'
import { useAuth } from '@/context/AuthContext'
import '@/styles/MyProjects.css'
import { Helmet } from 'react-helmet'

const statusClass = (status: string) => {
  const s = status?.toLowerCase?.() || ''
  if (s.includes('aprov')) return 'badge badge-green'
  if (s.includes('pend') || s.includes('anál') || s.includes('analise') || s.includes('em análise')) return 'badge badge-amber'
  if (s.includes('reprov') || s.includes('indefer')) return 'badge badge-red'
  return 'badge badge-gray'
}

const truncate = (txt: string, n = 80) => (txt?.length > n ? `${txt.slice(0, n)}…` : txt || '—')

export default function MyProjects() {
  const { user } = useAuth()
  const role = user?.role?.toUpperCase?.() || ''

  const filtered = useMemo(() => {
    // Gera dados simulando função, carga horária e datas
    return projetos.map(p => {
      let funcao = '—'
      let ch = '—'
      let inicio = '—'
      let fim = '—'

      if (role === 'COORDENADOR') {
        funcao = 'Coordenador'
        ch = '40h'
        inicio = '2025-03-01'
        fim = '2025-12-31'
      } else if (role === 'DISCENTE') {
        funcao = p.bolsistas > 0 ? 'Bolsista' : 'Voluntário'
        ch = p.bolsistas > 0 ? '20h' : '10h'
        inicio = '2025-04-01'
        fim = '2025-11-30'
      }

      return { ...p, funcao, ch, inicio, fim }
    })
  }, [role])

  const titulo =
    role === 'COORDENADOR'
      ? 'Projetos que Coordeno'
      : 'Projetos em que Participo'

  return (
    <div className="page-myprojects">
      <Card title={titulo}>
        <div className="projects-list-section">

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">Nenhum projeto encontrado</div>
              <div className="empty-subtitle">
                Você ainda não participa de nenhum projeto.
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <Table
                data={filtered}
                cols={[
                  { key: 'id', header: 'Código', render: (r: any) => <span className="mono">{r.id}</span> },
                  {
                    key: 'titulo',
                    header: 'Título',
                    render: (r: any) => (
                      <span className="proj-ttl" title={r.titulo}>
                        {truncate(r.titulo, 60)}
                      </span>
                    ),
                  },
                  { key: 'funcao', header: 'Função' },
                  { key: 'ch', header: 'CH' },
                  { key: 'inicio', header: 'Início' },
                  { key: 'fim', header: 'Fim' },
                  {
                    key: 'status',
                    header: 'Situação',
                    render: (r: any) => (
                      <span className={statusClass(r.status)}>{r.status}</span>
                    ),
                  },
                  { key: 'prazo', header: 'Prazo' },
                ]}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
