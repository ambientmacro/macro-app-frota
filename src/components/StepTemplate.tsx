// src/pages/admin/RequisicaoWizard/components/StepTemplate.tsx

import React from "react";

interface StepTemplateProps {
    titulo: string; // ex: "2.3 — Contrato"
    descricao?: string;
    progresso: number;
    children: React.ReactNode;
}

const StepTemplate: React.FC<StepTemplateProps> = ({
    titulo,
    descricao,
    progresso,
    children,
}) => {
    return (
        <div className="card shadow p-4 w-100">

            <h3 className="fw-bold text-primary">{titulo}</h3>

            {descricao && <p className="text-muted">{descricao}</p>}

            <div className="mt-3">{children}</div>

            {/* PROGRESSO */}
            <div className="mt-4">
                <div className="d-flex justify-content-between mb-1">
                    <small className="fw-bold">Progresso</small>
                    <small className="fw-bold">{progresso}%</small>
                </div>

                <div className="progress" style={{ height: "8px" }}>
                    <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${progresso}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default StepTemplate;
