// src/pages/admin/RequisicaoWizard/steps/dados/StepVinculo.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    setFormData: (fn: (prev: any) => any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function StepVinculo({ formData, setFormData, onNext, onBack }: Props) {
    const dados = formData.vinculo || {};

    const update = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            vinculo: {
                ...prev.vinculo,
                [field]: value,
            },
        }));
    };

    return (
        <StepContentWrapper title="Vínculo Motorista ↔ Veículo">
            <div className="row g-3">

                <div className="col-md-6">
                    <label className="form-label">Tipo de Vínculo</label>
                    <select
                        className="form-select"
                        value={dados.tipo || ""}
                        onChange={(e) => update("tipo", e.target.value)}
                    >
                        <option value="">Selecione</option>
                        <option value="clt">CLT</option>
                        <option value="autonomo">Autônomo</option>
                        <option value="terceirizado">Terceirizado</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Data de Início</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dados.dataInicio || ""}
                        onChange={(e) => update("dataInicio", e.target.value)}
                    />
                </div>

                {dados.tipo === "clt" && (
                    <div className="col-md-6">
                        <label className="form-label">Número da Carteira de Trabalho</label>
                        <input
                            type="text"
                            className="form-control"
                            value={dados.ctps || ""}
                            onChange={(e) => update("ctps", e.target.value)}
                        />
                    </div>
                )}

                {dados.tipo === "terceirizado" && (
                    <div className="col-md-6">
                        <label className="form-label">Empresa Terceirizada</label>
                        <input
                            type="text"
                            className="form-control"
                            value={dados.empresa || ""}
                            onChange={(e) => update("empresa", e.target.value)}
                        />
                    </div>
                )}

            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    Voltar
                </button>

                <button className="btn btn-primary" onClick={onNext}>
                    Próximo
                </button>
            </div>
        </StepContentWrapper>
    );
}
