#  PROPESQ (Protótipo PIBIC)

> Protótipo de sistema para gerenciamento do PIBIC/UFPB com três perfis (Discente, Docente e PROPESQ/Servidor), desenvolvido em **React + Vite + TypeScript + Tailwind** e uma **API mock em Express**

### Principais tecnologias

* **Frontend:** React 18, Vite 5, TypeScript, TailwindCSS, Lucide Icons, Recharts (gráficos), `qrcode.react` (QR nos certificados).
* **Backend (mock):** Node.js + **Express 5** (API simples em memória).
* **DX:** ESLint, `vite-tsconfig-paths` (alias `@/*`), Open Sans (Google Fonts).

### 1) Requisitos

* Node.js 18+ (ou superior)
* npm (ou pnpm/yarn)

### 2) Instalar dependências

```bash
npm install
```

### 3) Subir o frontend (Vite)

```bash
npm run dev
```

Por padrão, roda em **[http://localhost:5173](http://localhost:5173)**.

## Estrutura de pastas

```
api-rest/
├── api.js                   # API mock (Express) - endpoints em memória
├── data.js                  # Base de dados mock consumida pela API (projetos, planos, etc.)
├── index.html               # HTML raiz (Vite) - injeta src/main.tsx
├── package.json             # Scripts, dependências e metadados do projeto
├── tailwind.config.js       # Configuração do Tailwind (cores UFPB, fonte, etc.)
├── tsconfig.json            # Configuração TypeScript (paths, strict, etc.)
├── vite.config.ts           # Configuração do Vite + alias "@/..."
└── src/
    ├── App.tsx              # Definição de rotas + Shell (header, main, footer)
    ├── main.tsx             # Entrada React + BrowserRouter
    ├── styles.css           # Estilos globais base
    ├── components/          # Componentes reutilizáveis (UI)
    │   ├── AppHeader.tsx    # Cabeçalho com navegação, avatar, sinos, menu mobile
    │   ├── Card.tsx         # Cartão genérico com título
    │   ├── Logo.tsx         # Componente de logo (não está sendo usado)
    │   ├── StatCard.tsx     # Cartão de estatística (ícone, número, rótulo - precisa de alguns ajustas)
    │   └── Table.tsx        # Tabela genérica (colunas, render custom, densidade, etc. - precisa de ajustes usado em projects, reports, ... )
    ├── context/
    │   └── AuthContext.tsx  # Contexto de autenticação (usuário mock e logout)
    ├── mock/
    │   └── data.ts          # Dados mock usados pelo frontend (projetos, relatórios, etc.)
    ├── pages/               # Páginas do app (rotas)
    │   ├── AdminAnalytics.tsx   # Painel gerencial (visão PROPESQ/servidor)
    │   ├── Certificates.tsx     # Lista/ação de certificados
    │   ├── CertificateView.tsx  # Visualização de certificado com QR (precisa de ajustes)
    │   ├── Dashboard.tsx        # Dashboard principal (cards, timeline, notificações)- atualmente aparece para discentes, docentes e servidores acredito que deva aparecer só pra servidor (mudar em appheader.tsx)
    │   ├── Evaluations.tsx      # Lista de avaliações (PROPESQ/servidor)
    │   ├── EvaluationDetail.tsx # Detalhe de avaliação específica
    │   ├── Login.tsx            # Tela de login/seleção de papel (mock)
    │   ├── Monitoring.tsx       # Acompanhamento (visão de status/andamento)
    │   ├── NotFound.tsx         # 404
    │   ├── PlanForm.tsx         # Formulário de criação/edição de Plano de Trabalho
    │   ├── Plans.tsx            # Lista de planos
    │   ├── ProjectForm.tsx      # Formulário de cadastro de projeto
    │   ├── Projects.tsx         # Lista de projetos (com filtros, status, etc.)
    │   ├── Reports.tsx          # Envio/gestão de relatórios (parcial/final)
    │   └── Settings.tsx         # Preferências/conta do usuário
    ├── styles/              # CSS específicos (além de Tailwind)
    │   ├── AppHeader.css    # Estilo do header (glass, nav, responsivo)
    │   ├── Dashboard.css    # Ajustes do dashboard
    │   ├── Certificates.css # Estilo da página de certificados
    │   ├── Plans.css        # Estilo da lista de planos
    │   ├── Projects.css     # Estilo da lista de projetos
    │   ├── Reports.css      # Estilo da página de relatórios
    │   └── Table.css        # Estilo da tabela genérica
    └── utils/
        └── constants.ts     # Paleta e constantes (status de projetos etc.)
```

### Autenticação (mock)

`src/context/AuthContext.tsx` expõe:

* `user` (objeto simples com `name`, `role`, etc.);
* `logout()` (zera o usuário);
* *Guard*: em `App.tsx`, o componente `Protected` redireciona para **/login** quando `!user`.

Isso permite testar fluxos diferenciados por **papel** (Discente/Docente/PROPESQ-servidro) sem backend real.

## API Mock (backend)

* **Arquivo:** `api.js`
* **Dep:** `"express": "^5.1.0"`
* **Porta:** **3000**

### O que tá fazendo

* Serve como **mock de backend**, mantendo os dados **em memória** via `require('./data')`.
* Endpoints implementados:

  * `GET /` → teste (“Enviado pela api rest.”)
  * `GET /projetos` → lista de projetos
  * `GET /projetos/:id` → um projeto
  * `POST /projetos` → cria novo projeto
  * `PUT /projetos/:id` → substitui o projeto
  * `PATCH /projetos/:id` → atualiza parcialmente campos (inclui mesclagem de `corpo_do_plano_de_trabalho`)
  * `DELETE /projetos/:id` → remove projeto

### Arquivo `data.js`

* Define a estrutura esperada do projeto (ex.: `area_de_conhecimento`, `corpo_do_plano_de_trabalho`, metas, cronograma etc.).
* Fornece o array inicial `projetos` com exemplos realistas para testes.

## Rotas definidas (App.tsx)

* `/login` – **Login**
* `/` – **Dashboard** (protegida)
* `/meus-projetos` – **Projects**
* `/novo-projeto` – **ProjectForm**
* `/planos` – **Plans**
* `/novo-plano` – **PlanForm**
* `/avaliacoes` – **Evaluations**
* `/avaliacoes/:id` – **EvaluationDetail**
* `/acompanhamento` – **Monitoring**
* `/relatorios` – **Reports**
* `/certificados` – **Certificates**
* `/certificados/:id` – **CertificateView**
* `/painel-gerencial` – **AdminAnalytics**
* `/configuracoes` – **Settings**
* `*` – **NotFound**

Rotas protegidas ficam dentro do wrapper `<Protected>`, que checa `user` no `AuthContext`.

### 📌 Coisas pra adicionar e revisar (além do que citei acima)

* gráficos dinâmicos tais como Chart.js e Recharts.
* critérios de acessibilidade segundo as diretrizes WCAG 2.1.
