import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

/**
 * ============================================
 * AUTH CONTEXT — TEAM KAWUS (FIREBASE)
 * ============================================
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ id: currentUser.uid, username: currentUser.displayName || 'Jogador' })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const formatEmail = (username) => `${username.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@teamkawus.com`

  const register = async (username, password) => {
    if (username.trim().length < 3) return { success: false, error: 'Nome deve ter pelo menos 3 caracteres.' }
    if (password.length < 6) return { success: false, error: 'Senha deve ter pelo menos 6 caracteres.' }

    try {
      const email = formatEmail(username)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await updateProfile(userCredential.user, { displayName: username.trim() })
      
      // Salva no banco de dados Firestore para o Painel Admin
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: username.trim(),
        email: email,
        role: username.trim().toUpperCase() === 'KAWUS' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      })
      
      setUser({ id: userCredential.user.uid, username: username.trim() })
      return { success: true }
    } catch (error) {
      console.error(error)
      // Tratamento amigável para usuário duplicado
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'Este nome de usuário já está em uso! Escolha outro.' }
      }
      return { success: false, error: `Falha no Firebase: ${error.code}` }
    }
  }

  const login = async (username, password) => {
    try {
      const email = formatEmail(username)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser({ id: userCredential.user.uid, username: userCredential.user.displayName })
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, error: 'Usuário ou senha incorretos.' }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Erro ao sair", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
