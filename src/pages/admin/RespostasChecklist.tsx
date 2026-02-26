import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface MotoristaResumo {
    motoristaId: string;
    motoristaNome: string;
    total: number;
    ultimoEnvio: any;
}

interface ChecklistItem {
    id: string;
    checklistTitulo: string;
    equipamentoId: string;
    data: any;
}

const RespostasChecklist: React.FC = () => {
    const [motoristas, setMotoristas] = useState<MotoristaResumo[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [checklistsMotorista, setChecklistsMotorista] = useState<ChecklistItem[]>([]);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState<string>("");

    // Formata Timestamp do Firestore
    const formatarData = (ts: any) => {
        if (!ts) return "—";
        if (ts.toDate) {
            return ts.toDate().toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        return String(ts);
    };

    // Carrega funcionários e cria mapa authUid → nome
    const carregarFuncionarios = async () => {
        const snap = await getDocs(collection(db, "funcionarios"));
        const mapa: Record<string, string> = {};

        snap.forEach((doc) => {
            const d = doc.data();
            if (d.authUid && d.nome) {
                mapa[d.authUid] = d.nome;
            }
        });

        return mapa;
    };

    // Carrega checklists resolvidos e junta com os nomes dos funcionários
    const carregarDados = async () => {
        setLoading(true);

        const funcionarios = await carregarFuncionarios();
        const snap = await getDocs(collection(db, "checklists_resolvidos"));

        const mapa: Record<string, MotoristaResumo> = {};

        snap.forEach((doc) => {
            const d = doc.data();

            const id = d.motoristaId || "SEM_ID";

            const nome =
                d.motoristaNome ||
                funcionarios[id] ||
                "Motorista não informado";

            const dataEnvio = d.data || null;

            if (!mapa[id]) {
                mapa[id] = {
                    motoristaId: id,
                    motoristaNome: nome,
                    total: 0,
                    ultimoEnvio: dataEnvio
                };
            }

            mapa[id].total += 1;

            if (dataEnvio && dataEnvio > mapa[id].ultimoEnvio) {
                mapa[id].ultimoEnvio = dataEnvio;
            }
        });

        setMotoristas(Object.values(mapa));
        setLoading(false);
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // 🔥 Carrega checklists do motorista e abre modal
    const abrirModal = async (motoristaId: string, nome: string) => {
        setMotoristaSelecionado(nome);
        setModalAberto(true);

        const q = query(
            collection(db, "checklists_resolvidos"),
            where("motoristaId", "==", motoristaId)
        );

        const snap = await getDocs(q);

        const lista: ChecklistItem[] = [];

        snap.forEach((doc) => {
            const d = doc.data();
            lista.push({
                id: doc.id,
                checklistTitulo: d.checklistTitulo || "Sem título",
                equipamentoId: d.equipamentoId || "—",
                data: d.data || null
            });
        });

        setChecklistsMotorista(lista);
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">

                <h2 className="text-primary mb-4">Respostas de Checklists</h2>

                {loading && <p>Carregando...</p>}

                {!loading && motoristas.length === 0 && (
                    <p className="text-muted">Nenhum checklist registrado ainda.</p>
                )}

                {!loading && motoristas.length > 0 && (
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Motorista</th>
                                <th>Total de Checklists</th>
                                <th>Último Envio</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {motoristas.map((m) => (
                                <tr key={m.motoristaId}>
                                    <td>{m.motoristaNome}</td>
                                    <td>{m.total}</td>
                                    <td>{formatarData(m.ultimoEnvio)}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => abrirModal(m.motoristaId, m.motoristaNome)}
                                        >
                                            Ver Checklists
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

            </div>

            {/* MODAL */}
            {modalAberto && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Checklists de {motoristaSelecionado}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalAberto(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                {checklistsMotorista.length === 0 && (
                                    <p className="text-muted">Nenhum checklist encontrado.</p>
                                )}

                                {checklistsMotorista.length > 0 && (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Título</th>
                                                <th>Equipamento</th>
                                                <th>Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {checklistsMotorista.map((c) => (
                                                <tr key={c.id}>
                                                    <td>{c.checklistTitulo}</td>
                                                    <td>{c.equipamentoId}</td>
                                                    <td>{formatarData(c.data)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalAberto(false)}
                                >
                                    Fechar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RespostasChecklist;
