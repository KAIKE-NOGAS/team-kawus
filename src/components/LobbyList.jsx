import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLobbies } from '../context/LobbyContext'
import CreateLobbyModal from './CreateLobbyModal'
import { CATEGORY_COLORS } from '../data/games'
import {
  Plus, Users, Clock, Calendar, Trash2, LogIn, LogOut,
  Swords, User, MessageSquare, Gamepad2
} from 'lucide-react'

/**
 * ============================================
 * LOBBY LIST — Lista de Chamadas Ativas
 * ============================================
 * Cards escuros com detalhes vermelhos.
 * Mostra vagas, membros e ações contextuais.
 */

export default function LobbyList() {
  const { user } = useAuth()
  const { lobbies, joinLobby, leaveLobby, closeLobby } = useLobbies()
  const [showCreate, setShowCreate] = useState(false)

  const openLobbies = lobbies.filter(l => {
    if (l.status !== 'open') return false

    // Regra temporal: Se passar 1 dia completo após a data do jogo, oculta o lobby
    if (l.date) {
      const [year, month, day] = l.date.split('-')
      // Seta a data do jogo para às 23:59:59 daquele dia
      const lobbyDate = new Date(year, month - 1, day, 23, 59, 59)
      const now = new Date()
      const umDiaEmMs = 24 * 60 * 60 * 1000

      if (now.getTime() > lobbyDate.getTime() + umDiaEmMs) {
        return false // Expirou
      }
    }
    return true
  })

  /** Formata data para exibição */
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <section className="pb-24 md:pb-8">
      {/* Header da seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Swords size={24} className="text-red-500" />
            Lobbies Ativos
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {openLobbies.length} {openLobbies.length === 1 ? 'chamada aberta' : 'chamadas abertas'}
          </p>
        </div>

        {user ? (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm shadow-lg shadow-red-600/20"
          >
            <Plus size={18} />
            Criar Lobby
          </button>
        ) : (
          <p className="text-gray-500 text-sm italic">Faça login para criar lobbies</p>
        )}
      </div>

      {/* Lista de lobbies */}
      {openLobbies.length === 0 ? (
        <div className="text-center py-20 bg-[#121216] rounded-2xl border border-[#1f1f28]">
          <Gamepad2 size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Nenhum lobby ativo</p>
          <p className="text-gray-600 text-sm mt-1">Crie o primeiro e chame a galera!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {openLobbies.map((lobby, idx) => {
            const isMember = user && lobby.members.some(m => m.id === user.id)
            const isOwner = user && lobby.ownerId === user.id
            const isFull = lobby.members.length >= lobby.maxPlayers
            const catColor = CATEGORY_COLORS[lobby.gameCategory] || 'bg-gray-600'

            return (
              <div
                key={lobby.id}
                className="bg-[#121216] border border-[#1f1f28] rounded-2xl overflow-hidden hover:border-red-600/30 transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Card Header — Jogo e Categoria */}
                <div className="p-4 pb-3 border-b border-[#1f1f28]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-base truncate">{lobby.gameName}</h3>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white rounded ${catColor}`}>
                        {lobby.gameCategory}
                      </span>
                    </div>
                    {/* Vagas */}
                    <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isFull
                        ? 'bg-red-600/15 text-red-400 border border-red-600/30'
                        : 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/30'
                    }`}>
                      <Users size={12} />
                      {lobby.members.length}/{lobby.maxPlayers}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  {/* Criador */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center shrink-0">
                      <User size={12} className="text-red-400" />
                    </div>
                    <span className="text-sm text-gray-300 truncate">{lobby.ownerName}</span>
                    <span className="text-[10px] text-gray-600 bg-[#1A1A22] px-1.5 py-0.5 rounded">host</span>
                  </div>

                  {/* Data & Hora */}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-red-500/70" />
                      {formatDate(lobby.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-red-500/70" />
                      {lobby.time}
                    </span>
                  </div>

                  {/* Descrição */}
                  {lobby.description && (
                    <div className="flex items-start gap-2 bg-[#0A0A0C] rounded-lg p-2.5">
                      <MessageSquare size={12} className="text-gray-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-400 leading-relaxed">{lobby.description}</p>
                    </div>
                  )}

                  {/* Membros */}
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5 font-semibold">Membros</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lobby.members.map(member => (
                        <span
                          key={member.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#1A1A22] text-gray-300 text-[11px] rounded-md border border-[#2a2a35]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {member.username}
                        </span>
                      ))}
                      {Array.from({ length: lobby.maxPlayers - lobby.members.length }).map((_, i) => (
                        <span
                          key={`empty-${i}`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#0A0A0C] text-gray-700 text-[11px] rounded-md border border-[#1f1f28] border-dashed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                          vago
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {user && (
                  <div className="p-4 pt-0 flex gap-2">
                    {isOwner ? (
                      <button
                        onClick={() => closeLobby(lobby.id, user.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Excluir Lobby
                      </button>
                    ) : isMember ? (
                      <button
                        onClick={() => leaveLobby(lobby.id, user.id, lobby.members)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1A1A22] hover:bg-[#222230] text-gray-300 border border-[#2a2a35] rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        <LogOut size={14} />
                        Sair do Time
                      </button>
                    ) : !isFull ? (
                      <button
                        onClick={() => joinLobby(lobby.id, user, lobby.members)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/20"
                      >
                        <LogIn size={14} />
                        Entrar no Time
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-2.5 text-gray-600 text-xs font-medium">
                        Lobby lotado
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de criação */}
      <CreateLobbyModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </section>
  )
}
