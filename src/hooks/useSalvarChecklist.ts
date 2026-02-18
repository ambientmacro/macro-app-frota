import FirebaseService from "../services/FirebaseService";
import { ChecklistForm } from "../types/checklistTypes";

export const useSalvarChecklist = () => {
    const salvar = async (data: ChecklistForm) => {
        await FirebaseService.saveData("templates_checklist", {
            ...data,
            dataCriacao: new Date(),
            ativo: true
        });
    };

    return { salvar };
};
