// =============================
// File: src/pages/Projects.tsx
// =============================
import React, { useMemo, useState } from 'react'
import Card from '@/components/Card'
import Table from '@/components/Table'
import { projetos } from '@/mock/data'
import { Link } from 'react-router-dom'
import '@/styles/Projects.css'

type RoleType = 'discente' | 'docente' | 'servidor'

function getCurrentRole(): RoleType {
  if (typeof window !== 'undefined' && (window as any).__ROLE__) {
    return String((window as any).__ROLE__).toLowerCase() as RoleType
  }
  const fromLS = (typeof window !== 'undefined' && window.localStorage)
    ? localStorage.getItem('role')
    : null
  const normalized = (fromLS || 'discente').toLowerCase()
  return (['docente', 'discente', 'coordenador', 'admin', 'servidor'].includes(normalized)
    ? normalized
    : 'discente') as RoleType
}

const statusClass = (status: string) => {
  const s = status?.toLowerCase?.() || ''
  if (s.includes('aprov')) return 'badge badge-green'
  if (s.includes('pend') || s.includes('anál') || s.includes('analise') || s.includes('em análise')) return 'badge badge-amber'
  if (s.includes('reprov') || s.includes('indefer')) return 'badge badge-red'
  return 'badge badge-gray'
}

const truncate = (txt: string, n = 80) => (txt?.length > n ? `${txt.slice(0, n)}…` : txt || '—')

type Projeto = {
  id: string | number
  titulo: string
  centro: string
  area: string
  status: string
  prazo: string
  // campos que podem (ou não) existir no mock
  tipo?: 'interno' | 'externo'
  ano?: number | string
  pesquisador?: string
  unidade?: string
  objetivos?: string
  linhaPesquisa?: string
  areaConhecimento?: string
  grupoPesquisa?: string
  agencia?: string
  edital?: string
  situacao?: string
  categoria?: string
  relatorioFinal?: 'submetido' | 'nao_submetido'
}

export default function Projects() {
  const role = getCurrentRole()
  const canCreate = role === 'docente' || role === 'servidor'

  // ====== Critérios (com checkboxes) ======
  // Tipo
  const [useTipo, setUseTipo] = useState(false)
  const [tipo, setTipo] = useState<'' | 'interno' | 'externo'>('')

  // Código (formato livre; no SIE é PPPNNNN-AAAA, mas aqui faremos contains)
  const [useCodigo, setUseCodigo] = useState(false)
  const [codigo, setCodigo] = useState('')

  // Ano
  const [useAno, setUseAno] = useState(false)
  const [ano, setAno] = useState<string>('')

  // Escopo (Todos da UFPB / Somente da minha unidade / Somente externos)
  const [escopo, setEscopo] = useState<'todos' | 'minha_unidade' | 'somente_externos'>('todos')

  // Pesquisador
  const [usePesq, setUsePesq] = useState(false)
  const [pesquisador, setPesquisador] = useState('')

  // Centro/Unidade (select) + Unidade (texto)
  const [useCentro, setUseCentro] = useState(false)
  const [centro, setCentro] = useState('')

  const [useUnidade, setUseUnidade] = useState(false)
  const [unidade, setUnidade] = useState('')

  // Título
  const [useTitulo, setUseTitulo] = useState(false)
  const [titulo, setTitulo] = useState('')

  // Objetivos
  const [useObjetivos, setUseObjetivos] = useState(false)
  const [objetivos, setObjetivos] = useState('')

  // Linha de Pesquisa
  const [useLinha, setUseLinha] = useState(false)
  const [linhaPesquisa, setLinhaPesquisa] = useState('')

  // Área de Conhecimento (select)
  const [useAreaConhec, setUseAreaConhec] = useState(false)
  const [areaConhecimento, setAreaConhecimento] = useState('')

  // Grupo de Pesquisa (select)
  const [useGrupo, setUseGrupo] = useState(false)
  const [grupoPesquisa, setGrupoPesquisa] = useState('')

  // Agência Financiadora (select)
  const [useAgencia, setUseAgencia] = useState(false)
  const [agencia, setAgencia] = useState('')

  // Edital (select)
  const [useEdital, setUseEdital] = useState(false)
  const [edital, setEdital] = useState('')

  // Situação do Projeto (select)
  const [useSituacao, setUseSituacao] = useState(false)
  const [situacao, setSituacao] = useState('')

  // Categoria do Projeto (select)
  const [useCategoria, setUseCategoria] = useState(false)
  const [categoria, setCategoria] = useState('')

  // Relatório Final (radio)
  const [useRelatorioFinal, setUseRelatorioFinal] = useState(false)
  const [relatorioFinal, setRelatorioFinal] = useState<'' | 'submetido' | 'nao_submetido'>('')

  // Gerar relatório (checkbox “livre”)
  const [gerarRelatorio, setGerarRelatorio] = useState(false)

  // Opções derivadas do mock
  const centrosOpts = useMemo(() => {
    const set = new Set<string>()
    ;(projetos as Projeto[]).forEach(p => p.centro && set.add(p.centro))
    return Array.from(set)
  }, [])

  const areasConhecOpts = useMemo(() => {
    const set = new Set<string>()
    ;(projetos as Projeto[]).forEach(p => {
      if (p.areaConhecimento) set.add(p.areaConhecimento)
      if (p.area) set.add(p.area) // fallback: usa "area" como área de conhecimento
    })
    return Array.from(set)
  }, [])

  // Placeholders para selects que não existem no mock:
  const gruposOpts = ['—', 'GP I', 'GP II', 'GP III']
  const agenciasOpts = ['—', 'CNPq', 'CAPES', 'FINEP', 'UFPB', 'Outra']
  const editaisOpts = ['—', 'PIBIC 2023', 'PIBIC 2024', 'PIBITI 2024', 'Universal 2024']
  const situacoesOpts = ['—', 'Em análise', 'Aprovado', 'Reprovado', 'Indeferido', 'Concluído']
  const categoriasOpts = ['—', 'Pesquisa', 'Extensão', 'Inovação', 'Ensino']

  // ========== APLICAÇÃO DOS FILTROS ==========
  const filtered = useMemo(() => {
    return (projetos as Projeto[]).filter(p => {
      const sv = (v?: string) => (v || '').toLowerCase()
      const has = <T extends keyof Projeto>(k: T) => (p[k] !== undefined && p[k] !== null)

      // Tipo
      if (useTipo && tipo) {
        const v = has('tipo') ? (p.tipo as any) : ''
        if (String(v || '').toLowerCase() !== tipo) return false
      }

      // Código (contains em id ou campo codigo caso exista)
      if (useCodigo && codigo.trim()) {
        const idText = String(p.id || '').toLowerCase()
        const codigoField = (p as any).codigo ? String((p as any).codigo).toLowerCase() : ''
        const needle = codigo.trim().toLowerCase()
        if (!idText.includes(needle) && !codigoField.includes(needle)) return false
      }

      // Ano
      if (useAno && ano.trim()) {
        const yearText = String(p.ano ?? '').toLowerCase()
        if (!yearText || !yearText.includes(ano.trim().toLowerCase())) return false
      }

      // Escopo (sem dados no mock; tratamos apenas regras óbvias)
      if (escopo === 'somente_externos') {
        // se existir p.tipo, exige 'externo'
        if (has('tipo') && p.tipo !== 'externo') return false
      }
      if (escopo === 'minha_unidade') {
        // se existir p.unidade, exige não-vazio (simulando “da minha unidade”)
        if (has('unidade') && !p.unidade) return false
      }

      // Pesquisador
      if (usePesq && pesquisador.trim()) {
        const field = sv((p as any).pesquisador)
        if (!field.includes(pesquisador.trim().toLowerCase())) return false
      }

      // Centro/Unidade
      if (useCentro && centro) {
        if (sv(p.centro) !== centro.toLowerCase()) return false
      }

      if (useUnidade && unidade.trim()) {
        const field = sv((p as any).unidade)
        if (!field.includes(unidade.trim().toLowerCase())) return false
      }

      // Título
      if (useTitulo && titulo.trim()) {
        if (!sv(p.titulo).includes(titulo.trim().toLowerCase())) return false
      }

      // Objetivos
      if (useObjetivos && objetivos.trim()) {
        const field = sv((p as any).objetivos)
        if (!field.includes(objetivos.trim().toLowerCase())) return false
      }

      // Linha de Pesquisa
      if (useLinha && linhaPesquisa.trim()) {
        const field = sv((p as any).linhaPesquisa)
        if (!field.includes(linhaPesquisa.trim().toLowerCase())) return false
      }

      // Área de Conhecimento
      if (useAreaConhec && areaConhecimento) {
        const alvo = areaConhecimento.toLowerCase()
        const field = sv(p.areaConhecimento || p.area)
        if (field !== alvo) return false
      }

      // Grupo de Pesquisa
      if (useGrupo && grupoPesquisa && grupoPesquisa !== '—') {
        const field = sv((p as any).grupoPesquisa)
        if (field !== grupoPesquisa.toLowerCase()) return false
      }

      // Agência
      if (useAgencia && agencia && agencia !== '—') {
        const field = sv((p as any).agencia)
        if (field !== agencia.toLowerCase()) return false
      }

      // Edital
      if (useEdital && edital && edital !== '—') {
        const field = sv((p as any).edital)
        if (field !== edital.toLowerCase()) return false
      }

      // Situação (mapeia para status quando não existir)
      if (useSituacao && situacao && situacao !== '—') {
        const field = sv((p as any).situacao || p.status)
        if (!field.includes(situacao.toLowerCase())) return false
      }

      // Categoria
      if (useCategoria && categoria && categoria !== '—') {
        const field = sv((p as any).categoria)
        if (field !== categoria.toLowerCase()) return false
      }

      // Relatório final
      if (useRelatorioFinal && relatorioFinal) {
        const field = ((p as any).relatorioFinal || '') as 'submetido' | 'nao_submetido' | ''
        if (field !== relatorioFinal) return false
      }

      return true
    })
  }, [
    projetos,
    // deps:
    useTipo, tipo,
    useCodigo, codigo,
    useAno, ano,
    escopo,
    usePesq, pesquisador,
    useCentro, centro,
    useUnidade, unidade,
    useTitulo, titulo,
    useObjetivos, objetivos,
    useLinha, linhaPesquisa,
    useAreaConhec, areaConhecimento,
    useGrupo, grupoPesquisa,
    useAgencia, agencia,
    useEdital, edital,
    useSituacao, situacao,
    useCategoria, categoria,
    useRelatorioFinal, relatorioFinal
  ])

  // ====== RENDER ======
  return (
    <Card title="Projetos">
      <div className="page-projects">

      {/* ================= CRITÉRIOS DE BUSCA ================= */}
      <div className="criteria card-like criteria-form">
        <div className="criteria-title">Critérios de Busca dos Projetos</div>

        {/* Tipo */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useTipo} onChange={e => setUseTipo(e.target.checked)} />
            <span>Tipo:</span>
          </label>
          <div className="criteria-field">
            <label className={`radio ${!useTipo ? 'disabled' : ''}`}>
              <input type="radio" disabled={!useTipo} checked={tipo === 'interno'} onChange={() => setTipo('interno')} />
              Interno
            </label>
            <label className={`radio ${!useTipo ? 'disabled' : ''}`}>
              <input type="radio" disabled={!useTipo} checked={tipo === 'externo'} onChange={() => setTipo('externo')} />
              Externo
            </label>
            {useTipo && <button className="link-reset" onClick={() => setTipo('')}>Limpar</button>}
          </div>
        </div>

        {/* Código */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useCodigo} onChange={e => setUseCodigo(e.target.checked)} />
            <span>Código:</span>
          </label>
          <div className="criteria-field">
            <input
              type="text"
              disabled={!useCodigo}
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder="PPP0000-AAAA"
            />
            <span className="criteria-help">
              (Formato: PPPNNNN-AAAA, onde PPP = prefixo, NNNN = número e AAAA = ano)
            </span>
          </div>
        </div>

        {/* Ano */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useAno} onChange={e => setUseAno(e.target.checked)} />
            <span>Ano:</span>
          </label>
          <div className="criteria-field criteria-field--short">
            <input
              type="number"
              min={0}
              disabled={!useAno}
              value={ano}
              onChange={e => setAno(e.target.value)}
              placeholder="AAAA"
            />
          </div>
        </div>

        {/* Escopo (linha sem checkbox, exatamente como no print) */}
        <div className="criteria-row">
          <div className="criteria-offset" />
          <div className="criteria-field">
            <label className="radio">
              <input type="radio" checked={escopo === 'todos'} onChange={() => setEscopo('todos')} />
              Todos da UFPB
            </label>
            <label className="radio">
              <input type="radio" checked={escopo === 'minha_unidade'} onChange={() => setEscopo('minha_unidade')} />
              Somente da minha unidade
            </label>
            <label className="radio">
              <input type="radio" checked={escopo === 'somente_externos'} onChange={() => setEscopo('somente_externos')} />
              Somente externos
            </label>
          </div>
        </div>

        {/* Pesquisador */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={usePesq} onChange={e => setUsePesq(e.target.checked)} />
            <span>Pesquisador:</span>
          </label>
          <div className="criteria-field">
            <input
              type="text"
              disabled={!usePesq}
              value={pesquisador}
              onChange={e => setPesquisador(e.target.value)}
              placeholder="Nome do pesquisador"
            />
          </div>
        </div>

        {/* Centro/Unidade */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useCentro} onChange={e => setUseCentro(e.target.checked)} />
            <span>Centro/Unidade:</span>
          </label>
          <div className="criteria-field">
            <select disabled={!useCentro} value={centro} onChange={e => setCentro(e.target.value)}>
              <option value="">-- SELECIONE --</option>
              {centrosOpts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Unidade */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useUnidade} onChange={e => setUseUnidade(e.target.checked)} />
            <span>Unidade:</span>
          </label>
          <div className="criteria-field">
            <input
              type="text"
              disabled={!useUnidade}
              value={unidade}
              onChange={e => setUnidade(e.target.value)}
              placeholder="Código/nome da unidade"
            />
          </div>
        </div>

        {/* Título */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useTitulo} onChange={e => setUseTitulo(e.target.checked)} />
            <span>Título:</span>
          </label>
          <div className="criteria-field">
            <input
              type="text"
              disabled={!useTitulo}
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título do projeto"
            />
          </div>
        </div>

        {/* Objetivos */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useObjetivos} onChange={e => setUseObjetivos(e.target.checked)} />
            <span>Objetivos:</span>
          </label>
          <div className="criteria-field">
            <input
              type="text"
              disabled={!useObjetivos}
              value={objetivos}
              onChange={e => setObjetivos(e.target.value)}
              placeholder="Palavras-chave dos objetivos"
            />
          </div>
        </div>

        {/* Linha de Pesquisa */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useLinha} onChange={e => setUseLinha(e.target.checked)} />
            <span>Linha de Pesquisa:</span>
          </label>
          <div className="criteria-field">
            <input
              type="text"
              disabled={!useLinha}
              value={linhaPesquisa}
              onChange={e => setLinhaPesquisa(e.target.value)}
              placeholder="Linha/tema de pesquisa"
            />
          </div>
        </div>

        {/* Área de Conhecimento */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useAreaConhec} onChange={e => setUseAreaConhec(e.target.checked)} />
            <span>Área de Conhecimento:</span>
          </label>
          <div className="criteria-field">
            <select
              disabled={!useAreaConhec}
              value={areaConhecimento}
              onChange={e => setAreaConhecimento(e.target.value)}
            >
              <option value="">-- SELECIONE UMA ÁREA --</option>
              {areasConhecOpts.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Grupo de Pesquisa */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useGrupo} onChange={e => setUseGrupo(e.target.checked)} />
            <span>Grupo de Pesquisa:</span>
          </label>
          <div className="criteria-field">
            <select disabled={!useGrupo} value={grupoPesquisa} onChange={e => setGrupoPesquisa(e.target.value)}>
              {gruposOpts.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Agência Financiadora */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useAgencia} onChange={e => setUseAgencia(e.target.checked)} />
            <span>Agência Financiadora:</span>
          </label>
          <div className="criteria-field">
            <select disabled={!useAgencia} value={agencia} onChange={e => setAgencia(e.target.value)}>
              {agenciasOpts.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Edital */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useEdital} onChange={e => setUseEdital(e.target.checked)} />
            <span>Edital:</span>
          </label>
          <div className="criteria-field">
            <select disabled={!useEdital} value={edital} onChange={e => setEdital(e.target.value)}>
              {editaisOpts.map(ed => <option key={ed} value={ed}>{ed}</option>)}
            </select>
          </div>
        </div>

        {/* Situação do Projeto */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useSituacao} onChange={e => setUseSituacao(e.target.checked)} />
            <span>Situação do Projeto:</span>
          </label>
          <div className="criteria-field">
            <select disabled={!useSituacao} value={situacao} onChange={e => setSituacao(e.target.value)}>
              {situacoesOpts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Categoria do Projeto */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useCategoria} onChange={e => setUseCategoria(e.target.checked)} />
            <span>Categoria do Projeto:</span>
          </label>
          <div className="criteria-field">
            <select disabled={!useCategoria} value={categoria} onChange={e => setCategoria(e.target.value)}>
              {categoriasOpts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Relatório Final */}
        <div className="criteria-row">
          <label className="criteria-check">
            <input type="checkbox" checked={useRelatorioFinal} onChange={e => setUseRelatorioFinal(e.target.checked)} />
            <span>Relatório Final</span>
          </label>
          <div className="criteria-field">
            <label className={`radio ${!useRelatorioFinal ? 'disabled' : ''}`}>
              <input
                type="radio"
                disabled={!useRelatorioFinal}
                checked={relatorioFinal === 'submetido'}
                onChange={() => setRelatorioFinal('submetido')}
              />
              Submetido
            </label>
            <label className={`radio ${!useRelatorioFinal ? 'disabled' : ''}`}>
              <input
                type="radio"
                disabled={!useRelatorioFinal}
                checked={relatorioFinal === 'nao_submetido'}
                onChange={() => setRelatorioFinal('nao_submetido')}
              />
              Não Submetido
            </label>
          </div>
        </div>

        {/* Gerar relatório (linha sem label visível, como no print) */}
        <div className="criteria-row">
          <div className="criteria-offset" />
          <div className="criteria-field">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={gerarRelatorio}
                onChange={e => setGerarRelatorio(e.target.checked)}
              />
              Gerar relatório
            </label>
          </div>
        </div>

        {/* Ações centralizadas */}
        <div className="criteria-actions center">
          <button className="btn btn-primary">Buscar</button>
          <button
            className="btn"
            onClick={() => {
              setUseTipo(false); setTipo('');
              setUseCodigo(false); setCodigo('');
              setUseAno(false); setAno('');
              setEscopo('todos');
              setUsePesq(false); setPesquisador('');
              setUseCentro(false); setCentro('');
              setUseUnidade(false); setUnidade('');
              setUseTitulo(false); setTitulo('');
              setUseObjetivos(false); setObjetivos('');
              setUseLinha(false); setLinhaPesquisa('');
              setUseAreaConhec(false); setAreaConhecimento('');
              setUseGrupo(false); setGrupoPesquisa('');
              setUseAgencia(false); setAgencia('');
              setUseEdital(false); setEdital('');
              setUseSituacao(false); setSituacao('');
              setUseCategoria(false); setCategoria('');
              setUseRelatorioFinal(false); setRelatorioFinal('');
              setGerarRelatorio(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* ================= LISTAGEM DE PROJETOS ================= */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">Nenhum projeto encontrado</div>
          <div className="empty-subtitle">
            Ajuste os filtros ou marque os critérios desejados.
          </div>
        </div>
      ) : (
        <div className="projects-list-section">
          {/* Cabeçalho da listagem */}
          <div className="projects-list-header">
          <h2 className="projects-list-title">
            {role === 'docente' || role === 'servidor'
              ? 'Projetos que Coordeno'
              : 'Projetos em que Participo'}
          </h2>

            {canCreate && (
              <Link to="/novo-projeto" className="btn btn-gold">
                + Novo Projeto
              </Link>
            )}
          </div>

          {/* Tabela */}
          <div className="table-wrap">
            <Table
              data={filtered}
              cols={[
                { key: 'id', header: 'Código/ID', render: (r: any) => <span className="mono">{r.id}</span> },
                {
                  key: 'titulo',
                  header: 'Título',
                  render: (r: any) => (
                    <span className="proj-ttl" title={r.titulo}>
                      {truncate(r.titulo, 60)}
                    </span>
                  ),
                },
                { key: 'centro', header: 'Centro' },
                { key: 'area', header: 'Área' },
                {
                  key: 'status',
                  header: 'Situação',
                  render: (r: any) => <span className={statusClass(r.status)}>{r.status}</span>,
                },
                { key: 'prazo', header: 'Prazo' },
              ]}
            />
          </div>
        </div>
      )}
      </div>
    </Card>
  )
}
