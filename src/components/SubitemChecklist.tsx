import React from "react";
import { Legenda } from "../types/legendaTypes";

interface Props {
    campoIndex: number;
    subIndex: number;
    register: any;
    removeSubitem: (index: number) => void;
    legendas: Legenda[];
    onNovaLegendaClick: () => void;
}

const SubitemChecklist: React.FC<Props> = ({
    campoIndex,
    subIndex,
    register,
    removeSubitem,
    legendas,
    onNovaLegendaClick
}) => {
    return (
        <div className="card p-2 mb-2">

            <label className="form-label fw-bold">Título do subitem</label>
            <input
                {...register(`campos.${campoIndex}.subitens.${subIndex}.titulo`, { required: true })}
                className="form-control"
                placeholder="Ex: Os pneus estão em bom estado?"
            />

            <div className="row mt-2">
                <div className="col-md-4">
                    <label className="form-label fw-bold">Legenda</label>
                    <div className="d-flex">
                        <select
                            {...register(`campos.${campoIndex}.subitens.${subIndex}.legendaId`)}
                            className="form-select me-2"
                        >
                            <option value="">Nenhuma</option>
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
                </div>

                <div className="col-md-4">
                    <div className="form-check mt-4">
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

                <div className="col-md-4 d-flex align-items-end justify-content-end">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeSubitem(subIndex)}
                    >
                        Remover
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SubitemChecklist;
