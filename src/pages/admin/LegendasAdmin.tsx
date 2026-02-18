import React, { useState } from "react";
import { useLegendas } from "../../hooks/useLegendas";
import LegendaItem from "../../components/LegendaItem";
import LegendaModal from "../../components/LegendaModal";
import { Legenda } from "../../types/legendaTypes";
import Swal from "sweetalert2";

const LegendasAdmin: React.FC = () => {
    const { legendas, adicionar, atualizar, remover } = useLegendas();
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Legenda | null>(null);

    const abrirNova = () => {
        setEditando(null);
        setShowModal(true);
    };

    const abrirEditar = (legenda: Legenda) => {
        setEditando(legenda);
        setShowModal(true);
    };

    const salvarLegenda = async (data: Omit<Legenda, "id">) => {
        if (editando?.id) {
            await atualizar(editando.id, data);
        } else {
            await adicionar(data);
        }
    };

    const excluirLegenda = async (id?: string) => {
        if (!id) return;

        const res = await Swal.fire({
            title: "Confirmar exclusão",
            text: "Deseja realmente excluir esta legenda?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        });

        if (res.isConfirmed) {
            await remover(id);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="card p-4 shadow">

                <h2 className="text-primary mb-3">Gerenciar Legendas</h2>

                <p className="text-muted">
                    As legendas são usadas para classificar a criticidade dos itens do checklist.
                </p>

                <button className="btn btn-primary mb-3" onClick={abrirNova}>
                    + Nova legenda
                </button>

                {legendas.length === 0 && (
                    <p className="text-muted">Nenhuma legenda cadastrada ainda.</p>
                )}

                {legendas.map((l) => (
                    <LegendaItem
                        key={l.id}
                        legenda={l}
                        onEdit={() => abrirEditar(l)}
                        onDelete={() => excluirLegenda(l.id)}
                    />
                ))}

                <LegendaModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={salvarLegenda}
                    initial={editando}
                />
            </div>
        </div>
    );
};

export default LegendasAdmin;
