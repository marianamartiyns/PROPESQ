import React, { useMemo, useState } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import { planos, projetos } from '@/mock/data'
import { Link } from 'react-router-dom'
import '@/styles/Plans.css'

type RoleType = 'DISCENTE' | 'COORDENADOR' | 'ADMINISTRADOR'

function getCurrentRole(): RoleType {
  if (typeof window !== 'undefined' && (window as any).__ROLE__) {
    return String((window as any).__ROLE__).toUpperCase() as RoleType
  }
  const fromLS = (typeof window !== 'undefined' && window.localStorage)
    ? localStorage.getItem('role')
    : null
  const normalized = (fromLS || 'DISCENTE').toUpperCase()
  return (['DISCENTE', 'COORDENADOR', 'ADMINISTRADOR'].includes(normalized)
    ? normalized
    : 'DISCENTE') as RoleType
}

// Badge color por status
const statusClass = (status: string) => {
  const s = status.toLowerCase()
  if (s.includes('andamento')) return 'badge badge-amber'
  if (s.includes('finaliz')) return 'badge badge-green'
  if (s.includes('aguard') || s.includes('resumo')) return 'badge badge-gray'
  if (s.includes('aprov')) return 'badge badge-emerald' // cor verde mais forte
  if (s.includes('pend') || s.includes('anál') || s.includes('analise')) return 'badge badge-amber'
  if (s.includes('reprov') || s.includes('indefer')) return 'badge badge-red'
  return 'badge badge-gray'
}

// Truncar texto longo
const truncate = (txt: string, n = 80) => (txt?.length > n ? `${txt.slice(0, n)}…` : txt || '—')

// Função auxiliar de filtragem de status
function matchStatusFilter(statusProjeto: string, filtro: string): boolean {
  const s = statusProjeto.toLowerCase()
  switch (filtro) {
    case 'andamento': return s.includes('andamento')
    case 'finalizado': return s.includes('finaliz')
    case 'aguardando': return s.includes('aguard') || s.includes('resumo')
    case 'aprovado': return s.includes('aprov')
    default: return true
  }
}

export default function Plans() {
  const role = getCurrentRole()
  const canCreate = role === 'COORDENADOR' || role === 'ADMINISTRADOR'

  // Dados base com junção de informações
  const baseData = useMemo(() => {
    return planos.map(pl => {
      const projeto = projetos.find(p => p.id === pl.projetoId)
      return {
        ...pl,
        codigo: pl.id,
        titulo: projeto?.titulo ?? '—',
        discente: 'Aluno Exemplo',
        orientador: 'Prof. Dr. Fulano de Tal',
        mobilidade: projeto?.area?.includes('Computação') ? 'Remota' : 'Presencial',
        statusProjeto: projeto?.status ?? 'Em andamento',
      }
    })
  }, [])

  // Estado de filtros
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | 'andamento' | 'finalizado' | 'aguardando' | 'aprovado'>('all')

  // Filtro principal
  const filtered = useMemo(() => {
    return baseData.filter(d => {
      const hitsText =
        d.codigo.toLowerCase().includes(q.toLowerCase()) ||
        d.titulo.toLowerCase().includes(q.toLowerCase()) ||
        d.discente.toLowerCase().includes(q.toLowerCase()) ||
        d.orientador.toLowerCase().includes(q.toLowerCase())

      const hitsStatus = matchStatusFilter(d.statusProjeto, status)

      return hitsText && hitsStatus
    })
  }, [baseData, q, status])

  return (
    <Card title="Planos de Trabalho">
      <div className="page-plans">
        <div className="plans-header">

          {/* Busca */}
          <div className="search-wrap">
            <label className="select search">
              <span>Buscar</span>
              <input
                type="text"
                placeholder="Buscar por código, título ou participante…"
                value={q}
                onChange={e => setQ(e.target.value)}
                aria-label="Buscar planos"
              />
            </label>
          </div>

          {/* Botão + Novo Plano (somente coordenador/admin) */}
          <div className="actions">
            {canCreate ? (
              <Link to="/novo-plano" className="btn btn-gold">+ Novo Plano</Link>
            ) : null}
          </div>

          {/* Filtros */}
          <div className="selects">
            <label className="select">
              <span>Status</span>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                aria-label="Filtrar por status"
              >
                <option value="all">Todos</option>
                <option value="andamento">Em andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="aguardando">Aguardando resumo</option>
                <option value="aprovado">Aprovado</option>
              </select>
            </label>
          </div>
        </div>

        {/* Tabela */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">Nenhum plano encontrado</div>
            <div className="empty-subtitle">
              Ajuste os filtros ou tente outro termo de busca.
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <Table
              data={filtered}
              cols={[
                { key: 'codigo', header: 'Código', render: (r: any) => <span className="mono">{r.codigo}</span> },
                { key: 'titulo', header: 'Título', render: (r: any) => <span className="proj-ttl" title={r.titulo}>{truncate(r.titulo, 60)}</span> },
                { key: 'discente', header: 'Discente' },
                { key: 'orientador', header: 'Orientador' },
                { key: 'mobilidade', header: 'Mobilidade' },
                {
                  key: 'statusProjeto',
                  header: 'Status',
                  render: (r: any) => (
                    <span className={statusClass(r.statusProjeto)}>{r.statusProjeto}</span>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
