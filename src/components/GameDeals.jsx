import { useEffect, useState, useMemo } from 'react'
import {
  ShoppingBag, ExternalLink, TrendingDown, Loader2,
  AlertTriangle, RefreshCw, Search, Tag
} from 'lucide-react'

/**
 * ============================================
 * GAME DEALS — Ofertas e Promoções
 * ============================================
 * Consome a API gratuita da CheapShark para
 * exibir ofertas reais de jogos nas lojas.
 * 
 * Preços originais da API vêm em USD.
 * Convertemos para BRL com cotação aproximada.
 */

const API_URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1,7,25&upperPrice=60&pageSize=30&sortBy=Deal+Rating'

/** Cotação aproximada USD → BRL (atualize conforme necessário) */
const USD_TO_BRL = 5.45

// Mapa de lojas (IDs da CheapShark)
const STORE_MAP = {
  '1':  { name: 'Steam',            color: 'bg-blue-600',   icon: '🎮' },
  '2':  { name: 'GamersGate',       color: 'bg-orange-600', icon: '🎯' },
  '3':  { name: 'GreenManGaming',   color: 'bg-green-600',  icon: '🟢' },
  '7':  { name: 'GOG',              color: 'bg-purple-600', icon: '🟣' },
  '8':  { name: 'Origin / EA',      color: 'bg-orange-500', icon: '🔶' },
  '11': { name: 'Humble Store',     color: 'bg-red-700',    icon: '📦' },
  '13': { name: 'Ubisoft',          color: 'bg-blue-500',   icon: '🔷' },
  '15': { name: 'Fanatical',        color: 'bg-amber-600',  icon: '⚡' },
  '21': { name: 'WinGameStore',     color: 'bg-cyan-600',   icon: '🪟' },
  '23': { name: 'GameBillet',       color: 'bg-teal-600',   icon: '🎟️' },
  '24': { name: 'Voidu',            color: 'bg-indigo-600', icon: '🎲' },
  '25': { name: 'Epic Games',       color: 'bg-gray-600',   icon: '🏔️' },
}

/** Formata número para R$ brasileiro */
const formatBRL = (usdValue) => {
  const brl = parseFloat(usdValue) * USD_TO_BRL
  return brl.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export default function GameDeals() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')

  const fetchDeals = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Falha ao buscar ofertas')
      const data = await res.json()
      setDeals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDeals() }, [])

  // Lojas presentes nos resultados (para filtro)
  const availableStores = useMemo(() => {
    const ids = [...new Set(deals.map(d => d.storeID))]
    return ids
      .map(id => ({ id, ...(STORE_MAP[id] || { name: 'Loja', color: 'bg-gray-600', icon: '🏪' }) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [deals])

  // Filtra por nome e loja
  const filtered = useMemo(() => {
    return deals.filter(d => {
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase())
      const matchStore = selectedStore === 'all' || d.storeID === selectedStore
      return matchSearch && matchStore
    })
  }, [deals, search, selectedStore])

  return (
    <section className="pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShoppingBag size={24} className="text-red-500" />
            Ofertas de Games
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Promoções em tempo real • Preços convertidos para R$ (cotação ≈ {USD_TO_BRL.toFixed(2)})
          </p>
        </div>
        <button
          onClick={fetchDeals}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A22] hover:bg-[#222230] text-gray-300 border border-[#2a2a35] rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Busca + Filtro de loja */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar jogo nas ofertas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#121216] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-sm"
          />
        </div>

        {/* Filtro por loja */}
        <select
          value={selectedStore}
          onChange={e => setSelectedStore(e.target.value)}
          className="px-4 py-3 bg-[#121216] border border-[#2a2a35] rounded-xl text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="all">🏪 Todas as lojas</option>
          {availableStores.map(store => (
            <option key={store.id} value={store.id}>
              {store.icon} {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <Loader2 size={40} className="text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Buscando melhores ofertas...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16 bg-[#121216] rounded-2xl border border-red-800/30">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={fetchDeals}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Deals Grid */}
      {!loading && !error && (
        <>
          {/* Contador de resultados */}
          <p className="text-xs text-gray-600 mb-4">
            {filtered.length} {filtered.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#121216] rounded-2xl border border-[#1f1f28]">
              <Search size={40} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma oferta encontrada{search && ` para "${search}"`}</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((deal, idx) => {
                const discount = Math.round(parseFloat(deal.savings))
                const store = STORE_MAP[deal.storeID] || { name: 'Loja', color: 'bg-gray-600', icon: '🏪' }
                const salePrice = parseFloat(deal.salePrice)
                const normalPrice = parseFloat(deal.normalPrice)
                const isFree = salePrice === 0

                return (
                  <a
                    key={deal.dealID}
                    href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#121216] border border-[#1f1f28] rounded-2xl overflow-hidden hover:border-red-600/40 hover:shadow-lg hover:shadow-red-600/5 transition-all animate-fade-in-up block"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {/* Capa do jogo */}
                    <div className="relative aspect-[16/9] bg-[#0A0A0C] overflow-hidden">
                      <img
                        src={deal.thumb}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = ''
                          e.target.style.display = 'none'
                        }}
                      />

                      {/* Badge de desconto */}
                      {discount > 0 && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg">
                          <TrendingDown size={11} />
                          -{discount}%
                        </div>
                      )}

                      {/* Badge grátis */}
                      {isFree && (
                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg uppercase tracking-wide shadow-lg">
                          Grátis
                        </div>
                      )}

                      {/* Badge da loja */}
                      <div className={`absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold text-white rounded-md ${store.color} shadow-lg flex items-center gap-1`}>
                        <span>{store.icon}</span>
                        {store.name}
                      </div>
                    </div>

                    {/* Informações do jogo */}
                    <div className="p-4">
                      {/* Título */}
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors mb-3">
                        {deal.title}
                      </h3>

                      {/* Preços */}
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          {/* Preço original riscado */}
                          {!isFree && normalPrice !== salePrice && (
                            <p className="text-xs text-gray-600 line-through mb-0.5">
                              De: {formatBRL(normalPrice)}
                            </p>
                          )}
                          {/* Preço com desconto */}
                          <p className={`text-lg font-black ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                            {isFree ? 'GRÁTIS' : formatBRL(salePrice)}
                          </p>
                        </div>

                        {/* Economia */}
                        {!isFree && discount > 0 && (
                          <div className="text-right">
                            <p className="text-[10px] text-gray-600 uppercase tracking-wide">Economia</p>
                            <p className="text-xs font-bold text-emerald-400">
                              {formatBRL(normalPrice - salePrice)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Link CTA */}
                      <div className="mt-3 pt-3 border-t border-[#1f1f28] flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] text-gray-500 group-hover:text-red-500 transition-colors font-medium">
                          <Tag size={11} />
                          Ver na {store.name}
                        </span>
                        <ExternalLink size={12} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}
