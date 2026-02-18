import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Swal from "sweetalert2";
import ModalEquipamento from "./ModalEquipamento";
import { Equipamento, EquipamentoData } from "./RelacionarEquipamentoChecklist";

const EquipamentosAdmin: React.FC = () => {
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<Equipamento | null>(null);

    const carregar = async () => {
        const snap = await getDocs(collection(db, "equipamentos"));
        const lista: Equipamento[] = [];

        snap.forEach((d) => {
            const data = d.data() as EquipamentoData;
            lista.push({ id: d.id, ...data });
        });

        setEquipamentos(lista);
        setLoading(false);
    };

    useEffect(() => {
        carregar();
    }, []);

    const salvarNovo = async (data: EquipamentoData) => {
        await addDoc(collection(db, "equipamentos"), {
            ...data,
            checklistModeloId: null,
            ativo: true,
            dataCriacao: new Date(),
        });

        Swal.fire("Sucesso!", "Equipamento cadastrado.", "success");
        setShowModal(false);
        carregar();
    };

    const salvarEdicao = async (data: EquipamentoData) => {
        if (!editData) return;

        await updateDoc(doc(db, "equipamentos", editData.id), data);

        Swal.fire("Sucesso!", "Equipamento atualizado.", "success");
        setShowModal(false);
        setEditData(null);
        carregar();
    };

    const excluir = async (id: string) => {
        const confirm = await Swal.fire({
            title: "Excluir?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
            await deleteDoc(doc(db, "equipamentos", id));
            carregar();
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="card p-4 shadow">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="text-primary">Equipamentos</h2>
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
                        Novo Equipamento
                    </button>
                </div>

                {loading && <p>Carregando...</p>}

                {!loading && equipamentos.length === 0 && (
                    <p className="text-muted">Nenhum equipamento cadastrado.</p>
                )}

                {!loading &&
                    equipamentos.map((eq) => (
                        <div
                            key={eq.id}
                            className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{eq.nome}</strong>
                                <div className="text-muted" style={{ fontSize: 12 }}>
                                    {eq.tipo} {eq.frota ? `• Frota ${eq.frota}` : ""}
                                </div>
                            </div>

                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => {
                                        setEditData(eq);
                                        setShowModal(true);
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => excluir(eq.id)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            <ModalEquipamento
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditData(null);
                }}
                initialData={editData || undefined}
                onSubmit={editData ? salvarEdicao : salvarNovo}
                title={editData ? "Editar Equipamento" : "Novo Equipamento"}
            />
        </div>
    );
};

export default EquipamentosAdmin;
