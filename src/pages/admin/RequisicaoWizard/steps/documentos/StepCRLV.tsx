// src/pages/admin/RequisicaoWizard/steps/documentos/StepCRLV.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepCRLV({ formData, setFormData, onNext, onBack }: Props) {
    const updateFile = (file: File | null) => {
        setFormData((prev: any) => ({
            ...prev,
            documentos: {
                ...prev.documentos,
                crlv: file,
            },
        }));
    };

    return (
        <StepContentWrapper title="Documento CRLV">
            <div className="mb-3">
                <label className="form-label">Anexar CRLV</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => updateFile(e.target.files?.[0] || null)}
                />
            </div>

            {formData.documentos?.crlv && (
                <div className="alert alert-success py-2">
                    Arquivo selecionado: <strong>{formData.documentos.crlv.name}</strong>
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
