import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const VisualizarChecklist = () => {
    const { id } = useParams();
    const [dados, setDados] = useState<any>(null);

    const carregar = async () => {
        const ref = doc(db, "checklists_resolvidos", id!);
        const snap = await getDoc(ref);
        if (snap.exists()) setDados(snap.data());
    };

    useEffect(() => {
        carregar();
    }, []);

    if (!dados) return <p>Carregando...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-primary">{dados.checklistTitulo}</h2>

                <button
                    className="btn btn-secondary"
                    onClick={() => window.print()}
                >
                    Imprimir / PDF
                </button>
            </div>

            <p className="text-muted">
                Data: {dados.data.toDate().toLocaleString()}
            </p>

            <hr />

            {Object.keys(dados.respostas).map((key) => {
                const r = dados.respostas[key];

                return (
                    <div key={key} className="card p-3 mb-3">
                        <h5>{r.subitem}</h5>

                        <p>
                            <strong>Resposta:</strong> {r.tipo}
                        </p>

                        {r.texto && (
                            <p>
                                <strong>Observação:</strong> {r.texto}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default VisualizarChecklist;
