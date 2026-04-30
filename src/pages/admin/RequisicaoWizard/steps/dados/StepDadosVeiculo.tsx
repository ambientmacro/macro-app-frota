// src/pages/admin/RequisicaoWizard/steps/dados/StepDadosVeiculo.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepDadosVeiculo({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.dadosVeiculo || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            dadosVeiculo: {
                ...prev.dadosVeiculo,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Dados do Veículo">
            <div className="row g-3">

                <div className="col-md-4">
                    <label className="form-label">Placa</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dados.placa || ""}
                        onChange={(e) => update("placa", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Modelo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dados.modelo || ""}
                        onChange={(e) => update("modelo", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Ano</label>
                    <input
                        type="number"
                        className="form-control"
                        value={dados.ano || ""}
                        onChange={(e) => update("ano", e.target.value)}
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
