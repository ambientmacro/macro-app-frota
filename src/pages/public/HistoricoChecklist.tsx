import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUser } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

const diasSemana = [
    "domingo",
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado"
];

const getDiaSemana = (date: Date) => diasSemana[date.getDay()];

const formatarData = (date: Date) =>
    date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const formatarHora = (date: Date) =>
    date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

const HistoricoChecklist = () => {
    const { user } = useUser();
    const [lista, setLista] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const carregar = async () => {
        if (!user) return;

        try {
            // 🔥 Últimos 30 dias
            const hoje = new Date();
            const trintaDiasAtras = new Date();
            trintaDiasAtras.setDate(hoje.getDate() - 30);

            const q = query(
                collection(db, "checklists_resolvidos"),
                where("motoristaId", "==", user.uid),
                where("data", ">=", trintaDiasAtras),
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
    }, [user]);

    return (
        <div className="container mt-4">
            <h2 className="text-primary mb-3">Histórico de Checklists (últimos 30 dias)</h2>

            {carregando && <p>Carregando...</p>}

            {!carregando && lista.length === 0 && (
                <p>Nenhum checklist encontrado nos últimos 30 dias.</p>
            )}

            {lista.map((item) => {
                const data = item.data.toDate();
                const diaSemana = getDiaSemana(data);
                const dataFormatada = formatarData(data);
                const horaFormatada = formatarHora(data);

                return (
                    <div
                        key={item.id}
                        className="card mb-3 p-3"
                        style={{
                            borderLeft: "6px solid #0d6efd",
                            background: "#f8f9fa",
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4
                                    style={{
                                        margin: 0,
                                        textTransform: "capitalize",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {diaSemana}
                                </h4>

                                <small className="text-muted">
                                    {dataFormatada} — {horaFormatada}
                                </small>
                            </div>

                            <Link
                                to={`/visualizar-checklist/${item.id}`}
                                className="btn btn-outline-primary btn-sm"
                            >
                                Ver detalhes
                            </Link>
                        </div>

                        <hr />

                        <h5 style={{ margin: 0 }}>{item.checklistTitulo}</h5>
                    </div>
                );
            })}
        </div>
    );
};

export default HistoricoChecklist;
