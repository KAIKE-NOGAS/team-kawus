import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'

/**
 * ============================================
 * LOBBY CONTEXT — TEAM KAWUS (FIREBASE)
 * ============================================
 * Gerencia os lobbies/chamadas de jogo.
 * Conectado ao Firestore para tempo real.
 */

const LobbyContext = createContext(null)

export function LobbyProvider({ children }) {
  const [lobbies, setLobbies] = useState([])

  // Busca os lobbies em tempo real do banco de dados
  useEffect(() => {
    const q = query(collection(db, 'lobbies'), orderBy('createdAt', 'desc'))
    
    // onSnapshot escuta alterações (criação, edição, exclusão) em tempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lobbiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setLobbies(lobbiesData)
    })

    return () => unsubscribe()
  }, [])

  /** Cria um novo lobby */
  const createLobby = async (lobby) => {
    try {
      await addDoc(collection(db, 'lobbies'), {
        ...lobby,
        members: [{ id: lobby.ownerId, username: lobby.ownerName }],
        status: 'open',
        createdAt: serverTimestamp() // Pega a hora exata do servidor do Google
      })
    } catch (error) {
      console.error("Erro ao criar lobby:", error)
    }
  }

  /** Entrar em um lobby */
  const joinLobby = async (lobbyId, user, currentMembers) => {
    try {
      const lobbyRef = doc(db, 'lobbies', lobbyId)
      const newMembers = [...currentMembers, { id: user.id, username: user.username }]
      await updateDoc(lobbyRef, { members: newMembers })
    } catch (error) {
      console.error("Erro ao entrar no lobby:", error)
    }
  }

  /** Sair de um lobby */
  const leaveLobby = async (lobbyId, userId, currentMembers) => {
    try {
      const lobbyRef = doc(db, 'lobbies', lobbyId)
      const newMembers = currentMembers.filter(m => m.id !== userId)
      await updateDoc(lobbyRef, { members: newMembers })
    } catch (error) {
      console.error("Erro ao sair do lobby:", error)
    }
  }

  /** Fechar / Excluir lobby (apenas o dono) */
  const closeLobby = async (lobbyId) => {
    try {
      await deleteDoc(doc(db, 'lobbies', lobbyId))
    } catch (error) {
      console.error("Erro ao excluir lobby:", error)
    }
  }

  return (
    <LobbyContext.Provider value={{ lobbies, createLobby, joinLobby, leaveLobby, closeLobby }}>
      {children}
    </LobbyContext.Provider>
  )
}

export const useLobbies = () => {
  const ctx = useContext(LobbyContext)
  if (!ctx) throw new Error('useLobbies deve ser usado dentro de <LobbyProvider>')
  return ctx
}
