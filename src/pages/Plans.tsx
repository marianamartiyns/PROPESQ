// src/pages/Plans.tsx
import React, { useMemo, useState } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import { planos, projetos } from '@/mock/data'
import { Link } from 'react-router-dom'
import '@/styles/plans.css'

type RoleType = 'discente' | 'docente' | 'servidor'

function getCurrentRole(): RoleType {
  if (typeof window !== 'undefined' && (window as any).__ROLE__) {
    return String((window as any).__ROLE__).toLowerCase() as RoleType
  }
  const fromLS = (typeof window !== 'undefined' && window.localStorage)
    ? localStorage.getItem('role')
    : null
  const normalized = (fromLS || 'discente').toLowerCase()
  return (['docente', 'discente', 'coordenador', 'admin'].includes(normalized)
    ? normalized
    : 'discente') as RoleType
}

const statusClass = (status: string) => {
  const s = status.toLowerCase()
  if (s.includes('aprov')) return 'badge badge-green'
  if (s.includes('pend') || s.includes('em análise')) return 'badge badge-amber'
  if (s.includes('reprov') || s.includes('indefer')) return 'badge badge-red'
  return 'badge badge-gray'
}

const truncate = (txt: string, n = 90) => (txt?.length > n ? `${txt.slice(0, n)}…` : txt || '—')

export default function Plans() {
  const role = getCurrentRole()
  const canCreate = role === 'docente' || role === 'servidor'

  // monta data com título do projeto resolvido
  const baseData = useMemo(() => {
    return planos.map(pl => ({
      ...pl,
      projetoTitulo: projetos.find(p => p.id === pl.projetoId)?.titulo ?? pl.projetoId
    }))
  }, [])

  // UI state (busca + filtros)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | 'aprovado' | 'pendente' | 'reprovado'>('all')
  const [proj, setProj] = useState<'all' | string>('all')

  // opções de filtros
  const projetosOpts = useMemo(() => {
    const set = new Set<string>()
    baseData.forEach(d => set.add(d.projetoTitulo))
    return Array.from(set)
  }, [baseData])

  const filtered = useMemo(() => {
    return baseData.filter(d => {
      const hitsText =
        (d.projetoTitulo || '').toLowerCase().includes(q.toLowerCase()) ||
        (d.metas || '').toLowerCase().includes(q.toLowerCase()) ||
        (d.cronograma || '').toLowerCase().includes(q.toLowerCase()) ||
        String(d.id).includes(q)

      const hitsStatus =
        status === 'all'
          ? true
          : status === 'aprovado'
            ? d.status.toLowerCase().includes('aprov')
            : status === 'pendente'
              ? d.status.toLowerCase().includes('pend') || d.status.toLowerCase().includes('anál')
              : d.status.toLowerCase().includes('reprov') || d.status.toLowerCase().includes('indef')

      const hitsProj = proj === 'all' ? true : d.projetoTitulo === proj

      return hitsText && hitsStatus && hitsProj
    })
  }, [baseData, q, status, proj])

return (
  <Card title="Planos de Trabalho">
    <div className="page-plans">
      <div className="plans-header">
        {/* Linha 1: Busca */}
        <div className="search-wrap">
          <label className="select search">
            <span>Buscar</span>
            <input
              type="text"
              placeholder="Buscar por ID, projeto, metas ou cronograma…"
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Buscar planos"
            />
          </label>
        </div>

        <div className="actions">
          {canCreate ? (
            <Link to="/novo-plano" className="btn btn-gold">+ Novo Plano</Link>
          ) : null}
        </div>

        {/* Linha 2: Selects */}
        <div className="selects">
          <label className="select">
            <span>Status</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              aria-label="Filtrar por status"
            >
              <option value="all">Todos</option>
              <option value="aprovado">Aprovado</option>
              <option value="pendente">Pendente / Em análise</option>
              <option value="reprovado">Reprovado / Indeferido</option>
            </select>
          </label>

          <label className="select">
            <span>Projeto</span>
            <select
              value={proj}
              onChange={e => setProj(e.target.value)}
              aria-label="Filtrar por projeto"
            >
              <option value="all">Todos</option>
              {projetosOpts.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">Nenhum plano encontrado</div>
          <div className="empty-subtitle">Ajuste os filtros ou tente outro termo de busca.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <Table
            data={filtered}
            cols={[
              { key: 'id', header: 'ID', render: (r: any) => <span className="mono">{r.id}</span> },
              { key: 'projetoTitulo', header: 'Projeto', render: (r: any) => <span className="proj-ttl" title={r.projetoTitulo}>{truncate(r.projetoTitulo, 60)}</span> },
              { key: 'metas', header: 'Metas', render: (r: any) => <span className="muted" title={r.metas}>{truncate(r.metas, 80)}</span> },
              { key: 'cronograma', header: 'Cronograma', render: (r: any) => <span className="muted" title={r.cronograma}>{truncate(r.cronograma, 80)}</span> },
              { key: 'status', header: 'Status', render: (r: any) => <span className={statusClass(r.status)}>{r.status}</span> },
            ]}
          />
        </div>
      )}
    </div>
  </Card>
)
}
