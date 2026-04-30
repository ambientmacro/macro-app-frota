// src/pages/admin/RequisicaoWizard/steps/dados/StepDadosIniciais.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepDadosIniciais({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.dadosIniciais || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            dadosIniciais: {
                ...prev.dadosIniciais,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Dados Iniciais">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Nome do Proprietário</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dados.nomeProprietario || ""}
                        onChange={(e) => update("nomeProprietario", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">CPF/CNPJ</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dados.documento || ""}
                        onChange={(e) => update("documento", e.target.value)}
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
