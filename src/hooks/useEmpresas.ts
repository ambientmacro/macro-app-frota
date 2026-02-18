import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Empresa } from "../types/empresaTypes";

const COLLECTION = "empresas";

export const useEmpresas = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(false);

    const carregar = async () => {
        setLoading(true);
        const snap = await getDocs(collection(db, COLLECTION));
        const lista: Empresa[] = [];
        snap.forEach((d) => lista.push({ id: d.id, ...(d.data() as Empresa) }));
        setEmpresas(lista);
        setLoading(false);
    };

    useEffect(() => {
        carregar();
    }, []);

    const adicionar = async (empresa: Omit<Empresa, "id">) => {
        await addDoc(collection(db, COLLECTION), empresa);
        await carregar();
    };

    const atualizar = async (id: string, empresa: Partial<Empresa>) => {
        await updateDoc(doc(db, COLLECTION, id), empresa);
        await carregar();
    };

    const remover = async (id: string) => {
        await deleteDoc(doc(db, COLLECTION, id));
        await carregar();
    };

    return { empresas, loading, adicionar, atualizar, remover, recarregar: carregar };
};
