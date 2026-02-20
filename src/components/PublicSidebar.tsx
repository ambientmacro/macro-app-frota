import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Swal from 'sweetalert2';
import { FiHome, FiCalendar, FiClock } from 'react-icons/fi';
import { FaSignOutAlt } from 'react-icons/fa';

interface PublicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const PublicSidebar: React.FC<PublicSidebarProps> = ({ isOpen, onClose }) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  // 🔥 MESMA LÓGICA DO SIDEBAR ADMIN
  const handleLinkClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  const linkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    textDecoration: 'none',
    color: location.pathname === path ? '#fff' : '#e3f2fd',
    backgroundColor: location.pathname === path ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
    fontWeight: 500,
    transition: 'all 0.2s',
    borderRadius: '8px',
  });

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

  const publicSidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-250px',
    width: '250px',
    height: `${viewportHeight}px`,
    backgroundColor: 'rgba(13, 71, 161, 0.9)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'left 0.4s ease-in-out',
    zIndex: 999,
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  return (
    <aside style={publicSidebarStyle}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>

        <div style={headerStyle}>
          <span style={{ color: '#ffc107' }}>Macro</span>
          <br />
          <span style={{ color: '#ffc107' }}>Ambiental</span>
        </div>

        <Link
          to="/dashboard-cliente-publico"
          style={linkStyle('/dashboard-cliente-publico')}
          onClick={handleLinkClick}
        >
          <FiHome /> Menu
        </Link>

        <Link
          to="/lancar-checklist"
          style={linkStyle('/lancar-checklist')}
          onClick={handleLinkClick}
        >
          <FiClock /> Abrir Check List
        </Link>

        <Link
          to="/historico-checklist"
          style={linkStyle('/historico-checklist')}
          onClick={handleLinkClick}
        >
          <FiCalendar /> Histórico de Checklist
        </Link>

        <Link
          to="/lancar-ponto-jornada"
          style={linkStyle('/lancar-ponto-jornada')}
          onClick={handleLinkClick}
        >
          <FiCalendar /> Lançar Jornada Trabalho
        </Link>
      </nav>

      <div style={{ padding: '1rem' }}>
        <button
          onClick={handleLogout} // 🔥 NÃO FECHA O SIDEBAR
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
    </aside>
  );
};

export default PublicSidebar;
