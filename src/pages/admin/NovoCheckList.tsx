import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import CampoChecklist from "../../components/CampoChecklist";
import { ChecklistForm } from "../../types/checklistTypes";
import { useLegendas } from "../../hooks/useLegendas";
import LegendaModal from "../../components/LegendaModal";
import { Legenda } from "../../types/legendaTypes";
import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { FaEdit, FaTrash, FaFileImport } from "react-icons/fa";

const NovoCheckList: React.FC = () => {
  const { legendas, adicionar } = useLegendas();

  const [checklists, setChecklists] = useState<(ChecklistForm & { id: string })[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [showLegendaModal, setShowLegendaModal] = useState(false);

  const inputCSVRef = useRef<HTMLInputElement | null>(null);

  const { register, control, handleSubmit, watch, reset, setValue } =
    useForm<ChecklistForm>({
      defaultValues: {
        titulo: "",
        codigo: "",
        campos: []
      }
    });

  const { fields: campos, append: appendCampo, remove: removeCampo } = useFieldArray({
    control,
    name: "campos"
  });

  const camposWatch = watch("campos") || [];

  const carregarChecklists = async () => {
    const snap = await getDocs(collection(db, "templates_checklist"));
    const lista: any[] = [];

    snap.forEach((d) => {
      lista.push({
        id: d.id,
        ...(d.data() as ChecklistForm)
      });
    });

    setChecklists(lista);
  };

  useEffect(() => {
    carregarChecklists();
  }, []);

  const normalizarChecklist = (cl: ChecklistForm): ChecklistForm => {
    return {
      titulo: cl.titulo || "",
      codigo: cl.codigo || "",
      campos: (cl.campos || []).map((campo) => ({
        titulo: campo.titulo || "",
        tipo: campo.tipo || "lista",
        obrigatorio: campo.obrigatorio ?? false,
        critico: campo.critico ?? false,
        opcoes: campo.opcoes || [],
        subitens: campo.subitens || []
      }))
    };
  };
  const importarCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const texto = event.target?.result as string;

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

      const subitens: any[] = [];
      let tituloChecklist = "";
      let codigoChecklist = "";

      for (const linha of dados) {
        const partes = linha.split(";").map((p) => p.replace(/"/g, "").trim());

        const registro: Record<string, string> = {};
        cabecalho.forEach((col, idx) => {
          registro[col] = partes[idx] ?? "";
        });

        const titulo = registro["titulo"];
        const codigo = registro["codigo"];
        const campo = registro["campo"];
        const subitem = registro["subitem"];
        const legenda = registro["legenda"];
        const obrigatorio = registro["obrigatorio"] === "true";
        const critico = registro["critico"] === "true";

        tituloChecklist = titulo;
        codigoChecklist = codigo;

        const legendaEncontrada = legendas.find((l) => l.codigo === legenda);

        subitens.push({
          campo,
          titulo: subitem,
          legendaId: legendaEncontrada ? legendaEncontrada.id : legenda,
          obrigatorio,
          critico
        });
      }

      // AGRUPAR POR CAMPO
      const camposAgrupados: Record<string, any[]> = {};

      subitens.forEach((s) => {
        if (!camposAgrupados[s.campo]) {
          camposAgrupados[s.campo] = [];
        }
        camposAgrupados[s.campo].push({
          titulo: s.titulo,
          legendaId: s.legendaId,
          obrigatorio: s.obrigatorio,
          critico: s.critico
        });
      });

      const camposFinal = Object.keys(camposAgrupados).map((campoNome) => ({
        titulo: campoNome,
        tipo: "lista",
        obrigatorio: false,
        critico: false,
        opcoes: [
          "C - CONFORME",
          "NC - NÃO CONFORME",
          "NA - NÃO APLICÁVEL"
        ],
        subitens: camposAgrupados[campoNome]
      }));

      reset({
        titulo: tituloChecklist,
        codigo: codigoChecklist,
        campos: camposFinal
      });

      Swal.fire("Sucesso!", "Checklist importado com sucesso!", "success");
    };

    reader.readAsText(file, "UTF-8");
  };
  const salvarNovo = async (data: ChecklistForm) => {
    if (data.campos.length === 0) {
      Swal.fire("Atenção", "Adicione pelo menos um campo.", "warning");
      return;
    }

    if (data.campos.some((c) => c.subitens.length === 0)) {
      Swal.fire("Atenção", "Todos os campos precisam ter pelo menos um subitem.", "warning");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "templates_checklist"), data);

      Swal.fire({
        title: "Checklist criado!",
        html: `
          <div style="text-align: left">
            <strong>Título:</strong> ${data.titulo}<br/>
            <strong>Código:</strong> ${data.codigo || "—"}<br/>
            <strong>Campos:</strong> ${data.campos.length}<br/>
            <strong>ID gerado:</strong> ${docRef.id}
          </div>
        `,
        icon: "success"
      });

      reset({
        titulo: "",
        codigo: "",
        campos: []
      });

      carregarChecklists();
    } catch (error) {
      Swal.fire("Erro", "Não foi possível salvar o checklist.", "error");
    }
  };

  const salvarEdicao = async (data: ChecklistForm) => {
    if (!editandoId) return;

    try {
      await updateDoc(doc(db, "templates_checklist", editandoId), data);

      Swal.fire({
        title: "Checklist atualizado!",
        html: `
          <div style="text-align: left">
            <strong>Título:</strong> ${data.titulo}<br/>
            <strong>Código:</strong> ${data.codigo || "—"}<br/>
            <strong>Campos:</strong> ${data.campos.length}<br/>
            <strong>ID:</strong> ${editandoId}
          </div>
        `,
        icon: "success"
      });

      reset({
        titulo: "",
        codigo: "",
        campos: []
      });

      setEditandoId(null);
      carregarChecklists();
    } catch (error) {
      Swal.fire("Erro", "Não foi possível atualizar o checklist.", "error");
    }
  };

  const editarChecklist = (cl: ChecklistForm & { id: string }) => {
    const normalizado = normalizarChecklist(cl);
    reset(normalizado);
    setEditandoId(cl.id);
  };

  const excluirChecklist = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Excluir checklist?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    await deleteDoc(doc(db, "templates_checklist", id));
    carregarChecklists();
  };
  const salvarLegendaInline = async (data: Omit<Legenda, "id">) => {
    await adicionar(data);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow p-4">

        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-primary mb-3">
            {editandoId ? "Editar Checklist" : "Criar Novo Checklist"}
          </h2>

          <button
            className="btn btn-outline-secondary"
            onClick={() => inputCSVRef.current?.click()}
          >
            <FaFileImport className="me-2" />
            Importar CSV
          </button>

          <input
            type="file"
            accept=".csv"
            ref={inputCSVRef}
            style={{ display: "none" }}
            onChange={importarCSV}
          />
        </div>

        <form onSubmit={handleSubmit(editandoId ? salvarEdicao : salvarNovo)}>

          <label className="form-label fw-bold">Nome do Checklist</label>
          <input
            {...register("titulo", { required: true })}
            className="form-control mb-3"
            placeholder="Ex: Checklist de Inspeção Antes do Uso"
          />

          <label className="form-label fw-bold">Código/Revisão</label>
          <input
            {...register("codigo")}
            className="form-control mb-4"
            placeholder="Ex: CL-03 Revisão 04"
          />

          <h4 className="text-primary">Campos</h4>

          {campos.map((campo, campoIndex) => (
            <CampoChecklist
              key={campo.id}
              campoIndex={campoIndex}
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              removeCampo={removeCampo}
              legendas={legendas}
              onNovaLegendaClick={() => setShowLegendaModal(true)}
            />
          ))}

          <button
            type="button"
            className="btn btn-outline-primary mt-3"
            onClick={() =>
              appendCampo({
                titulo: "",
                tipo: "lista",
                obrigatorio: false,
                critico: false,
                opcoes: [],
                subitens: []
              })
            }
          >
            + Adicionar campo
          </button>

          <div className="d-flex justify-content-between mt-4">
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  reset({ titulo: "", codigo: "", campos: [] })
                }
              >
                Limpar formulário
              </button>
            )}

            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={camposWatch.length === 0}
            >
              {editandoId ? "Salvar alterações" : "Salvar Checklist"}
            </button>
          </div>

        </form>

        <LegendaModal
          show={showLegendaModal}
          onClose={() => setShowLegendaModal(false)}
          onSave={salvarLegendaInline}
        />
      </div>

      <div className="card shadow p-4 mt-4">
        {/* <h4 className="mb-3">Checklists Criados</h4> */}
        <h2 className="text-primary mb-3">Checklists Criados</h2>

        {checklists.length === 0 && (
          <p className="text-muted">Nenhum checklist criado ainda.</p>
        )}

        {checklists.map((cl) => (
          <div
            key={cl.id}
            className="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center"
          >
            <div>
              <strong>{cl.titulo}</strong>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Código: {cl.codigo || "—"}
              </div>
            </div>

            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => editarChecklist(cl)}
              >
                <FaEdit />
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => excluirChecklist(cl.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NovoCheckList;
