import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Shield, Trash2, Users, AlertTriangle } from 'lucide-react'

export default function AdminPanel() {
  const { user } = useAuth()
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  // Apenas o usuário KAWUS tem acesso
  const isAdmin = user?.username?.toUpperCase() === 'KAWUS'

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      // Ordena pelos mais recentes
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setUsersList(list)
    } catch (error) {
      console.error("Erro ao buscar usuários", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) fetchUsers()
  }, [isAdmin])

  const handleDeleteUser = async (id, username) => {
    if (window.confirm(`Tem certeza que deseja banir o usuário ${username}? Ele será removido do painel.`)) {
      try {
        await deleteDoc(doc(db, 'users', id))
        fetchUsers() // Atualiza a lista
      } catch (error) {
        alert("Erro ao excluir usuário.")
      }
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        <AlertTriangle size={48} className="mx-auto mb-4" />
        Acesso Negado. Apenas o administrador da comunidade pode ver esta página.
      </div>
    )
  }

  return (
    <section className="animate-fade-in-up pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield size={28} className="text-red-500" />
            Painel KAWUS
          </h2>
          <p className="text-gray-500 text-sm mt-1">Gerenciamento de membros da comunidade</p>
        </div>
      </div>

      <div className="bg-[#121216] border border-[#1f1f28] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#1f1f28] bg-[#1A1A22] flex items-center gap-2">
          <Users size={20} className="text-gray-400" />
          <h3 className="text-white font-semibold">Membros Cadastrados ({usersList.length})</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Buscando membros...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0A0A0C] text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Membro</th>
                  <th className="px-6 py-4">Data de Entrada</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f28]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1A1A22] transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{u.username}</td>
                    <td className="px-6 py-4">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Desconhecida'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-red-600/20 text-red-500 border border-red-600/30' 
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {u.role === 'admin' ? 'Fundador' : 'Membro'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.username.toUpperCase() !== 'KAWUS' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Banir Membro"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {usersList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Nenhum membro encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
