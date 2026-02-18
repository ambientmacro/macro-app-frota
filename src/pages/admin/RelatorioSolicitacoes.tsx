// Importações principais
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
    getDocs,
    collection,
    doc,
    updateDoc,
    getDoc,
    DocumentData,
    serverTimestamp
} from "firebase/firestore";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { db } from "../../firebaseConfig";

// Chart.js
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Componente principal de relatório de solicitações
const RelatorioSolicitacoes: React.FC = () => {
    // Estados principais
    const [usuarios, setUsuarios] = useState<{ id: string; nome: string; email: string }[]>([]);
    const [solicitacoes, setSolicitacoes] = useState<{ [key: string]: any[] }>({});
    const [carregando, setCarregando] = useState<boolean>(true);
    const [usuariosExpandido, setUsuariosExpandido] = useState<{ [key: string]: boolean }>({});

    // Filtros de busca
    const [filtroSituacao, setFiltroSituacao] = useState<string>("todos");
    const [filtroNome, setFiltroNome] = useState<string>("");

    // Contadores de status para o gráfico
    const [contagemStatus, setContagemStatus] = useState({ pendente: 0, finalizado: 0 });

    // Efeito para carregar os usuários inicialmente
    useEffect(() => {
        fetchUsuarios();
    }, []); // Carrega uma vez ao montar o componente

    // Função para buscar os usuários do banco de dados
    const fetchUsuarios = async () => {
        setCarregando(true);
        try {
            const usuariosSnapshot = await getDocs(collection(db, "solicitacoes"));
            if (usuariosSnapshot.empty) {
                setUsuarios([]);
            } else {
                // Busca informações detalhadas de cada usuário
                const listaUsuarios = await Promise.all(
                    usuariosSnapshot.docs.map(async (documento) => {
                        const userId = documento.id;
                        const clienteRef = doc(db, "clientes", userId);
                        const clienteSnapshot = await getDoc(clienteRef);
                        const clienteData = clienteSnapshot.data() as DocumentData;

                        return {
                            id: userId,
                            nome: clienteSnapshot.exists() ? clienteData.nome : "Nome desconhecido",
                            email: clienteSnapshot.exists() ? clienteData.email : "Email desconhecido"
                        };
                    })
                );
                setUsuarios(listaUsuarios);

                // Após obter usuários, conta as solicitações pendentes e finalizadas
                contarSolicitacoes(listaUsuarios);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setCarregando(false);
        }
    };

    // Função para contar as solicitações pendentes e finalizadas
    const contarSolicitacoes = async (usuariosLista: { id: string }[]) => {
        let pendentes = 0;
        let finalizados = 0;

        for (const usuario of usuariosLista) {
            const solicitacoesRef = collection(db, `solicitacoes/${usuario.id}/lista_solicitacoes`);
            const snapshot = await getDocs(solicitacoesRef);

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.situacao === "pendente") pendentes++;
                if (data.situacao === "finalizado") finalizados++;
            });
        }

        // Atualiza os contadores para o gráfico
        setContagemStatus({ pendente: pendentes, finalizado: finalizados });
    };

    // Função para buscar as solicitações de um usuário específico
    const fetchSolicitacoes = async (usuarioId: string) => {
        try {
            const solicitacoesRef = collection(db, `solicitacoes/${usuarioId}/lista_solicitacoes`);
            const solicitacoesSnapshot = await getDocs(solicitacoesRef);

            if (solicitacoesSnapshot.empty) {
                setSolicitacoes(prev => ({ ...prev, [usuarioId]: [] }));
                return;
            }

            const listaSolicitacoes = solicitacoesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filtra as solicitações conforme o filtro de situação
            const solicitacoesFiltradas = listaSolicitacoes.filter(solicitacao =>
                filtroSituacao === "todos" || solicitacao.situacao === filtroSituacao
            );

            setSolicitacoes(prev => ({ ...prev, [usuarioId]: solicitacoesFiltradas }));
        } catch (error) {
            console.error(`Erro ao buscar solicitações do usuário ${usuarioId}:`, error);
        }
    };

    // Função para expandir ou recolher as solicitações de um usuário
    const toggleExpandir = (usuarioId: string) => {
        setUsuariosExpandido(prev => ({
            ...prev,
            [usuarioId]: !prev[usuarioId]
        }));

        // Só busca as solicitações se não forem carregadas ainda
        if (!solicitacoes[usuarioId]) {
            fetchSolicitacoes(usuarioId);
        }
    };

    // Função para confirmar a finalização de uma solicitação
    const confirmarFinalizacao = (usuarioId: string, solicitacaoId: string) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja marcar este chamado como finalizado?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, finalizar!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                atualizarSituacao(usuarioId, solicitacaoId);
                Swal.fire("Finalizado!", "O chamado foi marcado como finalizado.", "success");
            }
        });
    };

    // Função para atualizar a situação de uma solicitação para 'finalizado'
    const atualizarSituacao = async (usuarioId: string, solicitacaoId: string) => {
        try {
            const solicitacaoRef = doc(db, `solicitacoes/${usuarioId}/lista_solicitacoes/${solicitacaoId}`);
            await updateDoc(solicitacaoRef, {
                situacao: "finalizado",
                horaFinalizacao: serverTimestamp()
            });

            // Atualiza a lista de solicitações localmente e o gráfico de status
            fetchSolicitacoes(usuarioId);
            contarSolicitacoes(usuarios);
        } catch (error) {
            console.error(`Erro ao atualizar solicitação ${solicitacaoId}:`, error);
        }
    };

    // Dados para o gráfico
    const chartData = {
        labels: ["Pendentes", "Finalizados"],
        datasets: [
            {
                label: "Quantidade",
                backgroundColor: ["#ffc107", "#28a745"],
                data: [contagemStatus.pendente, contagemStatus.finalizado]
            }
        ]
    };

    return (
        <div className="container mt-4">
            <h2>Relatório de Solicitações</h2>

            {/* Exibição do gráfico */}
            <div className="mb-4">
                <Bar data={chartData} />
            </div>

            
        </div>
    );
};

export default RelatorioSolicitacoes;