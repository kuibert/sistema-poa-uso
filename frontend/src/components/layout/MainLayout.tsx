import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authApi.me();
        setUserName(user.nombre);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">🎓</div>
          <h1>Sistema POA - USO</h1>
        </div>
        <div className="header-right">
          <span className="user-name">{userName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/proyectos/nuevo" 
              className={`nav-link ${isActive('/proyectos/nuevo') ? 'active' : ''}`}
            >
              ➕ Nuevo Proyecto
            </Link>
            <Link 
              to="/proyectos" 
              className={`nav-link ${isActive('/proyectos') ? 'active' : ''}`}
            >
              📁 Mis Proyectos
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};
