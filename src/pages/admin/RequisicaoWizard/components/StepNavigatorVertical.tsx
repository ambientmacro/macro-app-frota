// src/pages/admin/RequisicaoWizard/components/StepNavigatorVertical.tsx

import { FaCheckCircle, FaClock, FaRegCircle } from "react-icons/fa";
import { isStepFilled, mapLabelToKey } from "../utils/wizardValidation";

interface StepNavigatorVerticalProps {
    subSteps: string[];
    currentSubStep: number;
    onSelect: (index: number) => void;
    formData: any;
}

export default function StepNavigatorVertical({
    subSteps,
    currentSubStep,
    onSelect,
    formData,
}: StepNavigatorVerticalProps) {
    return (
        <div className="list-group">
            {subSteps.map((label, index) => {
                const isActive = currentSubStep === index;
                const key = mapLabelToKey(label);
                const filled = isStepFilled(key, formData);

                const icon = isActive ? (
                    <FaClock />
                ) : filled ? (
                    <FaCheckCircle />
                ) : (
                    <FaRegCircle />
                );

                return (
                    <button
                        key={index}
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActive ? "active" : ""
                            }`}
                        onClick={() => onSelect(index)}
                        style={{ cursor: "pointer" }}
                    >
                        <span>{label}</span>
                        {icon}
                    </button>
                );
            })}
        </div>
    );
}
