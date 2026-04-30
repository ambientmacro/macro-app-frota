// src/pages/admin/RequisicaoWizard/utils/wizardSteps.ts

export type TipoRequerimento = "veiculo" | "motorista" | "veiculo_motorista" | null;

interface WizardStepsConfig {
    macroSteps: string[];
    getSubSteps: (tipo: TipoRequerimento, temMotorista: boolean) => Record<number, string[]>;
}

export const wizardSteps: WizardStepsConfig = {
    macroSteps: [
        "Tipo de Requerimento",
        "Dados",
        "Documentos",
        "Revisão"
    ],

    getSubSteps: (tipo, temMotorista) => {
        return {
            0: [], // Tipo não tem substeps

            1: tipo === "veiculo"
                ? [
                    "Dados Iniciais",
                    "Dados do Veículo",
                    "Origem / Contrato",
                    "Valores de Aluguel",
                    ...(temMotorista ? ["Dados do Motorista", "Vínculo"] : [])
                ]
                : tipo === "motorista"
                    ? [
                        "Dados do Motorista",
                        "Jornada",
                        "Salário",
                        "Benefícios"
                    ]
                    : tipo === "veiculo_motorista"
                        ? [
                            "Dados Iniciais",
                            "Dados do Veículo",
                            "Origem / Contrato",
                            "Valores de Aluguel",
                            "Dados do Motorista",
                            "Vínculo"
                        ]
                        : [],

            2: tipo === "veiculo"
                ? ["CRLV", "Fotos", "Contrato", "Outros"]
                : tipo === "motorista"
                    ? ["CNH", "Fotos", "Outros"]
                    : tipo === "veiculo_motorista"
                        ? ["CRLV", "Fotos", "Contrato", "CNH", "Outros"]
                        : [],

            3: [] // Revisão não tem substeps
        };
    }
};
