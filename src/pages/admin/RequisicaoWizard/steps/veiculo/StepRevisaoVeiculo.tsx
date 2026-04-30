// src/pages/admin/RequisicaoWizard/steps/veiculo/StepRevisaoVeiculo.tsx

import React from "react";

interface StepRevisaoVeiculoProps {
    dados: {
        dadosIniciais: any;
        dadosVeiculo: any;
        dadosContrato: any;
    };
}

const StepRevisaoVeiculo: React.FC<StepRevisaoVeiculoProps> = ({ dados }) => {
    const { dadosIniciais, dadosVeiculo, dadosContrato } = dados;

    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">Revisão do Veículo</h3>

            <h5 className="fw-bold mt-3">Dados Iniciais</h5>
            <pre>{JSON.stringify(dadosIniciais, null, 2)}</pre>

            <h5 className="fw-bold mt-3">Dados do Veículo</h5>
            <pre>{JSON.stringify(dadosVeiculo, null, 2)}</pre>

            {dadosContrato?.empresa && (
                <>
                    <h5 className="fw-bold mt-3">Contrato</h5>
                    <pre>{JSON.stringify(dadosContrato, null, 2)}</pre>
                </>
            )}
        </div>
    );
};

export default StepRevisaoVeiculo;
