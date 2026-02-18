import React from "react";
import { useForm } from "react-hook-form";
import { EquipamentoData } from "../../types/Equipamento";

interface Props {
    initialData?: EquipamentoData;
    onSubmit: (data: EquipamentoData) => void;
    submitLabel: string;
}

const NovoEquipamentoForm: React.FC<Props> = ({ initialData, onSubmit, submitLabel }) => {
    const { register, handleSubmit } = useForm<EquipamentoData>({
        defaultValues: initialData || {
            nome: "",
            tipo: "",
            placa: "",
            frota: "",
            descricao: "",
            origem: "proprio",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label fw-bold">Origem</label>
                <select {...register("origem")} className="form-select">
                    <option value="proprio">Próprio</option>
                    <option value="alugado">Alugado</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Nome</label>
                <input {...register("nome")} className="form-control" />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Tipo</label>
                <input {...register("tipo")} className="form-control" />
            </div>

            <div className="row mb-3">
                <div className="col-md-4">
                    <label className="form-label fw-bold">Placa</label>
                    <input {...register("placa")} className="form-control" />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Frota</label>
                    <input {...register("frota")} className="form-control" />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Descrição</label>
                    <input {...register("descricao")} className="form-control" />
                </div>
            </div>

            <button className="btn btn-primary w-100">{submitLabel}</button>
        </form>
    );
};

export default NovoEquipamentoForm;
