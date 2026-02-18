export type TipoCampo =
    | "texto"
    | "numero"
    | "booleano"
    | "data"
    | "lista";

export interface SubitemChecklist {
    titulo: string;
    obrigatorio: boolean;
    critico: boolean;
    legendaId?: string;
}

export interface CampoChecklist {
    titulo: string;
    tipo: TipoCampo;
    obrigatorio: boolean;
    critico: boolean;

    // Para tipo texto
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    tamanho?: "curto" | "medio" | "longo";

    // Para tipo lista
    opcoes?: string[];

    subitens: SubitemChecklist[];
}

export interface ChecklistForm {
    titulo: string;
    codigo: string;
    campos: CampoChecklist[];
}
