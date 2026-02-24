import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const VisualizarChecklist = () => {
    const { id } = useParams();
    const [dados, setDados] = useState<any>(null);
    const [equipamento, setEquipamento] = useState<any>(null);

    const carregar = async () => {
        const ref = doc(db, "checklists_resolvidos", id!);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const dadosChecklist = snap.data();
        setDados(dadosChecklist);

        // 🔥 Buscar o equipamento
        if (dadosChecklist.equipamentoId) {
            const equipRef = doc(db, "equipamentos", dadosChecklist.equipamentoId);
            const equipSnap = await getDoc(equipRef);

            if (equipSnap.exists()) {
                setEquipamento(equipSnap.data());
            }
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    if (!dados) return <p>Carregando...</p>;

    return (
        <div className="container mt-4" style={{ maxWidth: 900 }}>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-primary">{dados.checklistTitulo}</h2>

                <button
                    className="btn btn-secondary"
                    onClick={() => window.print()}
                >
                    Imprimir / PDF
                </button>
            </div>

            <p className="text-muted">
                Data: {dados.data.toDate().toLocaleString()}
            </p>

            {/* 🔥 INFORMAÇÕES DO VEÍCULO */}
            {equipamento && (
                <div
                    className="p-3 mb-4"
                    style={{
                        background: "#f8f9fa",
                        borderRadius: "10px",
                        border: "1px solid #ddd"
                    }}
                >
                    <h4 className="text-primary mb-3">Informações do Veículo</h4>

                    <p><strong>Nome:</strong> {equipamento.nome}</p>
                    <p><strong>Tipo:</strong> {equipamento.tipo}</p>

                    {equipamento.placa && (
                        <p><strong>Placa:</strong> {equipamento.placa}</p>
                    )}

                    {equipamento.frota && (
                        <p><strong>Frota:</strong> {equipamento.frota}</p>
                    )}

                    {equipamento.origem && (
                        <p><strong>Origem:</strong> {equipamento.origem === "proprio" ? "Próprio" : "Alugado"}</p>
                    )}

                    {equipamento.descricao && (
                        <p><strong>Descrição:</strong> {equipamento.descricao}</p>
                    )}
                </div>
            )}

            <hr />

            {/* 🔥 ITENS DO CHECKLIST */}
            {Object.keys(dados.respostas).map((key) => {
                const r = dados.respostas[key];

                return (
                    <div key={key} className="card p-3 mb-3">
                        <h5>{r.subitem}</h5>

                        <p>
                            <strong>Resposta:</strong> {r.tipo}
                        </p>

                        {r.texto && (
                            <p>
                                <strong>Observação:</strong> {r.texto}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default VisualizarChecklist;
