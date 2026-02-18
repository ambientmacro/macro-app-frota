import React from "react";
import NovoEquipamentoForm from "./NovoEquipamentoForm";
import { EquipamentoData } from "../../types/Equipamento";

interface Props {
    show: boolean;
    onClose: () => void;
    initialData?: EquipamentoData;
    onSubmit: (data: EquipamentoData) => void;
    title: string;
}

const ModalEquipamento: React.FC<Props> = ({ show, onClose, initialData, onSubmit, title }) => {
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
                    maxWidth: "700px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                    animation: "fadeIn 0.2s ease"
                }}
            >
                <div className="modal-header p-3">
                    <h5 className="modal-title">{title}</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <div className="modal-body p-3">
                    <NovoEquipamentoForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        submitLabel="Salvar"
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalEquipamento;
