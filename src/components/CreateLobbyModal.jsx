import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLobbies } from '../context/LobbyContext'
import { GAMES, TEAM_SIZES } from '../data/games'
import { X, Plus, Calendar, Users, MessageSquare, Gamepad2 } from 'lucide-react'

/**
 * ============================================
 * CREATE LOBBY MODAL — Criar Chamada de Jogo
 * ============================================
 */

export default function CreateLobbyModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const { createLobby } = useLobbies()

  const [gameId, setGameId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [description, setDescription] = useState('')

  if (!isOpen || !user) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    const selectedGame = GAMES.find(g => g.id === gameId)
    if (!selectedGame) return

    createLobby({
      gameId,
      gameName: selectedGame.name,
      gameCategory: selectedGame.category,
      date,
      time,
      maxPlayers: Number(maxPlayers),
      description: description.trim(),
      ownerId: user.id,
      ownerName: user.username,
    })

    // Limpa e fecha
    setGameId('')
    setDate('')
    setTime('')
    setMaxPlayers(4)
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#121216] border border-[#2a2a35] rounded-2xl shadow-2xl animate-fade-in-up">

        {/* Header */}
        <div className="sticky top-0 bg-[#121216] p-5 pb-3 border-b border-[#1f1f28] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center">
              <Plus size={20} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Criar Lobby</h2>
              <p className="text-xs text-gray-500">Monte seu time, escolha o jogo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Jogo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Gamepad2 size={14} className="text-red-500" />
              Jogo
            </label>
            <select
              value={gameId}
              onChange={e => setGameId(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0C] border border-[#2a2a35] rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">Selecione um jogo...</option>
              {GAMES.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name} — {game.category}
                </option>
              ))}
            </select>
          </div>

          {/* Data & Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar size={14} className="text-red-500" />
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0C] border border-[#2a2a35] rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Horário</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0C] border border-[#2a2a35] rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* Tamanho do time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Users size={14} className="text-red-500" />
              Tamanho do Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TEAM_SIZES.map(size => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setMaxPlayers(size.value)}
                  className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    maxPlayers === size.value
                      ? 'bg-red-600/15 text-red-400 border-red-600/50'
                      : 'bg-[#0A0A0C] text-gray-400 border-[#2a2a35] hover:border-gray-600'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <MessageSquare size={14} className="text-red-500" />
              Observação
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Busco prata/ouro, jogatina casual, treino ranked..."
              className="w-full px-4 py-3 bg-[#0A0A0C] border border-[#2a2a35] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all resize-none h-20"
              maxLength={200}
            />
            <p className="text-right text-xs text-gray-600 mt-1">{description.length}/200</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={18} />
            Criar Lobby
          </button>
        </form>
      </div>
    </div>
  )
}
