import { doc, collection, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const criarSolicitacao = async (solicitacao: {
  dataInicio: string;
  dataFim: string;
  veiculo?: string;
  motivo: string;
  descricao: string;
  uid: string
}) => {
  // Valida se o UID foi passado corretamente
  if (!solicitacao.uid) {
    console.error('Erro: UID do usuário não foi informado.');
    return;
  }

  // Dados da solicitação a ser salva
  const dados = {
    ...solicitacao,
    situacao: 'pendente',  // Estado inicial como 'pendente'
    criadoEm: new Date().toISOString(),  // Timestamp de criação
    adminView: true, // Indica que o administrador pode visualizar todas as solicitações
  };

  try {
    // Referência ao documento do usuário, baseado no UID
    const usuarioRef = doc(db, 'solicitacoes', solicitacao.uid);

    // 🔍 Verifica se o documento do usuário já existe
    const usuarioDoc = await getDoc(usuarioRef);
    if (!usuarioDoc.exists()) {
      console.log(`Criando documento do usuário: ${solicitacao.uid}`);
      await setDoc(usuarioRef, {});  // Cria documento vazio para garantir que a subcoleção seja acessível
    }

    // 🔄 Criando a subcoleção "lista_solicitacoes" dentro do documento do usuário
    const listaRef = collection(usuarioRef, 'lista_solicitacoes');

    // 📝 Adicionando a solicitação na subcoleção 'lista_solicitacoes'
    const novoCheckListRef = await addDoc(listaRef, dados);
    console.log('Solicitação criada com sucesso', novoCheckListRef.id);
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
  }
};