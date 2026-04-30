// src/pages/admin/RequisicaoWizard/steps/StepEnviar.tsx

import React from "react";

interface StepEnviarProps {
    tipo: string;
    dados: any;
}

const StepEnviar: React.FC<StepEnviarProps> = ({ tipo, dados }) => {
    const handleEnviar = () => {
        console.log("ENVIANDO REQUERIMENTO...");
        console.log("TIPO:", tipo);
        console.log("DADOS:", dados);

        alert("Requerimento enviado com sucesso!");
    };

    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">Enviar Requerimento</h3>

            <p className="text-muted">
                Revise todas as informações e clique no botão abaixo para enviar o requerimento.
            </p>

            <button className="btn btn-success mt-3" onClick={handleEnviar}>
                Enviar Requerimento
            </button>
        </div>
    );
};

export default StepEnviar;