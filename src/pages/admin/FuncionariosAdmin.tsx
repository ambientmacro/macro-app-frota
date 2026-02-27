import React, { useEffect, useState } from "react";
import { db, authAdmin } from "../../firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

interface Funcionario {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    funcao: string;
    empresaId: string;
    empresaNome: string;
    equipamentoTitularId?: string | null;
    ativo: boolean;
    criarUsuario?: boolean;
    usuarioEmail?: string | null;
    authUid?: string | null;
}

interface Empresa {
    id: string;
    nome: string;
}

interface Equipamento {
    id: string;
    nome: string;
    placa?: string;
}

const aplicarMascaraTelefone = (valor: string) => {
    valor = valor.replace(/\D/g, "");

    if (valor.length <= 10) {
        return valor
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
};

const emailEhValido = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const FuncionariosAdmin: React.FC = () => {
    const [lista, setLista] = useState<Funcionario[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

    const [empresaSelecionada, setEmpresaSelecionada] = useState("");

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [funcao, setFuncao] = useState("Operador/Motorista");
    const [equipamentoTitular, setEquipamentoTitular] = useState("");

    const [criarUsuario, setCriarUsuario] = useState(false);
    const [usuarioEmail, setUsuarioEmail] = useState("");
    const [usuarioSenha, setUsuarioSenha] = useState("");

    const [filtroUsuario, setFiltroUsuario] = useState("todos");
    const [filtroAtivo, setFiltroAtivo] = useState("todos");
    const [filtroBusca, setFiltroBusca] = useState("");

    const [editando, setEditando] = useState<any | null>(null);

    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    useEffect(() => {
        if (criarUsuario) {
            setUsuarioEmail(email);
        }
    }, [email, criarUsuario]);

    const carregarFuncionarios = async () => {
        setLoading(true);
        const snap = await getDocs(collection(db, "funcionarios"));
        const arr: Funcionario[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
        arr.sort((a, b) => a.nome.localeCompare(b.nome));
        setLista(arr);
        setLoading(false);
    };

    const carregarEmpresas = async () => {
        const snap = await getDocs(collection(db, "empresas"));
        const arr: Empresa[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
        setEmpresas(arr);
        if (arr.length === 1) setEmpresaSelecionada(arr[0].id);
    };

    const carregarEquipamentos = async () => {
        const snap = await getDocs(collection(db, "equipamentos"));
        const arr: Equipamento[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as any) }));
        setEquipamentos(arr);
    };

    const validarEmailDuplicado = async (email: string) => {
        const q = query(
            collection(db, "funcionarios"),
            where("usuarioEmail", "==", email)
        );
        const snap = await getDocs(q);
        return !snap.empty;
    };

    const getEquipamentoLabel = (id?: string | null) => {
        if (!id) return "";
        const eq = equipamentos.find((e) => e.id === id);
        if (!eq) return id;
        return `${eq.nome}${eq.placa ? " • " + eq.placa : ""}`;
    };

    useEffect(() => {
        carregarFuncionarios();
        carregarEmpresas();
        carregarEquipamentos();
    }, []);
    const salvar = async () => {
        if (!nome || !email) {
            Swal.fire("Atenção", "Nome e e-mail são obrigatórios.", "warning");
            return;
        }

        if (!emailEhValido(email)) {
            Swal.fire("Erro", "Digite um e-mail válido.", "error");
            return;
        }

        if (!empresaSelecionada) {
            Swal.fire("Atenção", "Selecione uma empresa.", "warning");
            return;
        }

        if (criarUsuario) {
            if (!emailEhValido(usuarioEmail)) {
                Swal.fire("Erro", "O usuário deve ser um e-mail válido.", "error");
                return;
            }

            if (usuarioSenha.length < 6) {
                Swal.fire("Erro", "A senha deve ter pelo menos 6 caracteres.", "error");
                return;
            }

            const existe = await validarEmailDuplicado(usuarioEmail);
            if (existe) {
                Swal.fire("Erro", "Este e-mail já está cadastrado como usuário.", "error");
                return;
            }
        }

        const empresa = empresas.find((e) => e.id === empresaSelecionada);
        let authUid: string | null = null;

        try {
            setLoading(true);

            if (criarUsuario) {
                const cred = await createUserWithEmailAndPassword(
                    authAdmin,
                    usuarioEmail,
                    usuarioSenha
                );
                authUid = cred.user.uid;
            }

            await addDoc(collection(db, "funcionarios"), {
                nome,
                email,
                telefone,
                funcao: "Operador/Motorista",
                empresaId: empresaSelecionada,
                empresaNome: empresa?.nome || "",
                equipamentoTitularId: equipamentoTitular || null,
                ativo: true,
                criadoEm: new Date(),
                criarUsuario,
                usuarioEmail: criarUsuario ? usuarioEmail : null,
                authUid: authUid || null,
            });

            Swal.fire("Sucesso!", "Funcionário cadastrado.", "success");

            setNome("");
            setEmail("");
            setTelefone("");
            setFuncao("Operador/Motorista");
            setEmpresaSelecionada("");
            setCriarUsuario(false);
            setUsuarioEmail("");
            setUsuarioSenha("");
            setEquipamentoTitular("");

            carregarFuncionarios();
        } catch (error: any) {
            Swal.fire("Erro", error.message || "Erro ao salvar funcionário.", "error");
        } finally {
            setLoading(false);
        }
    };

    const salvarEdicao = async () => {
        if (!editando) return;

        if (!emailEhValido(editando.email)) {
            Swal.fire("Erro", "Digite um e-mail válido.", "error");
            return;
        }

        const ref = doc(db, "funcionarios", editando.id);
        let authUid = editando.authUid || null;

        try {
            setLoading(true);

            if (editando.criarUsuario && !editando.authUid) {
                if (!emailEhValido(editando.usuarioEmail || "")) {
                    Swal.fire("Erro", "O usuário deve ser um e-mail válido.", "error");
                    setLoading(false);
                    return;
                }

                if (!editando.usuarioSenha || editando.usuarioSenha.length < 6) {
                    Swal.fire("Erro", "A senha deve ter pelo menos 6 caracteres.", "error");
                    setLoading(false);
                    return;
                }

                const cred = await createUserWithEmailAndPassword(
                    authAdmin,
                    editando.usuarioEmail,
                    editando.usuarioSenha
                );
                authUid = cred.user.uid;
            }

            await updateDoc(ref, {
                nome: editando.nome,
                email: editando.email,
                telefone: editando.telefone,
                funcao: "Operador/Motorista",
                equipamentoTitularId: editando.equipamentoTitularId || null,
                ativo: editando.ativo,
                criarUsuario: editando.criarUsuario,
                usuarioEmail: editando.criarUsuario ? editando.usuarioEmail : null,
                authUid: authUid,
            });

            Swal.fire("Sucesso!", "Funcionário atualizado.", "success");
            setEditando(null);
            carregarFuncionarios();
        } catch (error: any) {
            Swal.fire("Erro", error.message || "Erro ao atualizar funcionário.", "error");
        } finally {
            setLoading(false);
        }
    };

    const ativarDesativar = async (f: Funcionario) => {
        const confirm = await Swal.fire({
            title: f.ativo ? "Desativar funcionário?" : "Ativar funcionário?",
            text: f.ativo
                ? "Ele não poderá mais acessar o sistema."
                : "Ele voltará a ter acesso ao sistema.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: f.ativo ? "Desativar" : "Ativar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            const ref = doc(db, "funcionarios", f.id);
            await updateDoc(ref, { ativo: !f.ativo });
            Swal.fire(
                "Sucesso!",
                `Funcionário ${f.ativo ? "desativado" : "ativado"}.`,
                "success"
            );
            carregarFuncionarios();
        } catch (error: any) {
            Swal.fire("Erro", error.message || "Erro ao atualizar status.", "error");
        } finally {
            setLoading(false);
        }
    };

    const exportarCSV = () => {
        const linhas = [
            ["Nome", "Email", "Telefone", "Empresa", "Equipamento", "Usuário", "Status"],
            ...lista.map((f) => [
                f.nome,
                f.email,
                f.telefone,
                f.empresaNome,
                getEquipamentoLabel(f.equipamentoTitularId),
                f.usuarioEmail || "",
                f.ativo ? "Ativo" : "Inativo",
            ]),
        ];

        const csvContent = linhas
            .map((linha) => linha.map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`).join(";"))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "funcionarios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const listaFiltrada = lista.filter((f) => {
        if (filtroUsuario === "com" && !f.criarUsuario) return false;
        if (filtroUsuario === "sem" && f.criarUsuario) return false;

        if (filtroAtivo === "ativos" && !f.ativo) return false;
        if (filtroAtivo === "inativos" && f.ativo) return false;

        if (filtroBusca && !f.nome.toLowerCase().includes(filtroBusca.toLowerCase())) {
            return false;
        }

        return true;
    });

    const totalPaginas = Math.max(
        1,
        Math.ceil(listaFiltrada.length / itensPorPagina)
    );

    const paginaCorrigida = Math.min(paginaAtual, totalPaginas);
    const inicio = (paginaCorrigida - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const listaPaginada = listaFiltrada.slice(inicio, fim);

    if (loading && lista.length === 0) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "80vh" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }
    return (
        <div className={darkMode ? "bg-dark text-light min-vh-100" : "min-vh-100"}>
            <div className="container mt-4 pb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="text-primary mb-0">Funcionários</h1>
                    <div className="d-flex gap-2">
                        {/* <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? "Modo claro" : "Modo escuro"}
                        </button> */}
                        <button
                            className="btn btn-outline-success btn-sm"
                            onClick={exportarCSV}
                        >
                            Exportar CSV
                        </button>
                    </div>
                </div>

                {/* FORMULÁRIO */}
                <div className="card p-4 mb-4">
                    <h2 className="text-primary mb-3">Novo</h2>

                    <div className="row mt-3">
                        <div className="col-md-4">
                            <label className="form-label">Nome</label>
                            <input
                                className="form-control"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">E-mail</label>
                            <input
                                className="form-control"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setUsuarioEmail(e.target.value);
                                }}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Telefone</label>
                            <input
                                className="form-control"
                                value={telefone}
                                onChange={(e) =>
                                    setTelefone(aplicarMascaraTelefone(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-4">
                            <label className="form-label">Empresa</label>
                            <select
                                className="form-select"
                                value={empresaSelecionada}
                                onChange={(e) => setEmpresaSelecionada(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {empresas.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Função</label>
                            <select
                                className="form-select"
                                value={funcao}
                                onChange={(e) => setFuncao(e.target.value)}
                            >
                                <option value="Operador/Motorista">
                                    Operador Motorista
                                </option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Equipamento Titular</label>
                            <select
                                className="form-select"
                                value={equipamentoTitular}
                                onChange={(e) => setEquipamentoTitular(e.target.value)}
                            >
                                <option value="">Nenhum</option>
                                {equipamentos.map((eq) => (
                                    <option key={eq.id} value={eq.id}>
                                        {eq.nome} {eq.placa ? `• ${eq.placa}` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-check mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={criarUsuario}
                            onChange={(e) => {
                                setCriarUsuario(e.target.checked);
                                if (e.target.checked) setUsuarioEmail(email);
                            }}
                        />
                        <label className="form-check-label">
                            Criar usuário para este funcionário
                        </label>
                    </div>

                    {criarUsuario && (
                        <div className="row mt-3">
                            <div className="col-md-4">
                                <label className="form-label">Usuário (e-mail)</label>
                                <input
                                    className="form-control"
                                    value={usuarioEmail}
                                    onChange={(e) => setUsuarioEmail(e.target.value)}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={usuarioSenha}
                                    onChange={(e) => setUsuarioSenha(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        className="btn btn-success mt-3"
                        onClick={salvar}
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar Funcionário"}
                    </button>
                </div>

                {/* FILTROS + BUSCA */}
                <div className="card p-4 mb-4">
                    <h2 className="text-primary mb-3">Listar</h2>

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <h5>Filtro por usuário:</h5>
                            <select
                                className="form-select"
                                value={filtroUsuario}
                                onChange={(e) => setFiltroUsuario(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="com">Com usuário</option>
                                <option value="sem">Sem usuário</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label>Filtro por status:</label>
                            <select
                                className="form-select"
                                value={filtroAtivo}
                                onChange={(e) => setFiltroAtivo(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="ativos">Ativos</option>
                                <option value="inativos">Inativos</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label>Buscar por nome:</label>
                            <input
                                className="form-control"
                                placeholder="Digite o nome..."
                                value={filtroBusca}
                                onChange={(e) => {
                                    setFiltroBusca(e.target.value);
                                    setPaginaAtual(1);
                                }}
                            />
                        </div>
                    </div>

                    {/* LISTAGEM */}
                    {listaPaginada.map((f) => (
                        <div key={f.id} className="card p-3 mb-2">
                            <strong>{f.nome}</strong> — {f.funcao}
                            <br />
                            <small>{f.email}</small>
                            <br />
                            <small>Empresa: {f.empresaNome}</small>
                            <br />
                            {f.equipamentoTitularId && (
                                <small style={{ color: "blue" }}>
                                    Equipamento titular:{" "}
                                    {getEquipamentoLabel(f.equipamentoTitularId)}
                                </small>
                            )}
                            <br />
                            {f.criarUsuario ? (
                                <small style={{ color: "green" }}>
                                    Usuário criado: {f.usuarioEmail}
                                </small>
                            ) : (
                                <small style={{ color: "red" }}>Sem usuário</small>
                            )}
                            <br />
                            <small>Status: {f.ativo ? "Ativo" : "Inativo"}</small>

                            <div className="mt-2">
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => setEditando(f)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => ativarDesativar(f)}
                                    disabled={loading}
                                >
                                    {f.ativo ? "Desativar" : "Ativar"}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Paginação */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Página {paginaCorrigida} de {totalPaginas}
                        </span>
                        <div className="btn-group">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={paginaCorrigida <= 1}
                                onClick={() =>
                                    setPaginaAtual((p) => Math.max(1, p - 1))
                                }
                            >
                                Anterior
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={paginaCorrigida >= totalPaginas}
                                onClick={() =>
                                    setPaginaAtual((p) =>
                                        Math.min(totalPaginas, p + 1)
                                    )
                                }
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
                {/* MODAL DE EDIÇÃO */}
                {editando && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                            padding: "20px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                padding: "25px",
                                width: "100%",
                                maxWidth: "500px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                            }}
                        >
                            <h4 className="mb-3">Editar Funcionário</h4>

                            <label>Nome</label>
                            <input
                                className="form-control"
                                value={editando.nome}
                                onChange={(e) =>
                                    setEditando({
                                        ...editando,
                                        nome: e.target.value,
                                    })
                                }
                            />

                            <label className="mt-2">E-mail</label>
                            <input
                                className="form-control"
                                value={editando.email}
                                onChange={(e) =>
                                    setEditando({
                                        ...editando,
                                        email: e.target.value,
                                        usuarioEmail: e.target.value,
                                    })
                                }
                            />

                            <label className="mt-2">Telefone</label>
                            <input
                                className="form-control"
                                value={editando.telefone}
                                onChange={(e) =>
                                    setEditando({
                                        ...editando,
                                        telefone: aplicarMascaraTelefone(
                                            e.target.value
                                        ),
                                    })
                                }
                            />

                            <label className="mt-2">Função</label>
                            <select
                                className="form-select"
                                value={editando.funcao}
                                onChange={(e) =>
                                    setEditando({
                                        ...editando,
                                        funcao: e.target.value,
                                    })
                                }
                            >
                                <option value="Operador/Motorista">
                                    Operador/Motorista
                                </option>
                            </select>

                            <label className="mt-2">Equipamento Titular</label>
                            <select
                                className="form-select"
                                value={editando.equipamentoTitularId || ""}
                                onChange={(e) =>
                                    setEditando({
                                        ...editando,
                                        equipamentoTitularId: e.target.value,
                                    })
                                }
                            >
                                <option value="">Nenhum</option>
                                {equipamentos.map((eq) => (
                                    <option key={eq.id} value={eq.id}>
                                        {eq.nome} {eq.placa ? `• ${eq.placa}` : ""}
                                    </option>
                                ))}
                            </select>

                            <div className="form-check mt-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={!!editando.criarUsuario}
                                    onChange={(e) =>
                                        setEditando({
                                            ...editando,
                                            criarUsuario: e.target.checked,
                                            usuarioEmail: editando.email,
                                        })
                                    }
                                />
                                <label className="form-check-label">
                                    Criar usuário para este funcionário
                                </label>
                            </div>

                            {editando.criarUsuario && (
                                <>
                                    <label className="mt-2">Usuário (e-mail)</label>
                                    <input
                                        className="form-control"
                                        value={editando.usuarioEmail || ""}
                                        onChange={(e) =>
                                            setEditando({
                                                ...editando,
                                                usuarioEmail: e.target.value,
                                            })
                                        }
                                    />

                                    {!editando.authUid && (
                                        <>
                                            <label className="mt-2">Senha</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={editando.usuarioSenha || ""}
                                                onChange={(e) =>
                                                    setEditando({
                                                        ...editando,
                                                        usuarioSenha:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )}

                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    className="btn btn-success"
                                    onClick={salvarEdicao}
                                    disabled={loading}
                                >
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditando(null)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FuncionariosAdmin;
