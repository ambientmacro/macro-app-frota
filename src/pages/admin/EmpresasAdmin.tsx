import React, { useState } from "react";
import { useEmpresas } from "../../hooks/useEmpresas";
import { Empresa } from "../../types/empresaTypes";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const EmpresasAdmin: React.FC = () => {
    const { empresas, adicionar, atualizar, remover, loading } = useEmpresas();
    const { register, handleSubmit, reset, setValue } = useForm<Omit<Empresa, "id">>({
        defaultValues: {
            nome: "",
            cnpj: "",
            ativa: true,
        },
    });

    const [editandoId, setEditandoId] = useState<string | null>(null);

    const onSubmit = async (data: Omit<Empresa, "id">) => {
        if (!data.nome.trim()) {
            Swal.fire("Atenção", "Informe o nome da empresa.", "warning");
            return;
        }

        try {
            if (editandoId) {
                await atualizar(editandoId, data);
                Swal.fire("Sucesso", "Empresa atualizada com sucesso.", "success");
            } else {
                await adicionar(data);
                Swal.fire("Sucesso", "Empresa cadastrada com sucesso.", "success");
            }
            reset();
            setEditandoId(null);
        } catch (e) {
            Swal.fire("Erro", "Não foi possível salvar a empresa.", "error");
        }
    };

    const editar = (empresa: Empresa) => {
        if (!empresa.id) return;
        setEditandoId(empresa.id);
        setValue("nome", empresa.nome);
        setValue("cnpj", empresa.cnpj || "");
        setValue("ativa", empresa.ativa);
    };

    const excluir = async (empresa: Empresa) => {
        if (!empresa.id) return;

        const res = await Swal.fire({
            title: "Confirmar exclusão",
            text: `Deseja realmente excluir a empresa "${empresa.nome}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
        });

        if (res.isConfirmed) {
            await remover(empresa.id);
        }
    };

    const cancelarEdicao = () => {
        reset();
        setEditandoId(null);
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="card p-4 shadow">
                <h2 className="text-primary mb-3">Empresas</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Nome da empresa</label>
                        <input
                            {...register("nome", { required: true })}
                            className="form-control"
                            placeholder="Ex: Macro Ambiental"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">CNPJ (opcional)</label>
                        <input
                            {...register("cnpj")}
                            className="form-control"
                            placeholder="Ex: 00.000.000/0000-00"
                        />
                    </div>

                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            {...register("ativa")}
                            className="form-check-input"
                            id="empresaAtiva"
                        />
                        <label className="form-check-label" htmlFor="empresaAtiva">
                            Empresa ativa
                        </label>
                    </div>

                    <div className="d-flex justify-content-end">
                        {editandoId && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary me-2"
                                onClick={cancelarEdicao}
                            >
                                Cancelar
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary">
                            {editandoId ? "Atualizar" : "Cadastrar"}
                        </button>
                    </div>
                </form>

                <h5 className="mb-3">Empresas cadastradas</h5>

                {loading && <p>Carregando...</p>}

                {!loading && empresas.length === 0 && (
                    <p className="text-muted">Nenhuma empresa cadastrada ainda.</p>
                )}

                {!loading &&
                    empresas.map((emp) => (
                        <div
                            key={emp.id}
                            className="card p-2 mb-2 d-flex flex-row align-items-center justify-content-between"
                        >
                            <div>
                                <strong>{emp.nome}</strong>
                                {emp.cnpj && (
                                    <div className="text-muted" style={{ fontSize: 12 }}>
                                        CNPJ: {emp.cnpj}
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontSize: 12,
                                        color: emp.ativa ? "green" : "red",
                                    }}
                                >
                                    {emp.ativa ? "Ativa" : "Inativa"}
                                </div>
                            </div>

                            <div>
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => editar(emp)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => excluir(emp)}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default EmpresasAdmin;
