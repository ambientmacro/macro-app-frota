// src/pages/admin/RequisicaoWizard/steps/relacionamento/StepVinculo.tsx

import React from "react";

interface StepVinculoProps {
    data: {
        motoristaId: string;
        veiculoId: string;
    };
    onChange: (field: string, value: string) => void;
}

const StepVinculo: React.FC<StepVinculoProps> = ({ data, onChange }) => {
    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">Vínculo Motorista ↔ Veículo</h3>

            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label fw-bold">ID do Motorista</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.motoristaId}
                        onChange={(e) => onChange("motoristaId", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">ID do Veículo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.veiculoId}
                        onChange={(e) => onChange("veiculoId", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
};

export default StepVinculo;
