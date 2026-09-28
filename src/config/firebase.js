import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * ============================================
 * FIREBASE CONFIGURATION
 * ============================================
 * Conecta o app ao banco de dados do Google.
 * Chaves injetadas diretamente para facilitar o deploy na Vercel.
 */

const firebaseConfig = {
  apiKey: "AIzaSyBlj2PZ3eT9lcZqUFXgovwlk92tF2XoLo8",
  authDomain: "team-kawus.firebaseapp.com",
  projectId: "team-kawus",
  storageBucket: "team-kawus.firebasestorage.app",
  messagingSenderId: "723238868683",
  appId: "1:723238868683:web:b9aaae48e5cbf184e5ed4e"
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)

// Exporta a Autenticação e o Banco de Dados (Firestore)
export const auth = getAuth(app)
export const db = getFirestore(app)
