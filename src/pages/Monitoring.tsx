// src/pages/Monitoring.tsx - editais

import React from 'react'
import Card from '@/components/Card'
import { FaCheckCircle, FaClock, FaTimesCircle, FaFileAlt } from 'react-icons/fa'
import '@/styles/Monitoring.css'
import { Helmet } from 'react-helmet'

const etapas = [
  { nome: 'Submissão', data: '2025-09-01', done: true },
  { nome: 'Avaliação', data: '2025-10-10', done: true },
  { nome: 'Vigência', data: '2025-10-20', done: false },
  { nome: 'Encerramento', data: '2026-08-31', done: false },
]

export default function Monitoring() {
  const completed = etapas.filter(e => e.done).length
  const total = etapas.length
  const progress = Math.round((completed / total) * 100)

  // Resumo geral dos editais
  const resumo = [
    { title: 'Total de Editais', value: 12, color: 'bg-blue-600', icon: <FaFileAlt /> },
    { title: 'Etapas Concluídas', value: completed, color: 'bg-green-600', icon: <FaCheckCircle /> },
    { title: 'Em Vigência', value: 5, color: 'bg-yellow-500', icon: <FaClock /> },
    { title: 'Encerrados', value: 3, color: 'bg-red-600', icon: <FaTimesCircle /> },
  ]

  return (
    <div className="monitoring-page">
      <h1 className="page-title">Painel de Editais</h1>

      {/* Cards de resumo */}
      <div className="resumo-cards">
        {resumo.map((r, i) => (
          <div key={i} className={`resumo-card ${r.color}`}>
            <div className="resumo-icon">{r.icon}</div>
            <div className="resumo-info">
              <div className="resumo-value">{r.value}</div>
              <div className="resumo-title">{r.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline do edital */}
      <Card title="Acompanhamento e Vigência">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">{progress}% das etapas concluídas</p>

        <ol className="timeline">
          {etapas.map((e, i) => (
            <li key={i} className="timeline-item">
              <span className={`timeline-dot ${e.done ? 'done' : 'pending'}`}>
                {e.done ? <FaCheckCircle /> : <FaClock />}
              </span>
              <div className="timeline-content">
                <div className="timeline-title">{e.nome}</div>
                <div className="timeline-date">{e.data}</div>
                <button className="timeline-btn">Ver detalhes</button>
              </div>
            </li>
          ))}
        </ol>

        <div className="timeline-note">
          Histórico de alterações disponível no detalhe do projeto.
        </div>
      </Card>
    </div>
  )
}
