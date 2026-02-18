import React, { useEffect } from "react";
import { Legenda } from "../types/legendaTypes";
import { useForm } from "react-hook-form";

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: (data: Omit<Legenda, "id">) => Promise<void> | void;
    initial?: Legenda | null;
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1050
};

const cardStyle: React.CSSProperties = {
    minWidth: 400,
    maxWidth: "90vw"
};

const LegendaModal: React.FC<Props> = ({ show, onClose, onSave, initial }) => {
    const { register, handleSubmit, reset } = useForm<Omit<Legenda, "id">>({
        defaultValues: {
            codigo: "",
            cor: "#ff0000",
            descricao: "",
            acao: ""
        }
    });

    useEffect(() => {
        reset(
            initial || {
                codigo: "",
                cor: "#ff0000",
                descricao: "",
                acao: ""
            }
        );
    }, [initial, reset]);

    if (!show) return null;

    const submit = async (data: Omit<Legenda, "id">) => {
        await onSave(data);
        onClose();
    };

    return (
        <div style={overlayStyle}>
            <div className="card p-3" style={cardStyle}>
                <h5 className="mb-3">{initial ? "Editar legenda" : "Nova legenda"}</h5>

                <form onSubmit={handleSubmit(submit)}>
                    <label className="form-label fw-bold">Código</label>
                    <input
                        {...register("codigo", { required: true })}
                        className="form-control mb-2"
                        placeholder="VM"
                    />

                    <label className="form-label fw-bold">Cor</label>
                    <input
                        type="color"
                        {...register("cor", { required: true })}
                        className="form-control form-control-color mb-2"
                    />

                    <label className="form-label fw-bold">Descrição</label>
                    <input
                        {...register("descricao", { required: true })}
                        className="form-control mb-2"
                        placeholder="Equipamento interditado"
                    />

                    <label className="form-label fw-bold">Ação</label>
                    <input
                        {...register("acao", { required: true })}
                        className="form-control mb-3"
                        placeholder="Bloquear operação"
                    />

                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary me-2"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LegendaModal;
