// src/pages/Reports.tsx
import React, { useMemo, useRef, useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { relatorios } from '@/mock/data';
import '@/styles/Reports.css';

type Rel = {
  id: string | number;
  tipo: 'Parcial' | 'Final' | string;
  projeto: string;
  prazo: string;
  status: string;
};

type Aba = 'Parciais' | 'Finais';

export default function Reports() {
  const [q, setQ] = useState('');
  const [onlyPendentes, setOnlyPendentes] = useState(false);
  const [aba, setAba] = useState<Aba>('Parciais');

  const inputParcialRef = useRef<HTMLInputElement>(null);
  const inputFinalRef = useRef<HTMLInputElement>(null);
  const tabelaRef = useRef<HTMLDivElement>(null);

  // KPIs gerais
  const resumo = useMemo(() => {
    const total = (relatorios as Rel[]).length;
    const entregues = (relatorios as Rel[]).filter(r => r.status.toLowerCase().includes('entreg')).length;
    const atrasados = (relatorios as Rel[]).filter(r => r.status.toLowerCase().includes('atras')).length;
    const pendentes = total - entregues - atrasados;
    return { total, entregues, atrasados, pendentes };
  }, []);

  // Contadores por tipo (mostrados nos botões/abas)
  const contadores = useMemo(() => {
    const parciais = (relatorios as Rel[]).filter(r => r.tipo.toLowerCase().includes('parc')).length;
    const finais = (relatorios as Rel[]).filter(r => r.tipo.toLowerCase().includes('final')).length;
    return { parciais, finais };
  }, []);

  const dadosFiltrados = useMemo(() => {
    const isParciais = aba === 'Parciais';
    const needle = q.trim().toLowerCase();

    return (relatorios as Rel[])
      .filter(r => isParciais ? r.tipo.toLowerCase().includes('parc') : r.tipo.toLowerCase().includes('final'))
      .filter(r =>
        !needle
          ? true
          : [r.id, r.tipo, r.projeto, r.prazo, r.status].join(' ').toLowerCase().includes(needle)
      )
      .filter(r => (onlyPendentes ? r.status.toLowerCase().includes('pend') : true));
  }, [q, onlyPendentes, aba]);

  function badgeClass(status: string) {
    const s = status.toLowerCase();
    if (s.includes('atras')) return 'badge badge-danger';
    if (s.includes('entreg')) return 'badge badge-success';
    if (s.includes('pend')) return 'badge badge-warning';
    return 'badge badge-gray';
  }

  function handleEnviarParcial() {
    inputParcialRef.current?.click();
  }
  function handleEnviarFinal() {
    inputFinalRef.current?.click();
  }
  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>, tipo: 'Parcial' | 'Final') {
    const file = e.target.files?.[0];
    if (!file) return;
    // Aqui você pode integrar com sua API. Por enquanto, apenas um log.
    console.log(`Arquivo selecionado (${tipo}):`, file.name);
    // reset opcional
    e.target.value = '';
  }

  function consultar(tipo: Aba) {
    setAba(tipo);
    // rolar até a tabela
    setTimeout(() => {
      tabelaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  return (
    <div className="page-reports">
      <Card title="Relatórios">
        {/* KPIs (mantidos) */}
        <div className="kpis">
          <div className="kpi"><div className="kpi-label">Total</div><div className="kpi-value">{resumo.total}</div></div>
          <div className="kpi"><div className="kpi-label">Entregues</div><div className="kpi-value kpi-success">{resumo.entregues}</div></div>
          <div className="kpi"><div className="kpi-label">Pendentes</div><div className="kpi-value kpi-warning">{resumo.pendentes}</div></div>
          <div className="kpi"><div className="kpi-label">Atrasados</div><div className="kpi-value kpi-danger">{resumo.atrasados}</div></div>
        </div>

        {/* Ações rápidas: Parciais e Finais */}
        <div className="qa-grid">
          <div className="qa-card">
            <div className="qa-head">
              <h4>Relatórios Parciais</h4>
              <span className="qa-count">{contadores.parciais}</span>
            </div>
            <p className="qa-desc">Envie o PDF do relatório parcial ou consulte os já cadastrados.</p>
            <div className="qa-actions">
              <button className="btn btn-primary" onClick={handleEnviarParcial}>Enviar parcial</button>
              <button className="btn btn-consult" onClick={() => consultar('Parciais')}>Consultar parciais</button>
            </div>
            <input
              ref={inputParcialRef}
              type="file"
              accept="application/pdf"
              className="hidden-input"
              onChange={(e) => onFileSelected(e, 'Parcial')}
            />
          </div>

          <div className="qa-card">
            <div className="qa-head">
              <h4>Relatórios Finais</h4>
              <span className="qa-count">{contadores.finais}</span>
            </div>
            <p className="qa-desc">Envie o PDF do relatório final ou consulte os já cadastrados.</p>
            <div className="qa-actions">
              <button className="btn btn-primary" onClick={handleEnviarFinal}>Enviar final</button>
              <button className="btn btn-consult" onClick={() => consultar('Finais')}>Consultar finais</button>
            </div>
            <input
              ref={inputFinalRef}
              type="file"
              accept="application/pdf"
              className="hidden-input"
              onChange={(e) => onFileSelected(e, 'Final')}
            />
          </div>
        </div>

        {/* Abas de conteúdo */}
        <div className="tabbar">
          <button
            className={`tab ${aba === 'Parciais' ? 'active' : ''}`}
            onClick={() => setAba('Parciais')}
          >
            Parciais
          </button>
          <button
            className={`tab ${aba === 'Finais' ? 'active' : ''}`}
            onClick={() => setAba('Finais')}
          >
            Finais
          </button>
        </div>

        {/* Barra de ações + filtros*/}
        <div className="actions-bar">

          <div className="right">
            <div className="filter">
              <input
                className="input"
                placeholder={`Buscar em ${aba.toLowerCase()}`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

      {/* Tabela */}
      {dadosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">Nenhum relatório encontrado</div>
          <div className="empty-subtitle">
            Ajuste o filtro ou tente outro termo de busca.
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <Table
            data={dadosFiltrados}
            cols={[
              { key: 'id', header: 'ID', width: 'w-28' },
              { key: 'tipo', header: 'Tipo', width: 'w-28' },
              { key: 'projeto', header: 'Projeto', width: 'min-w-[260px]' },
              { key: 'prazo', header: 'Prazo', width: 'w-32' },
              {
                key: 'status',
                header: 'Status',
                width: 'w-36',
                render: (r: Rel) => (
                  <span className={badgeClass(r.status)}>{r.status}</span>
                ),
              },
            ]}
          />
        </div>
      )}

      </Card>
    </div>
  );
}
