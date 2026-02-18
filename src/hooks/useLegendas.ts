import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import FirebaseService from "../services/FirebaseService";
import { Legenda } from "../types/legendaTypes";

const COLLECTION = "legendas_checklist";

export const useLegendas = () => {
    const [legendas, setLegendas] = useState<Legenda[]>([]);
    const [loading, setLoading] = useState(false);

    const carregar = async () => {
        setLoading(true);
        const snap = await getDocs(collection(db, COLLECTION));
        const lista: Legenda[] = [];
        snap.forEach((d) => lista.push({ id: d.id, ...(d.data() as Legenda) }));
        setLegendas(lista);
        setLoading(false);
    };

    useEffect(() => {
        carregar();
    }, []);

    const adicionar = async (legenda: Omit<Legenda, "id">) => {
        await FirebaseService.saveData(COLLECTION, legenda);
        await carregar();
    };

    const atualizar = async (id: string, legenda: Partial<Legenda>) => {
        await updateDoc(doc(db, COLLECTION, id), legenda);
        await carregar();
    };

    const remover = async (id: string) => {
        await deleteDoc(doc(db, COLLECTION, id));
        await carregar();
    };

    return { legendas, loading, adicionar, atualizar, remover, recarregar: carregar };
};
