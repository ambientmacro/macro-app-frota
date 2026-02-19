import React from "react";
import { Legenda } from "../types/legendaTypes";

interface Props {
    legenda: Legenda;
    onEdit: () => void;
    onDelete: () => void;
}

const LegendaItem: React.FC<Props> = ({ legenda, onEdit, onDelete }) => {
    return (
        <div
            className="card mb-3 shadow-sm"
            style={{
                borderLeft: `6px solid ${legenda.cor || "#000"}`,
                minHeight: "140px"
            }}
        >
            <div className="card-body d-flex flex-column justify-content-between">

                {/* TÍTULO + CÓDIGO */}
                <div className="d-flex align-items-center mb-2">
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: legenda.cor,
                            marginRight: 10
                        }}
                    ></div>

                    <h5 className="card-title mb-0 fw-bold">
                        {legenda.codigo}
                    </h5>
                </div>

                {/* DESCRIÇÃO */}
                <p className="card-text text-muted" style={{ fontSize: "0.95rem" }}>
                    {legenda.descricao}
                </p>

                {/* AÇÃO */}
                <p className="fw-bold text-primary" style={{ fontSize: "0.95rem" }}>
                    Ação: {legenda.acao}
                </p>

                {/* BOTÕES PADRONIZADOS */}
                <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-outline-primary w-50" onClick={onEdit}>
                        Editar
                    </button>

                    <button className="btn btn-sm btn-outline-danger w-50" onClick={onDelete}>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegendaItem;
