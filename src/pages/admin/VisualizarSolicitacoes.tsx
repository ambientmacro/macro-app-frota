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

// Componente principal de visualização de solicitações
const VisualizarSolicitacoes: React.FC = () => {
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

    // Efeito para carregar os usuários e solicitações inicialmente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Recarrega as solicitações quando filtros mudam
    useEffect(() => {
        if (usuarios.length > 0) {
            fetchTodasSolicitacoes(usuarios);
        }
    }, [filtroSituacao]);

    // Função para buscar os usuários do banco de dados
    const fetchUsuarios = async () => {
        setCarregando(true);
        try {
            const usuariosSnapshot = await getDocs(collection(db, "solicitacoes"));
            if (usuariosSnapshot.empty) {
                setUsuarios([]);
            } else {
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
                fetchTodasSolicitacoes(listaUsuarios);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setCarregando(false);
        }
    };

    // Função para buscar todas as solicitações de todos os usuários
    const fetchTodasSolicitacoes = async (usuariosLista: { id: string }[]) => {
        let pendentes = 0;
        let finalizados = 0;
        const todasSolicitacoes: { [key: string]: any[] } = {};

        for (const usuario of usuariosLista) {
            const solicitacoesRef = collection(db, `solicitacoes/${usuario.id}/lista_solicitacoes`);
            const snapshot = await getDocs(solicitacoesRef);

            const listaSolicitacoes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            listaSolicitacoes.forEach((sol) => {
                if (sol.situacao === "pendente") pendentes++;
                if (sol.situacao === "finalizado") finalizados++;
            });

            todasSolicitacoes[usuario.id] = listaSolicitacoes;
        }

        setSolicitacoes(todasSolicitacoes);
        setContagemStatus({ pendente: pendentes, finalizado: finalizados });
    };

    // Função para expandir ou recolher as solicitações de um usuário
    const toggleExpandir = (usuarioId: string) => {
        setUsuariosExpandido(prev => ({
            ...prev,
            [usuarioId]: !prev[usuarioId]
        }));
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

            // Recarrega os dados
            fetchUsuarios();
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
            <h2>Visualização de Solicitações</h2>

            {/* Exibição do gráfico */}
            {/* <div className="mb-4">
                <Bar data={chartData} />
            </div> */}

            {/* Filtros */}
            <div className="mb-3 d-flex gap-3 align-items-center flex-wrap">
                <div>
                    <label htmlFor="filtroNome" className="form-label mb-0">Filtrar por nome:</label>
                    <input
                        list="nomesUsuarios"
                        id="filtroNome"
                        className="form-control"
                        placeholder="Digite o nome do usuário"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                    />
                    <datalist id="nomesUsuarios">
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.nome} />
                        ))}
                    </datalist>
                </div>

                <div>
                    <label htmlFor="filtroSituacao" className="form-label mb-0">Situação:</label>
                    <select
                        id="filtroSituacao"
                        className="form-select"
                        value={filtroSituacao}
                        onChange={(e) => setFiltroSituacao(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="pendente">Pendentes</option>
                        <option value="finalizado">Finalizados</option>
                    </select>
                </div>
            </div>

            {/* Lista de usuários */}
            {carregando ? (
                <p>Carregando usuários...</p>
            ) : (
                <ul className="list-unstyled">
                    {usuarios
                        .filter((usuario) =>
                            filtroNome.trim() === "" || usuario.nome.toLowerCase().includes(filtroNome.toLowerCase())
                        )
                        .filter((usuario) => {
                            const solicitacoesUsuario = solicitacoes[usuario.id] || [];
                            if (filtroSituacao === "pendente") {
                                return solicitacoesUsuario.some(s => s.situacao === "pendente");
                            } else if (filtroSituacao === "finalizado") {
                                return solicitacoesUsuario.some(s => s.situacao === "finalizado");
                            }
                            return true;
                        })
                        .map(usuario => (
                            <li key={usuario.id} className="mb-3">
                                <button
                                    className="btn btn-link d-flex align-items-center"
                                    onClick={() => toggleExpandir(usuario.id)}
                                >
                                    {usuario.nome} - {usuario.email}
                                    <span className="ms-2">
                                        {usuariosExpandido[usuario.id] ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </button>

                                {/* Tabela de solicitações se expandido */}
                                {usuariosExpandido[usuario.id] && (
                                    <table className="table table-striped mt-2">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Data Início</th>
                                                <th>Data Fim</th>
                                                <th>Veículo</th>
                                                <th>Motivo</th>
                                                <th>Descrição</th>
                                                <th>Status</th>
                                                <th>Hora Finalização</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(solicitacoes[usuario.id] || [])
                                                .filter(solicitacao =>
                                                    filtroSituacao === "todos" || solicitacao.situacao === filtroSituacao
                                                )
                                                .map((solicitacao, index) => (
                                                    <tr key={solicitacao.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{solicitacao.dataInicio || "Não informado"}</td>
                                                        <td>{solicitacao.dataFim || "Não informado"}</td>
                                                        <td>{solicitacao.veiculo || "Não informado"}</td>
                                                        <td>{solicitacao.motivo}</td>
                                                        <td>{solicitacao.descricao}</td>
                                                        <td>{solicitacao.situacao}</td>
                                                        <td>
                                                            {solicitacao.horaFinalizacao?.seconds
                                                                ? new Date(solicitacao.horaFinalizacao.seconds * 1000).toLocaleString()
                                                                : "Ainda não finalizado"}
                                                        </td>
                                                        <td>
                                                            {solicitacao.situacao === "pendente" && (
                                                                <button
                                                                    className="btn btn-sm btn-success"
                                                                    onClick={() => confirmarFinalizacao(usuario.id, solicitacao.id)}
                                                                >
                                                                    Finalizar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                )}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default VisualizarSolicitacoes;