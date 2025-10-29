// =============================
// File: src/components/AppHeader.tsx
// =============================
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Bell,
  FileText,
  Files,
  GraduationCap,
  Home,
  LineChart,
  LogOut,
  Notebook,
  ShieldCheck,
  User,
  Settings,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import LogoImg from "@/styles/imgs/logo_propesq_imagem.png";
import { useAuth } from "@/context/AuthContext";
import "@/styles/AppHeader.css";

type Item = { to: string; label: string; icon: React.ReactNode; badge?: string };
type Section = { title?: string; items: Item[] };

function matchPathStartsWith(current: string, base: string) {
  if (base === "/") return current === "/";
  return current === base || current.startsWith(base + "/");
}
function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // sombra/elevacao ao rolar
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const role = (user?.role as "DISCENTE" | "DOCENTE" | "PROPESQ") || "DISCENTE";

  const base: Item[] = [{ to: "/", label: "Dashboard", icon: <Home size={18} /> }];

  const discente: Section = {
    title: "Discente",
    items: [
      { to: "/meus-projetos", label: "Projetos", icon: <Files size={18} /> },
      { to: "/planos", label: "Planos de Trabalho", icon: <Notebook size={18} /> },
      { to: "/relatorios", label: "Relatórios", icon: <FileText size={18} /> },
      { to: "/certificados", label: "Certificados", icon: <ShieldCheck size={18} /> },
    ],
  };

  const docente: Section = {
    title: "Docente",
    items: [
      { to: "/meus-projetos", label: "Projetos", icon: <Files size={18} /> },
      { to: "/planos", label: "Planos de Trabalho", icon: <Notebook size={18} /> },
      { to: "/novo-projeto", label: "Cadastro de Projeto", icon: <GraduationCap size={18} /> },
      { to: "/relatorios", label: "Relatórios", icon: <FileText size={18} /> },
      { to: "/certificados", label: "Certificados", icon: <ShieldCheck size={18} /> },
    ],
  };

  const propesq: Section = {
    title: "PROPESQ",
    items: [
      { to: "/avaliacoes", label: "Avaliações", icon: <FileText size={18} /> },
      { to: "/painel-gerencial", label: "Painel Gerencial", icon: <LineChart size={18} /> },
      { to: "/certificados", label: "Certificados", icon: <ShieldCheck size={18} /> }
    ],
  };

  const account: Section = {
    title: "Conta",
    items: [
      { to: "/configuracoes", label: "Conta", icon: <User size={18} /> }
    ],
  };

  const sections: Section[] = [
    { items: base },
    ...(role === "DISCENTE" ? [discente] : []),
    ...(role === "DOCENTE" ? [docente] : []),
    ...(role === "PROPESQ" ? [propesq] : []),
    account,
  ];

  const flatItems: Item[] = sections.flatMap((s) => s.items);

  return (
    <header className={cx("appheader", scrolled && "is-scrolled")} role="banner">
      {/* Barra animada superior */}
      <div className="appheader__rainbow" aria-hidden />

      {/* ROW 1 — Título à esquerda / Ações + LOGO à direita */}
      <div className="appheader__row appheader__row--top">
        <a className="appheader__brand appheader__brand--logo" href="/" aria-label="Página inicial">
          <img src={LogoImg} alt="PROPESQ" />
        </a>

        <div className="appheader__actions">
          {/* Avatar dinâmico */}
          {user && (
            <div className="appheader__user">
              {/* se houver foto -> usa img, senão fallback com inicial */}
              {user.photoURL || user.avatarUrl || user.image ? (
                <img
                  className="appheader__avatar appheader__avatar-img"
                  src={(user.photoURL || user.avatarUrl || user.image) as string}
                  alt={user.name || "Usuário"}
                  onError={(e) => {
                    // fallback visual se a imagem quebrar
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "grid";
                  }}
                />
              ) : null}

              <div
                className="appheader__avatar appheader__avatar-fallback"
                style={{ display: user?.photoURL || user?.avatarUrl || user?.image ? "none" : "grid" }}
                aria-hidden={!!(user?.photoURL || user?.avatarUrl || user?.image)}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>

              <div className="appheader__user-meta">
                <span className="appheader__user-name">{user.name}</span>
                <span className="appheader__user-role">{user.role}</span>
              </div>
            </div>
          )}

          <button className="appheader__notify" aria-label="Notificações">
            <Bell size={18} />
            <span className="appheader__notify-dot" />
          </button>

          <button className="appheader__iconbtn" onClick={logout} title="Sair" aria-label="Sair">
            <LogOut size={16} />
          </button>

          <button
            className="appheader__burger"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* ROW 2 — Navegação horizontal (desktop) */}
      <nav className="appheader__row appheader__row--nav" role="navigation" aria-label="Menu principal">
        <ul className="appheader__navlist" role="menubar">
          {flatItems.map((it) => {
            const isActive = matchPathStartsWith(location.pathname, it.to);
            return (
              <li key={it.to} role="none">
                <NavLink
                  to={it.to}
                  className={({ isActive: strict }) =>
                    cx("appheader__link", (isActive || strict) && "is-active")
                  }
                  role="menuitem"
                >
                  <span className="appheader__link-icon" aria-hidden>
                    {it.icon}
                  </span>
                  <span className="appheader__link-label">{it.label}</span>
                  {it.badge && <span className="appheader__link-badge">{it.badge}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MENU MOBILE */}
      <nav
        className={cx("appheader__mobile", mobileOpen && "is-open")}
        aria-label="Menu principal (mobile)"
      >
        <ul className="appheader__mobile-list">
          <li className="appheader__mobile-user">
            <div className="appheader__avatar appheader__avatar--lg">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="appheader__mobile-user-meta">
              <div className="appheader__user-name">{user?.name || "Usuário"}</div>
              <div className="appheader__user-role">{role}</div>
            </div>
          </li>

          {sections.map((section, i) => (
            <React.Fragment key={i}>
              {section.title && <li className="appheader__section-title">{section.title}</li>}
              {section.items.map((it) => {
                const isActive = matchPathStartsWith(location.pathname, it.to);
                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      className={({ isActive: strict }) =>
                        cx("appheader__mobile-link", (isActive || strict) && "is-active")
                      }
                    >
                      <span className="appheader__link-icon" aria-hidden>
                        {it.icon}
                      </span>
                      <span className="appheader__link-label">{it.label}</span>
                      {it.badge && <span className="appheader__link-badge">{it.badge}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </React.Fragment>
          ))}

          <li className="appheader__mobile-bottom">
            <a className="appheader__org appheader__org--mobile" href="/" aria-label="Página inicial">
              <img src={LogoImg} alt="PROPESQ" />
            </a>

            <button className="appheader__mobile-logout" onClick={logout}>
              <LogOut size={16} /> <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
