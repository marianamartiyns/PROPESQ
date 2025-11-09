
// src/pages/Dashboard.tsx - inicio
import React from 'react'
import StatCard from '@/components/StatCard'
import Card from '@/components/Card'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { projetos, relatorios, notificacoes } from '@/mock/data'
import '@/styles/Dashboard.css'

// ===== MOCKS GERENCIAIS (dados fakes para protótipo) =====
const estatisticas = {
  projetosAtivos: 124,
  bolsistas: 342,
  coordenadores: 58,
  editaisAbertos: 3,
}

const aprovadosPorMes = [
  { mes: 'Jan', aprovados: 8, reprovados: 2 },
  { mes: 'Fev', aprovados: 12, reprovados: 3 },
  { mes: 'Mar', aprovados: 20, reprovados: 4 },
  { mes: 'Abr', aprovados: 14, reprovados: 6 },
  { mes: 'Mai', aprovados: 22, reprovados: 8 },
  { mes: 'Jun', aprovados: 30, reprovados: 5 },
  { mes: 'Jul', aprovados: 25, reprovados: 10 },
  { mes: 'Ago', aprovados: 18, reprovados: 7 },
  { mes: 'Set', aprovados: 15, reprovados: 4 },
  { mes: 'Out', aprovados: 10, reprovados: 2 },
  { mes: 'Nov', aprovados: 6, reprovados: 1 },
  { mes: 'Dez', aprovados: 4, reprovados: 0 },
]

const bolsasPorArea = [
  { name: 'Exatas', value: 140 },
  { name: 'Humanas', value: 95 },
  { name: 'Saúde', value: 72 },
  { name: 'Tecnologia', value: 88 },
  { name: 'Biológicas', value: 54 },
]

const timeline = [
  { etapa: 'Submissão', progresso: 100 },
  { etapa: 'Avaliação', progresso: 75 },
  { etapa: 'Vigência', progresso: 40 },
  { etapa: 'Encerramento', progresso: 10 },
]

// Paleta de cores
const COLORS = ['#0077b6', '#00b4d8', '#90e0ef', '#ffb703', '#fb8500']

function getStatusClass(status: string) {
  const s = status.toLowerCase()
  if (s.includes('aprov')) return 'badge badge-green'
  if (s.includes('anál') || s.includes('anal')) return 'badge badge-blue'
  if (s.includes('pend')) return 'badge badge-amber'
  if (s.includes('reprov')) return 'badge badge-red'
  return 'badge badge-neutral'
}

export default function DashboardAdmin() {
  const pendentes = relatorios.filter(r => r.status === 'Pendente').length
  const proximos30d = projetos.filter(p => p.prazo).length

  return (
    <div className="dashboard-page">
      {/* TOPO */}
      <div className="page-header">
        <h1 className="page-title">Painel Administrativo</h1>
        <span className="pill pill-gold">Gestão Institucional de Pesquisa</span>
      </div>

      {/* MÉTRICAS RESUMIDAS */}
      <div className="cards-grid">
        <StatCard title="Projetos ativos" value={estatisticas.projetosAtivos} />
        <StatCard title="Bolsistas" value={estatisticas.bolsistas} />
        <StatCard title="Coordenadores" value={estatisticas.coordenadores} />
        <StatCard title="Editais abertos" value={estatisticas.editaisAbertos} />
        <StatCard title="Relatórios pendentes" value={pendentes} />
        <StatCard title="Prazos próximos (30d)" value={proximos30d} />
      </div>

      {/* LINHA DE 3 COLUNAS */}
      <div className="section-grid">
        {/* 1️⃣ Evolução de aprovações */}
        <Card title="Aprovações e Reprovações (Ano)">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aprovadosPorMes}>
                <defs>
                  <linearGradient id="gradAprov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="gradReprov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fill: 'var(--texto)' }} />
                <YAxis tick={{ fill: 'var(--texto)' }} />
                <Tooltip wrapperClassName="chart-tooltip" />
                <Area type="monotone" dataKey="aprovados" stroke="#10b981" fill="url(#gradAprov)" />
                <Area type="monotone" dataKey="reprovados" stroke="#ef4444" fill="url(#gradReprov)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2️⃣ Distribuição de bolsas */}
        <Card title="Distribuição de Bolsas por Área">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bolsasPorArea}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {bolsasPorArea.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3️⃣ Timeline do edital */}
        <Card title="Etapas do Edital Atual">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--azul)" stopOpacity={0.8}/>
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
      </div>

      {/* NOTIFICAÇÕES E PRAZOS */}
      <div className="section-grid mt-6">
        <Card title="Notificações Recentes">
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

        <Card title="Prazos Próximos">
          <ul className="stack">
            {projetos.slice(0, 6).map(p => (
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
