import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, Role } from '@/context/AuthContext'
import '@/styles/Login.css'
import logo from '@/styles/imgs/logo_propesq.png'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [searchParams] = useSearchParams()


  const Roles = ['DISCENTE', 'COORDENADOR', 'ADMINISTRADOR']

  const initialRole = useMemo(() => {
    const fromUrl = (searchParams.get('role') || '').toUpperCase()
    const validFromUrl = Roles.includes(fromUrl)
      ? (fromUrl as Role)
      : null

    const fromStorage = (localStorage.getItem('role') || '').toUpperCase()
    const validFromStorage = Roles.includes(fromStorage)
      ? (fromStorage as Role)
      : null

    return validFromUrl || validFromStorage || ('DISCENTE' as Role)
  }, [searchParams])

  const [role, setRole] = useState<Role>(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { setRole(initialRole) }, [initialRole])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('role', role)
    login(email || 'usuario@ufpb.br', password, role)

    // Redirecionamento por função
    if (role === 'ADMINISTRADOR') {
      nav('/') // Dashboard
    } else if (role === 'DISCENTE' || role === 'COORDENADOR') {
      nav('/projetos')
    } else {
      nav('/') // fallback
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-card login-card--elevated">
        <div className="login-header">
          <img src={logo} alt="UFPB / PROPESQ" className="login-logo" />
          <h1 className="login-title-sigaa">PRÓ-REITORIA DE PESQUISA - UFPB</h1>
        </div>

        <div className="login-panel">
          <label className="login-label">E-mail Institucional</label>
          <input
            className="login-input login-input--outlined"
            type="email"
            placeholder="E-mail Institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Senha</label>
          <input
            className="login-input login-input--outlined"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 🔹 Seleção de papéis atualizada */}
          <div className="role-group" role="group" aria-label="Escolher perfil">
            {Roles.map((r) => (
              <button
                type="button"
                key={r}
                className={`role-chip ${role === r ? 'is-active' : ''}`}
                onClick={() => setRole(r as Role)}
                aria-pressed={role === r}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="login-actions">
            <button type="submit" className="btn-primary-lg">ENTRAR</button>
          </div>

          <div className="login-links login-links--inline">
            <a href="#" className="login-link">Recuperar Senha</a>
            <span className="link-sep">•</span>
            <a href="#" className="login-link">Cadastrar</a>
          </div>
        </div>
      </form>

      <div className="login-footer">
        PROPESQ - UFPB - © 2025
      </div>
    </div>
  )
}
