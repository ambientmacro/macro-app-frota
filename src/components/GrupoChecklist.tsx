import React from "react";
import ItemChecklist from "./ItemChecklist";

interface Props {
    grupoIndex: number;
    register: any;
    control: any;
    watch: any;
    removeGrupo: (index: number) => void;
    appendItem: (item: any) => void;
    removeItem: (index: number) => void;
    itens: any[];
}

const GrupoChecklist: React.FC<Props> = ({
    grupoIndex,
    register,
    control,
    watch,
    removeGrupo,
    appendItem,
    removeItem,
    itens
}) => {
    return (
        <div className="card border-primary p-3 mb-4">

            <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-primary">Grupo {grupoIndex + 1}</h5>
                <button className="btn btn-danger" onClick={() => removeGrupo(grupoIndex)}>
                    Remover grupo
                </button>
            </div>

            <label className="form-label fw-bold mt-2">Título do grupo</label>
            <input
                {...register(`grupos.${grupoIndex}.titulo`, { required: true })}
                className="form-control mb-3"
            />

            {itens.map((item: any, itemIndex: number) => (
                <ItemChecklist
                    key={item.id}
                    grupoIndex={grupoIndex}
                    itemIndex={itemIndex}
                    register={register}
                    watch={watch}
                    removeItem={removeItem}
                />
            ))}

            <button
                type="button"
                className="btn btn-outline-primary mt-2"
                onClick={() =>
                    appendItem({
                        texto: "",
                        tipo: "texto",
                        obrigatorio: false,
                        critico: false,
                        icone: "",
                        opcoes: []
                    })
                }
            >
                + Adicionar item
            </button>

        </div>
    );
};

export default GrupoChecklist;
