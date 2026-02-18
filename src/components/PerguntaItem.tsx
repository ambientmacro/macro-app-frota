import React from "react";
import { FaTrash } from "react-icons/fa";

interface PerguntaItemProps {
    index: number;
    register: any;
    remove: (index: number) => void;
    canRemove: boolean;
}

const PerguntaItem: React.FC<PerguntaItemProps> = ({
    index,
    register,
    remove,
    canRemove
}) => {
    return (
        <div className="card bg-light mb-3 p-3">
            <div className="row align-items-start">

                <div className="col-md-1 text-center">
                    <span className="badge bg-secondary rounded-pill">{index + 1}</span>
                </div>

                <div className="col-md-7">
                    <label className="form-label fw-bold">Descrição do item</label>
                    <textarea
                        {...register(`perguntas.${index}.texto`, { required: true })}
                        placeholder="Ex: Os cintos de segurança estão em bom estado de conservação e funcionando?"
                        className="form-control"
                        rows={2}
                    />
                    <small className="text-muted">
                        Esse texto aparecerá exatamente assim para o operador na inspeção.
                    </small>
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Configuração</label>
                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            {...register(`perguntas.${index}.critico`)}
                            id={`critico-${index}`}
                        />
                        <label className="form-check-label" htmlFor={`critico-${index}`}>
                            Item crítico (bloqueia operação se marcado NC)
                        </label>
                    </div>
                </div>

                <div className="col-md-1 d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-outline-danger border-0 mt-4"
                        onClick={() => remove(index)}
                        disabled={!canRemove}
                    >
                        <FaTrash />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PerguntaItem;
