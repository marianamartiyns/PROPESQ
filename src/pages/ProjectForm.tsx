import React, { useState } from 'react'
import Card from '@/components/Card'
import '@/styles/ProjectForm.css'

export default function ProjectForm() {
  const [status, setStatus] = useState<'Rascunho' | 'Enviado'>('Rascunho')

  return (
    <div className="page-project-form">

      <div className="page-body">
        <div className="main">
          <Card title="Cadastro de Projeto de Pesquisa">
            <form className="form-grid">
              <div className="field">
                <label className="label" htmlFor="titulo">Título</label>
                <input id="titulo" className="input" placeholder="Título do projeto" />
              </div>

              <div className="field">
                <label className="label" htmlFor="resumo">Resumo</label>
                <textarea id="resumo" className="input min-h-[120px]" placeholder="Breve resumo do projeto" />
              </div>

              <div className="row row-2">
                <div className="field">
                  <label className="label" htmlFor="area">Área do conhecimento (CNPq)</label>
                  <input id="area" className="input" placeholder="Ex.: Computação / IA" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="keywords">Palavras-chave</label>
                  <input id="keywords" className="input" placeholder="IA; visão computacional; saúde" />
                </div>
              </div>

              <div className="row row-3">
                <div className="field">
                  <label className="label" htmlFor="objetivos">Objetivos</label>
                  <textarea id="objetivos" className="input min-h-[80px]" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="metodologia">Metodologia</label>
                  <textarea id="metodologia" className="input min-h-[80px]" />
                </div>
                <div className="field">
                  <label className="label" htmlFor="resultados">Resultados esperados</label>
                  <textarea id="resultados" className="input min-h-[80px]" />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="arquivo">Projeto (PDF)</label>
                <input id="arquivo" type="file" className="input file-input" />
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setStatus('Rascunho')}
                >
                  Salvar rascunho
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStatus('Enviado')}
                >
                  Submeter
                </button>
              </div>
            </form>
          </Card>
        </div>

        <aside className="aside">
          <Card title="Status">
            <div className="aside-status">
              <div className={`status-pill ${status === 'Enviado' ? 'ok' : 'draft'}`}>
                {status}
              </div>
            </div>
          </Card>

          <Card title="Orientações">
            <ul className="tips">
              <li>Use o template institucional do edital vigente.</li>
              <li>PDF até 10MB.</li>
              <li>Campos obrigatórios marcados.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  )
}
