// src/pages/admin/RequisicaoWizard/RequisicaoWizard.tsx

import { useEffect, useState, useMemo } from "react";

import MacroSteps from "./components/MacroSteps";
import StepNavigatorVertical from "./components/StepNavigatorVertical";

import { wizardSteps } from "./utils/wizardSteps";
import { loadWizardDraft, saveWizardDraft, clearWizardDraft } from "./utils/wizardLocalStorage";

// STEPS — TIPO
import StepTipoRequerimento from "./steps/tipo/StepTipoRequerimento";

// STEPS — DADOS
import StepDadosIniciais from "./steps/dados/StepDadosIniciais";
import StepDadosVeiculo from "./steps/dados/StepDadosVeiculo";
import StepOrigemContrato from "./steps/dados/StepOrigemContrato";
import StepValoresAluguel from "./steps/dados/StepValoresAluguel";
import StepDadosMotorista from "./steps/dados/StepDadosMotorista";
import StepJornada from "./steps/dados/StepJornada";
import StepSalario from "./steps/dados/StepSalario";
import StepBeneficios from "./steps/dados/StepBeneficios";
import StepVinculo from "./steps/dados/StepVinculo";

// STEPS — DOCUMENTOS
import StepCRLV from "./steps/documentos/StepCRLV";
import StepCNH from "./steps/documentos/StepCNH";
import StepContrato from "./steps/documentos/StepContrato";
import StepFotos from "./steps/documentos/StepFotos";
import StepOutros from "./steps/documentos/StepOutros";

// STEP — REVISÃO
import StepRevisaoFinal from "./steps/revisao/StepRevisaoFinal";

export default function RequisicaoWizard() {
    // -------------------------------------------------------
    // ESTADO GLOBAL DO FORMULÁRIO
    // -------------------------------------------------------
    const [formData, setFormData] = useState<any>({
        tipoRequerimento: null,

        dadosIniciais: {},
        dadosVeiculo: {},
        origemContrato: {},
        valoresAluguel: {},

        dadosMotorista: {},
        jornada: {},
        salario: {},
        beneficios: {},
        vinculo: {},

        documentos: {
            crlv: null,
            cnh: null,
            contrato: null,
            fotos: [],
            outros: [],
        },
    });

    // -------------------------------------------------------
    // CARREGAR RASCUNHO DO LOCALSTORAGE
    // -------------------------------------------------------
    useEffect(() => {
        const saved = loadWizardDraft();
        if (saved) setFormData(saved);
    }, []);

    // -------------------------------------------------------
    // SALVAR RASCUNHO AUTOMATICAMENTE
    // -------------------------------------------------------
    useEffect(() => {
        saveWizardDraft(formData);
    }, [formData]);

    // -------------------------------------------------------
    // CONTROLE DE MACROSTEP E SUBSTEP
    // -------------------------------------------------------
    const [currentMacroStep, setCurrentMacroStep] = useState(0);
    const [currentSubStep, setCurrentSubStep] = useState(0);

    const tipo = formData.tipoRequerimento;
    const temMotorista = tipo === "veiculo_motorista";

    const subSteps = useMemo(() => {
        return wizardSteps.getSubSteps(tipo, temMotorista);
    }, [tipo, temMotorista]);

    const macroLabels = wizardSteps.macroSteps;
    const currentSubSteps = subSteps[currentMacroStep] || [];

    // -------------------------------------------------------
    // NAVEGAÇÃO LIVRE (OPÇÃO A)
    // -------------------------------------------------------
    const goToMacroStep = (index: number) => {
        setCurrentMacroStep(index);
        setCurrentSubStep(0);
    };

    const goToSubStep = (index: number) => {
        setCurrentSubStep(index);
    };

    const handleNext = () => {
        if (currentSubStep < currentSubSteps.length - 1) {
            setCurrentSubStep((prev) => prev + 1);
        } else {
            setCurrentMacroStep((prev) => prev + 1);
            setCurrentSubStep(0);
        }
    };

    const handleBack = () => {
        if (currentSubStep > 0) {
            setCurrentSubStep((prev) => prev - 1);
        } else {
            const prevMacro = currentMacroStep - 1;
            setCurrentMacroStep(prevMacro);
            setCurrentSubStep(subSteps[prevMacro]?.length - 1 || 0);
        }
    };

    // -------------------------------------------------------
    // RENDERIZAÇÃO DOS STEPS
    // -------------------------------------------------------
    const renderStep = () => {
        // MACROSTEP 0 — TIPO
        if (currentMacroStep === 0) {
            return (
                <StepTipoRequerimento
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                />
            );
        }

        // MACROSTEP 1 — DADOS
        if (currentMacroStep === 1) {
            const label = currentSubSteps[currentSubStep];

            switch (label) {
                case "Dados Iniciais":
                    return <StepDadosIniciais formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Dados do Veículo":
                    return <StepDadosVeiculo formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Origem / Contrato":
                    return <StepOrigemContrato formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Valores de Aluguel":
                    return <StepValoresAluguel formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Dados do Motorista":
                    return <StepDadosMotorista formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Jornada":
                    return <StepJornada formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Salário":
                    return <StepSalario formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Benefícios":
                    return <StepBeneficios formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Vínculo":
                    return <StepVinculo formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;
            }
        }

        // MACROSTEP 2 — DOCUMENTOS
        if (currentMacroStep === 2) {
            const label = currentSubSteps[currentSubStep];

            switch (label) {
                case "CRLV":
                    return <StepCRLV formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "CNH":
                    return <StepCNH formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Contrato":
                    return <StepContrato formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Fotos":
                    return <StepFotos formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;

                case "Outros":
                    return <StepOutros formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />;
            }
        }

        // MACROSTEP 3 — REVISÃO
        if (currentMacroStep === 3) {
            return (
                <StepRevisaoFinal
                    formData={formData}
                    onBack={handleBack}
                    onSubmit={() => {
                        console.log("ENVIAR PARA FIRESTORE:", formData);
                        clearWizardDraft();
                        alert("Cadastro enviado com sucesso!");
                    }}
                />
            );
        }
    };

    // -------------------------------------------------------
    // LAYOUT FINAL
    // -------------------------------------------------------
    return (
        <div className="container py-4">

            {/* MACROSTEPS */}
            <MacroSteps
                currentMacroStep={currentMacroStep}
                steps={macroLabels}
                formData={formData}
                subSteps={subSteps}
                onSelect={goToMacroStep}
            />

            <div className="row mt-4">

                {/* SIDEBAR */}
                {(currentMacroStep === 1 || currentMacroStep === 2) && (
                    <div className="col-md-3 mb-4">
                        <StepNavigatorVertical
                            subSteps={currentSubSteps}
                            currentSubStep={currentSubStep}
                            onSelect={goToSubStep}
                            formData={formData}
                        />
                    </div>
                )}

                {/* CONTEÚDO */}
                <div className={currentMacroStep === 1 || currentMacroStep === 2 ? "col-md-9" : "col-12"}>
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}
