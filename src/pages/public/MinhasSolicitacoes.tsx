import React, { useEffect, useState } from 'react';
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FaCarSide, FaRegClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

// Interface das solicitações
interface Solicitacao {
  id: string;
  veiculo?: string;
  dataInicio: string;
  dataFim: string;
  motivo: string;
  descricao: string;
  situacao: string;
  criadoEm: any; // Timestamp do Firestore ou string
}

const MinhasSolicitacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [ultimoDocumento, setUltimoDocumento] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [resetFiltro, setResetFiltro] = useState<boolean>(false); // Adicionado para reset

  // Função para buscar as solicitações
  const fetchSolicitacoes = async (pagina: number) => {
    const user = auth.currentUser;
    if (!user) return;

    setCarregando(true);

    try {
      const usuarioDocRef = doc(db, 'solicitacoes', user.uid);
      const listaRef = collection(usuarioDocRef, 'lista_solicitacoes');

      let q;

      if (filtro === 'todos') {
        q = query(listaRef, orderBy('criadoEm', 'desc'), limit(5));
      } else {
        q = query(listaRef, where('situacao', '==', filtro.trim()), orderBy('criadoEm', 'desc'), limit(5));
      }

      // Só aplica paginação se não estivermos resetando o filtro
      if (pagina > 1 && ultimoDocumento) {
        q = query(q, startAfter(ultimoDocumento));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        if (pagina === 1) {
          Swal.fire({
            icon: 'info',
            title: '🚨 Atenção!',
            text: 'Você não tem solicitações para exibir.',
            confirmButtonText: 'OK',
          });
        }
        setCarregando(false);
        return;
      }

      const listaSolicitacoes: Solicitacao[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Solicitacao[];

      // Atualiza a lista corretamente dependendo da página
      setSolicitacoes((prev) => {
        const novas = pagina === 1 ? listaSolicitacoes : [...prev, ...listaSolicitacoes];
        return novas.filter((item, index, self) => index === self.findIndex((i) => i.id === item.id));
      });

      setUltimoDocumento(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error: any) {
      console.error('Erro ao buscar solicitações:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível carregar as solicitações. Verifique se o índice existe no Firestore.',
      });
    } finally {
      setCarregando(false);
    }
  };

  // Efeito para filtro: resetar tudo
  useEffect(() => {
    setPaginaAtual(1);
    setSolicitacoes([]);
    setUltimoDocumento(null);
    setResetFiltro(true);
  }, [filtro]);

  // Efeito para fetch: executa sempre que pagina ou filtro for alterado
  useEffect(() => {
    if (resetFiltro || paginaAtual > 1) {
      fetchSolicitacoes(paginaAtual);
      setResetFiltro(false);
    }
  }, [paginaAtual, resetFiltro]);

  const loadMore = () => {
    setPaginaAtual((prev) => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h2>Histórico de Checklist</h2>

      {/* Filtro */}
      <div style={{ margin: '16px 0' }}>
        <label htmlFor="filtro">Filtrar por situação:</label>
        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="form-select mt-2"
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      {/* Lista de solicitações */}
      {solicitacoes.length === 0 && !carregando ? (
        <p>Nenhuma solicitação encontrada.</p>
      ) : (
        <div className="list-group">
          {solicitacoes.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <div className="list-group-item p-3 mb-3 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-1">
                    <FaCarSide className="me-2" />
                    {s.veiculo || 'Não informado'}
                  </h5>
                  <span className={`badge ${s.situacao === 'pendente' ? 'bg-warning' : 'bg-success'}`}>
                    {s.situacao}
                  </span>
                </div>

                <p className="mb-1"><strong>Motivo:</strong> {s.motivo}</p>
                <p className="mb-1"><strong>Descrição:</strong> {s.descricao}</p>
                <p className="mb-1"><FaRegClock className="me-2" /><strong>Início:</strong> {new Date(s.dataInicio).toLocaleString()}</p>
                <p className="mb-1"><FaRegClock className="me-2" /><strong>Fim:</strong> {new Date(s.dataFim).toLocaleString()}</p>

                <p className="mb-1">
                  <small>
                    <strong>Criado em:</strong>{' '}
                    {s.criadoEm?.toDate
                      ? s.criadoEm.toDate().toLocaleString()
                      : typeof s.criadoEm === 'string'
                      ? new Date(s.criadoEm).toLocaleString()
                      : 'Data inválida'}
                  </small>
                </p>

                <div className="d-flex justify-content-end">
                  {s.situacao === 'pendente' ? (
                    <FaExclamationCircle className="text-warning" />
                  ) : (
                    <FaCheckCircle className="text-success" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Botão "Carregar mais" */}
      {!carregando && solicitacoes.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={loadMore}>
            Carregar mais
          </button>
        </div>
      )}

      {/* Spinner de carregamento */}
      {carregando && (
        <div className="text-center mt-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasSolicitacoes;