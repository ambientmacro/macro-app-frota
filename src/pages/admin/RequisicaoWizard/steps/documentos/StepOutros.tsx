// src/pages/admin/RequisicaoWizard/steps/documentos/StepOutros.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepOutros({ formData, setFormData, onNext, onBack }: Props) {
    const updateFiles = (files: FileList | null) => {
        const arr = files ? Array.from(files) : [];

        setFormData((prev: any) => ({
            ...prev,
            documentos: {
                ...prev.documentos,
                outros: arr,
            },
        }));
    };

    return (
        <StepContentWrapper title="Outros Documentos">
            <div className="mb-3">
                <label className="form-label">Selecionar Arquivos</label>
                <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={(e) => updateFiles(e.target.files)}
                />
            </div>

            {formData.documentos?.outros?.length > 0 && (
                <div className="alert alert-success py-2">
                    {formData.documentos.outros.length} arquivo(s) selecionado(s)
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
