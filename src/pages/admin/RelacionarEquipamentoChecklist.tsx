import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import ModalRelacaoChecklist from "./ModalRelacaoChecklist";

interface Equipamento {
    id: string;
    nome: string;
    tipo: string;
    placa?: string;
    frota?: string;
    descricao?: string;
    origem: "proprio" | "alugado";
    checklistModeloId?: string | null;
}

interface ChecklistModelo {
    id: string;
    titulo: string;
}

const RelacionarEquipamentoChecklist: React.FC = () => {
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [checklists, setChecklists] = useState<ChecklistModelo[]>([]);

    const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<string>("");
    const [checklistSelecionado, setChecklistSelecionado] = useState<string>("");

    const [loading, setLoading] = useState(true);

    // Modal de edição de relação
    const [showModal, setShowModal] = useState(false);
    const [equipamentoEmEdicao, setEquipamentoEmEdicao] = useState<Equipamento | null>(null);
    const [checklistSelecionadoModal, setChecklistSelecionadoModal] = useState<string>("");

    const pendentes = equipamentos.filter(e => !e.checklistModeloId);

    const carregarEquipamentos = async () => {
        const snap = await getDocs(collection(db, "equipamentos"));
        const lista: Equipamento[] = [];

        snap.forEach((d) => {
            const data = d.data() as Omit<Equipamento, "id">;
            lista.push({
                id: d.id,
                ...data,
            });
        });

        setEquipamentos(lista);
        setLoading(false);
    };

    const carregarChecklists = async () => {
        const snap = await getDocs(collection(db, "templates_checklist"));
        const lista: ChecklistModelo[] = [];

        snap.forEach((d) =>
            lista.push({
                id: d.id,
                titulo: (d.data() as any).titulo || "Sem título",
            })
        );

        setChecklists(lista);
    };

    useEffect(() => {
        (async () => {
            await Promise.all([carregarEquipamentos(), carregarChecklists()]);
        })();
    }, []);

    const salvarRelacao = async () => {
        if (!equipamentoSelecionado || !checklistSelecionado) {
            Swal.fire("Atenção", "Selecione o equipamento e o checklist.", "warning");
            return;
        }

        try {
            await updateDoc(doc(db, "equipamentos", equipamentoSelecionado), {
                checklistModeloId: checklistSelecionado,
            });

            Swal.fire("Sucesso!", "Checklist vinculado ao equipamento.", "success");
            setEquipamentoSelecionado("");
            setChecklistSelecionado("");
            carregarEquipamentos();
        } catch (e) {
            Swal.fire("Erro", "Não foi possível salvar a relação.", "error");
        }
    };

    const abrirModalEdicao = (eq: Equipamento) => {
        setEquipamentoEmEdicao(eq);
        setChecklistSelecionadoModal(eq.checklistModeloId || "");
        setShowModal(true);
    };

    const salvarRelacaoModal = async () => {
        if (!equipamentoEmEdicao || !checklistSelecionadoModal) {
            Swal.fire("Atenção", "Selecione um checklist.", "warning");
            return;
        }

        try {
            await updateDoc(doc(db, "equipamentos", equipamentoEmEdicao.id), {
                checklistModeloId: checklistSelecionadoModal,
            });

            Swal.fire("Sucesso!", "Relação atualizada.", "success");
            setShowModal(false);
            setEquipamentoEmEdicao(null);
            setChecklistSelecionadoModal("");
            carregarEquipamentos();
        } catch (e) {
            Swal.fire("Erro", "Não foi possível atualizar a relação.", "error");
        }
    };

    const removerRelacao = async (eq: Equipamento) => {
        const confirm = await Swal.fire({
            title: "Remover relação?",
            text: `Remover checklist vinculado ao equipamento "${eq.nome}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await updateDoc(doc(db, "equipamentos", eq.id), {
                checklistModeloId: null,
            });

            Swal.fire("Sucesso!", "Relação removida.", "success");
            carregarEquipamentos();
        } catch (e) {
            Swal.fire("Erro", "Não foi possível remover a relação.", "error");
        }
    };

    const getNomeChecklist = (id?: string | null) => {
        if (!id) return "Nenhum checklist vinculado";
        const cl = checklists.find((c) => c.id === id);
        return cl ? cl.titulo : "Checklist não encontrado";
    };

    const equipamentosComRelacao = equipamentos.filter((e) => e.checklistModeloId);

    return (
        <div className="container mt-4 mb-5">
            <div className="card p-4 shadow">
                <h2 className="text-primary mb-3">Relacionar Checklist ao Equipamento</h2>

                {loading && <p>Carregando dados...</p>}

                {!loading && (
                    <>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Equipamento</label>
                            <select
                                className="form-select"
                                value={equipamentoSelecionado}
                                onChange={(e) => setEquipamentoSelecionado(e.target.value)}
                            >
                                <option value="">Selecione um equipamento</option>
                                {equipamentos.map((eq) => {
                                    const pendente = !eq.checklistModeloId;

                                    return (
                                        <option
                                            key={eq.id}
                                            value={eq.id}
                                            style={{
                                                backgroundColor: pendente ? "#fff7d6" : "white", // amarelo bem suave
                                            }}
                                        >
                                            {eq.nome}
                                            {eq.tipo ? ` • ${eq.tipo}` : ""}
                                            {eq.origem ? ` • Origem: ${eq.origem === "proprio" ? "Próprio" : "Alugado"}` : ""}
                                            {eq.frota ? ` • Frota ${eq.frota}` : ""}
                                            {eq.placa ? ` • Placa ${eq.placa}` : ""}
                                            {pendente ? " • (pendente)" : ""}
                                        </option>
                                    );
                                })}

                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Checklist</label>
                            <select
                                className="form-select"
                                value={checklistSelecionado}
                                onChange={(e) => setChecklistSelecionado(e.target.value)}
                            >
                                <option value="">Selecione um checklist</option>
                                {checklists.map((cl) => (
                                    <option key={cl.id} value={cl.id}>
                                        {cl.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {pendentes.length > 0 && (
                            <div className="alert alert-warning py-2">
                                {pendentes.length === 1
                                    ? "Existe 1 equipamento sem relacionamento."
                                    : `Existem ${pendentes.length} equipamentos sem relacionamento.`}
                            </div>
                        )}


                        <div className="text-end mb-4">
                            <button className="btn btn-primary" onClick={salvarRelacao}>
                                Salvar relação
                            </button>
                        </div>

                        <h4 className="mt-4 mb-3">Relações existentes</h4>

                        {equipamentosComRelacao.length === 0 && (
                            <p className="text-muted">Nenhum relacionamento cadastrado.</p>
                        )}

                        {equipamentosComRelacao.map((eq) => (
                            <div
                                key={eq.id}
                                className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{eq.nome}</strong>

                                    <div className="text-muted" style={{ fontSize: 12 }}>
                                        {eq.tipo}
                                        {eq.origem ? ` • Origem: ${eq.origem === "proprio" ? "Próprio" : "Alugado"}` : ""}
                                        {eq.frota ? ` • Frota ${eq.frota}` : ""}
                                        {eq.placa ? ` • Placa ${eq.placa}` : ""}
                                    </div>

                                    <div style={{ fontSize: 12, color: "#555" }}>
                                        Checklist: {getNomeChecklist(eq.checklistModeloId)}
                                    </div>

                                    {eq.descricao && (
                                        <div style={{ fontSize: 12, color: "#666" }}>
                                            {eq.descricao}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => abrirModalEdicao(eq)}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removerRelacao(eq)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <ModalRelacaoChecklist
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEquipamentoEmEdicao(null);
                    setChecklistSelecionadoModal("");
                }}
                equipamentoNome={equipamentoEmEdicao?.nome}
                checklists={checklists}
                checklistSelecionado={checklistSelecionadoModal}
                onChangeChecklist={setChecklistSelecionadoModal}
                onSalvar={salvarRelacaoModal}
            />
        </div>
    );
};

export default RelacionarEquipamentoChecklist;
