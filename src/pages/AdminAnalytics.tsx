// src/pages/Dashboard.tsx
import React, { useState } from 'react'
import StatCard from '@/components/StatCard'
import Card from '@/components/Card'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid
} from 'recharts'
import '@/styles/Dashboard.css'

// ================= MOCKS ================= //
const AREAS = ['Exatas', 'Humanas', 'Saúde', 'Tecnologia', 'Biológicas']
const STATUS = ['Ativo', 'Concluído', 'Pendente']
const TIPOS_BOLSA = ['Iniciação', 'Mestrado', 'Doutorado']

const projetos = Array.from({length: 30}, (_, i) => ({
  id: i+1,
  titulo: `Projeto ${i+1}`,
  area: AREAS[i % AREAS.length],
  status: STATUS[i % STATUS.length],
  coordenador: `Coord ${i%5+1}`,
  prazo: `2025-${(i%12)+1}-15`,
  aprovados: Math.floor(Math.random() * 20),
  reprovados: Math.floor(Math.random() * 5),
}))

const bolsas = Array.from({length: 50}, (_, i) => ({
  id: i+1,
  area: AREAS[i % AREAS.length],
  tipo: TIPOS_BOLSA[i % TIPOS_BOLSA.length],
}))

const notificacoes = [
  { id: 1, texto: 'Prazo final para submissão de relatórios trimestrais', tipo: 'urgente' },
  { id: 2, texto: 'Edital de Inovação 2025 aberto para inscrições', tipo: 'info' },
  { id: 3, texto: 'Projeto de Extensão Interdisciplinar aprovado', tipo: 'sucesso' },
]

const COLORS = ['#0077b6', '#00b4d8', '#90e0ef', '#ffb703', '#fb8500']

// ================= Helper ================= //
function getStatusClass(status: string) {
  const s = status.toLowerCase()
  if (s.includes('pend')) return 'badge badge-amber'
  if (s.includes('and')) return 'badge badge-blue'
  if (s.includes('plan')) return 'badge badge-neutral'
  return 'badge badge-green'
}

// ================= COMPONENTE ================= //
export default function DashboardAdmin() {
  // filtros globais
  const [areaFiltro, setAreaFiltro] = useState<string | 'Todas'>('Todas')
  const [statusFiltro, setStatusFiltro] = useState<string | 'Todos'>('Todos')
  const [tipoBolsaFiltro, setTipoBolsaFiltro] = useState<string | 'Todos'>('Todos')

  const projetosFiltrados = projetos.filter(p => 
    (areaFiltro === 'Todas' || p.area === areaFiltro) &&
    (statusFiltro === 'Todos' || p.status === statusFiltro)
  )

  const bolsasFiltradas = bolsas.filter(b => 
    (areaFiltro === 'Todas' || b.area === areaFiltro) &&
    (tipoBolsaFiltro === 'Todos' || b.tipo === tipoBolsaFiltro)
  )

  // KPIs
  const estatisticas = {
    projetosAtivos: projetosFiltrados.filter(p => p.status==='Ativo').length,
    projetosConcluidos: projetosFiltrados.filter(p => p.status==='Concluído').length,
    bolsistas: bolsasFiltradas.length,
    editaisAbertos: 3,
    relatoriosPendentes: projetosFiltrados.filter(p => p.status==='Pendente').length,
    taxaConclusao: Math.round(
      (projetosFiltrados.filter(p => p.status==='Concluído').length / projetosFiltrados.length || 1) * 100
    )
  }

  // dados para gráficos
  const aprovadosPorMes = Array.from({length: 12}, (_, i) => {
    const mes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i]
    const mesData = projetosFiltrados.filter((_, idx) => idx % 12 === i)
    const aprovados = mesData.reduce((acc, p) => acc + p.aprovados,0)
    const reprovados = mesData.reduce((acc, p) => acc + p.reprovados,0)
    return { mes, aprovados, reprovados }
  })

  const bolsasPorArea = AREAS.map((a, i) => ({
    name: a,
    value: bolsasFiltradas.filter(b => b.area===a).length
  }))

  const progressoEdital = [
    { etapa: 'Submissão', progresso: 100 },
    { etapa: 'Avaliação', progresso: 75 },
    { etapa: 'Vigência', progresso: 40 },
    { etapa: 'Encerramento', progresso: 10 },
  ]

  return (
    <div className="dashboard-page">
      {/* TOPO */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Institucional</h1>
        <span className="pill pill-gold">Gestão Integrada de Pesquisa</span>
      </div>

      {/* FILTROS GLOBAIS */}
      <div className="filtros-grid">
        <select value={areaFiltro} onChange={e => setAreaFiltro(e.target.value)}>
          <option>Todas</option>
          {AREAS.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}>
          <option>Todos</option>
          {STATUS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={tipoBolsaFiltro} onChange={e => setTipoBolsaFiltro(e.target.value)}>
          <option>Todos</option>
          {TIPOS_BOLSA.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* MÉTRICAS */}
      <div className="cards-grid">
        <StatCard title="Projetos Ativos" value={estatisticas.projetosAtivos} />
        <StatCard title="Projetos Concluídos" value={estatisticas.projetosConcluidos} />
        <StatCard title="Bolsistas" value={estatisticas.bolsistas} />
        <StatCard title="Editais Abertos" value={estatisticas.editaisAbertos} />
        <StatCard title="Relatórios Pendentes" value={estatisticas.relatoriosPendentes} />
        <StatCard title="Taxa de Conclusão (%)" value={estatisticas.taxaConclusao} />
      </div>

      {/* GRÁFICOS */}
      <div className="section-grid">
        <Card title="Aprovações e Reprovações">
          <ResponsiveContainer width="100%" height={200}>
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
              <Tooltip wrapperClassName="chart-tooltip"/>
              <Area type="monotone" dataKey="aprovados" stroke="#10b981" fill="url(#gradAprov)" />
              <Area type="monotone" dataKey="reprovados" stroke="#ef4444" fill="url(#gradReprov)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Distribuição de Bolsas por Área">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={bolsasPorArea} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bolsasPorArea.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Progresso do Edital Atual">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressoEdital}>
              <defs>
                <linearGradient id="gradEdital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077b6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0077b6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="etapa" tick={{ fill: 'var(--texto)' }} />
              <YAxis domain={[0,100]} tick={{ fill: 'var(--texto)' }} />
              <Tooltip wrapperClassName="chart-tooltip"/>
              <Area type="monotone" dataKey="progresso" stroke="#00b4d8" fill="url(#gradEdital)" />
            </AreaChart>
          </ResponsiveContainer>
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

        <Card title="Projetos Filtrados">
          <ul className="stack">
            {projetosFiltrados.slice(0, 6).map(p => (
              <li key={p.id} className="row hover-lift">
                <div className="text-sm">
                  <div className="font-medium">{p.titulo}</div>
                  <div className="muted">{p.area} — {p.coordenador}</div>
                  <div className="muted">Prazo: {p.prazo}</div>
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
