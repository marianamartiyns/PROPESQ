import React, { useMemo, useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { certificados } from '@/mock/data';
import { Link } from 'react-router-dom';
import '@/styles/Certificates.css';

type Certificado = {
  id: string | number;
  nome: string;       // Tipo
  pessoa: string;     // Nome
  projetoId: string;  // Projeto
  data: string;       // ISO date ou DD/MM/YYYY
  pdfUrl?: string;    // opcional no mock
};

function normalize(str: string) {
  return (str || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function parseDate(d: string) {
  const iso = new Date(d);
  if (!isNaN(iso.getTime())) return iso;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return new Date(NaN);
}

function formatDate(d: string) {
  const dt = parseDate(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Certificates() {
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState<'todos' | string>('todos');

  const tipos = useMemo(() => {
    const set = new Set<string>();
    (certificados as Certificado[]).forEach(c => { if (c?.nome) set.add(c.nome); });
    return ['todos', ...Array.from(set).sort()];
  }, []);

  const data = useMemo(() => {
    const nq = normalize(q);
    const filtered = (certificados as Certificado[]).filter(c => {
      const inTipo = tipo === 'todos' || c.nome === tipo;
      if (!inTipo) return false;
      if (!q) return true;
      const hay =
        normalize(String(c.id)) + ' ' +
        normalize(c.nome) + ' ' +
        normalize(c.pessoa) + ' ' +
        normalize(c.projetoId) + ' ' +
        normalize(c.data);
      return hay.includes(nq);
    });
    return filtered
      .slice()
      .sort((a, b) => (parseDate(b.data).getTime() || 0) - (parseDate(a.data).getTime() || 0));
  }, [q, tipo]);

  const emptyMsg =
    q || tipo !== 'todos'
      ? 'Nenhum certificado encontrado para os filtros aplicados.'
      : 'Nenhum certificado cadastrado.';

  return (
    <div className="page-certificates">
      <div className="container mx-auto px-4 py-6">
        <Card title="Certificados">
          <div className="cert-toolbar" role="region" aria-label="Filtros de certificados">
            <div className="cert-field">
              <label htmlFor="q">Busca</label>
              <input
                id="q"
                type="text"
                placeholder="Buscar por nome, projeto, tipo ou ID…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="cert-field">
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                {tipos.map(t => (
                  <option key={t} value={t}>{t === 'todos' ? 'Todos' : t}</option>
                ))}
              </select>
            </div>

            <div className="cert-field cert-actions">
              <div className="cert-count" aria-live="polite">
                <span className="count-dot" />
                {data.length} resultado{data.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {/* Tabela*/}
          {data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">Nenhum certificado encontrado</div>
              <div className="empty-subtitle">{emptyMsg}</div>
            </div>
          ) : (
            <div className="table-wrap">
              <Table
                data={data}
                cols={[
                  { key: 'id', header: 'ID', render: (r: Certificado) => <span className="mono">{r.id}</span> },
                  {
                    key: 'nome',
                    header: 'Tipo',
                    render: (r: Certificado) => (
                      <span className="tipo-chip" title={r.nome}>{r.nome}</span>
                    )
                  },
                  { key: 'pessoa', header: 'Nome' },
                  {
                    key: 'projetoId',
                    header: 'Projeto',
                    render: (r: Certificado) => (
                      <span className="proj-ttl" title={r.projetoId}>{r.projetoId}</span>
                    ),
                  },
                  {
                    key: 'data',
                    header: 'Data',
                    render: (r: Certificado) => formatDate(r.data),
                  },
                  {
                    key: 'download',
                    header: 'Baixar',
                    render: (r: Certificado) => (
                      <a
                        className="btn btn-gold btn-sm"
                        href={r.pdfUrl || '#'}
                        download={Boolean(r.pdfUrl) || undefined}
                        aria-disabled={!r.pdfUrl}
                        onClick={(e) => { if (!r.pdfUrl) e.preventDefault(); }}
                      >
                        Baixar PDF
                      </a>
                    ),
                  },
                  {
                  key: 'verificar',
                  header: 'Verificar',
                  render: (r: Certificado) => (
                    <button className="btn btn-primary btn-sm" disabled>
                      Verificar
                    </button>
                  ),

                  },
                ]}
                striped
                stickyHeader
                dense="compact"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
