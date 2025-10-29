import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectForm from './pages/ProjectForm'
import Plans from './pages/Plans'
import PlanForm from './pages/PlanForm'
import Evaluations from './pages/Evaluations'
import EvaluationDetail from './pages/EvaluationDetail'
import Monitoring from './pages/Monitoring'
import Reports from './pages/Reports'
import Certificates from './pages/Certificates'
import CertificateView from './pages/CertificateView'
import AdminAnalytics from './pages/AdminAnalytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { AuthProvider, useAuth } from './context/AuthContext'

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-ufpb-light grid grid-rows-[auto_1fr_auto]">
      <AppHeader />
      <main className="overflow-auto p-4 md:p-6">{children}</main>
      <footer className="px-6 py-4 text-center border-t border-gray-200 bg-gray-100 text-gray-500">
        <div className="flex items-center justify-center">
          <span className="text-sm md:text-xs tracking-wide">
            © {new Date().getFullYear()} UFPB • PROPESQ
          </span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Protected><Shell><Dashboard/></Shell></Protected>} />
        <Route path="/meus-projetos" element={<Protected><Shell><Projects/></Shell></Protected>} />
        <Route path="/novo-projeto" element={<Protected><Shell><ProjectForm/></Shell></Protected>} />
        <Route path="/planos" element={<Protected><Shell><Plans/></Shell></Protected>} />
        <Route path="/novo-plano" element={<Protected><Shell><PlanForm/></Shell></Protected>} />
        <Route path="/avaliacoes" element={<Protected><Shell><Evaluations/></Shell></Protected>} />
        <Route path="/avaliacoes/:id" element={<Protected><Shell><EvaluationDetail/></Shell></Protected>} />
        <Route path="/acompanhamento" element={<Protected><Shell><Monitoring/></Shell></Protected>} />
        <Route path="/relatorios" element={<Protected><Shell><Reports/></Shell></Protected>} />
        <Route path="/certificados" element={<Protected><Shell><Certificates/></Shell></Protected>} />
        <Route path="/certificados/:id" element={<Protected><Shell><CertificateView/></Shell></Protected>} />
        <Route path="/painel-gerencial" element={<Protected><Shell><AdminAnalytics/></Shell></Protected>} />
        <Route path="/configuracoes" element={<Protected><Shell><Settings/></Shell></Protected>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </AuthProvider>
  )
}
