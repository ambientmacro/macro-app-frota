import React from "react";
import ChecklistForm from "./ChecklistForm";
import { ChecklistForm as ChecklistType } from "../../types/checklistTypes";
import { Legenda } from "../../types/legendaTypes";

interface Props {
    show: boolean;
    onClose: () => void;
    initialData?: ChecklistType;
    onSubmit: (data: ChecklistType) => void;
    legendas: Legenda[];
    onNovaLegendaClick: () => void;
    title: string;
}

const ModalChecklist: React.FC<Props> = ({
    show,
    onClose,
    initialData,
    onSubmit,
    legendas,
    onNovaLegendaClick,
    title
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
                padding: "20px"
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: "900px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)"
                }}
            >
                <div className="modal-header p-3">
                    <h5 className="modal-title">{title}</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <div className="modal-body p-3">
                    <ChecklistForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        legendas={legendas}
                        onNovaLegendaClick={onNovaLegendaClick}
                        submitLabel="Salvar alterações"
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalChecklist;
