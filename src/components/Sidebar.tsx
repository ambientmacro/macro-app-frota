import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaTools,
  FaSignOutAlt,
  FaBuilding,
  FaClipboardCheck,
  FaTruck,
  FaUsers,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import Swal from 'sweetalert2';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // 🔥 Submenus
  const [openRequerimentos, setOpenRequerimentos] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const location = useLocation();
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) onClose();
  };

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
        navigate('/login');
      }
    });
  };

  const linkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    color: location.pathname.startsWith(path) ? '#fff' : '#e3e3e3',
    backgroundColor: location.pathname.startsWith(path) ? '#0d6efd' : 'transparent',
    textDecoration: 'none',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    transition: '0.2s',
  });

  const submenuStyle = {
    paddingLeft: '2rem',
    marginBottom: '0.5rem',
  };

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

          {/* MENU */}
          <Link to="/dashboard" onClick={handleLinkClick} style={linkStyle('/dashboard')}>
            <FaHome style={{ marginRight: 10 }} /> Menu
          </Link>

          {/* EMPRESAS */}
          <Link to="/admin/empresas" onClick={handleLinkClick} style={linkStyle('/admin/empresas')}>
            <FaBuilding style={{ marginRight: 10 }} /> Empresas
          </Link>

          {/* FUNCIONÁRIOS */}
          <Link to="/admin/funcionarios" onClick={handleLinkClick} style={linkStyle('/admin/funcionarios')}>
            <FaUsers style={{ marginRight: 10 }} /> Funcionários
          </Link>

          {/* 🔥 SUBMENU: REQUERIMENTOS */}
          <div
            style={linkStyle('/admin/novo-equipamento')}
            onClick={() => setOpenRequerimentos(!openRequerimentos)}
          >
            <FaTruck style={{ marginRight: 10 }} />
            Requerimentos
            {openRequerimentos ? <FaChevronUp style={{ marginLeft: 'auto' }} /> : <FaChevronDown style={{ marginLeft: 'auto' }} />}
          </div>

          {openRequerimentos && (
            <div style={{ marginLeft: '1rem', marginTop: '-0.5rem' }}>
              <Link to="/admin/novo-equipamento" onClick={handleLinkClick} style={submenuStyle}>
                • Novo Requerimento
              </Link>
            </div>
          )}

          {/* 🔥 SUBMENU: CHECKLIST */}
          <div
            style={linkStyle('/admin/novo-checklist')}
            onClick={() => setOpenChecklist(!openChecklist)}
          >
            <FaClipboardCheck style={{ marginRight: 10 }} />
            Checklist
            {openChecklist ? <FaChevronUp style={{ marginLeft: 'auto' }} /> : <FaChevronDown style={{ marginLeft: 'auto' }} />}
          </div>

          {openChecklist && (
            <div style={{ marginLeft: '1rem', marginTop: '-0.5rem' }}>
              <Link to="/admin/novo-checklist" onClick={handleLinkClick} style={submenuStyle}>
                • Criar Checklist
              </Link>

              <Link to="/admin/relacionar-checklist" onClick={handleLinkClick} style={submenuStyle}>
                • Relacionar ao Equipamento
              </Link>

              <Link to="/respostas-checklist" onClick={handleLinkClick} style={submenuStyle}>
                • Respostas dos Checklists
              </Link>

              <Link to="/legendas" onClick={handleLinkClick} style={submenuStyle}>
                • Legendas
              </Link>
            </div>
          )}

        </nav>
      </div>

      {/* LOGOUT */}
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
