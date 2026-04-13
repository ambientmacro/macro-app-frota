import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaSave, FaTruck, FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface EquipamentoForm {
    nome: string;
    tipo: string;
    placa?: string;
    frota?: string;
    descricao?: string;
    origem: "proprio" | "alugado";
    valor?: string;
}

interface Equipamento extends EquipamentoForm {
    id: string;
    checklistModeloId?: string | null;
}

const NovoEquipamento: React.FC = () => {

    // FORM PRINCIPAL
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm<EquipamentoForm>({
        defaultValues: {
            nome: '',
            tipo: '',
            placa: '',
            frota: '',
            descricao: '',
            origem: "proprio",
            valor: ""
        }
    });

    // FORM DO MODAL
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        setValue: setValueEdit
    } = useForm<EquipamentoForm>({
        defaultValues: {
            nome: '',
            tipo: '',
            placa: '',
            frota: '',
            descricao: '',
            origem: "proprio",
            valor: ""
        }
    });

    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [loading, setLoading] = useState(true);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // PRÉ-VISUALIZAÇÃO CSV
    const [previewCSV, setPreviewCSV] = useState<any[] | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // CARREGAR EQUIPAMENTOS
    const carregarEquipamentos = async () => {
        const snap = await getDocs(collection(db, "equipamentos"));
        const lista: Equipamento[] = [];

        snap.forEach((d) => {
            const data = d.data() as EquipamentoForm;
            lista.push({
                id: d.id,
                ...data
            });
        });

        setEquipamentos(lista);
        setLoading(false);
    };

    useEffect(() => {
        carregarEquipamentos();
    }, []);

    // SALVAR NOVO
    const salvarEquipamento = async (data: EquipamentoForm) => {
        try {
            await addDoc(collection(db, "equipamentos"), {
                ...data,
                checklistModeloId: null,
                dataCriacao: new Date(),
                ativo: true
            });

            Swal.fire('Sucesso!', 'Equipamento cadastrado com sucesso.', 'success');
            reset();
            carregarEquipamentos();
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível salvar o cadastro.', 'error');
        }
    };

    // SALVAR EDIÇÃO
    const salvarEdicao = async (data: EquipamentoForm) => {
        if (!editandoId) return;

        try {
            await updateDoc(doc(db, "equipamentos", editandoId), data);

            Swal.fire('Sucesso!', 'Equipamento atualizado.', 'success');
            setShowModal(false);
            setEditandoId(null);
            resetEdit();
            carregarEquipamentos();
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível atualizar.', 'error');
        }
    };

    // ABRIR MODAL
    const editar = (eq: Equipamento) => {
        setEditandoId(eq.id);

        setValueEdit("nome", eq.nome);
        setValueEdit("tipo", eq.tipo);
        setValueEdit("placa", eq.placa || "");
        setValueEdit("frota", eq.frota || "");
        setValueEdit("descricao", eq.descricao || "");
        setValueEdit("origem", eq.origem);
        setValueEdit("valor", eq.valor || "");

        setShowModal(true);
    };

    // EXCLUIR
    const excluir = async (id: string) => {
        const confirm = await Swal.fire({
            title: "Excluir equipamento?",
            text: "Essa ação não pode ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
            await deleteDoc(doc(db, "equipamentos", id));
            carregarEquipamentos();
        }
    };

    // ============================================================
    // 📌 IMPORTAÇÃO CSV (ANSI + UTF-8) + PRÉVIA
    // ============================================================
    const importarCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (event) => {
            let texto = event.target?.result as string;

            texto = texto.replace(/^\uFEFF/, "");

            try {
                texto = decodeURIComponent(escape(texto));
            } catch { }

            const linhas = texto
                .split(/\r?\n/)
                .map((l) => l.trim())
                .filter((l) => l.length > 0);

            if (linhas.length < 2) {
                Swal.fire("Erro", "CSV vazio ou incompleto.", "error");
                return;
            }

            const cabecalho = linhas[0].split(";").map((c) => c.trim().toLowerCase());
            const dados = linhas.slice(1);

            const listaPreview: any[] = [];

            for (const linha of dados) {
                const partes = linha.split(";").map((p) => p.replace(/"/g, "").trim());

                const registro: Record<string, string> = {};
                cabecalho.forEach((col, idx) => {
                    registro[col] = partes[idx] ?? "";
                });

                listaPreview.push({
                    nome: registro["veiculo"],
                    placa: registro["placa"],
                    origem: registro["contrato"]?.toLowerCase() === "próprio" ? "proprio" : "alugado",
                    valor: registro["valor mensal"] || "",
                    tipo: "Veículo",
                    frota: registro["placa"],
                    descricao: ""
                });
            }

            setPreviewCSV(listaPreview);
            setShowPreviewModal(true);
        };

        reader.readAsText(file, "ISO-8859-1");
    };
    // CONFIRMAR IMPORTAÇÃO
    const confirmarImportacao = async () => {
        if (!previewCSV) return;

        let totalNovos = 0;
        let totalAtualizados = 0;

        const snap = await getDocs(collection(db, "equipamentos"));
        const existentes: any[] = [];

        snap.forEach((d) => {
            existentes.push({ id: d.id, ...(d.data() as EquipamentoForm) });
        });

        for (const item of previewCSV) {
            if (!item.placa) continue;

            const encontrado = existentes.find(
                (eq) => eq.placa?.toLowerCase() === item.placa.toLowerCase()
            );

            if (encontrado) {
                await updateDoc(doc(db, "equipamentos", encontrado.id), item);
                totalAtualizados++;
            } else {
                await addDoc(collection(db, "equipamentos"), {
                    ...item,
                    ativo: true,
                    checklistModeloId: null,
                    dataCriacao: new Date()
                });
                totalNovos++;
            }
        }

        setShowPreviewModal(false);
        setPreviewCSV(null);
        carregarEquipamentos();

        Swal.fire(
            "Importação concluída!",
            `${totalNovos} novos adicionados<br>${totalAtualizados} atualizados`,
            "success"
        );
    };

    return (
        <div className="container mt-4 mb-5">

            {/* FORMULÁRIO PRINCIPAL */}
            <div className="card shadow p-4 mb-4">
                <h2 className="mb-4 text-primary">
                    <FaTruck className="me-2" /> Cadastrar Equipamento / Veículo
                </h2>

                <div className="mb-3">
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => document.getElementById("csvEquipamentos")?.click()}
                    >
                        Importar CSV
                    </button>

                    <input
                        id="csvEquipamentos"
                        type="file"
                        accept=".csv"
                        style={{ display: "none" }}
                        onChange={importarCSV}
                    />
                </div>

                <form onSubmit={handleSubmit(salvarEquipamento)}>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Tipo de contrato</label>
                        <select {...register("origem")} className="form-select form-select-lg">
                            <option value="proprio">Próprio</option>
                            <option value="alugado">Alugado</option>
                        </select>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Nome do Equipamento</label>
                            <input
                                {...register('nome', { required: true })}
                                className="form-control form-control-lg"
                                placeholder="Ex: Caminhão Muck 01"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Tipo</label>
                            <input
                                {...register('tipo', { required: true })}
                                className="form-control form-control-lg"
                                placeholder="Ex: Caminhão, Retroescavadeira..."
                            />
                        </div>
                    </div>

                    <hr />

                    <h5 className="mb-3">Informações Complementares</h5>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Placa</label>
                            <input {...register('placa')} className="form-control" placeholder="ABC-1234" />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold">Tag/Patrimonio</label>
                            <input {...register('frota')} className="form-control" placeholder="C28" />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold">Descrição</label>
                            <input {...register('descricao')} className="form-control" placeholder="Informações adicionais..." />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Valor (R$)</label>
                            <input
                                {...register("valor")}
                                className="form-control form-control-lg"
                                placeholder="Ex: 150.000,00"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-success btn-lg px-5" disabled={isSubmitting}>
                            <FaSave className="me-2" />
                            {isSubmitting ? 'Salvando...' : 'Salvar Cadastro'}
                        </button>
                    </div>

                </form>
            </div>
            {/* LISTAGEM */}
            <div className="card shadow p-4">
                <h2 className="mb-4 text-primary">
                    <FaClipboardList className="me-2" /> Equipamentos Cadastrados / Veículo
                </h2>

                {loading && <p>Carregando...</p>}

                {!loading && equipamentos.length === 0 && (
                    <p className="text-muted">Nenhum equipamento cadastrado.</p>
                )}

                {!loading && equipamentos.map((eq) => (
                    <div
                        key={eq.id}
                        className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{eq.nome}</strong>
                            <div className="text-muted" style={{ fontSize: 12 }}>
                                {eq.tipo}

                                {eq.origem && (
                                    <> • Origem: {eq.origem === "proprio" ? "Próprio" : "Alugado"}</>
                                )}

                                {eq.frota && (
                                    <> • Frota {eq.frota}</>
                                )}

                                {eq.placa && (
                                    <> • Placa {eq.placa}</>
                                )}

                                {eq.valor && (
                                    <> • Valor R$ {eq.valor}</>
                                )}

                                {eq.descricao && (
                                    <> • Descrição {eq.descricao}</>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => editar(eq)}
                            >
                                <FaEdit />
                            </button>

                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => excluir(eq.id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE EDIÇÃO */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(2px)",
                        zIndex: 99999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            maxWidth: "700px",
                            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                            animation: "fadeIn 0.2s ease"
                        }}
                    >
                        <div className="modal-header p-3">
                            <h5 className="modal-title">Editar Equipamento</h5>
                            <button
                                className="btn-close"
                                onClick={() => {
                                    resetEdit();
                                    setShowModal(false);
                                }}
                            ></button>
                        </div>

                        <div className="modal-body p-3">
                            <form onSubmit={handleSubmitEdit(salvarEdicao)}>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tipo de contrato</label>
                                    <select {...registerEdit("origem")} className="form-select">
                                        <option value="proprio">Próprio</option>
                                        <option value="alugado">Alugado</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Valor (R$)</label>
                                    <input {...registerEdit("valor")} className="form-control" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome</label>
                                    <input {...registerEdit("nome")} className="form-control" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tipo</label>
                                    <input {...registerEdit("tipo")} className="form-control" />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Placa</label>
                                        <input {...registerEdit("placa")} className="form-control" />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Frota</label>
                                        <input {...registerEdit("frota")} className="form-control" />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Descrição</label>
                                        <input {...registerEdit("descricao")} className="form-control" />
                                    </div>
                                </div>

                                <button className="btn btn-primary w-100">Salvar Alterações</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE PRÉVIA CSV */}
            {showPreviewModal && previewCSV && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(2px)",
                        zIndex: 99999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            maxWidth: "900px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: "20px"
                        }}
                    >
                        <h4 className="mb-3">Pré-visualização da Importação</h4>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Placa</th>
                                    <th>Origem</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewCSV.map((v, i) => (
                                    <tr key={i}>
                                        <td>{v.nome}</td>
                                        <td>{v.placa}</td>
                                        <td>{v.origem}</td>
                                        <td>{v.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-end mt-3">
                            <button
                                className="btn btn-secondary me-2"
                                onClick={() => setShowPreviewModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={confirmarImportacao}
                            >
                                Confirmar Importação
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NovoEquipamento;
