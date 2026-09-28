import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { LobbyProvider } from './context/LobbyContext'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import LobbyList from './components/LobbyList'
import GameDeals from './components/GameDeals'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <AuthProvider>
      <LobbyProvider>
        <div className="min-h-screen bg-black flex flex-col">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
            {activeTab === 'home' && <HeroSection setActiveTab={setActiveTab} />}
            {activeTab === 'lobbies' && <LobbyList />}
            {activeTab === 'deals' && <GameDeals />}
            {activeTab === 'admin' && <AdminPanel />}
          </main>

          <Footer />
        </div>
      </LobbyProvider>
    </AuthProvider>
  )
}
