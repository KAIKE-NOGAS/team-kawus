import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { LobbyProvider } from './context/LobbyContext'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LobbyList from './components/LobbyList'
import GameDeals from './components/GameDeals'
import Footer from './components/Footer'

/**
 * ============================================
 * APP — Componente Raiz do Portal TEAM KAWUS
 * ============================================
 * Gerencia a navegação por abas entre as seções:
 * Home, Lobbies e Ofertas de Games.
 */

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <AuthProvider>
      <LobbyProvider>
        <div className="min-h-screen bg-black flex flex-col">
          {/* Navbar fixa no topo */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Conteúdo principal */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
            {activeTab === 'home' && <HeroSection setActiveTab={setActiveTab} />}
            {activeTab === 'lobbies' && <LobbyList />}
            {activeTab === 'deals' && <GameDeals />}
          </main>

          {/* Rodapé */}
          <Footer />
        </div>
      </LobbyProvider>
    </AuthProvider>
  )
}
