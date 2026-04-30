// src/pages/admin/RequisicaoWizard/steps/dados/StepOrigemContrato.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepOrigemContrato({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.origemContrato || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            origemContrato: {
                ...prev.origemContrato,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Origem / Contrato">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Origem do Veículo</label>
                    <select
                        className="form-select"
                        value={dados.origem || ""}
                        onChange={(e) => update("origem", e.target.value)}
                    >
                        <option value="">Selecione</option>
                        <option value="proprio">Próprio</option>
                        <option value="alugado">Alugado</option>
                    </select>
                </div>

                {dados.origem === "alugado" && (
                    <div className="col-md-6">
                        <label className="form-label">Empresa Locadora</label>
                        <input
                            type="text"
                            className="form-control"
                            value={dados.locadora || ""}
                            onChange={(e) => update("locadora", e.target.value)}
                        />
                    </div>
                )}

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
