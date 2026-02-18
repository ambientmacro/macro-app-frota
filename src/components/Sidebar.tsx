import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaTools,
  FaSignOutAlt,
  FaBuilding,
  FaClipboardCheck,
  FaTruck,
  FaUsers
} from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { getAuth, signOut } from 'firebase/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  const linkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    color: location.pathname.startsWith(path) ? '#fff' : '#e3e3e3',
    backgroundColor: location.pathname.startsWith(path) ? '#0d6efd' : 'transparent',
    textDecoration: 'none',
    borderRadius: '8px',
    marginBottom: '1rem',
    transition: '0.2s',
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-250px',
        width: '250px',
        height: `${viewportHeight}px`,
        backgroundColor: '#0b1d40',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'left 0.4s ease-in-out',
        zIndex: 999,
      }}
    >
      <div>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <span style={{ color: '#ffc107' }}>Macro</span><br />
          <span style={{ color: '#ffc107' }}>Ambiental</span>
        </div>

        <nav style={{ padding: '0 1rem' }}>

          {/* DASHBOARD */}
          <Link to="/dashboard" onClick={handleLinkClick} style={linkStyle('/dashboard')}>
            <FaHome style={{ marginRight: 10 }} /> Menu
          </Link>

          {/* EMPRESAS */}
          <Link to="/admin/empresas" onClick={handleLinkClick} style={linkStyle('/admin/empresas')}>
            <FaBuilding style={{ marginRight: 10 }} /> Empresas
          </Link>

          {/* FUNCIONÁRIOS — NOVO */}
          <Link to="/admin/funcionarios" onClick={handleLinkClick} style={linkStyle('/admin/funcionarios')}>
            <FaUsers style={{ marginRight: 10 }} /> Funcionários
          </Link>

          {/* EQUIPAMENTOS */}
          <Link to="/admin/novo-equipamento" onClick={handleLinkClick} style={linkStyle('/admin/novo-equipamento')}>
            <FaTruck style={{ marginRight: 10 }} /> Novo Equipamento
          </Link>

          {/* CHECKLIST */}
          <Link to="/admin/novo-checklist" onClick={handleLinkClick} style={linkStyle('/admin/novo-checklist')}>
            <FaClipboardCheck style={{ marginRight: 10 }} /> Criar Checklist
          </Link>

          {/* RELACIONAR CHECKLIST */}
          <Link to="/admin/relacionar-checklist" onClick={handleLinkClick} style={linkStyle('/admin/relacionar-checklist')}>
            <FaTools style={{ marginRight: 10 }} /> Relacionar Checklist
          </Link>

          {/* LEGENDAS */}
          <Link to="/legendas" onClick={handleLinkClick} style={linkStyle('/legendas')}>
            <FaTools style={{ marginRight: 10 }} /> Legendas
          </Link>

        </nav>
      </div>

      <div style={{ padding: '1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '10px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
