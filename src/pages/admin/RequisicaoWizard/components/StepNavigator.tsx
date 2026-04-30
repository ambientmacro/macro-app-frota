import React, { useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaRegCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface StepItem {
  id: number;
  label: string;
  numero: string; // ex: "2.1"
  status: "pendente" | "andamento" | "concluido";
  onClick: () => void;
}

interface StepNavigatorProps {
  steps: StepItem[];
  currentStep: number;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({
  steps,
  currentStep,
}) => {
  const [openMobile, setOpenMobile] = useState(false);

  const getIcon = (status: StepItem["status"]) => {
    switch (status) {
      case "concluido":
        return <FaCheckCircle className="text-success" size={18} />;
      case "andamento":
        return <FaClock className="text-warning" size={18} />;
      default:
        return <FaRegCircle className="text-secondary" size={18} />;
    }
  };

  return (
    <>
      {/* BOTÃO MOBILE */}
      <div className="d-md-none mb-3">
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={() => setOpenMobile(true)}
        >
          <FaBars /> Etapas
        </button>
      </div>

      {/* DRAWER MOBILE */}
      {openMobile && (
        <div
          className="position-fixed top-0 start-0 w-75 h-100 bg-white shadow p-3"
          style={{ zIndex: 9999 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">Etapas</h5>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => setOpenMobile(false)}
            >
              <FaTimes />
            </button>
          </div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-2 rounded d-flex align-items-center gap-2 mb-2 ${index === currentStep ? "bg-primary text-white" : "bg-light"
                }`}
              onClick={() => {
                step.onClick();
                setOpenMobile(false);
              }}
              style={{ cursor: "pointer" }}
            >
              {getIcon(step.status)}
              <strong>{step.numero}</strong>
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <div className="d-none d-md-block" style={{ width: "260px" }}>
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.02 }}
            className={`p-2 rounded d-flex align-items-center gap-2 mb-2 ${index === currentStep ? "bg-primary text-white" : "bg-light"
              }`}
            style={{ cursor: "pointer" }}
            onClick={step.onClick}
          >
            {getIcon(step.status)}
            <strong>{step.numero}</strong>
            <span>{step.label}</span>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default StepNavigator;
