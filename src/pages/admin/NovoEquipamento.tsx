import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaSave, FaTruck, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface EquipamentoForm {
    nome: string;
    tipo: string;
    placa?: string;
    frota?: string;
    descricao?: string;
    origem: "proprio" | "alugado";
}

interface Equipamento extends EquipamentoForm {
    id: string;
    checklistModeloId?: string | null;
}

const NovoEquipamento: React.FC = () => {
    const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } =
        useForm<EquipamentoForm>({
            defaultValues: {
                nome: '',
                tipo: '',
                placa: '',
                frota: '',
                descricao: '',
                origem: "proprio",
            }
        });

    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [loading, setLoading] = useState(true);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Carregar equipamentos
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

    // Salvar novo equipamento
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

    // Salvar edição
    const salvarEdicao = async (data: EquipamentoForm) => {
        if (!editandoId) return;

        try {
            await updateDoc(doc(db, "equipamentos", editandoId), data);

            Swal.fire('Sucesso!', 'Equipamento atualizado.', 'success');
            setShowModal(false);
            setEditandoId(null);
            reset();
            carregarEquipamentos();
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Não foi possível atualizar.', 'error');
        }
    };

    // Abrir modal de edição
    const editar = (eq: Equipamento) => {
        setEditandoId(eq.id);
        setValue("nome", eq.nome);
        setValue("tipo", eq.tipo);
        setValue("placa", eq.placa || "");
        setValue("frota", eq.frota || "");
        setValue("descricao", eq.descricao || "");
        setValue("origem", eq.origem);
        setShowModal(true);
    };

    // Excluir equipamento
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

    return (
        <div className="container mt-4 mb-5">

            {/* FORMULÁRIO PRINCIPAL */}
            <div className="card shadow p-4 mb-4">
                <h2 className="mb-4 text-primary">
                    <FaTruck className="me-2" /> Cadastrar Equipamento / Veículo
                </h2>

                <form onSubmit={handleSubmit(salvarEquipamento)}>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Origem</label>
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
                            <label className="form-label fw-bold">Número da Frota</label>
                            <input {...register('frota')} className="form-control" placeholder="F-001" />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold">Descrição</label>
                            <input {...register('descricao')} className="form-control" placeholder="Informações adicionais..." />
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
                <h4 className="mb-3">Equipamentos Cadastrados</h4>

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
                            {/* Aqui eu poço estilizar os campos que vem para exibição */}
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
                            <button className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>

                        <div className="modal-body p-3">
                            <form onSubmit={handleSubmit(salvarEdicao)}>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Origem</label>
                                    <select {...register("origem")} className="form-select">
                                        <option value="proprio">Próprio</option>
                                        <option value="alugado">Alugado</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome</label>
                                    <input {...register("nome")} className="form-control" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tipo</label>
                                    <input {...register("tipo")} className="form-control" />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Placa</label>
                                        <input {...register("placa")} className="form-control" />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Frota</label>
                                        <input {...register("frota")} className="form-control" />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Descrição</label>
                                        <input {...register("descricao")} className="form-control" />
                                    </div>
                                </div>

                                <button className="btn btn-primary w-100">Salvar Alterações</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default NovoEquipamento;
