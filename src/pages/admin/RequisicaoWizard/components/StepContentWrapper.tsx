// src/pages/admin/RequisicaoWizard/components/StepContentWrapper.tsx

interface StepContentWrapperProps {
    title: string;
    children: React.ReactNode;
}

export default function StepContentWrapper({ title, children }: StepContentWrapperProps) {
    return (
        <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom">
                <h5 className="fw-bold mb-0">{title}</h5>
            </div>

            <div className="card-body">{children}</div>
        </div>
    );
}
