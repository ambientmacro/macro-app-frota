import React from "react";
import { Legenda } from "../types/legendaTypes";

interface Props {
    campoIndex: number;
    subIndex: number;
    register: any;
    removeSubitem: (index: number) => void;
    legendas: Legenda[];
    onNovaLegendaClick: () => void;
    watch?: any;
}

const SubitemChecklist: React.FC<Props> = ({
    campoIndex,
    subIndex,
    register,
    removeSubitem,
    legendas,
    onNovaLegendaClick,
    watch
}) => {

    // 🔥 Pega a legenda selecionada
    const legendaSelecionadaId = watch(`campos.${campoIndex}.subitens.${subIndex}.legendaId`);
    const legendaSelecionada = legendas.find(l => l.id === legendaSelecionadaId);

    return (
        <div
            className="card p-3 mb-3 shadow-sm"
            style={{
                borderLeft: `6px solid ${legendaSelecionada?.cor || "#ccc"}`,
                transition: "0.2s"
            }}
        >
            {/* TÍTULO */}
            <label className="form-label fw-bold">Título do subitem</label>
            <input
                {...register(`campos.${campoIndex}.subitens.${subIndex}.titulo`, { required: true })}
                className="form-control mb-2"
                placeholder="Ex: Os pneus estão em bom estado?"
            />

            {/* LEGENDA */}
            <label className="form-label fw-bold">Legenda</label>
            <div className="d-flex gap-2 mb-2">

                <select
                    {...register(`campos.${campoIndex}.subitens.${subIndex}.legendaId`)}
                    className="form-select"
                >
                    <option value="">Selecione...</option>

                    {legendas.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.codigo}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={onNovaLegendaClick}
                >
                    +
                </button>
            </div>

            {/* CONFIGURAÇÕES */}
            <div className="d-flex gap-4">

                <div className="form-check">
                    <input
                        type="checkbox"
                        {...register(`campos.${campoIndex}.subitens.${subIndex}.obrigatorio`)}
                        className="form-check-input"
                    />
                    <label className="form-check-label">Obrigatório</label>
                </div>

                <div className="form-check">
                    <input
                        type="checkbox"
                        {...register(`campos.${campoIndex}.subitens.${subIndex}.critico`)}
                        className="form-check-input"
                    />
                    <label className="form-check-label">Crítico</label>
                </div>

            </div>

            {/* REMOVER */}
            <button
                type="button"
                className="btn btn-sm btn-danger mt-3"
                onClick={() => removeSubitem(subIndex)}
            >
                Remover
            </button>
        </div>
    );
};

export default SubitemChecklist;
