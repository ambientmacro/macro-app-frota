import React from "react";
import { Legenda } from "../types/legendaTypes";

interface Props {
    legenda: Legenda;
    onEdit: () => void;
    onDelete: () => void;
}

const LegendaItem: React.FC<Props> = ({ legenda, onEdit, onDelete }) => {
    return (
        <div className="card p-2 mb-2 d-flex flex-row align-items-center justify-content-between">
            <div className="d-flex align-items-center">
                <div
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: legenda.cor,
                        marginRight: 10
                    }}
                />
                <div>
                    <strong>{legenda.codigo}</strong> - {legenda.descricao}
                    <div className="text-muted" style={{ fontSize: 12 }}>
                        Ação: {legenda.acao}
                    </div>
                </div>
            </div>

            <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={onEdit}>
                    Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default LegendaItem;
