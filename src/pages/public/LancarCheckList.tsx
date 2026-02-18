import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    Timestamp
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useUser } from "../../contexts/UserContext";

interface SubitemChecklist {
    titulo: string;
    obrigatorio: boolean;
    critico: boolean;
    legendaId?: string;
}

interface CampoChecklist {
    titulo: string;
    tipo: string;
    obrigatorio: boolean;
    critico: boolean;
    opcoes: string[];
    subitens: SubitemChecklist[];
}

interface ChecklistForm {
    titulo: string;
    codigo: string;
    campos: CampoChecklist[];
}

const LancarCheckList: React.FC = () => {
    const { user } = useUser();

    const [equipamentos, setEquipamentos] = useState<any[]>([]);
    const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<string>("");
    const [checklist, setChecklist] = useState<ChecklistForm | null>(null);
    const [respostas, setRespostas] = useState<any>({});
    const [errosObrigatorios, setErrosObrigatorios] = useState<string[]>([]);

    // Carregar equipamentos
    const carregarEquipamentos = async () => {
        const snap = await getDocs(collection(db, "equipamentos"));
        const lista: any[] = [];
        snap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
        setEquipamentos(lista);
    };

    // Carregar checklist vinculado
    const carregarChecklist = async (equipId: string) => {
        const equipRef = doc(db, "equipamentos", equipId);
        const equipSnap = await getDoc(equipRef);

        if (!equipSnap.exists()) return;

        const { checklistModeloId } = equipSnap.data();

        if (!checklistModeloId) {
            Swal.fire("Atenção", "Este veículo não possui checklist vinculado.", "warning");
            setChecklist(null);
            return;
        }

        const checklistRef = doc(db, "templates_checklist", checklistModeloId);
        const checklistSnap = await getDoc(checklistRef);

        if (checklistSnap.exists()) {
            setChecklist(checklistSnap.data() as ChecklistForm);
            setRespostas({});
            setErrosObrigatorios([]);
        }
    };

    useEffect(() => {
        carregarEquipamentos();
    }, []);

    // Atualizar respostas
    const atualizarResposta = (campoIndex: number, subIndex: number, valor: any) => {
        setRespostas((prev: any) => ({
            ...prev,
            [`${campoIndex}-${subIndex}`]: valor
        }));
    };

    // 🔥 VALIDAÇÃO REAL BASEADA NO SEU FIRESTORE
    const validarObrigatorios = () => {
        if (!checklist) return true;

        const erros: string[] = [];

        checklist.campos.forEach((campo, campoIndex) => {
            campo.subitens.forEach((sub, subIndex) => {
                const key = `${campoIndex}-${subIndex}`;

                // regra correta:
                // 1) se o campo é obrigatório → todos os subitens devem ser respondidos
                // 2) se o campo não é obrigatório → validar apenas subitens obrigatórios
                const deveValidar =
                    campo.obrigatorio === true || sub.obrigatorio === true;

                if (deveValidar && !respostas[key]) {
                    erros.push(`${campo.titulo} → ${sub.titulo}`);
                }
            });
        });

        setErrosObrigatorios(erros);

        if (erros.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Campos obrigatórios faltando",
                html: erros.map((e) => `<div style="text-align:left">${e}</div>`).join(""),
            });
            return false;
        }

        return true;
    };

    // Enviar checklist
    const enviarChecklist = async () => {
        if (!equipamentoSelecionado || !checklist) return;

        if (!validarObrigatorios()) return;

        const payload = {
            equipamentoId: equipamentoSelecionado,
            checklistModeloId: checklist.codigo,
            checklistTitulo: checklist.titulo,
            respostas,
            data: Timestamp.now(),
            motoristaId: user.uid // 🔥 AGORA ESTÁ AQUI!
        };

        await addDoc(collection(db, "checklists_resolvidos"), payload);

        Swal.fire("Sucesso!", "Checklist lançado com sucesso!", "success");

        setChecklist(null);
        setRespostas({});
        setEquipamentoSelecionado("");
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="card shadow p-4">
                <h2 className="text-primary mb-3">Lançar Checklist</h2>

                {/* Seleção do veículo */}
                <label className="form-label fw-bold">Selecione o veículo</label>
                <select
                    className="form-select mb-4"
                    value={equipamentoSelecionado}
                    onChange={(e) => {
                        setEquipamentoSelecionado(e.target.value);
                        carregarChecklist(e.target.value);
                    }}
                >
                    <option value="">Selecione...</option>
                    {equipamentos.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                            {eq.nome} {eq.placa ? `• ${eq.placa}` : ""}
                        </option>
                    ))}
                </select>

                {/* Renderização do checklist */}
                {checklist && (
                    <>
                        <h4 className="text-primary">{checklist.titulo}</h4>
                        <p className="text-muted">Código: {checklist.codigo}</p>

                        {checklist.campos.map((campo, campoIndex) => {
                            const campoTemErro = errosObrigatorios.some((e) =>
                                e.startsWith(campo.titulo)
                            );

                            return (
                                <div
                                    key={campoIndex}
                                    className="card p-3 mb-3"
                                    style={{
                                        border: campoTemErro ? "2px solid #dc3545" : "1px solid #ddd",
                                    }}
                                >
                                    <h5>
                                        {campo.titulo}{" "}
                                        {campo.obrigatorio && (
                                            <span className="badge bg-warning text-dark ms-2">OBRIGATÓRIO</span>
                                        )}
                                        {campo.critico && (
                                            <span className="badge bg-danger ms-2">CRÍTICO</span>
                                        )}
                                    </h5>

                                    {campo.subitens.map((sub, subIndex) => {
                                        const key = `${campoIndex}-${subIndex}`;
                                        const subTemErro = errosObrigatorios.includes(
                                            `${campo.titulo} → ${sub.titulo}`
                                        );

                                        return (
                                            <div key={subIndex} className="mt-3">
                                                <label
                                                    className="fw-bold"
                                                    style={{ color: subTemErro ? "#dc3545" : "inherit" }}
                                                >
                                                    {sub.titulo}
                                                </label>

                                                <div className="d-flex gap-3 mt-2">
                                                    {campo.opcoes.map((opcao, opIndex) => (
                                                        <label key={opIndex} className="me-3">
                                                            <input
                                                                type="radio"
                                                                name={key}
                                                                value={opcao}
                                                                onChange={() =>
                                                                    atualizarResposta(campoIndex, subIndex, {
                                                                        tipo: opcao,
                                                                        subitem: sub.titulo,
                                                                        texto: ""
                                                                    })
                                                                }
                                                            />{" "}
                                                            {opcao}
                                                        </label>
                                                    ))}
                                                </div>

                                                {respostas[key]?.tipo === "OBS" && (
                                                    <textarea
                                                        className="form-control mt-2"
                                                        placeholder="Descreva a observação"
                                                        onChange={(e) =>
                                                            atualizarResposta(campoIndex, subIndex, {
                                                                tipo: "OBS",
                                                                subitem: sub.titulo,
                                                                texto: e.target.value
                                                            })
                                                        }
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        <button className="btn btn-success btn-lg mt-3" onClick={enviarChecklist}>
                            Enviar Checklist
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default LancarCheckList;