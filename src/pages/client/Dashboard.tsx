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
import { colorAzul, colorBranco } from '../../values/colors';

const Dashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const menuOptions = [
    {
      label: 'Empresas',
      icon: <FaBuilding size={22} />,
      onClick: () => navigate('/admin/empresas'),
    },
    {
      label: 'Funcionários',   // 🔥 NOVO
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
      <h1
        style={{
          color: colorAzul,
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '30px',
        }}
      >
        👋 Bem-vindo, {user?.displayName || user?.email || 'Administrador'}!
      </h1>

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

        <motion.button
          onClick={logout}
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
