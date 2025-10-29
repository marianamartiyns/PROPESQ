import React from 'react'
import StatCard from '@/components/StatCard'
import Card from '@/components/Card'
import { projetos, relatorios, notificacoes } from '@/mock/data'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import '@/styles/dashboard.css'

const timeline = [
  { etapa: 'Submissão', progresso: 100 },
  { etapa: 'Avaliação', progresso: 60 },
  { etapa: 'Vigência', progresso: 20 },
  { etapa: 'Encerramento', progresso: 0 },
]

// mapeia status -> cor padronizada
function getStatusClass(status: string) {
  const s = status.toLowerCase()
  if (s.includes('aprov')) return 'badge badge-green'
  if (s.includes('anál') || s.includes('anal')) return 'badge badge-blue'
  if (s.includes('pend')) return 'badge badge-amber'
  if (s.includes('reprov')) return 'badge badge-red'
  return 'badge badge-neutral'
}

export default function Dashboard() {
  const ativos = projetos.filter(p => ['Em análise', 'Aprovado'].includes(p.status)).length
  const pendentes = relatorios.filter(r => r.status === 'Pendente').length
  const proximos30d = projetos.filter(p => p.prazo).length

  return (
    <div className="dashboard-page">
      {/* topo resumido */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="pill pill-gold">PIBIC • UFPB</span>
      </div>

      {/* métricas rápidas */}
      <div className="cards-grid">
        <div className="card-animate"><StatCard title="Projetos ativos" value={ativos} /></div>
        <div className="card-animate"><StatCard title="Relatórios pendentes" value={pendentes} /></div>
        <div className="card-animate"><StatCard title="Prazos próximos (30d)" value={proximos30d} /></div>
      </div>

      {/* linha de 3 colunas */}
      <div className="section-grid">
        <Card title="Timeline do Edital">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} className="chart">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--azul)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--azul)" stopOpacity={0.08}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="etapa" tick={{ fill: 'var(--texto)' }} />
                <YAxis domain={[0,100]} tick={{ fill: 'var(--texto)' }} />
                <Tooltip wrapperClassName="chart-tooltip" />
                <Area type="monotone" dataKey="progresso" stroke="var(--azul-claro)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Notificações">
          <ul className="stack">
            {notificacoes.map(n => (
              <li key={n.id} className="row-soft hover-lift">
                <span className="text-sm">{n.texto}</span>
                <span className={n.tipo === 'urgente' ? 'badge badge-red pulse' : 'badge badge-gold'}>
                  {n.tipo}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Prazos próximos">
          <ul className="stack">
            {projetos.map(p => (
              <li key={p.id} className="row hover-lift">
                <div className="text-sm">
                  <div className="font-medium">{p.titulo}</div>
                  <div className="muted">Prazo: {p.prazo ?? '—'}</div>
                </div>
                <span className={getStatusClass(p.status)}>{p.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
