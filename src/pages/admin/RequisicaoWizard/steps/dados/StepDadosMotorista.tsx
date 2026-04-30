// src/pages/admin/RequisicaoWizard/steps/dados/StepDadosMotorista.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepDadosMotorista({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.dadosMotorista || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            dadosMotorista: {
                ...prev.dadosMotorista,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Dados do Motorista">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Nome Completo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dados.nome || ""}
                        onChange={(e) => update("nome", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">CPF</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dados.cpf || ""}
                        onChange={(e) => update("cpf", e.target.value)}
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
