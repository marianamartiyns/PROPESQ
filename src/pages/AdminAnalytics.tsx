import React from 'react'
import Card from '@/components/Card'
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import '@/styles/AdminAnalytics.css'

/* ================== DADOS MOCK ================== */
const porCentro = [
  { nome:'CCEN', projetos: 12 },
  { nome:'CCS',  projetos: 18 },
  { nome:'CCT',  projetos: 7  },
  { nome:'CE',   projetos: 9  },
]
const areas = [
  { nome:'Computação', valor: 22 },
  { nome:'Medicina',   valor: 15 },
  { nome:'Biologia',   valor: 12 },
  { nome:'Educação',   valor: 8  },
]
const bolsas = [
  { tipo:'CNPq',      valor: 14 },
  { tipo:'UFPB',      valor: 20 },
  { tipo:'Voluntário',valor: 12 },
]
const porMes = [
  { mes:'Jan', submissoes: 8,  aprovados: 5 },
  { mes:'Fev', submissoes: 10, aprovados: 6 },
  { mes:'Mar', submissoes: 12, aprovados: 8 },
  { mes:'Abr', submissoes: 9,  aprovados: 6 },
  { mes:'Mai', submissoes: 14, aprovados: 9 },
  { mes:'Jun', submissoes: 11, aprovados: 7 },
]
const statusPorCentro = [
  { nome:'CCEN', enviados:6, analise:4, aprovados:2 },
  { nome:'CCS',  enviados:7, analise:7, aprovados:4 },
  { nome:'CCT',  enviados:3, analise:3, aprovados:1 },
  { nome:'CE',   enviados:4, analise:3, aprovados:2 },
]
const statusDistrib = [
  { name:'Enviado',    value: 20, fill:'#8c8c8c' },
  { name:'Em análise', value: 17, fill:'#0050B3' },
  { name:'Aprovado',   value: 9,  fill:'#22c55e' },
  { name:'Negado',     value: 6,  fill:'#ef4444' },
]
const criteriosRadar = [
  { criterio:'Originalidade', Computação:4.2, Medicina:3.8, Biologia:3.5, Educação:3.2 },
  { criterio:'Metodologia',   Computação:4.0, Medicina:3.9, Biologia:3.6, Educação:3.4 },
  { criterio:'Viabilidade',   Computação:3.7, Medicina:3.9, Biologia:3.8, Educação:3.6 },
  { criterio:'Impacto',       Computação:4.1, Medicina:4.3, Biologia:3.7, Educação:3.5 },
]
const topOrientadores = [
  { nome:'Prof. A', projetos:7 },
  { nome:'Prof. B', projetos:6 },
  { nome:'Prof. C', projetos:5 },
  { nome:'Prof. D', projetos:4 },
]
const COLORS = ['#0050B3', '#FFD700', '#003366', '#8c8c8c', '#22c55e', '#ef4444']

export default function AdminAnalytics() {
  return (
    <div className="page-admin-analytics">
      {/* Toolbar (largura total) */}
      <div className="toolbar tile-toolbar">
        <input className="input" placeholder="Ano: 2025" />
        <input className="input" placeholder="Edital: PIBIC" />
      </div>

      {/* HERO: Trend (largura dupla) */}
      <section className="tile-trend">
        <Card title="Submissões e aprovados por mês">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={porMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="submissoes" fill="#003366" stroke="#003366" fillOpacity={0.2} />
                <Line type="monotone" dataKey="aprovados" stroke="#22c55e" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Lateral do hero: Radial */}
      <section className="tile-radial">
        <Card title="Distribuição de status">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={14} data={statusDistrib}>
                <RadialBar background dataKey="value" />
                <Legend />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Linha 2: Barras + Barras empilhadas + Pizza */}
      <section className="tile-centros">
        <Card title="Nº de projetos por centro">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porCentro}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projetos" fill="#0050B3" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="tile-status">
        <Card title="Status por centro">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusPorCentro}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enviados" stackId="a" fill="#8c8c8c" />
                <Bar dataKey="analise"  stackId="a" fill="#0050B3" />
                <Bar dataKey="aprovados" stackId="a" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="tile-areas">
        <Card title="Áreas de conhecimento mais frequentes">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={areas} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={80} label>
                  {areas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Linha 3: Radar (full width) */}
      <section className="tile-radar">
        <Card title="Critérios médios por área (radar)">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={criteriosRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="criterio" />
                <PolarRadiusAxis />
                <Radar name="Computação" dataKey="Computação" stroke="#0050B3" fill="#0050B3" fillOpacity={0.2} />
                <Radar name="Medicina"   dataKey="Medicina"   stroke="#FFD700" fill="#FFD700" fillOpacity={0.2} />
                <Radar name="Biologia"   dataKey="Biologia"   stroke="#003366" fill="#003366" fillOpacity={0.2} />
                <Radar name="Educação"   dataKey="Educação"   stroke="#8c8c8c" fill="#8c8c8c" fillOpacity={0.2} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Linha 4: Bolsas (compacto) */}
      <section className="tile-bolsas">
        <Card title="Tipos de bolsas">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bolsas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#FFD700" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  )
}
