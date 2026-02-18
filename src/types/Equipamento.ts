export interface EquipamentoData {
    nome: string;
    tipo: string;
    placa?: string;
    frota?: string;
    descricao?: string;
    origem: "proprio" | "alugado";
    checklistModeloId?: string | null;
}

export interface Equipamento extends EquipamentoData {
    id: string;
}
