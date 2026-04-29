// src/pages/NovoEquipamento.tsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    Timestamp,
    DocumentData,
} from "firebase/firestore";
import { FaSave, FaTruck, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";

type Entidade = "veiculo" | "motorista";

interface FormRequerimentoBase {
    entidade: Entidade;
}

interface FormVeiculo {
    nome: string;
    tipo: string;
    porte: "leve" | "pesado";
    origem: "proprio" | "alugado" | "prestacao";
    placa?: string;
    renavam?: string;
    crlv?: string;
    anoFabricacao?: string;
    anoModelo?: string;
    capacidade?: string;
    combustivel?: string;
    quilometragem?: string;
    horimetro?: string;
    valorMensal?: string;
    valorAquisicao?: string;
    centroCusto?: string;
    unidade?: string;
    responsavel?: string;
    observacoes?: string;

    // regras novas
    categoriaCnh?: string; // para LEVE
    cursosObrigatorios?: string[]; // para PESADO
}

interface FormMotorista {
    nomeMotorista: string;
    cpf?: string;
    rg?: string;
    dataNascimento?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    cnh?: string;
    categoriaCnh?: string;
    validadeCnh?: string;
    registroCnh?: string;
    tipoContrato?: string;
    empresa?: string;
    funcao?: string;
    observacoesMotorista?: string;
    dataInicioContrato?: string;
    dataFinalContrato?: string;
    tipoPeriodoContrato?: string;
    duracaoCustomizada?: string;

}

type FormRequerimento = FormRequerimentoBase & FormVeiculo & FormMotorista;

interface RequerimentoListagem {
    id: string;
    entidade: Entidade;
    status: string;
    criadoEm: Date;
    resolvidoEm?: Date;
    criadoPor?: string;
    dadosSolicitados: any;
}

const NovoEquipamento: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { isSubmitting },
    } = useForm<FormRequerimento>({
        defaultValues: {
            entidade: "veiculo",
            porte: "pesado",
            origem: "proprio",
        },
    });

    const [requerimentos, setRequerimentos] = useState<RequerimentoListagem[]>([]);
    const [loading, setLoading] = useState(true);

    const entidadeSelecionada = watch("entidade");
    const categoriaSelecionada = watch("porte");
    const origemSelecionada = watch("origem");


    // No topo do componente, você pode controlar com useState
    const [vincularMotorista, setVincularMotorista] = useState(false);



    // relógio ao vivo
    const [agora, setAgora] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setAgora(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // carregar requerimentos
    const carregarRequerimentos = async () => {
        setLoading(true);

        const lista: RequerimentoListagem[] = [];

        const snapFrotas = await getDocs(collection(db, "dp", "requerimento", "frotas"));
        snapFrotas.forEach((d) => {
            const data = d.data() as DocumentData;
            lista.push({
                id: d.id,
                entidade: data.entidade,
                status: data.status,
                criadoEm: data.criadoEm?.toDate() || new Date(),
                resolvidoEm: data.resolvidoEm?.toDate() || undefined,
                criadoPor: data.criadoPor,
                dadosSolicitados: data.dadosSolicitados,
            });
        });

        const snapMotoristas = await getDocs(collection(db, "dp", "requerimento", "motoristas"));
        snapMotoristas.forEach((d) => {
            const data = d.data() as DocumentData;
            lista.push({
                id: d.id,
                entidade: data.entidade,
                status: data.status,
                criadoEm: data.criadoEm?.toDate() || new Date(),
                resolvidoEm: data.resolvidoEm?.toDate() || undefined,
                criadoPor: data.criadoPor,
                dadosSolicitados: data.dadosSolicitados,
            });
        });

        lista.sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());

        setRequerimentos(lista);
        setLoading(false);
    };

    useEffect(() => {
        carregarRequerimentos();
    }, []);

    // helpers de tempo
    const calcularDuracao = (ini: Date, fim: Date) => {
        const diffMs = fim.getTime() - ini.getTime();
        const minutos = Math.floor(diffMs / 60000);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);

        return {
            dias,
            horas: horas % 24,
            minutos: minutos % 60,
        };
    };

    const formatarDuracao = (d: number, h: number, m: number) => {
        const partes = [];
        if (d > 0) partes.push(`${d} dia${d > 1 ? "s" : ""}`);
        if (h > 0) partes.push(`${h} hora${h > 1 ? "s" : ""}`);
        partes.push(`${m} minuto${m > 1 ? "s" : ""}`);
        return partes.join(", ");
    };
    // ============================
    // SUBMIT — sempre será NOVO requerimento
    // ============================
    const onSubmit = async (data: FormRequerimento) => {
        try {
            const { entidade, ...resto } = data;

            const dadosSolicitados: any = {};

            // ============================
            // VEÍCULO
            // ============================
            if (entidade === "veiculo") {
                dadosSolicitados.nome = resto.nome;
                dadosSolicitados.tipo = resto.tipo;
                dadosSolicitados.porte = resto.porte;
                dadosSolicitados.origem = resto.origem;

                dadosSolicitados.placa = resto.placa || "";
                dadosSolicitados.renavam = resto.renavam || "";
                dadosSolicitados.crlv = resto.crlv || "";
                dadosSolicitados.anoFabricacao = resto.anoFabricacao || "";
                dadosSolicitados.anoModelo = resto.anoModelo || "";
                dadosSolicitados.capacidade = resto.capacidade || "";
                dadosSolicitados.combustivel = resto.combustivel || "";
                dadosSolicitados.quilometragem = resto.quilometragem || "";
                dadosSolicitados.horimetro = resto.horimetro || "";
                dadosSolicitados.valorMensal = resto.valorMensal || "";
                dadosSolicitados.valorAquisicao = resto.valorAquisicao || "";
                dadosSolicitados.centroCusto = resto.centroCusto || "";
                dadosSolicitados.unidade = resto.unidade || "";
                dadosSolicitados.responsavel = resto.responsavel || "";
                dadosSolicitados.observacoes = resto.observacoes || "";

                // regras novas
                // contrato (somente se não for próprio)
                if (resto.origem !== "proprio") {
                    dadosSolicitados.dataInicioContrato = resto.dataInicioContrato || "";
                    dadosSolicitados.dataFinalContrato = resto.dataFinalContrato || "";
                    dadosSolicitados.tipoPeriodoContrato = resto.tipoPeriodoContrato || "";
                    dadosSolicitados.duracaoCustomizada = resto.duracaoCustomizada || "";
                }

                if (resto.porte === "leve") {
                    dadosSolicitados.categoriaCnh = resto.categoriaCnh || "";
                }

                if (resto.porte === "pesado") {
                    dadosSolicitados.cursosObrigatorios = resto.cursosObrigatorios || [];
                }

                if (resto.origem === "prestacao") {
                    dadosSolicitados.alertaOrigem =
                        "Origem 'Prestação de serviço' — DP deve validar contrato e documentação.";
                }
            }

            // ============================
            // MOTORISTA
            // ============================
            if (entidade === "motorista") {
                dadosSolicitados.nome = resto.nomeMotorista;
                dadosSolicitados.cpf = resto.cpf || "";
                dadosSolicitados.rg = resto.rg || "";
                dadosSolicitados.dataNascimento = resto.dataNascimento || "";
                dadosSolicitados.telefone = resto.telefone || "";
                dadosSolicitados.email = resto.email || "";
                dadosSolicitados.endereco = resto.endereco || "";
                dadosSolicitados.cnh = resto.cnh || "";
                dadosSolicitados.categoriaCnh = resto.categoriaCnh || "";
                dadosSolicitados.validadeCnh = resto.validadeCnh || "";
                dadosSolicitados.registroCnh = resto.registroCnh || "";
                dadosSolicitados.tipoContrato = resto.tipoContrato || "";
                dadosSolicitados.empresa = resto.empresa || "";
                dadosSolicitados.funcao = resto.funcao || "";
                dadosSolicitados.observacoes = resto.observacoesMotorista || "";
            }

            const caminho =
                entidade === "veiculo"
                    ? ["dp", "requerimento", "frotas"]
                    : ["dp", "requerimento", "motoristas"];

            await addDoc(collection(db, ...caminho), {
                tipoSolicitacao: "novo", // FIXO
                entidade,
                status: "analise",
                dadosSolicitados,
                criadoPor: "admFrotaId",
                criadoEm: Timestamp.now(),
                resolvidoEm: null,
            });

            Swal.fire(
                "Requisição enviada!",
                "O departamento pessoal irá analisar sua solicitação.",
                "success"
            );

            reset({
                entidade,
                porte: "pesado",
                origem: "proprio",
            });

            carregarRequerimentos();
        } catch (error) {
            console.error(error);
            Swal.fire("Erro", "Não foi possível enviar a requisição.", "error");
        }
    };

    // ============================
    // RENDER
    // ============================
    return (
        <div className="container mt-4 mb-5">
            {/* FORMULÁRIO PRINCIPAL */}
            <div className="card shadow p-4 mb-4">
                <h2 className="mb-4 text-primary">
                    <FaTruck className="me-2" /> Requerimento Contratual Veículos e Motoristas
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* ENTIDADE */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Entidade</label>
                            <select {...register("entidade")} className="form-select form-select-lg">
                                <option value="veiculo">Veículo</option>
                                <option value="motorista">Motorista</option>
                            </select>
                        </div>
                    </div>
                    {/* CAMPOS DO VEÍCULO */}
                    {entidadeSelecionada === "veiculo" && (
                        <>
                            <hr />
                            <h5 className="mb-3">Dados do Veículo</h5>

                            {/* Porte */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Porte do Veículo</label>
                                <select {...register("porte")} className="form-select form-select-lg">
                                    <option value="">Selecione...</option>
                                    <option value="leve">Leve</option>
                                    <option value="pesado">Pesado</option>
                                </select>
                            </div>



                            


                            <div className="mb-3">
                                <label className="form-label fw-bold">Requisito CNH para este veículo</label>
                                <select {...register("categoriaCnh")} className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                </select>
                            </div>

                            {/* Cursos NR obrigatórios para PESADO */}
                            {categoriaSelecionada === "pesado" && (
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Cursos obrigatórios para este equipamento)</label>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            value="NR-11"
                                            {...register("cursosObrigatorios")}
                                            className="form-check-input"
                                            id="nr11"
                                        />
                                        <label htmlFor="nr11" className="form-check-label">Curso de retroescavadeira</label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            value="NR-12"
                                            {...register("cursosObrigatorios")}
                                            className="form-check-input"
                                            id="nr12"
                                        />
                                        <label htmlFor="nr12" className="form-check-label">Curso de cavadeira</label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            value="NR-18"
                                            {...register("cursosObrigatorios")}
                                            className="form-check-input"
                                            id="nr18"
                                        />
                                        <label htmlFor="nr18" className="form-check-label">Curso de Muck</label>
                                    </div>
                                </div>
                            )}

                            {/* Origem */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Origem / Tipo de contrato</label>
                                <select {...register("origem")} className="form-select form-select-lg">
                                    <option value="proprio">Próprio</option>
                                    <option value="alugado">Alugado</option>
                                    <option value="prestacao">Prestação de serviço</option>
                                </select>
                            </div>


                            <div className="row mb-3">
                                {/* Valor Aquisição — aparece somente quando origem = próprio */}
                                {origemSelecionada === "proprio" && (
                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Valor Aquisição (R$)</label>
                                        <input
                                            {...register("valorAquisicao")}
                                            className="form-control"
                                            placeholder="R$ 100.000,00"
                                        />
                                    </div>
                                )}

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Valor Mensal (R$)</label>
                                    <input
                                        {...register("valorMensal")}
                                        className="form-control"
                                        placeholder="Se alugado"
                                    />
                                </div>
                            </div>


                            {/* Campos de contrato — aparecem somente se NÃO for próprio */}
                            {origemSelecionada !== "proprio" && (
                                <div className="row mb-3">

                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Data Início do Contrato</label>
                                        <input
                                            type="date"
                                            {...register("dataInicioContrato")}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Data Final do Contrato</label>
                                        <input
                                            type="date"
                                            {...register("dataFinalContrato")}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-bold">Tipo de Período</label>
                                        <select {...register("tipoPeriodoContrato")} className="form-select">
                                            <option value="anual">Anual</option>
                                            <option value="mensal">Mensal</option>
                                            <option value="semanal">Semanal</option>
                                            <option value="diaria">Diária</option>

                                        </select>
                                    </div>



                                </div>
                            )}

                            {/* Alerta origem prestador */}
                            {origemSelecionada === "prestacao" && (
                                <div className="alert alert-warning">
                                    Origem "Prestação de serviço" — Verificar se será somente Funcionário e tem que ter no banco de dados funcionários.
                                    Aqui foi confirmado o relacionamento com Rik
                                </div>
                            )}

                            {/* Nome + Tipo */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Marca</label>
                                    <input
                                        {...register("nome", { required: true })}
                                        className="form-control form-control-lg"
                                        placeholder="Ex: Caterpillar, JCB"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Modelo</label>
                                    <input
                                        {...register("tipo", { required: true })}
                                        className="form-control form-control-lg"
                                        placeholder="Ex: 416F2, 3CX, etc."
                                    />
                                </div>
                            </div>

                            {/* Placa / Renavam / CRLV */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Placa</label>
                                    <input {...register("placa")} className="form-control" placeholder="ABC-1234" />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Renavam</label>
                                    <input {...register("renavam")} className="form-control" placeholder="Renavam" />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">CRLV</label>
                                    <input {...register("crlv")} className="form-control" placeholder="Número do CRLV" />
                                </div>
                            </div>

                            {/* Ano / Capacidade / Combustível */}
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Ano Fabricação</label>
                                    <input {...register("anoFabricacao")} className="form-control" placeholder="2018" />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Ano Modelo</label>
                                    <input {...register("anoModelo")} className="form-control" placeholder="2019" />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Capacidade</label>
                                    <input
                                        {...register("capacidade")}
                                        className="form-control"
                                        placeholder="Ex: 8.000 litros"
                                    />
                                </div>


                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Combustível</label>
                                    <select {...register("combustivel")} className="form-select form-select-lg">
                                        <option value="diesel">Diesel</option>
                                        <option value="gasolina">Gasolina</option>
                                        <option value="alcool">Álcool</option>
                                        <option value="gnv">GNV</option>
                                        <option value="flex">Flex</option>
                                    </select>
                                </div>


                            </div>

                            {/* Quilometragem / Horímetro / Valores */}
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Quilometragem</label>
                                    <input
                                        {...register("quilometragem")}
                                        className="form-control"
                                        placeholder="Ex: 120000"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Horímetro</label>
                                    <input
                                        {...register("horimetro")}
                                        className="form-control"
                                        placeholder="Ex: 3500h"
                                    />
                                </div>




                            </div>

                            {/* Centro de custo / Unidade / Responsável */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Centro de Custo</label>
                                    <input
                                        {...register("centroCusto")}
                                        className="form-control"
                                        placeholder="Ex: Operações"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Unidade / Base</label>
                                    <input
                                        {...register("unidade")}
                                        className="form-control"
                                        placeholder="Ex: Vila Velha"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Responsável</label>
                                    <input
                                        {...register("responsavel")}
                                        className="form-control"
                                        placeholder="Nome do responsável"
                                    />
                                </div>
                            </div>

                            {/* Observações */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Observações</label>
                                <textarea
                                    {...register("observacoes")}
                                    className="form-control"
                                    rows={3}
                                    placeholder="Informações adicionais..."
                                />
                            </div>




                        </>
                    )}

                    {/* CAMPOS DO MOTORISTA */}
                    {entidadeSelecionada === "motorista" && (
                        <>
                            <hr />
                            <h5 className="mb-3">Dados do Motorista</h5>



                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">
                                        Relacionar este motorista ao veículo deste formulário
                                    </label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="vincularMotorista"
                                            checked={vincularMotorista}
                                            onChange={(e) => setVincularMotorista(e.target.checked)}
                                        />
                                        <label htmlFor="vincularMotorista" className="form-check-label">
                                            Vincular motorista
                                        </label>
                                    </div>
                                </div>
                            </div>






                            <div className="mb-3">
                                <label className="form-label fw-bold">Nome do Motorista</label>
                                <input
                                    {...register("nomeMotorista", { required: true })}
                                    className="form-control form-control-lg"
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">CPF</label>
                                    <input
                                        {...register("cpf")}
                                        className="form-control"
                                        placeholder="CPF"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">RG</label>
                                    <input
                                        {...register("rg")}
                                        className="form-control"
                                        placeholder="RG"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Data de Nascimento</label>
                                    <input
                                        {...register("dataNascimento")}
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Telefone</label>
                                    <input
                                        {...register("telefone")}
                                        className="form-control"
                                        placeholder="Telefone"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Email</label>
                                    <input
                                        {...register("email")}
                                        className="form-control"
                                        placeholder="Email"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Endereço</label>
                                    <input
                                        {...register("endereco")}
                                        className="form-control"
                                        placeholder="Endereço completo"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">CNH</label>
                                    <input
                                        {...register("cnh")}
                                        className="form-control"
                                        placeholder="Número da CNH"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Categoria CNH</label>
                                    <input
                                        {...register("categoriaCnh")}
                                        className="form-control"
                                        placeholder="Ex: D, E..."
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Validade CNH</label>
                                    <input
                                        {...register("validadeCnh")}
                                        type="date"
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Registro CNH</label>
                                    <input
                                        {...register("registroCnh")}
                                        className="form-control"
                                        placeholder="Registro"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Tipo de Contrato</label>
                                    <input
                                        {...register("tipoContrato")}
                                        className="form-control"
                                        placeholder="CLT, Terceirizado..."
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Empresa</label>
                                    <input
                                        {...register("empresa")}
                                        className="form-control"
                                        placeholder="Se terceirizado"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Função</label>
                                    <input
                                        {...register("funcao")}
                                        className="form-control"
                                        placeholder="Função"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Observações</label>
                                <textarea
                                    {...register("observacoesMotorista")}
                                    className="form-control"
                                    rows={3}
                                    placeholder="Informações adicionais..."
                                />
                            </div>
                        </>
                    )}

                    {/* BOTÃO DE ENVIO */}
                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-success btn-lg px-5"
                            disabled={isSubmitting}
                        >
                            <FaSave className="me-2" />
                            {isSubmitting ? "Enviando..." : "Enviar Requisição"}
                        </button>
                    </div>
                </form>
            </div>

            {/* LISTAGEM DE REQUERIMENTOS */}
            <div className="card shadow p-4">
                <h2 className="mb-4 text-primary">
                    <FaClipboardList className="me-2" /> Requerimentos Enviados
                </h2>

                {loading && <p>Carregando...</p>}

                {!loading && requerimentos.length === 0 && (
                    <p className="text-muted">Nenhum requerimento enviado.</p>
                )}

                {!loading &&
                    requerimentos.map((req) => {
                        const inicio = req.criadoEm;
                        const fim = req.resolvidoEm || agora;

                        const diffMs = fim.getTime() - inicio.getTime();
                        const minutos = Math.floor(diffMs / 60000);
                        const horas = Math.floor(minutos / 60);
                        const dias = Math.floor(horas / 24);

                        const tempo = (() => {
                            const texto = `${dias}d ${horas % 24}h ${minutos % 60}m`;

                            if (req.status === "analise") {
                                return <strong>Em análise há {texto}</strong>;
                            }

                            if (req.status === "aprovado") {
                                return `Aprovado em ${texto}`;
                            }

                            return `Reprovado em ${texto}`;
                        })();

                        return (
                            <div
                                key={req.id}
                                className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>
                                        {req.entidade === "veiculo"
                                            ? req.dadosSolicitados?.nome || "Veículo"
                                            : req.dadosSolicitados?.nome || "Motorista"}
                                    </strong>

                                    <div className="text-muted" style={{ fontSize: 12 }}>
                                        {/* Informações do veículo */}
                                        {req.entidade === "veiculo" && (
                                            <>
                                                {req.dadosSolicitados?.tipo && (
                                                    <> • {req.dadosSolicitados.tipo}</>
                                                )}
                                                {req.dadosSolicitados?.placa && (
                                                    <> • Placa {req.dadosSolicitados.placa}</>
                                                )}
                                                {req.dadosSolicitados?.porte && (
                                                    <> • Categoria {req.dadosSolicitados.porte}</>
                                                )}
                                            </>
                                        )}

                                        {/* Informações do motorista */}
                                        {req.entidade === "motorista" && (
                                            <>
                                                {req.dadosSolicitados?.cpf && (
                                                    <> • CPF {req.dadosSolicitados.cpf}</>
                                                )}
                                                {req.dadosSolicitados?.telefone && (
                                                    <> • Tel {req.dadosSolicitados.telefone}</>
                                                )}
                                            </>
                                        )}

                                        <> • Status: {req.status}</>
                                        <> • {tempo}</>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default NovoEquipamento;
