// src/pages/admin/RequisicaoWizard/steps/tipo/StepTipoRequerimento.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface StepTipoRequerimentoProps {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
}

export default function StepTipoRequerimento({
    formData,
    setFormData,
    onNext,
}: StepTipoRequerimentoProps) {
    const handleSelect = (tipo: string) => {
        setFormData((prev: any) => ({
            ...prev,
            tipoRequerimento: tipo,
        }));
    };

    return (
        <StepContentWrapper title="Tipo de Requerimento">
            <p className="text-muted mb-3">
                Escolha o tipo de cadastro que deseja realizar.
            </p>

            <div className="row g-3">

                {/* VEÍCULO */}
                <div className="col-md-4">
                    <button
                        className={`btn w-100 py-3 ${formData.tipoRequerimento === "veiculo"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                        onClick={() => handleSelect("veiculo")}
                    >
                        Veículo
                    </button>
                </div>

                {/* MOTORISTA */}
                <div className="col-md-4">
                    <button
                        className={`btn w-100 py-3 ${formData.tipoRequerimento === "motorista"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                        onClick={() => handleSelect("motorista")}
                    >
                        Motorista
                    </button>
                </div>

                {/* VEÍCULO + MOTORISTA */}
                <div className="col-md-4">
                    <button
                        className={`btn w-100 py-3 ${formData.tipoRequerimento === "veiculo_motorista"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                        onClick={() => handleSelect("veiculo_motorista")}
                    >
                        Veículo + Motorista
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
                <button
                    className="btn btn-primary"
                    disabled={!formData.tipoRequerimento}
                    onClick={onNext}
                >
                    Próximo
                </button>
            </div>
        </StepContentWrapper>
    );
}
