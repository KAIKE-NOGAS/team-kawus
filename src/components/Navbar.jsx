import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import {
  Menu, X, Gamepad2, LogIn, LogOut, User,
  Swords, ShoppingBag, Home, Shield
} from 'lucide-react'

/**
 * ============================================
 * NAVBAR — Navegação Principal
 * ============================================
 * Menu responsivo com hambúrguer para mobile
 * e links para as seções do portal.
 */

// Link do Discord do Team Kawus (substitua pelo real)
const DISCORD_LINK = 'https://discord.gg/HaTeDw45S'

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home',    label: 'Início',   icon: Home },
    { id: 'lobbies', label: 'Lobbies',  icon: Swords },
    { id: 'deals',   label: 'Ofertas',  icon: ShoppingBag },
  ]

  // Libera a aba Admin apenas para o usuário KAWUS
  if (user?.username?.toUpperCase() === 'KAWUS') {
    navItems.push({ id: 'admin', label: 'Painel', icon: Shield })
  }

  const handleNav = (id) => {
    setActiveTab(id)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#1f1f28]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src="/logo.png"
                alt="Team Kawus Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-red-600"
              />
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                TEAM <span className="text-red-500">KAWUS</span>
              </span>
            </div>

            {/* Links Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-600/15 text-red-500 border border-red-600/30'
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A22]'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Ações Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Discord */}
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Gamepad2 size={16} />
                Discord
              </a>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A22] rounded-lg border border-[#2a2a35]">
                    <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center">
                      <User size={14} className="text-red-400" />
                    </div>
                    <span className="text-sm text-gray-200 font-medium max-w-[100px] truncate">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#1A1A22] rounded-lg transition-colors cursor-pointer"
                    title="Sair"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <LogIn size={16} />
                  Entrar
                </button>
              )}
            </div>

            {/* Botão hambúrguer (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1f1f28] bg-[#0A0A0C] animate-fade-in-up">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-600/15 text-red-500 border border-red-600/30'
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A22]'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                )
              })}

              <hr className="border-[#1f1f28]" />

              {/* Discord Mobile */}
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 bg-[#5865F2]/10 text-[#7289DA] rounded-xl text-sm font-medium"
              >
                <Gamepad2 size={18} />
                Entrar no Discord
              </a>

              {/* Auth Mobile */}
              {user ? (
                <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A22] rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center">
                      <User size={16} className="text-red-400" />
                    </div>
                    <span className="text-sm text-gray-200 font-medium">{user.username}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false) }}
                    className="text-sm text-red-400 hover:text-red-300 font-medium cursor-pointer"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAuth(true); setMobileMenuOpen(false) }}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  <LogIn size={18} />
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-t border-[#1f1f28]">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
