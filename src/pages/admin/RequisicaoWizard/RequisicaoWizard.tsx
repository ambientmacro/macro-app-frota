// src/pages/admin/RequisicaoWizard/RequisicaoWizard.tsx

import React, { useState } from "react";
import StepNavigator from "./components/StepNavigator.tsx";

// IMPORTS DOS STEPS
import StepTipoRequerimento from "./steps/StepTipoRequerimento";
import StepDadosIniciais from "./steps/veiculo/StepDadosIniciais";
import StepDadosVeiculo from "./steps/veiculo/StepDadosVeiculo";
import StepContrato from "./steps/veiculo/StepContrato";
import StepRevisaoVeiculo from "./steps/veiculo/StepRevisaoVeiculo";
import StepDadosMotorista from "./steps/motorista/StepDadosMotorista";
import StepVinculo from "./steps/relacionamento/StepVinculo";
import StepEnviar from "./steps/StepEnviar";

const RequisicaoWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [tipoRequerimento, setTipoRequerimento] = useState("");

    // ESTADOS DOS FORMULÁRIOS
    const [dadosIniciais, setDadosIniciais] = useState({
        porte: "",
        tipo: "",
        marca: "",
        origem: "",
    });

    const [dadosVeiculo, setDadosVeiculo] = useState({
        placa: "",
        renavam: "",
        crlv: "",
        anoFabricacao: "",
        anoModelo: "",
        capacidade: "",
        combustivel: "",
        quilometragem: "",
        horimetro: "",
        centroCusto: "",
        unidade: "",
        responsavel: "",
        observacoes: "",
    });

    const [dadosContrato, setDadosContrato] = useState({
        empresa: "",
        cnpj: "",
        contratoNumero: "",
        vigenciaInicio: "",
        vigenciaFim: "",
    });

    const [dadosMotorista, setDadosMotorista] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        cnhNumero: "",
        cnhCategoria: "",
        cnhValidade: "",
    });

    const [dadosVinculo, setDadosVinculo] = useState({
        motoristaId: "",
        veiculoId: "",
    });

    // -------------------------
    // DEFINIÇÃO DINÂMICA DOS STEPS
    // -------------------------

    const steps: any[] = [];

    // STEP 1 — Tipo
    steps.push({
        label: "Tipo de Requerimento",
        numero: "1",
        status: tipoRequerimento ? "concluido" : currentStep === 0 ? "andamento" : "pendente",
        componente: (
            <StepTipoRequerimento
                value={tipoRequerimento}
                onSelect={(v) => setTipoRequerimento(v)}
            />
        ),
    });

    // VEÍCULO
    if (tipoRequerimento === "veiculo" || tipoRequerimento === "veiculo_motorista") {
        steps.push({
            label: "Dados Iniciais",
            numero: "2.1",
            status:
                dadosIniciais.porte && dadosIniciais.tipo && dadosIniciais.marca
                    ? "concluido"
                    : currentStep === steps.length
                        ? "andamento"
                        : "pendente",
            componente: (
                <StepDadosIniciais
                    data={dadosIniciais}
                    onChange={(f, v) => setDadosIniciais((p) => ({ ...p, [f]: v }))}
                />
            ),
        });

        steps.push({
            label: "Dados do Veículo",
            numero: "2.2",
            status:
                dadosVeiculo.placa && dadosVeiculo.renavam
                    ? "concluido"
                    : currentStep === steps.length
                        ? "andamento"
                        : "pendente",
            componente: (
                <StepDadosVeiculo
                    data={dadosVeiculo}
                    onChange={(f, v) => setDadosVeiculo((p) => ({ ...p, [f]: v }))}
                />
            ),
        });

        if (dadosIniciais.origem && dadosIniciais.origem !== "proprio") {
            steps.push({
                label: "Contrato",
                numero: "2.3",
                status:
                    dadosContrato.empresa && dadosContrato.cnpj
                        ? "concluido"
                        : currentStep === steps.length
                            ? "andamento"
                            : "pendente",
                componente: (
                    <StepContrato
                        data={dadosContrato}
                        onChange={(f, v) => setDadosContrato((p) => ({ ...p, [f]: v }))}
                    />
                ),
            });
        }

        steps.push({
            label: "Revisão",
            numero: "2.4",
            status: currentStep === steps.length ? "andamento" : "pendente",
            componente: (
                <StepRevisaoVeiculo
                    dados={{ dadosIniciais, dadosVeiculo, dadosContrato }}
                />
            ),
        });
    }

    // MOTORISTA
    if (tipoRequerimento === "motorista" || tipoRequerimento === "veiculo_motorista") {
        steps.push({
            label: "Dados do Motorista",
            numero: "3.1",
            status:
                dadosMotorista.nome && dadosMotorista.cpf
                    ? "concluido"
                    : currentStep === steps.length
                        ? "andamento"
                        : "pendente",
            componente: (
                <StepDadosMotorista
                    data={dadosMotorista}
                    onChange={(f, v) => setDadosMotorista((p) => ({ ...p, [f]: v }))}
                />
            ),
        });
    }

    // VÍNCULO
    if (tipoRequerimento === "veiculo_motorista" && dadosMotorista.nome) {
        steps.push({
            label: "Vínculo",
            numero: "4.1",
            status:
                dadosVinculo.motoristaId && dadosVinculo.veiculoId
                    ? "concluido"
                    : currentStep === steps.length
                        ? "andamento"
                        : "pendente",
            componente: (
                <StepVinculo
                    data={dadosVinculo}
                    onChange={(f, v) => setDadosVinculo((p) => ({ ...p, [f]: v }))}
                />
            ),
        });
    }

    // ENVIO
    steps.push({
        label: "Envio",
        numero: "5.1",
        status: currentStep === steps.length ? "andamento" : "pendente",
        componente: (
            <StepEnviar
                tipo={tipoRequerimento}
                dados={{
                    dadosIniciais,
                    dadosVeiculo,
                    dadosContrato,
                    dadosMotorista,
                    dadosVinculo,
                }}
            />
        ),
    });

    return (
        <div className="container-fluid mt-4 mb-5">
            <div className="row">

                {/* SIDEBAR */}
                <div className="col-md-3">
                    <StepNavigator
                        steps={steps.map((s, index) => ({
                            id: index,
                            label: s.label,
                            numero: s.numero,
                            status: s.status,
                            onClick: () => setCurrentStep(index),
                        }))}
                        currentStep={currentStep}
                    />
                </div>

                {/* CONTEÚDO */}
                <div className="col-md-9">
                    {steps[currentStep].componente}

                    {/* NAVEGAÇÃO */}
                    <div className="d-flex justify-content-between mt-4">
                        {currentStep > 0 && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setCurrentStep((p) => p - 1)}
                            >
                                Voltar
                            </button>
                        )}

                        {currentStep < steps.length - 1 && (
                            <button
                                className="btn btn-primary ms-auto"
                                onClick={() => setCurrentStep((p) => p + 1)}
                            >
                                Próximo
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RequisicaoWizard;
