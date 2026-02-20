import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBuilding,
  FaClipboardCheck,
  FaTools,
  FaTruck,
  FaSignOutAlt,
  FaUsers
} from 'react-icons/fa';
import Swal from "sweetalert2";
import { colorAzul, colorBranco } from '../../values/colors';

const Dashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Tem certeza que deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };

  const menuOptions = [
    {
      label: 'Empresas',
      icon: <FaBuilding size={22} />,
      onClick: () => navigate('/admin/empresas'),
    },
    {
      label: 'Funcionários',
      icon: <FaUsers size={22} />,
      onClick: () => navigate('/admin/funcionarios'),
    },
    {
      label: 'Novo Equipamento',
      icon: <FaTruck size={22} />,
      onClick: () => navigate('/admin/novo-equipamento'),
    },
    {
      label: 'Criar Checklist',
      icon: <FaClipboardCheck size={22} />,
      onClick: () => navigate('/admin/novo-checklist'),
    },
    {
      label: 'Relacionar Checklist',
      icon: <FaTools size={22} />,
      onClick: () => navigate('/admin/relacionar-checklist'),
    },
    {
      label: 'Gerenciar Legendas',
      icon: <FaTools size={22} />,
      onClick: () => navigate('/legendas'),
    },
  ];

  return (
    <div
      className="container mt-5"
      style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '700px',
      }}
    >
      {/* CABEÇALHO */}
      <h1
        style={{
          color: colorAzul,
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        👋 Bem-vindo, {user?.displayName || 'Administrador'}!
      </h1>

      {/* EMPRESA E FUNÇÃO */}
      <p style={{ margin: 0, fontSize: '16px', color: '#555' }}>
        <strong>Empresa:</strong> {user?.empresaNome?.replace(/"/g, '') || '—'}
      </p>

      <p style={{ marginTop: '5px', fontSize: '16px', color: '#555' }}>
        <strong>Função:</strong> {user?.funcao || '—'}
      </p>

      <hr style={{ margin: '20px 0' }} />

      {/* MENU */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {menuOptions.map((option, index) => (
          <motion.button
            key={index}
            onClick={option.onClick}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: colorAzul,
              color: colorBranco,
              fontSize: '18px',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            {option.icon}
            {option.label}
          </motion.button>
        ))}

        {/* BOTÃO SAIR */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#e74c3c',
            color: colorBranco,
            fontSize: '18px',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          <FaSignOutAlt size={22} />
          Sair
        </motion.button>
      </div>
    </div>
  );
};

export default Dashboard;
