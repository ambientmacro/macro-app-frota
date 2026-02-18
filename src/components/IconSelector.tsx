import React from "react";

interface IconSelectorProps {
    campoIndex: number;
    register: any;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
    campoIndex,
    register
}) => {
    return (
        <div className="mt-2">
            <label className="form-label fw-bold">Ícone (opcional)</label>
            <small className="text-muted d-block mb-1">
                Cole aqui um SVG ou qualquer texto que represente o ícone.
            </small>

            <textarea
                {...register(`campos.${campoIndex}.iconeSvg`)}
                className="form-control"
                placeholder="<svg>...</svg>"
                rows={3}
            />
        </div>
    );
};
