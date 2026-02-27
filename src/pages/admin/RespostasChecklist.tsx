import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface MotoristaResumo {
    motoristaId: string;
    motoristaNome: string;
    total: number;
    ultimoEnvio: any;
    ultimoEquipamentoId?: string | null;
}

interface ChecklistItem {
    id: string;
    checklistTitulo: string;
    equipamentoId: string;
    data: any;
    respostas: Record<string, any>;
    motoristaId?: string;
}

const normalizar = (txt: string) =>
    txt
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

const RespostasChecklist: React.FC = () => {
    const hoje = new Date().toISOString().split("T")[0];
    const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const [motoristas, setMotoristas] = useState<MotoristaResumo[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalAberto, setModalAberto] = useState(false);
    const [checklistsMotorista, setChecklistsMotorista] = useState<ChecklistItem[]>([]);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState<string>("");

    const [equipamentos, setEquipamentos] = useState<Record<string, any>>({});

    const [dataInicio, setDataInicio] = useState(hoje);
    const [dataFim, setDataFim] = useState(amanha);
    const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);

    const [opcoesChecklist, setOpcoesChecklist] = useState<string[]>([]);
    const [legendas, setLegendas] = useState<Record<string, any>>({});

    const [legendaResumo, setLegendaResumo] = useState<Record<string, number>>({});
    const [tipoResumo, setTipoResumo] = useState<Record<string, number>>({});
    const [totalRespostas, setTotalRespostas] = useState(0);

    const [checklistsFiltrados, setChecklistsFiltrados] = useState<ChecklistItem[]>([]);
    const [mapaSubitemLegenda, setMapaSubitemLegenda] = useState<Record<string, string>>({});

    const formatarData = (ts: any) => {
        if (!ts) return "—";
        if (ts.toDate) {
            return ts.toDate().toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        return String(ts);
    };

    const carregarEquipamentos = async () => {
        const snap = await getDocs(collection(db, "equipamentos"));
        const mapa: Record<string, any> = {};
        snap.forEach((doc) => {
            const d = doc.data();
            mapa[doc.id] = { nome: d.nome || "", placa: d.placa || "" };
        });
        setEquipamentos(mapa);
    };

    const getEquipamentoLabel = (id: string | null | undefined) => {
        if (!id || !equipamentos[id]) return id || "";
        const eq = equipamentos[id];
        return `${eq.nome}${eq.placa ? ` (${eq.placa})` : ""}`;
    };

    const carregarOpcoesChecklist = async () => {
        const snap = await getDocs(collection(db, "templates_checklist"));
        const setOpcoes = new Set<string>();
        snap.forEach((doc) => {
            const d = doc.data();
            if (d.campos) {
                Object.values(d.campos).forEach((campo: any) => {
                    if (campo.opcoes) campo.opcoes.forEach((op: string) => setOpcoes.add(op));
                });
            }
        });
        setOpcoesChecklist(Array.from(setOpcoes));
    };

    const carregarLegendas = async () => {
        const snap = await getDocs(collection(db, "legendas_checklist"));
        const mapa: Record<string, any> = {};
        snap.forEach((doc) => {
            const d = doc.data();
            if (!d.codigo) return;
            mapa[d.codigo] = {
                cor: d.cor || "#999",
                descricao: d.descricao || "",
                acao: d.acao || ""
            };
        });
        setLegendas(mapa);
    };

    const carregarTemplateSubitens = async () => {
        const snap = await getDocs(collection(db, "templates_checklist"));
        const mapa: Record<string, string> = {};
        snap.forEach((doc) => {
            const d = doc.data();
            if (!d.campos) return;
            Object.values(d.campos).forEach((campo: any) => {
                if (campo.titulo && campo.legendaId)
                    mapa[normalizar(campo.titulo)] = campo.legendaId.trim();
                if (campo.subitens) {
                    Object.values(campo.subitens).forEach((sub: any) => {
                        if (sub.titulo && sub.legendaId)
                            mapa[normalizar(sub.titulo)] = sub.legendaId.trim();
                    });
                }
            });
        });
        setMapaSubitemLegenda(mapa);
    };

    const getCorLegenda = (legendaId: string) => {
        if (!legendaId) return "#999";
        if (legendas[legendaId]) return legendas[legendaId].cor;
        const codigo = Object.keys(legendas).find((cod) => legendaId.includes(cod));
        return codigo ? legendas[codigo].cor : "#999";
    };

    const getCorDoSubitem = (texto: string) => {
        if (!texto) return "#999";
        const chave = normalizar(texto);
        const legendaId = mapaSubitemLegenda[chave];
        return legendaId ? getCorLegenda(legendaId) : "#999";
    };

    const calcularPercentual = (parte: number, total: number) =>
        !total ? 0 : Math.round((parte / total) * 100);

    const handleExportarPDF = () => window.print();
    const carregarDados = async () => {
        setLoading(true);

        const snap = await getDocs(collection(db, "checklists_resolvidos"));
        const funcionariosSnap = await getDocs(collection(db, "funcionarios"));

        const mapaNomes: Record<string, string> = {};
        funcionariosSnap.forEach((doc) => {
            const d = doc.data();
            if (d.authUid && d.nome) mapaNomes[d.authUid] = d.nome;
        });

        const mapaMotoristas: Record<string, MotoristaResumo> = {};
        const legendaCount: Record<string, number> = {};
        const tipoCount: Record<string, number> = {};
        let totalResp = 0;

        const listaChecklists: ChecklistItem[] = [];

        snap.forEach((doc) => {
            const d = doc.data();

            if (dataInicio || dataFim) {
                if (!d.data?.toDate) return;
                const dataChecklist = d.data.toDate();
                if (dataInicio && dataChecklist < new Date(dataInicio)) return;
                if (dataFim && dataChecklist > new Date(dataFim + " 23:59")) return;
            }

            if (tiposSelecionados.length > 0) {
                const respostas = d.respostas || {};
                const valores = Object.values(respostas).map((r: any) => r.tipo);
                const tem = valores.some((v) => tiposSelecionados.includes(v));
                if (!tem) return;
            }

            const motoristaId = d.motoristaId || "SEM_ID";
            const nome = d.motoristaNome || mapaNomes[motoristaId] || "Motorista não informado";

            const dataEnvio = d.data || null;
            const equipamentoId = d.equipamentoId || null;

            if (!mapaMotoristas[motoristaId]) {
                mapaMotoristas[motoristaId] = {
                    motoristaId,
                    motoristaNome: nome,
                    total: 0,
                    ultimoEnvio: dataEnvio,
                    ultimoEquipamentoId: equipamentoId
                };
            }

            mapaMotoristas[motoristaId].total += 1;

            if (dataEnvio && dataEnvio > mapaMotoristas[motoristaId].ultimoEnvio) {
                mapaMotoristas[motoristaId].ultimoEnvio = dataEnvio;
                mapaMotoristas[motoristaId].ultimoEquipamentoId = equipamentoId;
            }

            listaChecklists.push({
                id: doc.id,
                checklistTitulo: d.checklistTitulo || "Sem título",
                equipamentoId: d.equipamentoId || "—",
                data: d.data || null,
                respostas: d.respostas || {},
                motoristaId
            });

            const respostas = d.respostas || {};
            Object.values(respostas).forEach((r: any) => {
                totalResp += 1;
                if (r.legendaId) legendaCount[r.legendaId] = (legendaCount[r.legendaId] || 0) + 1;
                if (r.tipo) tipoCount[r.tipo] = (tipoCount[r.tipo] || 0) + 1;
            });
        });

        setMotoristas(Object.values(mapaMotoristas));
        setLegendaResumo(legendaCount);
        setTipoResumo(tipoCount);
        setTotalRespostas(totalResp);
        setChecklistsFiltrados(listaChecklists);
        setLoading(false);
    };

    useEffect(() => {
        carregarEquipamentos();
        carregarOpcoesChecklist();
        carregarLegendas();
        carregarTemplateSubitens();
    }, []);

    useEffect(() => {
        carregarDados();
    }, [dataInicio, dataFim, tiposSelecionados]);

    const abrirModal = (motoristaId: string, nome: string) => {
        setMotoristaSelecionado(nome);
        setModalAberto(true);
        setChecklistsMotorista(checklistsFiltrados.filter((c) => c.motoristaId === motoristaId));
    };

    const getResumoMotoristaLegenda = () => {
        const legendaCount: Record<string, number> = {};
        let total = 0;
        checklistsMotorista.forEach((c) => {
            Object.values(c.respostas).forEach((r: any) => {
                total += 1;
                if (r.legendaId) legendaCount[r.legendaId] = (legendaCount[r.legendaId] || 0) + 1;
            });
        });
        return { legendaCount, total };
    };

    const getResumoMotoristaTipo = () => {
        const tipoCount: Record<string, number> = {};
        let total = 0;
        checklistsMotorista.forEach((c) => {
            Object.values(c.respostas).forEach((r: any) => {
                total += 1;
                if (r.tipo) tipoCount[r.tipo] = (tipoCount[r.tipo] || 0) + 1;
            });
        });
        return { tipoCount, total };
    };
    return (
        <div className="container mt-4">

            {/* ÁREA NORMAL DA TELA (NÃO IMPRIME) */}
            <div className="card shadow p-4 no-print">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="text-primary mb-0">Respostas de Checklists</h2>
                    <button className="btn btn-outline-secondary" onClick={handleExportarPDF}>
                        Exportar PDF
                    </button>
                </div>

                {/* FILTROS */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <label>Data início</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label>Data fim</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </div>

                    <div className="col-md-6">
                        <label>Filtrar por respostas</label>
                        <div className="d-flex flex-wrap gap-2">
                            {opcoesChecklist.map((op) => (
                                <label key={op} className="me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-1"
                                        checked={tiposSelecionados.includes(op)}
                                        onChange={() =>
                                            setTiposSelecionados((prev) =>
                                                prev.includes(op)
                                                    ? prev.filter((x) => x !== op)
                                                    : [...prev, op]
                                            )
                                        }
                                    />
                                    {op}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RESUMO GERAL */}
                <div className="mb-3">
                    <strong>Resumo do filtro:</strong>{" "}
                    {motoristas.length} motorista(s), {totalRespostas} resposta(s) no período.
                </div>

                {/* GRÁFICO DE PIZZA (PDF ONLY) */}
                <div className="pizza-chart">
                    <h4>Gráfico de Pizza</h4>

                    <h5>Legendas</h5>
                    {Object.entries(legendaResumo).map(([legId, qtd]) => (
                        <div key={legId}>
                            <strong>{legId}</strong> — {calcularPercentual(qtd, totalRespostas)}%
                        </div>
                    ))}

                    <h5 className="mt-3">Tipos</h5>
                    {Object.entries(tipoResumo).map(([tipo, qtd]) => (
                        <div key={tipo}>
                            <strong>{tipo}</strong> — {calcularPercentual(qtd, totalRespostas)}%
                        </div>
                    ))}
                </div>

                {/* LISTA PRINCIPAL */}
                {loading && <p>Carregando...</p>}

                {!loading && motoristas.length === 0 && (
                    <p className="text-muted">
                        Nenhum checklist encontrado para os filtros selecionados.
                    </p>
                )}

                {!loading && motoristas.length > 0 && (
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Motorista</th>
                                <th>Total de Checklists</th>
                                <th>Último Envio</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {motoristas.map((m) => (
                                <tr key={m.motoristaId}>
                                    <td>{m.motoristaNome}</td>
                                    <td>{m.total}</td>
                                    <td>
                                        {formatarData(m.ultimoEnvio)}
                                        <br />
                                        <small className="text-muted">
                                            {getEquipamentoLabel(m.ultimoEquipamentoId)}
                                        </small>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => abrirModal(m.motoristaId, m.motoristaNome)}
                                        >
                                            Ver Checklists
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
            {/* MODAL DETALHADO (NÃO IMPRIME) */}
            {modalAberto && (
                <div
                    className="modal fade show no-print"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Checklists de {motoristaSelecionado}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setModalAberto(false)}
                                ></button>
                            </div>

                            <div className="modal-body no-print">

                                {checklistsMotorista.length === 0 && (
                                    <p className="text-muted">Nenhum checklist encontrado.</p>
                                )}

                                {checklistsMotorista.length > 0 && (
                                    <>
                                        {(() => {
                                            const { legendaCount, total } = getResumoMotoristaLegenda();
                                            const { tipoCount, total: totalTipos } = getResumoMotoristaTipo();

                                            return (
                                                <div className="mb-4">
                                                    <h5>Resumo deste motorista</h5>
                                                    <p className="mb-2">
                                                        Total de respostas neste filtro: {total}
                                                    </p>

                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <h6>Legendas das perguntas</h6>
                                                            {Object.entries(legendaCount).map(([legId, qtd]) => (
                                                                <div key={legId} className="d-flex align-items-center mb-1">
                                                                    <div
                                                                        style={{
                                                                            width: 14,
                                                                            height: 14,
                                                                            borderRadius: "50%",
                                                                            background: getCorLegenda(legId),
                                                                            marginRight: 8
                                                                        }}
                                                                    ></div>
                                                                    <span className="me-2">
                                                                        <strong>{legId}</strong> — {qtd} item(ns)
                                                                    </span>
                                                                    <span className="text-muted">
                                                                        ({calcularPercentual(qtd, total)}%)
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <h6>Tipos de opções respondidas</h6>
                                                            {Object.entries(tipoCount).map(([tipo, qtd]) => (
                                                                <div key={tipo} className="mb-1">
                                                                    <span className="me-2">
                                                                        <strong>{tipo}</strong> — {qtd} item(ns)
                                                                    </span>
                                                                    <span className="text-muted">
                                                                        ({calcularPercentual(qtd, totalTipos)}%)
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <table className="table table-bordered mb-4">
                                            <thead>
                                                <tr>
                                                    <th>Título</th>
                                                    <th>Equipamento</th>
                                                    <th>Data do registro</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {checklistsMotorista.map((c) => (
                                                    <tr key={c.id}>
                                                        <td>{c.checklistTitulo}</td>
                                                        <td>{getEquipamentoLabel(c.equipamentoId)}</td>
                                                        <td>{formatarData(c.data)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {checklistsMotorista.map((c) => (
                                            <div key={c.id} className="mb-5 p-3 border rounded">

                                                <h5 className="mb-2">{c.checklistTitulo}</h5>

                                                <p className="mb-1">
                                                    <strong>Equipamento:</strong> {getEquipamentoLabel(c.equipamentoId)}
                                                </p>

                                                <p className="mb-3">
                                                    <strong>Data:</strong> {formatarData(c.data)}
                                                </p>

                                                <table className="table table-sm table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Pergunta / Subitem</th>
                                                            <th>Resposta</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.values(c.respostas).map((r: any, idx) => {
                                                            const iluminado = tiposSelecionados.includes(r.tipo);
                                                            const corSubitem = getCorDoSubitem(r.subitem || r.texto);

                                                            return (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <span
                                                                            style={{
                                                                                color: iluminado ? "#fff" : corSubitem,
                                                                                background: iluminado ? corSubitem : "transparent",
                                                                                padding: "4px 8px",
                                                                                borderRadius: "4px",
                                                                                fontWeight: "bold",
                                                                                display: "inline-block"
                                                                            }}
                                                                        >
                                                                            {r.subitem || r.texto}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            style={{
                                                                                padding: "4px 10px",
                                                                                borderRadius: "6px",
                                                                                background: corSubitem,
                                                                                color: "#fff",
                                                                                fontWeight: "bold",
                                                                                display: "inline-block"
                                                                            }}
                                                                        >
                                                                            {r.tipo}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>

                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="modal-footer no-print">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setModalAberto(false)}
                                >
                                    Fechar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {/* ÁREA DE IMPRESSÃO (PDF) */}
            <div className="print-area">
                <h2>Checklist detalhado</h2>

                {checklistsFiltrados.map((c) => (
                    <div key={c.id} style={{ marginBottom: "20px" }}>
                        <h3>{c.checklistTitulo}</h3>

                        <p>
                            <strong>Equipamento:</strong> {getEquipamentoLabel(c.equipamentoId)}
                        </p>

                        <p>
                            <strong>Data:</strong> {formatarData(c.data)}
                        </p>

                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #000", padding: "4px" }}>
                                        Subitem
                                    </th>
                                    <th style={{ border: "1px solid #000", padding: "4px" }}>
                                        Resposta
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(c.respostas).map((r: any, idx) => {
                                    const cor = getCorDoSubitem(r.subitem || r.texto);
                                    return (
                                        <tr key={idx}>
                                            <td
                                                style={{
                                                    border: "1px solid #000",
                                                    padding: "4px",
                                                    color: cor,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {r.subitem || r.texto}
                                            </td>
                                            <td
                                                style={{
                                                    border: "1px solid #000",
                                                    padding: "4px",
                                                    background: cor,
                                                    color: "#fff",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {r.tipo}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default RespostasChecklist;
