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
import { Link } from "react-router-dom";

const FuncionariosAdmin = () => {
    const [lista, setLista] = useState<any[]>([]);
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState("");

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [funcao, setFuncao] = useState("motorista");

    const [criarUsuario, setCriarUsuario] = useState(false);
    const [usuarioEmail, setUsuarioEmail] = useState("");
    const [usuarioSenha, setUsuarioSenha] = useState("");

    const [filtroUsuario, setFiltroUsuario] = useState("todos");
    const [filtroAtivo, setFiltroAtivo] = useState("todos");

    // Edição
    const [editando, setEditando] = useState<any | null>(null);

    const carregarFuncionarios = async () => {
        const snap = await getDocs(collection(db, "funcionarios"));
        const arr: any[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setLista(arr);
    };

    const carregarEmpresas = async () => {
        const snap = await getDocs(collection(db, "empresas"));
        const arr: any[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setEmpresas(arr);

        if (arr.length === 1) setEmpresaSelecionada(arr[0].id);
    };

    const validarEmailDuplicado = async (email: string) => {
        const q = query(
            collection(db, "funcionarios"),
            where("usuarioEmail", "==", email)
        );
        const snap = await getDocs(q);
        return !snap.empty;
    };

    const salvar = async () => {
        if (!nome || !email) {
            Swal.fire("Atenção", "Nome e e-mail são obrigatórios.", "warning");
            return;
        }

        if (!empresaSelecionada) {
            Swal.fire("Atenção", "Selecione uma empresa.", "warning");
            return;
        }

        if (criarUsuario) {
            if (!usuarioEmail.includes("@")) {
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

        let authUid = null;

        if (criarUsuario) {
            try {
                const cred = await createUserWithEmailAndPassword(
                    authAdmin,
                    usuarioEmail,
                    usuarioSenha
                );
                authUid = cred.user.uid;
            } catch (error: any) {
                Swal.fire("Erro ao criar usuário", error.message, "error");
                return;
            }
        }

        await addDoc(collection(db, "funcionarios"), {
            nome,
            email,
            telefone,
            funcao,
            empresaId: empresaSelecionada,
            empresaNome: empresa?.nome || "",
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
        setFuncao("motorista");
        setEmpresaSelecionada("");
        setCriarUsuario(false);
        setUsuarioEmail("");
        setUsuarioSenha("");

        carregarFuncionarios();
    };

    const salvarEdicao = async () => {
        if (!editando) return;

        const ref = doc(db, "funcionarios", editando.id);

        await updateDoc(ref, {
            nome: editando.nome,
            email: editando.email,
            telefone: editando.telefone,
            funcao: editando.funcao,
            ativo: editando.ativo,
        });

        Swal.fire("Sucesso!", "Funcionário atualizado.", "success");

        setEditando(null);
        carregarFuncionarios();
    };

    const ativarDesativar = async (f: any) => {
        const ref = doc(db, "funcionarios", f.id);

        await updateDoc(ref, {
            ativo: !f.ativo,
        });

        Swal.fire(
            "Sucesso!",
            `Funcionário ${f.ativo ? "desativado" : "ativado"}.`,
            "success"
        );

        carregarFuncionarios();
    };

    useEffect(() => {
        carregarFuncionarios();
        carregarEmpresas();
    }, []);

    const listaFiltrada = lista.filter((f) => {
        if (filtroUsuario === "com" && !f.criarUsuario) return false;
        if (filtroUsuario === "sem" && f.criarUsuario) return false;

        if (filtroAtivo === "ativos" && !f.ativo) return false;
        if (filtroAtivo === "inativos" && f.ativo) return false;

        return true;
    });

    return (
        <div className="container mt-4">
            <h2 className="text-primary mb-3">Cadastro de Funcionários</h2>

            {/* FORMULÁRIO */}
            <div className="card p-4 mb-4">
                <h5>Novo Funcionário</h5>

                <div className="row mt-3">
                    <div className="col-md-4">
                        <label className="form-label">Nome</label>
                        <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">E-mail</label>
                        <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Telefone</label>
                        <input className="form-control" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
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
                        <select className="form-select" value={funcao} onChange={(e) => setFuncao(e.target.value)}>
                            <option value="motorista">Motorista</option>
                            <option value="operador">Operador</option>
                            <option value="mecanico">Mecânico</option>
                            <option value="administrativo">Administrativo</option>
                        </select>
                    </div>
                </div>

                <div className="form-check mt-4">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={criarUsuario}
                        onChange={(e) => setCriarUsuario(e.target.checked)}
                    />
                    <label className="form-check-label">Criar usuário para este funcionário</label>
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

                <button type="button" className="btn btn-success mt-3" onClick={salvar}>
                    Salvar Funcionário
                </button>
            </div>

            {/* FILTROS */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <label>Filtro por usuário:</label>
                    <select className="form-select" value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="com">Com usuário</option>
                        <option value="sem">Sem usuário</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <label>Filtro por status:</label>
                    <select className="form-select" value={filtroAtivo} onChange={(e) => setFiltroAtivo(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="ativos">Ativos</option>
                        <option value="inativos">Inativos</option>
                    </select>
                </div>
            </div>

            {/* LISTAGEM */}
            {listaFiltrada.map((f) => (
                <div key={f.id} className="card p-3 mb-2">
                    <strong>{f.nome}</strong> — {f.funcao}
                    <br />
                    <small>{f.email}</small>
                    <br />
                    <small>Empresa: {f.empresaNome}</small>
                    <br />
                    {f.criarUsuario ? (
                        <small style={{ color: "green" }}>Usuário criado: {f.usuarioEmail}</small>
                    ) : (
                        <small style={{ color: "red" }}>Sem usuário</small>
                    )}
                    <br />
                    <small>Status: {f.ativo ? "Ativo" : "Inativo"}</small>

                    <div className="mt-2">
                        <button className="btn btn-primary btn-sm me-2" onClick={() => setEditando(f)}>
                            Editar
                        </button>

                        <button className="btn btn-warning btn-sm" onClick={() => ativarDesativar(f)}>
                            {f.ativo ? "Desativar" : "Ativar"}
                        </button>
                    </div>
                </div>
            ))}

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
                            onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                        />

                        <label className="mt-2">E-mail</label>
                        <input
                            className="form-control"
                            value={editando.email}
                            onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                        />

                        <label className="mt-2">Telefone</label>
                        <input
                            className="form-control"
                            value={editando.telefone}
                            onChange={(e) => setEditando({ ...editando, telefone: e.target.value })}
                        />

                        <label className="mt-2">Função</label>
                        <select
                            className="form-select"
                            value={editando.funcao}
                            onChange={(e) => setEditando({ ...editando, funcao: e.target.value })}
                        >
                            <option value="motorista">Motorista</option>
                            <option value="operador">Operador</option>
                            <option value="mecanico">Mecânico</option>
                            <option value="administrativo">Administrativo</option>
                        </select>

                        <div className="d-flex justify-content-between mt-4">
                            <button className="btn btn-success" onClick={salvarEdicao}>
                                Salvar
                            </button>
                            <button className="btn btn-secondary" onClick={() => setEditando(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FuncionariosAdmin;
