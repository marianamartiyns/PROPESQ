// src/pages/AdminAnalytics.tsx - painel gerencial

import React, { useState } from 'react'
import StatCard from '@/components/StatCard'
import Card from '@/components/Card'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid
} from 'recharts'
import '@/styles/AdminAnalytics.css'
import { Helmet } from 'react-helmet'

// ================= MOCKS ================= //
const AREAS = ['Exatas', 'Humanas', 'Saúde', 'Tecnologia', 'Biológicas']
const STATUS = ['Submissão', 'Em avaliação', 'Aprovado', 'Em andamento', 'Concluído']
const TIPOS_BOLSA = ['Iniciação Científica', 'Mestrado', 'Doutorado', 'Extensão']

// Projetos fakes
const projetos = Array.from({length: 50}, (_, i) => ({
  id: i+1,
  titulo: `Projeto ${i+1}`,
  area: AREAS[i % AREAS.length],
  status: STATUS[i % STATUS.length],
  coordenador: `Coord ${i%7+1}`,
  prazo: `2025-${(i%12)+1}-20`,
  aprovados: Math.floor(Math.random()*20),
  reprovados: Math.floor(Math.random()*5),
  resumos: Math.floor(Math.random()*5),
  certificados: Math.floor(Math.random()*3),
}))

// Bolsistas fakes
const bolsas = Array.from({length: 60}, (_, i) => ({
  id: i+1,
  area: AREAS[i % AREAS.length],
  tipo: TIPOS_BOLSA[i % TIPOS_BOLSA.length],
}))

const notificacoes = [
  { id:1, texto:'Prazo final para submissão de relatórios', tipo:'urgente' },
  { id:2, texto:'Novo edital aberto: Inovação 2025', tipo:'info' },
  { id:3, texto:'Certificados de projetos emitidos', tipo:'sucesso' },
]

const COLORS = ['#0077b6','#00b4d8','#90e0ef','#ffb703','#fb8500']

function getStatusClass(status:string){
  const s = status.toLowerCase()
  if(s.includes('pend') || s.includes('sub')) return 'badge badge-amber'
  if(s.includes('and') || s.includes('aval')) return 'badge badge-blue'
  if(s.includes('aprov')) return 'badge badge-green'
  if(s.includes('conc')) return 'badge badge-purple'
  return 'badge badge-neutral'
}

// ================= COMPONENTE ================= //
export default function DashboardAdminPIBIC(){
  const [areaFiltro,setAreaFiltro] = useState<string|'Todas'>('Todas')
  const [statusFiltro,setStatusFiltro] = useState<string|'Todos'>('Todos')
  const [tipoBolsaFiltro,setTipoBolsaFiltro] = useState<string|'Todos'>('Todos')

  const projetosFiltrados = projetos.filter(p =>
    (areaFiltro==='Todas' || p.area===areaFiltro) &&
    (statusFiltro==='Todos' || p.status===statusFiltro)
  )

  const bolsasFiltradas = bolsas.filter(b =>
    (areaFiltro==='Todas' || b.area===areaFiltro) &&
    (tipoBolsaFiltro==='Todos' || b.tipo===tipoBolsaFiltro)
  )

  // KPIs
  const estatisticas = {
    projetosAtivos: projetosFiltrados.filter(p=>p.status==='Em andamento').length,
    projetosConcluidos: projetosFiltrados.filter(p=>p.status==='Concluído').length,
    resumosEnviados: projetosFiltrados.reduce((acc,p)=>acc+p.resumos,0),
    certificadosEmitidos: projetosFiltrados.reduce((acc,p)=>acc+p.certificados,0),
    bolsistasAtivos: bolsasFiltradas.length,
    editaisAbertos:3,
    taxaAprovacao: Math.round(
      projetosFiltrados.reduce((acc,p)=>acc+p.aprovados,0)/
      (projetosFiltrados.reduce((acc,p)=>acc+p.aprovados+p.reprovados,0)||1)*100
    )
  }

  // Dados gráficos
  const aprovadosPorMes = Array.from({length:12},(_,i)=>{
    const mes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i]
    const mesData = projetosFiltrados.filter((_,idx)=>idx%12===i)
    return {
      mes,
      aprovados: mesData.reduce((acc,p)=>acc+p.aprovados,0),
      reprovados: mesData.reduce((acc,p)=>acc+p.reprovados,0),
      resumos: mesData.reduce((acc,p)=>acc+p.resumos,0),
      certificados: mesData.reduce((acc,p)=>acc+p.certificados,0)
    }
  })

  const bolsasPorArea = AREAS.map((a,i)=>({
    name:a,
    value: bolsasFiltradas.filter(b=>b.area===a).length
  }))

  const progressoEdital = [
    {etapa:'Submissão', progresso:100},
    {etapa:'Avaliação', progresso:75},
    {etapa:'Vigência', progresso:40},
    {etapa:'Encerramento', progresso:10},
  ]

  return (
    <div className="dashboard-page">

      <Helmet>
        <title>Dashboard Administrativo</title>
        <link rel="icon" type="image/png" href="/src/styles/imgs/favicon-32x32.png" />
      </Helmet>

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Dashboard Administrativo PIBIC</h1>
      </div>

      {/* FILTROS GLOBAIS */}
      <div className="filtros-grid">
        <select value={areaFiltro} onChange={e=>setAreaFiltro(e.target.value)}>
          <option>Todas</option>
          {AREAS.map(a=><option key={a}>{a}</option>)}
        </select>
        <select value={statusFiltro} onChange={e=>setStatusFiltro(e.target.value)}>
          <option>Todos</option>
          {STATUS.map(s=><option key={s}>{s}</option>)}
        </select>
        <select value={tipoBolsaFiltro} onChange={e=>setTipoBolsaFiltro(e.target.value)}>
          <option>Todos</option>
          {TIPOS_BOLSA.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>

      {/* CARDS KPI */}
      <div className="cards-grid">
        <StatCard title="Projetos em andamento" value={estatisticas.projetosAtivos}/>
        <StatCard title="Projetos concluídos" value={estatisticas.projetosConcluidos}/>
        <StatCard title="Resumos enviados" value={estatisticas.resumosEnviados}/>
        <StatCard title="Certificados emitidos" value={estatisticas.certificadosEmitidos}/>
        <StatCard title="Bolsistas ativos" value={estatisticas.bolsistasAtivos}/>
        <StatCard title="Editais abertos" value={estatisticas.editaisAbertos}/>
        <StatCard title="Taxa de aprovação (%)" value={estatisticas.taxaAprovacao}/>
      </div>

      {/* GRÁFICOS */}
      <div className="section-grid">
        {/* Aprovações / reprovações */}
        <Card title="Aprovações e Reprovações por Mês">
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
              <XAxis dataKey="mes" tick={{fill:'var(--texto)'}}/>
              <YAxis tick={{fill:'var(--texto)'}}/>
              <Tooltip wrapperClassName="chart-tooltip"/>
              <Area type="monotone" dataKey="aprovados" stroke="#10b981" fill="url(#gradAprov)"/>
              <Area type="monotone" dataKey="reprovados" stroke="#ef4444" fill="url(#gradReprov)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Bolsas por área */}
        <Card title="Distribuição de Bolsas por Área">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={bolsasPorArea} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bolsasPorArea.map((_,i)=><Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Legend/>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Progresso Edital */}
        <Card title="Progresso do Edital Atual">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressoEdital}>
              <defs>
                <linearGradient id="gradEdital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077b6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0077b6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="etapa" tick={{fill:'var(--texto)'}}/>
              <YAxis domain={[0,100]} tick={{fill:'var(--texto)'}}/>
              <Tooltip wrapperClassName="chart-tooltip"/>
              <Area type="monotone" dataKey="progresso" stroke="#00b4d8" fill="url(#gradEdital)"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* NOTIFICAÇÕES E PROJETOS */}
      <div className="section-grid mt-6">
        <Card title="Notificações Recentes">
          <ul className="stack">
            {notificacoes.map(n=>(
              <li key={n.id} className="row-soft hover-lift">
                <span className="text-sm">{n.texto}</span>
                <span className={n.tipo==='urgente'?'badge badge-red pulse':'badge badge-gold'}>{n.tipo}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Projetos Filtrados (Resumo)">
          <ul className="stack">
            {projetosFiltrados.slice(0,8).map(p=>(
              <li key={p.id} className="row hover-lift">
                <div className="text-sm">
                  <div className="font-medium">{p.titulo}</div>
                  <div className="muted">{p.area} — {p.coordenador}</div>
                  <div className="muted">Prazo: {p.prazo}</div>
                  <div className="muted">Resumos: {p.resumos} | Certificados: {p.certificados}</div>
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

