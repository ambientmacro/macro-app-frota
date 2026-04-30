// src/pages/admin/RequisicaoWizard/utils/wizardValidation.ts

export function isStepFilled(stepKey: string, formData: any) {
    const data = formData[stepKey];
    if (!data) return false;

    // Objeto (dados)
    if (typeof data === "object" && !Array.isArray(data)) {
        return Object.values(data).some(
            (v) => v !== "" && v !== null && v !== undefined
        );
    }

    // Array (fotos, outros)
    if (Array.isArray(data)) {
        return data.length > 0;
    }

    // Arquivo único
    return !!data;
}

export function mapLabelToKey(label: string) {
    const map: any = {
        "Dados Iniciais": "dadosIniciais",
        "Dados do Veículo": "dadosVeiculo",
        "Origem / Contrato": "origemContrato",
        "Valores de Aluguel": "valoresAluguel",
        "Dados do Motorista": "dadosMotorista",
        "Jornada": "jornada",
        "Salário": "salario",
        "Benefícios": "beneficios",
        "Vínculo": "vinculo",

        // Documentos
        "CRLV": "crlv",
        "CNH": "cnh",
        "Contrato": "contrato",
        "Fotos": "fotos",
        "Outros": "outros",
    };

    return map[label];
}

export function isMacroStepFilled(
    macroIndex: number,
    subSteps: Record<number, string[]>,
    formData: any
) {
    const steps = subSteps[macroIndex];
    if (!steps || steps.length === 0) return false;

    return steps.every((label) => {
        const key = mapLabelToKey(label);
        return isStepFilled(key, formData);
    });
}
