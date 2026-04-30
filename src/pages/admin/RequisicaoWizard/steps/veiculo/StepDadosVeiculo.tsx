// src/pages/admin/RequisicaoWizard/steps/veiculo/StepDadosVeiculo.tsx

import React from "react";

interface StepDadosVeiculoProps {
    data: {
        placa: string;
        renavam: string;
        crlv: string;
        anoFabricacao: string;
        anoModelo: string;
        capacidade: string;
        combustivel: string;
        quilometragem: string;
        horimetro: string;
        centroCusto: string;
        unidade: string;
        responsavel: string;
        observacoes: string;
    };
    onChange: (field: string, value: string) => void;
}

const StepDadosVeiculo: React.FC<StepDadosVeiculoProps> = ({ data, onChange }) => {
    return (
        <div className="card shadow p-4">
            <h3 className="mb-4 text-primary fw-bold">3. Dados do Veículo / Equipamento</h3>

            <div className="row g-3">

                <div className="col-md-3">
                    <label className="form-label fw-bold">Placa</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.placa}
                        onChange={(e) => onChange("placa", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Renavam</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.renavam}
                        onChange={(e) => onChange("renavam", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">CRLV</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.crlv}
                        onChange={(e) => onChange("crlv", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Ano Fabricação</label>
                    <input
                        type="number"
                        className="form-control"
                        value={data.anoFabricacao}
                        onChange={(e) => onChange("anoFabricacao", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Ano Modelo</label>
                    <input
                        type="number"
                        className="form-control"
                        value={data.anoModelo}
                        onChange={(e) => onChange("anoModelo", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Capacidade</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: 8m³, 15 toneladas..."
                        value={data.capacidade}
                        onChange={(e) => onChange("capacidade", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Combustível</label>
                    <select
                        className="form-select"
                        value={data.combustivel}
                        onChange={(e) => onChange("combustivel", e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="diesel">Diesel</option>
                        <option value="gasolina">Gasolina</option>
                        <option value="etanol">Etanol</option>
                        <option value="flex">Flex</option>
                        <option value="eletrico">Elétrico</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Quilometragem</label>
                    <input
                        type="number"
                        className="form-control"
                        value={data.quilometragem}
                        onChange={(e) => onChange("quilometragem", e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Horímetro</label>
                    <input
                        type="number"
                        className="form-control"
                        value={data.horimetro}
                        onChange={(e) => onChange("horimetro", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Centro de Custo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.centroCusto}
                        onChange={(e) => onChange("centroCusto", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Unidade</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.unidade}
                        onChange={(e) => onChange("unidade", e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-bold">Responsável</label>
                    <input
                        type="text"
                        className="form-control"
                        value={data.responsavel}
                        onChange={(e) => onChange("responsavel", e.target.value)}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label fw-bold">Observações</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={data.observacoes}
                        onChange={(e) => onChange("observacoes", e.target.value)}
                    ></textarea>
                </div>

            </div>
        </div>
    );
};

export default StepDadosVeiculo;
