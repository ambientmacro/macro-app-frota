import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { colorBranco } from '../../values/colors';

const colorAzulClaro = '#3498db';

const DashboardClientePublico = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const menuOptions = [
    {
      label: 'Abrir Check List',
      icon: <FaCheckCircle size={20} />,
      onClick: () => navigate('/lancar-checklist'),
    },
    {
      label: 'Abrir Check List',
      icon: <FaClock size={20} />,
      onClick: () => navigate('/lancar-checklist'),
    },
    {
      label: 'Histórico de Checklist',
      icon: <FaClock size={20} />,
      onClick: () => navigate('/historico-checklist'),
    },
    {
      label: 'Lançar Jornada Trabalho',
      icon: <FaClock size={20} />,
      onClick: () => navigate('/lancar-ponto-jornada'),
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
          color: colorAzulClaro,
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '30px',
        }}
      >
        👋 Olá, {user?.displayName || user?.email || 'Cliente'}!
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
              backgroundColor: colorAzulClaro,
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

export default DashboardClientePublico;
