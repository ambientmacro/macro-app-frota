// src/pages/admin/RequisicaoWizard/steps/dados/StepValoresAluguel.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepValoresAluguel({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.valoresAluguel || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            valoresAluguel: {
                ...prev.valoresAluguel,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Valores de Aluguel">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Valor Mensal</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.valorMensal || ""}
                        onChange={(e) => update("valorMensal", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Valor Diário</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.valorDiario || ""}
                        onChange={(e) => update("valorDiario", e.target.value)}
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
