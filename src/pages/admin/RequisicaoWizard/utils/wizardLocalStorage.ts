// src/pages/admin/RequisicaoWizard/utils/wizardLocalStorage.ts

const STORAGE_KEY = "wizard_requisicao_draft";

export function saveWizardDraft(data: any) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
        console.error("Erro ao salvar rascunho:", err);
    }
}

export function loadWizardDraft() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Erro ao carregar rascunho:", err);
        return null;
    }
}

export function clearWizardDraft() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error("Erro ao limpar rascunho:", err);
    }
}
