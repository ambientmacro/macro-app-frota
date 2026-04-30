// src/pages/admin/RequisicaoWizard/steps/revisao/StepRevisaoFinal.tsx

import StepContentWrapper from "../../components/StepContentWrapper";

interface Props {
    formData: any;
    onBack: () => void;
    onSubmit: () => void;
}

export default function StepRevisaoFinal({ formData, onBack, onSubmit }: Props) {
    const {
        tipoRequerimento,
        dadosIniciais,
        dadosVeiculo,
        dadosMotorista,
        origemContrato,
        valoresAluguel,
        jornada,
        salario,
        beneficios,
        vinculo,
        documentos
    } = formData;

    return (
        <StepContentWrapper title="Revisão Final">
            <p className="text-muted mb-4">
                Confira todas as informações antes de enviar o cadastro.
            </p>

            {/* TIPO */}
            <div className="mb-4">
                <h6 className="fw-bold">Tipo de Requerimento</h6>
                <div className="border rounded p-3 bg-light">
                    {tipoRequerimento === "veiculo" && "Veículo"}
                    {tipoRequerimento === "motorista" && "Motorista"}
                    {tipoRequerimento === "veiculo_motorista" && "Veículo + Motorista"}
                </div>
            </div>

            {/* DADOS INICIAIS */}
            {dadosIniciais && (
                <div className="mb-4">
                    <h6 className="fw-bold">Dados Iniciais</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Proprietário:</strong> {dadosIniciais.nomeProprietario}</p>
                        <p className="mb-1"><strong>Documento:</strong> {dadosIniciais.documento}</p>
                    </div>
                </div>
            )}

            {/* DADOS DO VEÍCULO */}
            {dadosVeiculo && tipoRequerimento !== "motorista" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Dados do Veículo</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Placa:</strong> {dadosVeiculo.placa}</p>
                        <p className="mb-1"><strong>Modelo:</strong> {dadosVeiculo.modelo}</p>
                        <p className="mb-1"><strong>Ano:</strong> {dadosVeiculo.ano}</p>
                    </div>
                </div>
            )}

            {/* ORIGEM / CONTRATO */}
            {origemContrato && tipoRequerimento !== "motorista" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Origem / Contrato</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Origem:</strong> {origemContrato.origem}</p>
                        {origemContrato.locadora && (
                            <p className="mb-1"><strong>Locadora:</strong> {origemContrato.locadora}</p>
                        )}
                    </div>
                </div>
            )}

            {/* VALORES */}
            {valoresAluguel && tipoRequerimento !== "motorista" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Valores de Aluguel</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Mensal:</strong> R$ {valoresAluguel.valorMensal}</p>
                        <p className="mb-1"><strong>Diário:</strong> R$ {valoresAluguel.valorDiario}</p>
                    </div>
                </div>
            )}

            {/* DADOS DO MOTORISTA */}
            {dadosMotorista && tipoRequerimento !== "veiculo" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Dados do Motorista</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Nome:</strong> {dadosMotorista.nome}</p>
                        <p className="mb-1"><strong>CPF:</strong> {dadosMotorista.cpf}</p>
                    </div>
                </div>
            )}

            {/* JORNADA */}
            {jornada && tipoRequerimento !== "veiculo" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Jornada</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Entrada:</strong> {jornada.entrada}</p>
                        <p className="mb-1"><strong>Saída:</strong> {jornada.saida}</p>
                    </div>
                </div>
            )}

            {/* SALÁRIO */}
            {salario && tipoRequerimento !== "veiculo" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Salário</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Base:</strong> R$ {salario.base}</p>
                        <p className="mb-1"><strong>Adicionais:</strong> R$ {salario.adicionais}</p>
                    </div>
                </div>
            )}

            {/* BENEFÍCIOS */}
            {beneficios && tipoRequerimento !== "veiculo" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Benefícios</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>VT:</strong> R$ {beneficios.vt}</p>
                        <p className="mb-1"><strong>VA:</strong> R$ {beneficios.va}</p>
                    </div>
                </div>
            )}

            {/* VÍNCULO */}
            {vinculo && tipoRequerimento !== "veiculo" && (
                <div className="mb-4">
                    <h6 className="fw-bold">Vínculo</h6>
                    <div className="border rounded p-3 bg-light">
                        <p className="mb-1"><strong>Tipo:</strong> {vinculo.tipo}</p>
                        <p className="mb-1"><strong>Início:</strong> {vinculo.dataInicio}</p>
                        {vinculo.ctps && <p className="mb-1"><strong>CTPS:</strong> {vinculo.ctps}</p>}
                        {vinculo.empresa && <p className="mb-1"><strong>Empresa:</strong> {vinculo.empresa}</p>}
                    </div>
                </div>
            )}

            {/* DOCUMENTOS */}
            <div className="mb-4">
                <h6 className="fw-bold">Documentos</h6>
                <div className="border rounded p-3 bg-light">

                    {documentos.crlv && (
                        <p className="mb-1"><strong>CRLV:</strong> {documentos.crlv.name}</p>
                    )}

                    {documentos.cnh && (
                        <p className="mb-1"><strong>CNH:</strong> {documentos.cnh.name}</p>
                    )}

                    {documentos.contrato && (
                        <p className="mb-1"><strong>Contrato:</strong> {documentos.contrato.name}</p>
                    )}

                    {documentos.fotos?.length > 0 && (
                        <p className="mb-1"><strong>Fotos:</strong> {documentos.fotos.length} arquivo(s)</p>
                    )}

                    {documentos.outros?.length > 0 && (
                        <p className="mb-1"><strong>Outros:</strong> {documentos.outros.length} arquivo(s)</p>
                    )}

                </div>
            </div>

            {/* BOTÕES */}
            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    Voltar
                </button>

                <button className="btn btn-success" onClick={onSubmit}>
                    Enviar Cadastro
                </button>
            </div>
        </StepContentWrapper>
    );
}
