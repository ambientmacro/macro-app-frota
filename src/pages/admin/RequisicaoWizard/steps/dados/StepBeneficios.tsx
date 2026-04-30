// src/pages/admin/RequisicaoWizard/steps/dados/StepBeneficios.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepBeneficios({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.beneficios || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            beneficios: {
                ...prev.beneficios,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Benefícios">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Vale Transporte</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.vt || ""}
                        onChange={(e) => update("vt", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Vale Alimentação</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.va || ""}
                        onChange={(e) => update("va", e.target.value)}
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
