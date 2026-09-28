import { Heart } from 'lucide-react'

/**
 * ============================================
 * FOOTER — Rodapé do Portal
 * ============================================
 * Logo do Team Kawus + créditos.
 */

const DISCORD_LINK = 'https://discord.gg/HaTeDw45S'

export default function Footer() {
  return (
    <footer className="border-t border-[#1f1f28] bg-[#0A0A0C] mt-12 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Team Kawus Logo"
            className="w-16 h-16 object-contain opacity-80"
          />

          <div className="text-center">
            <p className="text-white font-bold text-lg">
              TEAM <span className="text-red-500">KAWUS</span>
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Comunidade de eSports & Gaming
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-[#7289DA] transition-colors"
            >
              Discord
            </a>
            <span className="text-gray-800">•</span>
            <span className="text-xs text-gray-500">
              Preços via CheapShark API
            </span>
          </div>

          {/* Copyright */}
          <p className="flex items-center gap-1 text-[11px] text-gray-700">
            © {new Date().getFullYear()} Team Kawus — Feito com
            <Heart size={10} className="text-red-600 fill-red-600" />
            para a comunidade
          </p>
        </div>
      </div>
    </footer>
  )
}
