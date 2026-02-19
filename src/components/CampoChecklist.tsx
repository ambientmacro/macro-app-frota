import React from "react";
import { useFieldArray } from "react-hook-form";
import SubitemChecklist from "./SubitemChecklist";
import { Legenda } from "../types/legendaTypes";

interface Props {
    campoIndex: number;
    register: any;
    control: any;
    watch: any;
    setValue: any;
    removeCampo: (index: number) => void;
    legendas: Legenda[];
    onNovaLegendaClick: () => void;
}

const CampoChecklist: React.FC<Props> = ({
    campoIndex,
    register,
    control,
    watch,
    setValue,
    removeCampo,
    legendas,
    onNovaLegendaClick
}) => {

    const { fields: subitens, append, remove } = useFieldArray({
        control,
        name: `campos.${campoIndex}.subitens`
    });

    // Agora o tipo SEMPRE vem como "lista" porque o append() no componente pai já define isso
    const tipo = watch(`campos.${campoIndex}.tipo`) || "lista";
    const opcoes = watch(`campos.${campoIndex}.opcoes`) || [];

    return (
        <div className="card border-primary p-3 mb-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-primary">Campo {campoIndex + 1}</h5>
                <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => removeCampo(campoIndex)}
                >
                    Remover campo
                </button>
            </div>

            {/* TÍTULO */}
            <label className="form-label fw-bold mt-2">Título do campo</label>
            <input
                {...register(`campos.${campoIndex}.titulo`, { required: true })}
                className="form-control mb-3"
                placeholder="Ex: Verificação dos pneus"
            />

            {/* TIPO */}
            <div className="row">
                <div className="col-md-4">
                    <label className="form-label fw-bold">Tipo do campo</label>

                    <select
                        {...register(`campos.${campoIndex}.tipo`)}
                        className="form-select"
                        defaultValue="lista"   // 🔥 garante fallback visual
                    >
                        <option value="lista">Lista</option>
                    </select>
                </div>

                {/* CONFIGURAÇÕES */}
                <div className="col-md-4">
                    <label className="form-label fw-bold">Configurações</label>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            {...register(`campos.${campoIndex}.obrigatorio`)}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Obrigatório</label>
                    </div>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            {...register(`campos.${campoIndex}.critico`)}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Crítico</label>
                    </div>
                </div>
            </div>

            {/* MINI-CRUD DO TIPO LISTA */}
            {tipo === "lista" && (
                <div className="mt-3">

                    <div className="mt-3">

                        <label className="form-label fw-bold">Opções da lista do Motorista</label>

                        <div className="mb-3">
                            {opcoes.length > 0 ? (
                                opcoes.map((op: string, opIndex: number) => (
                                    <div
                                        key={opIndex}
                                        className="d-flex align-items-center justify-content-between border p-2 mb-2 rounded"
                                    >
                                        <span>{op}</span>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                                const novaLista = opcoes.filter((_: any, i: number) => i !== opIndex);
                                                setValue(`campos.${campoIndex}.opcoes`, novaLista);
                                            }}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">Nenhuma opção adicionada ainda. Adicione no campo abaixo as opções que o motorista terá para selecionar os campos de subitens.</p>
                            )}
                        </div>



                    </div>

                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Digite uma nova opção"
                            id={`novaOpcao-${campoIndex}`}
                        />

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                const input = document.getElementById(`novaOpcao-${campoIndex}`) as HTMLInputElement;
                                const valor = input.value.trim();
                                if (!valor) return;

                                const novaLista = [...opcoes, valor];
                                setValue(`campos.${campoIndex}.opcoes`, novaLista);
                                input.value = "";
                            }}
                        >
                            +
                        </button>
                    </div>

                </div>
            )}

            {/* SUBITENS */}
            <h6 className="mt-4">Subitens</h6>

            {subitens.map((sub, subIndex) => (
                <SubitemChecklist
                    key={sub.id}
                    campoIndex={campoIndex}
                    subIndex={subIndex}
                    register={register}
                    removeSubitem={remove}
                    legendas={legendas}
                    onNovaLegendaClick={onNovaLegendaClick}
                    watch={watch} // 🔥 adicionar isso
                />
            ))}

            <button
                type="button"
                className="btn btn-outline-primary mt-2"
                onClick={() =>
                    append({
                        titulo: "",
                        obrigatorio: false,
                        critico: false,
                        legendaId: ""
                    })
                }
            >
                + Adicionar subitem
            </button>

        </div>
    );
};

export default CampoChecklist;
