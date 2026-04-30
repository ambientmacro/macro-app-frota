// src/pages/admin/RequisicaoWizard/steps/documentos/StepContrato.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepContrato({ formData, setFormData, onNext, onBack }: Props) {
    const updateFile = (file: File | null) => {
        setFormData((prev: any) => ({
            ...prev,
            documentos: {
                ...prev.documentos,
                contrato: file,
            },
        }));
    };

    return (
        <StepContentWrapper title="Contrato de Locação">
            <div className="mb-3">
                <label className="form-label">Anexar Contrato</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => updateFile(e.target.files?.[0] || null)}
                />
            </div>

            {formData.documentos?.contrato && (
                <div className="alert alert-success py-2">
                    Arquivo selecionado: <strong>{formData.documentos.contrato.name}</strong>
                </div>
            )}

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
