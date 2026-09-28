import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import { Swords, ShoppingBag, Users, Gamepad2, ChevronRight, Zap } from 'lucide-react'

/**
 * ============================================
 * HERO SECTION — Tela Inicial do Portal
 * ============================================
 * Página de boas-vindas com CTA e stats.
 */

const DISCORD_LINK = 'https://discord.gg/HaTeDw45S'

export default function HeroSection({ setActiveTab }) {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  const features = [
    {
      icon: Swords,
      title: 'Lobbies de Jogo',
      desc: 'Crie chamadas, monte seu time e jogue com a comunidade.',
      action: () => setActiveTab('lobbies'),
      cta: 'Ver Lobbies',
    },
    {
      icon: ShoppingBag,
      title: 'Ofertas de Games',
      desc: 'Promoções em tempo real das maiores lojas de jogos.',
      action: () => setActiveTab('deals'),
      cta: 'Ver Ofertas',
    },
    {
      icon: Users,
      title: 'Comunidade Discord',
      desc: 'Conecte-se com centenas de jogadores no nosso servidor.',
      action: () => window.open(DISCORD_LINK, '_blank'),
      cta: 'Entrar no Discord',
    },
  ]

  return (
    <>
      <section className="pb-24 md:pb-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121216] via-[#1A1A22] to-[#0A0A0C] border border-[#1f1f28] mb-8">
          {/* Glow decorativo */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-600/5 rounded-full blur-3xl" />

          <div className="relative p-6 sm:p-10 md:p-14">
            {/* Logo grande */}
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Team Kawus Logo"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl"
              />
            </div>

            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-xs font-semibold mb-4">
                <Zap size={12} />
                COMUNIDADE ATIVA
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                TEAM <span className="text-red-500">KAWUS</span>
              </h1>
              <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                O quartel-general da galera. Monte seu time, encontre jogadores,
                acompanhe promoções e domine os lobbies.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                {user ? (
                  <button
                    onClick={() => setActiveTab('lobbies')}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/25 text-sm"
                  >
                    <Swords size={18} />
                    Ir para Lobbies
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/25 text-sm"
                  >
                    <Gamepad2 size={18} />
                    Entrar no Portal
                    <ChevronRight size={16} />
                  </button>
                )}

                <a
                  href={DISCORD_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#5865F2]/15 hover:bg-[#5865F2]/25 text-[#7289DA] border border-[#5865F2]/30 font-semibold rounded-xl transition-all text-sm"
                >
                  Discord
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <button
                key={idx}
                onClick={feat.action}
                className="group text-left bg-[#121216] border border-[#1f1f28] rounded-2xl p-5 hover:border-red-600/30 transition-all cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors">
                  <Icon size={20} className="text-red-500" />
                </div>
                <h3 className="text-white font-bold text-base mb-1">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{feat.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold group-hover:gap-2 transition-all">
                  {feat.cta}
                  <ChevronRight size={12} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}

/** Mini ícone de external link inline */
function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
