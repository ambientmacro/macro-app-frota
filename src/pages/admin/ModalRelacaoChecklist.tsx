import React from "react";

interface ChecklistModelo {
    id: string;
    titulo: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    equipamentoNome?: string;
    checklists: ChecklistModelo[];
    checklistSelecionado: string;
    onChangeChecklist: (id: string) => void;
    onSalvar: () => void;
}

const ModalRelacaoChecklist: React.FC<Props> = ({
    show,
    onClose,
    equipamentoNome,
    checklists,
    checklistSelecionado,
    onChangeChecklist,
    onSalvar,
}) => {
    if (!show) return null;

    return (
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
                padding: "20px",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: "600px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                }}
            >
                <div className="modal-header p-3">
                    <h5 className="modal-title">
                        Editar relação {equipamentoNome ? `– ${equipamentoNome}` : ""}
                    </h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <div className="modal-body p-3">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Checklist</label>
                        <select
                            className="form-select"
                            value={checklistSelecionado}
                            onChange={(e) => onChangeChecklist(e.target.value)}
                        >
                            <option value="">Selecione um checklist</option>
                            {checklists.map((cl) => (
                                <option key={cl.id} value={cl.id}>
                                    {cl.titulo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-primary w-100" onClick={onSalvar}>
                        Salvar relação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalRelacaoChecklist;
