// src/pages/admin/RequisicaoWizard/steps/dados/StepJornada.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepJornada({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.jornada || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            jornada: {
                ...prev.jornada,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Jornada de Trabalho">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Horário de Entrada</label>
                    <input
                        type="time"
                        className="form-control"
                        value={dados.entrada || ""}
                        onChange={(e) => update("entrada", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Horário de Saída</label>
                    <input
                        type="time"
                        className="form-control"
                        value={dados.saida || ""}
                        onChange={(e) => update("saida", e.target.value)}
                    />
                </div>

            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    Voltar
                </button>

                <button className="btn btn-primary" onClick={onNext}>
                    Próximo
                </button>
            </div>
        </StepContentWrapper>
    );
}
