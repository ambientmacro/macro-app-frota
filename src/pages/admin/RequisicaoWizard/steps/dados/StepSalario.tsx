// src/pages/admin/RequisicaoWizard/steps/dados/StepSalario.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepSalario({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.salario || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            salario: {
                ...prev.salario,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Salário / Remuneração">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Salário Base</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.base || ""}
                        onChange={(e) => update("base", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Adicionais</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.adicionais || ""}
                        onChange={(e) => update("adicionais", e.target.value)}
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
