// src/pages/admin/RequisicaoWizard/steps/motorista/StepDadosMotorista.tsx

import React from "react";

interface StepDadosMotoristaProps {
    data: {
        nome: string;
        cpf: string;
        telefone: string;
        cnhNumero: string;
        cnhCategoria: string;
        cnhValidade: string;
    };
    onChange: (field: string, value: string) => void;
}

const StepDadosMotorista: React.FC<StepDadosMotoristaProps> = ({ data, onChange }) => {
    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">Dados do Motorista</h3>

            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.nome}
                        onChange={(e) => onChange("nome", e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">CPF</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.cpf}
                        onChange={(e) => onChange("cpf", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Telefone</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.telefone}
                        onChange={(e) => onChange("telefone", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">CNH Número</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.cnhNumero}
                        onChange={(e) => onChange("cnhNumero", e.target.value)}
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label fw-bold">Categoria</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.cnhCategoria}
                        onChange={(e) => onChange("cnhCategoria", e.target.value)}
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label fw-bold">Validade</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.cnhValidade}
                        onChange={(e) => onChange("cnhValidade", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
};

export default StepDadosMotorista;
