// src/pages/Dashboard.tsx - inicio

import React from 'react'
import Card from '@/components/Card'
import '@/styles/Dashboard.css'
import { Helmet } from 'react-helmet'

// Dados fake 
const indicadores = [
  { title: 'Projetos Ativos', value: 42, icon: '📁' },
  { title: 'Editais Abertos', value: 5, icon: '📄' },
  { title: 'Bolsistas Ativos', value: 28, icon: '🎓' },
  { title: 'Certificados Emitidos', value: 120, icon: '🏆' },
  { title: 'Resumos Submetidos', value: 75, icon: '📝' },
]

const atividades = [
  'Novo projeto de Física cadastrado',
  'Resumo submetido para o edital de Biologia',
  'Bolsista aprovado no edital PIBIC 2025',
  'Certificado emitido para Maria da Silva',
]

const proximosPrazos = [
  { titulo: 'Fim do edital de Química', data: '15/11/2025' },
  { titulo: 'Entrega de relatórios de PIBIC', data: '20/11/2025' },
  { titulo: 'Inscrição de bolsistas de extensão', data: '30/11/2025' },
]

export default function Home() {
  return (
    <div className="home-page">
      {/* Favicon e título da página */}
      <Helmet>
        <link rel="icon" type="image/png" href="/src/styles/imgs/favicon-32x32.png" />
      </Helmet>

      <header className="home-header">
        <h1>Bem-vindo, Administrador</h1>
        <p>Resumo rápido das atividades e indicadores da universidade</p>
      </header>

      {/* Indicadores */}
      <section className="indicators">
        {indicadores.map((ind) => (
          <Card key={ind.title} className="indicator-card" title={''}>
            <div className="card-content">
              <span className="icon">{ind.icon}</span>
              <div className="info">
                <h3>{ind.value}</h3>
                <p>{ind.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <div className="home-lower">
        {/* Últimas atividades */}
        <section className="activities">
          <h2>Últimas Atividades</h2>
          <ul>
            {atividades.map((act, i) => (
              <li key={i}>• {act}</li>
            ))}
          </ul>
        </section>

        {/* Próximos prazos */}
        <section className="deadlines">
          <h2>Próximos Prazos</h2>
          <ul>
            {proximosPrazos.map((prazo, i) => (
              <li key={i}>
                <strong>{prazo.data}</strong> - {prazo.titulo}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
