import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUser } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

const HistoricoChecklist = () => {
    const { user } = useUser();
    const [lista, setLista] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const carregar = async () => {
        if (!user) return; // 🔥 evita erro de null

        try {
            const q = query(
                collection(db, "checklists_resolvidos"),
                where("motoristaId", "==", user.uid),
                orderBy("data", "desc")
            );

            const snap = await getDocs(q);
            const arr: any[] = [];
            snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
            setLista(arr);
        } catch (err) {
            console.error("Erro ao carregar histórico:", err);
        }

        setCarregando(false);
    };

    useEffect(() => {
        carregar();
    }, [user]); // 🔥 só roda quando o user existir

    return (
        <div className="container mt-4">
            <h2 className="text-primary mb-3">Histórico de Checklists</h2>

            {carregando && <p>Carregando...</p>}

            {!carregando && lista.length === 0 && (
                <p>Nenhum checklist encontrado.</p>
            )}

            {lista.map((item) => (
                <div key={item.id} className="card p-3 mb-3">
                    <h5>{item.checklistTitulo}</h5>

                    <p className="text-muted">
                        Data: {item.data.toDate().toLocaleString()}
                    </p>

                    <Link
                        to={`/visualizar-checklist/${item.id}`}
                        className="btn btn-outline-primary btn-sm"
                    >
                        Ver detalhes
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default HistoricoChecklist;
