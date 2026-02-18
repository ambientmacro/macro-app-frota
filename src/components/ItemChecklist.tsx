import React from "react";
import { IconSelector } from "./IconSelector";

interface ItemChecklistProps {
    campoIndex: number;
    itemIndex: number;
    register: any;
    watch: any;
    removeItem: (index: number) => void;
}

const ItemChecklist: React.FC<ItemChecklistProps> = ({
    campoIndex,
    itemIndex,
    register,
    watch,
    removeItem
}) => {
    const tipo = watch(`campos.${campoIndex}.itens.${itemIndex}.tipo`);

    return (
        <div className="card bg-light p-3 mb-3">

            <label className="form-label fw-bold">Descrição do item</label>
            <textarea
                {...register(`campos.${campoIndex}.itens.${itemIndex}.texto`, { required: true })}
                className="form-control"
                rows={2}
            />

            <div className="row mt-3">
                <div className="col-md-4">
                    <label className="form-label fw-bold">Tipo do campo</label>
                    <select
                        {...register(`campos.${campoIndex}.itens.${itemIndex}.tipo`)}
                        className="form-select"
                    >
                        <option value="texto">Texto</option>
                        <option value="numero">Número</option>
                        <option value="booleano">Verdadeiro/Falso</option>
                        <option value="data">Data</option>
                        <option value="lista">Lista de opções</option>
                        <option value="checklist">C / NC / NA</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Configurações</label>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            {...register(`campos.${campoIndex}.itens.${itemIndex}.obrigatorio`)}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Obrigatório</label>
                    </div>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            {...register(`campos.${campoIndex}.itens.${itemIndex}.critico`)}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Item crítico</label>
                    </div>
                </div>

                <div className="col-md-4">
                    <IconSelector
                        campoIndex={campoIndex}
                        itemIndex={itemIndex}
                        register={register}
                    />
                </div>
            </div>

            {tipo === "lista" && (
                <div className="mt-3">
                    <label className="form-label fw-bold">Opções (uma por linha)</label>
                    <textarea
                        {...register(`campos.${campoIndex}.itens.${itemIndex}.opcoes`)}
                        className="form-control"
                        placeholder={"Ex:\nDiesel\nGasolina\nElétrico"}
                    />
                </div>
            )}

            <div className="text-end mt-3">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeItem(itemIndex)}
                >
                    Remover item
                </button>
            </div>

        </div>
    );
};

export default ItemChecklist;
