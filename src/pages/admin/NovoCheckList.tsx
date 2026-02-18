import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import CampoChecklist from "../../components/CampoChecklist";
import { ChecklistForm } from "../../types/checklistTypes";
import { useLegendas } from "../../hooks/useLegendas";
import LegendaModal from "../../components/LegendaModal";
import { Legenda } from "../../types/legendaTypes";
import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";

const NovoCheckList: React.FC = () => {
  const { legendas, adicionar } = useLegendas();

  const [checklists, setChecklists] = useState<(ChecklistForm & { id: string })[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [showLegendaModal, setShowLegendaModal] = useState(false);

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

  // Carregar checklists existentes
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

  // Normalizar checklist vindo do Firestore
  const normalizarChecklist = (cl: ChecklistForm): ChecklistForm => {
    return {
      titulo: cl.titulo || "",
      codigo: cl.codigo || "",
      campos: (cl.campos || []).map((campo) => ({
        titulo: campo.titulo || "",
        tipo: campo.tipo || "texto",
        obrigatorio: campo.obrigatorio ?? false,
        critico: campo.critico ?? false,
        opcoes: campo.opcoes || [],
        subitens: campo.subitens || []
      }))
    };
  };

  // Salvar novo checklist
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

  // Salvar edição
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

  // Preencher formulário para edição
  const editarChecklist = (cl: ChecklistForm & { id: string }) => {
    const normalizado = normalizarChecklist(cl);
    reset(normalizado);
    setEditandoId(cl.id);
  };

  // Limpar formulário e voltar ao modo criação
  const limparFormulario = () => {
    reset({
      titulo: "",
      codigo: "",
      campos: []
    });
    setEditandoId(null);
  };

  // Excluir checklist
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

        <h2 className="text-primary mb-3">
          {editandoId ? "Editar Checklist" : "Criar Novo Checklist"}
        </h2>

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
                tipo: "texto",
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
                onClick={limparFormulario}
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

      {/* LISTAGEM */}
      <div className="card shadow p-4 mt-4">
        <h4 className="mb-3">Checklists Criados</h4>

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
