// src/pages/admin/RequisicaoWizard/steps/veiculo/StepDadosIniciais.tsx

import React from "react";

interface StepDadosIniciaisProps {
    data: {
        porte: string;
        tipo: string;
        marca: string;
        origem: string;
        cnhNumero: string;
        cnhCategoria: string;
        cnhValidade: string;
        cnhRegistro: string;
    };
    onChange: (field: string, value: string) => void;
}

const StepDadosIniciais: React.FC<StepDadosIniciaisProps> = ({ data, onChange }) => {
    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">2. Dados Iniciais do Veículo / Equipamento</h3>

            <div className="row g-3">

                {/* PORTE */}
                <div className="col-md-4">
                    <label className="form-label fw-bold">Porte</label>
                    <select
                        className="form-select"
                        value={data.porte}
                        onChange={(e) => onChange("porte", e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="leve">Leve</option>
                        <option value="pesado">Pesado</option>
                    </select>
                </div>

                {/* TIPO */}
                <div className="col-md-4">
                    <label className="form-label fw-bold">Tipo / Modelo</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: Caminhão Pipa, Retroescavadeira..."
                        value={data.tipo}
                        onChange={(e) => onChange("tipo", e.target.value)}
                    />
                </div>

                {/* MARCA */}
                <div className="col-md-4">
                    <label className="form-label fw-bold">Marca</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: Volvo, Scania, CAT..."
                        value={data.marca}
                        onChange={(e) => onChange("marca", e.target.value)}
                    />
                </div>

                {/* ORIGEM */}
                <div className="col-md-4">
                    <label className="form-label fw-bold">Origem</label>
                    <select
                        className="form-select"
                        value={data.origem}
                        onChange={(e) => onChange("origem", e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="proprio">Próprio</option>
                        <option value="alugado">Alugado</option>
                        <option value="prestacao">Prestação de Serviço</option>
                    </select>
                </div>

            </div>

            <hr className="my-4" />

            <h5 className="fw-bold mb-3">Informações da CNH (sempre obrigatório)</h5>

            <div className="row g-3">

                {/* CNH Número */}
                <div className="col-md-3">
                    <label className="form-label fw-bold">Número da CNH</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.cnhNumero}
                        onChange={(e) => onChange("cnhNumero", e.target.value)}
                    />
                </div>

                {/* Categoria */}
                <div className="col-md-3">
                    <label className="form-label fw-bold">Categoria</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: B, C, D, E"
                        value={data.cnhCategoria}
                        onChange={(e) => onChange("cnhCategoria", e.target.value)}
                    />
                </div>

                {/* Validade */}
                <div className="col-md-3">
                    <label className="form-label fw-bold">Validade</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.cnhValidade}
                        onChange={(e) => onChange("cnhValidade", e.target.value)}
                    />
                </div>

                {/* Registro */}
                <div className="col-md-3">
                    <label className="form-label fw-bold">Registro</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.cnhRegistro}
                        onChange={(e) => onChange("cnhRegistro", e.target.value)}
                    />
                </div>

            </div>
        </div>
    );
};

export default StepDadosIniciais;
