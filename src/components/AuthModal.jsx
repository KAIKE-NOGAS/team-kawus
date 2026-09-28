import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { X, User, Lock, LogIn, UserPlus } from 'lucide-react'

/**
 * ============================================
 * AUTH MODAL — Login & Cadastro
 * ============================================
 * Modal minimalista para autenticação.
 * Alterna entre Login e Cadastro na mesma tela.
 */

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = isLogin
      ? login(username, password)
      : register(username, password)

    setTimeout(() => {
      setLoading(false)
      if (result.success) {
        setUsername('')
        setPassword('')
        onClose()
      } else {
        setError(result.error)
      }
    }, 300)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#121216] border border-[#2a2a35] rounded-2xl shadow-2xl animate-fade-in-up">

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header do modal */}
        <div className="p-6 pb-0 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#1A1A22] border-2 border-red-600 flex items-center justify-center mb-4">
            {isLogin ? <LogIn size={28} className="text-red-500" /> : <UserPlus size={28} className="text-red-500" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Entrar no Portal' : 'Criar Conta'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? 'Acesse seu perfil KAWUS' : 'Junte-se ao TEAM KAWUS'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Nome de Usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0A0A0C] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0A0A0C] border border-[#2a2a35] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800/30 rounded-lg p-2">
              {error}
            </p>
          )}

          {/* Botão submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </>
            )}
          </button>

          {/* Toggle Login / Cadastro */}
          <p className="text-center text-gray-400 text-sm">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 text-red-500 hover:text-red-400 font-semibold transition-colors cursor-pointer"
            >
              {isLogin ? 'Cadastrar' : 'Fazer Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
