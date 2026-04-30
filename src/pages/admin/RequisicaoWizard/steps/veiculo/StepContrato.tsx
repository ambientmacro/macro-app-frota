// src/pages/admin/RequisicaoWizard/steps/veiculo/StepContrato.tsx

import React from "react";

interface StepContratoProps {
    data: {
        empresa: string;
        cnpj: string;
        contratoNumero: string;
        vigenciaInicio: string;
        vigenciaFim: string;
        anexos: File | null;
    };
    onChange: (field: string, value: any) => void;
}

const StepContrato: React.FC<StepContratoProps> = ({ data, onChange }) => {
    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">Contrato</h3>

            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label fw-bold">Empresa</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.empresa}
                        onChange={(e) => onChange("empresa", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">CNPJ</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.cnpj}
                        onChange={(e) => onChange("cnpj", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Número do Contrato</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.contratoNumero}
                        onChange={(e) => onChange("contratoNumero", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Vigência - Início</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.vigenciaInicio}
                        onChange={(e) => onChange("vigenciaInicio", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Vigência - Fim</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.vigenciaFim}
                        onChange={(e) => onChange("vigenciaFim", e.target.value)}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label fw-bold">Anexar Contrato (PDF)</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="application/pdf"
                        onChange={(e) => onChange("anexos", e.target.files?.[0] || null)}
                    />
                </div>

            </div>
        </div>
    );
};

export default StepContrato;
