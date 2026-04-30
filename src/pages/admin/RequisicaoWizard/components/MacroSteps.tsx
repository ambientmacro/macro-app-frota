// src/pages/admin/RequisicaoWizard/components/MacroSteps.tsx

import { FaCheckCircle, FaClock, FaRegCircle } from "react-icons/fa";
import { isMacroStepFilled } from "../utils/wizardValidation";

interface MacroStepsProps {
    currentMacroStep: number;
    steps: string[];
    formData: any;
    subSteps: Record<number, string[]>;
    onSelect: (index: number) => void;
}

export default function MacroSteps({
    currentMacroStep,
    steps,
    formData,
    subSteps,
    onSelect
}: MacroStepsProps) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4 position-relative">

            {/* Linha de fundo */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "0",
                    right: "0",
                    height: "4px",
                    backgroundColor: "#dee2e6",
                    zIndex: 0,
                }}
            />

            {steps.map((label, index) => {
                const isActive = currentMacroStep === index;
                const isFilled = isMacroStepFilled(index, subSteps, formData);

                const icon = isActive ? (
                    <FaClock />
                ) : isFilled ? (
                    <FaCheckCircle />
                ) : (
                    <FaRegCircle />
                );

                const bg = isActive
                    ? "#0d6efd"
                    : isFilled
                        ? "#198754"
                        : "#dee2e6";

                const color = isActive || isFilled ? "white" : "#6c757d";

                return (
                    <div
                        key={index}
                        className="text-center flex-fill position-relative"
                        style={{ cursor: "pointer", zIndex: 1 }}
                        onClick={() => onSelect(index)}
                    >
                        <div
                            className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                            style={{
                                width: "42px",
                                height: "42px",
                                backgroundColor: bg,
                                color,
                                fontSize: "1.1rem",
                            }}
                        >
                            {icon}
                        </div>

                        <div
                            className={`mt-2 fw-semibold ${isActive ? "text-primary" : isFilled ? "text-success" : "text-muted"
                                }`}
                            style={{ fontSize: "0.85rem" }}
                        >
                            {label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
