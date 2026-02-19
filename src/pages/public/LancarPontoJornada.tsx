import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
} from "firebase/firestore";
import { useUser } from "../../contexts/UserContext";
import Swal from "sweetalert2";

const LancarPontoJornada = () => {
    const { user } = useUser();

    const [data, setData] = useState("");
    const [kmManha, setKmManha] = useState("");
    const [horaEntrada, setHoraEntrada] = useState("");
    const [horaSaida, setHoraSaida] = useState("");
    const [bairroObs, setBairroObs] = useState("");

    const [registroExistente, setRegistroExistente] = useState<any | null>(null);

    const preencherValoresIniciais = () => {
        const agora = new Date();
        setData(agora.toISOString().split("T")[0]);
        setHoraEntrada(agora.toTimeString().slice(0, 5));
        setHoraSaida("");
    };

    const carregarRegistro = async () => {
        if (!user) return;

        // 1️⃣ Buscar ponto em aberto (sem hora de saída)
        const qAberto = query(
            collection(db, "ponto_jornada"),
            where("motoristaId", "==", user.uid),
            where("horaSaida", "==", "")
        );

        const snapAberto = await getDocs(qAberto);

        if (!snapAberto.empty) {
            const docData = snapAberto.docs[0];
            const dados = { id: docData.id, ...docData.data() };

            setRegistroExistente(dados);

            setData(dados.data);
            setKmManha(dados.kmManha || "");
            setHoraEntrada(dados.horaEntrada);
            setHoraSaida("");
            setBairroObs(dados.bairroObs || "");
            return;
        }

        // 2️⃣ Buscar ponto completo do dia
        const hoje = new Date().toISOString().split("T")[0];

        const qHoje = query(
            collection(db, "ponto_jornada"),
            where("motoristaId", "==", user.uid),
            where("data", "==", hoje)
        );

        const snapHoje = await getDocs(qHoje);

        if (!snapHoje.empty) {
            const docData = snapHoje.docs[0];
            const dados = { id: docData.id, ...docData.data() };

            setRegistroExistente(dados);

            setData(dados.data);
            setKmManha(dados.kmManha || "");
            setHoraEntrada(dados.horaEntrada);
            setHoraSaida(dados.horaSaida || "");
            setBairroObs(dados.bairroObs || "");
            return;
        }

        // 3️⃣ Nenhum registro → novo ponto
        preencherValoresIniciais();
        setRegistroExistente(null);
    };

    useEffect(() => {
        carregarRegistro();
    }, [user]);

    // 🔥 Validação da hora de saída (sem validação chata de futuro)
    const validarHoraSaida = () => {
        if (!horaSaida) return true;

        const agora = new Date();
        const entrada = new Date(`${data}T${horaEntrada}:00`);
        let saida = new Date(`${data}T${horaSaida}:00`);

        // 🔥 Caso a saída seja menor que a entrada → virou a madrugada
        if (horaSaida < horaEntrada) {
            saida.setDate(saida.getDate() + 1);
        }

        // 🔥 Nova regra simples: saída não pode ser mais de 2h à frente da hora atual
        const limite = 2 * 60 * 60 * 1000; // 2 horas
        if (saida.getTime() - agora.getTime() > limite) {
            Swal.fire(
                "Atenção",
                "Hora de saída não pode estar muito distante da hora atual.",
                "warning"
            );
            return false;
        }

        // 🔥 Se saída < entrada e NÃO virou a madrugada → inválido
        if (horaSaida < horaEntrada && saida.getDate() === entrada.getDate()) {
            Swal.fire(
                "Atenção",
                "Hora de saída não pode ser menor que a hora de entrada no mesmo dia.",
                "warning"
            );
            return false;
        }

        return true;
    };

    const salvar = async () => {
        if (!user) {
            Swal.fire("Erro", "Usuário não autenticado.", "error");
            return;
        }

        if (!data || !horaEntrada) {
            Swal.fire("Atenção", "Data e hora de entrada são obrigatórios.", "warning");
            return;
        }

        if (registroExistente && !validarHoraSaida()) return;

        try {
            if (registroExistente) {
                // 🔥 Atualiza registro existente (bater saída)
                await updateDoc(doc(db, "ponto_jornada", registroExistente.id), {
                    kmManha,
                    horaSaida,
                    bairroObs,
                });

                Swal.fire("Sucesso!", "Jornada finalizada.", "success");
            } else {
                // 🔥 Cria novo registro
                await addDoc(collection(db, "ponto_jornada"), {
                    motoristaId: user.uid,
                    data,
                    kmManha,
                    horaEntrada,
                    horaSaida: "",
                    bairroObs,
                    criadoEm: new Date(),
                });

                Swal.fire("Sucesso!", "Entrada registrada.", "success");
            }

            carregarRegistro();
        } catch (error) {
            console.error("Erro ao salvar ponto:", error);
            Swal.fire("Erro", "Não foi possível registrar o ponto.", "error");
        }
    };

    // 🔒 BLOQUEIOS DEPOIS DE FINALIZADO
    const pontoFinalizado = registroExistente && registroExistente.horaSaida;

    return (
        <div className="container mt-4">
            <h2 className="text-primary mb-3">Registrar Ponto de Jornada</h2>

            <div className="card p-4">

                {/* DATA */}
                <div className="mb-3">
                    <label className="form-label">Data</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data}
                        disabled={true}
                    />
                </div>

                {/* KM */}
                <div className="mb-3">
                    <label className="form-label">KM / Horímetro (manhã)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={kmManha}
                        disabled={pontoFinalizado}
                        onChange={(e) => setKmManha(e.target.value)}
                    />
                </div>

                {/* HORA ENTRADA */}
                <div className="mb-3">
                    <label className="form-label">Hora de Entrada</label>
                    <input
                        type="time"
                        className="form-control"
                        value={horaEntrada}
                        disabled={true}
                    />
                </div>

                {/* HORA SAÍDA */}
                <div className="mb-3">
                    <label className="form-label">Hora de Saída</label>
                    <input
                        type="time"
                        className="form-control"
                        value={horaSaida}
                        disabled={!registroExistente || pontoFinalizado}
                        onChange={(e) => setHoraSaida(e.target.value)}
                    />
                </div>

                {/* OBSERVAÇÃO */}
                <div className="mb-3">
                    <label className="form-label">Bairro / Observação</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={bairroObs}
                        disabled={pontoFinalizado}
                        onChange={(e) => setBairroObs(e.target.value)}
                    ></textarea>
                </div>

                {!pontoFinalizado && (
                    <button className="btn btn-success" onClick={salvar}>
                        {registroExistente ? "Finalizar Jornada" : "Salvar Entrada"}
                    </button>
                )}

                {pontoFinalizado && (
                    <div className="alert alert-success mt-3">
                        Jornada finalizada. Nenhuma edição adicional é permitida.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LancarPontoJornada;
