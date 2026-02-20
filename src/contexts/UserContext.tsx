// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface User {
  email: string | null;
  uid: string | null;
  displayName: string | null;
  empresaNome?: string | null;
  funcao?: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let nome: string | null = null;
        let empresaNome: string | null = null;
        let funcao: string | null = null;

        try {
          // 🔥 1) Buscar na coleção FUNCIONARIOS
          const qFunc = query(
            collection(db, "funcionarios"),
            where("authUid", "==", firebaseUser.uid)
          );

          const snapFunc = await getDocs(qFunc);

          if (!snapFunc.empty) {
            const dados = snapFunc.docs[0].data();

            nome = dados.nome || null;
            empresaNome = dados.empresaNome || null;
            funcao = dados.funcao || null;

            console.log("🔥 Funcionário encontrado:", dados);
          } else {
            console.warn("⚠️ Não encontrado em funcionarios, buscando em clientes...");

            // 🔥 2) Buscar na coleção CLIENTES
            const qCli = query(
              collection(db, "clientes"),
              where("email", "==", firebaseUser.email)
            );

            const snapCli = await getDocs(qCli);

            if (!snapCli.empty) {
              const dadosCli = snapCli.docs[0].data();

              nome = dadosCli.nome || null;
              empresaNome = dadosCli.empresaNome || null;
              funcao = dadosCli.funcao || null;

              console.log("🔥 Cliente encontrado:", dadosCli);
            } else {
              console.warn("⚠️ Usuário não encontrado em clientes também.");
            }
          }
        } catch (error) {
          console.error("❌ Erro ao buscar dados do usuário:", error);
        }

        setUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          displayName: nome,
          empresaNome,
          funcao,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error('Erro ao fazer logout:', error));
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
