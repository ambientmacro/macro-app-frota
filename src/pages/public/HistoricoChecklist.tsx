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

    const [dataInicial, setDataInicial] = useState<string>("");
    const [dataFinal, setDataFinal] = useState<string>("");
    const [modoPdf, setModoPdf] = useState<"individual" | "unico" | "resumo">("individual");

    const carregar = async () => {
        if (!user) return;

        setCarregando(true);

        try {
            let inicio: Date;
            let fim: Date;

            if (dataInicial && dataFinal) {
                inicio = new Date(dataInicial + "T00:00:00");
                fim = new Date(dataFinal + "T23:59:59");
            } else {
                const hoje = new Date();
                const trintaDiasAtras = new Date();
                trintaDiasAtras.setDate(hoje.getDate() - 30);
                inicio = trintaDiasAtras;
                fim = hoje;
            }

            const q = query(
                collection(db, "checklists_resolvidos"),
                where("motoristaId", "==", user.uid),
                where("data", ">=", inicio),
                where("data", "<=", fim),
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const aplicarFiltro = () => {
        carregar();
    };

    const gerarPdfPeriodo = () => {
        if (lista.length === 0) return;

        const conteudo = document.getElementById("area-pdf");
        if (!conteudo) return;

        const janela = window.open("", "_blank");
        if (!janela) return;

        janela.document.write(`
            <html>
                <head>
                    <title>Relatório de Checklists</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1, h2, h3, h4 { margin: 0 0 10px 0; }
                        .card { border: 1px solid #ddd; border-radius: 6px; padding: 10px 15px; margin-bottom: 10px; }
                        .linha { border-bottom: 1px solid #eee; padding: 6px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ccc; padding: 6px 8px; font-size: 12px; }
                        th { background: #f0f0f0; }
                        .titulo { font-size: 18px; margin-bottom: 15px; }
                        .subtitulo { font-size: 14px; color: #555; margin-bottom: 10px; }
                        .quebra-pagina { page-break-after: always; }
                    </style>
                </head>
                <body>
                    ${conteudo.innerHTML}
                </body>
            </html>
        `);

        janela.document.close();
        janela.focus();
        janela.print();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-primary mb-3">Histórico de Checklists</h2>

            {/* FILTROS */}
            <div className="card p-3 mb-3">
                <div className="row g-3 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Data inicial</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dataInicial}
                            onChange={(e) => setDataInicial(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label fw-bold">Data final</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dataFinal}
                            onChange={(e) => setDataFinal(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label fw-bold">Modo de PDF</label>
                        <select
                            className="form-select"
                            value={modoPdf}
                            onChange={(e) => setModoPdf(e.target.value as any)}
                        >
                            <option value="individual">Individual (um por checklist)</option>
                            <option value="unico">Completo (todos em um PDF)</option>
                            <option value="resumo">Resumo (tabela)</option>
                        </select>
                    </div>

                    <div className="col-md-3 d-flex gap-2">
                        <button className="btn btn-primary w-100" onClick={aplicarFiltro}>
                            Aplicar filtro
                        </button>
                    </div>
                </div>

                {modoPdf !== "individual" && (
                    <div className="mt-3 d-flex justify-content-end">
                        <button
                            className="btn btn-success"
                            onClick={gerarPdfPeriodo}
                            disabled={lista.length === 0}
                        >
                            Gerar PDF do período
                        </button>
                    </div>
                )}

                {modoPdf === "individual" && (
                    <p className="mt-2 text-muted" style={{ fontSize: 13 }}>
                        Modo individual: abra cada checklist em "Ver detalhes" e use o botão "Imprimir / PDF".
                    </p>
                )}
            </div>

            {carregando && <p>Carregando...</p>}

            {!carregando && lista.length === 0 && (
                <p>Nenhum checklist encontrado no período selecionado.</p>
            )}

            {/* LISTA NORMAL NA TELA */}
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

            {/* ÁREA OCULTA PARA GERAR PDF DO PERÍODO */}
            <div id="area-pdf" style={{ display: "none" }}>
                <h1 className="titulo">Relatório de Checklists</h1>
                {dataInicial && dataFinal && (
                    <p className="subtitulo">
                        Período: {new Date(dataInicial).toLocaleDateString("pt-BR")} até{" "}
                        {new Date(dataFinal).toLocaleDateString("pt-BR")}
                    </p>
                )}

                {modoPdf === "resumo" && (
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Dia</th>
                                <th>Título</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((item) => {
                                const data = item.data.toDate();
                                const diaSemana = getDiaSemana(data);
                                const dataFormatada = formatarData(data);
                                const horaFormatada = formatarHora(data);

                                return (
                                    <tr key={item.id}>
                                        <td>{dataFormatada}</td>
                                        <td>{horaFormatada}</td>
                                        <td style={{ textTransform: "capitalize" }}>{diaSemana}</td>
                                        <td>{item.checklistTitulo}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {modoPdf === "unico" && (
                    <>
                        {lista.map((item, index) => {
                            const data = item.data.toDate();
                            const diaSemana = getDiaSemana(data);
                            const dataFormatada = formatarData(data);
                            const horaFormatada = formatarHora(data);

                            return (
                                <div
                                    key={item.id}
                                    className={index < lista.length - 1 ? "quebra-pagina" : ""}
                                >
                                    <h2>{item.checklistTitulo}</h2>
                                    <p>
                                        <strong>Data:</strong> {dataFormatada} ({diaSemana}) às {horaFormatada}
                                    </p>
                                    <hr />
                                    <p>Checklist ID: {item.id}</p>
                                    {/* Aqui você pode, se quiser, no futuro, buscar e renderizar mais detalhes */}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoricoChecklist;
