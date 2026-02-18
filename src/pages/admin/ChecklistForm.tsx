import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ChecklistForm as ChecklistType } from "../../types/checklistTypes";
import CampoChecklist from "../../components/CampoChecklist";
import { Legenda } from "../../types/legendaTypes";

interface Props {
    initialData?: ChecklistType;
    onSubmit: (data: ChecklistType) => void;
    legendas: Legenda[];
    onNovaLegendaClick: () => void;
    submitLabel: string;
}

const ChecklistForm: React.FC<Props> = ({
    initialData,
    onSubmit,
    legendas,
    onNovaLegendaClick,
    submitLabel
}) => {

    const { register, control, handleSubmit, watch, setValue } = useForm<ChecklistType>({
        defaultValues: initialData || {
            titulo: "",
            codigo: "",
            campos: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "campos"
    });

    const camposWatch = watch("campos") || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className="form-label fw-bold">Nome do Checklist</label>
            <input
                {...register("titulo", { required: true })}
                className="form-control mb-3"
                placeholder="Ex: Checklist de Inspeção Antes do Uso"
            />

            <label className="form-label fw-bold">Código/Revisão</label>
            <input
                {...register("codigo")}
                className="form-control mb-4"
                placeholder="Ex: CL-03 Revisão 04"
            />

            <h4 className="text-primary">Campos</h4>

            {fields.map((campo, campoIndex) => (
                <CampoChecklist
                    key={campo.id}
                    campoIndex={campoIndex}
                    register={register}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    removeCampo={remove}
                    legendas={legendas}
                    onNovaLegendaClick={onNovaLegendaClick}
                />
            ))}

            <button
                type="button"
                className="btn btn-outline-primary mt-3"
                onClick={() =>
                    append({
                        titulo: "",
                        tipo: "texto",
                        obrigatorio: false,
                        critico: false,
                        opcoes: [],
                        subitens: []
                    })
                }
            >
                + Adicionar campo
            </button>

            <div className="text-end mt-4">
                <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={camposWatch.length === 0}
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

export default ChecklistForm;
