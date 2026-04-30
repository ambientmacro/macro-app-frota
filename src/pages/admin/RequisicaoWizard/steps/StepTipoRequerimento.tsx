// src/pages/admin/RequisicaoWizard/steps/StepTipoRequerimento.tsx

import React from "react";

interface StepTipoRequerimentoProps {
    value: string;
    onSelect: (tipo: string) => void;
}

const StepTipoRequerimento: React.FC<StepTipoRequerimentoProps> = ({ value, onSelect }) => {
    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">1. Tipo de Requerimento</h3>

            <p className="text-muted mb-4">
                Selecione o tipo de cadastro que deseja realizar. As próximas etapas serão ajustadas
                automaticamente conforme sua escolha.
            </p>

            <div className="row g-3">

                {/* Apenas Veículo */}
                <div className="col-md-4">
                    <div
                        className={`p-3 border rounded cursor-pointer ${value === "veiculo" ? "border-primary bg-light" : "border-secondary"
                            }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => onSelect("veiculo")}
                    >
                        <h5 className="fw-bold mb-2">Apenas Veículo / Equipamento</h5>
                        <p className="text-muted small mb-0">
                            Cadastro de um veículo ou equipamento sem vínculo com motorista.
                            <br />
                            <strong>Exemplos:</strong> Retroescavadeira, Caminhão Pipa, Muck, Escavadeira.
                        </p>
                    </div>
                </div>

                {/* Apenas Motorista */}
                <div className="col-md-4">
                    <div
                        className={`p-3 border rounded cursor-pointer ${value === "motorista" ? "border-primary bg-light" : "border-secondary"
                            }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => onSelect("motorista")}
                    >
                        <h5 className="fw-bold mb-2">Apenas Motorista</h5>
                        <p className="text-muted small mb-0">
                            Cadastro de motorista sem vínculo com veículo ou equipamento.
                            <br />
                            <strong>Exemplos:</strong> Motorista de caminhão, operador de máquinas.
                        </p>
                    </div>
                </div>

                {/* Veículo + Motorista */}
                <div className="col-md-4">
                    <div
                        className={`p-3 border rounded cursor-pointer ${value === "veiculo_motorista" ? "border-primary bg-light" : "border-secondary"
                            }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => onSelect("veiculo_motorista")}
                    >
                        <h5 className="fw-bold mb-2">Veículo + Motorista Titular</h5>
                        <p className="text-muted small mb-0">
                            Cadastro de veículo/equipamento com vínculo direto com motorista.
                            <br />
                            <strong>Exemplos:</strong> Caminhão + Motorista, Retroescavadeira + Operador.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StepTipoRequerimento;
