import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { Button, FormGroup, ErrorMessage } from '../components/common';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.login({ email, password });
      navigate('/');
    } catch (error) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--login-gradient-start) 0%, var(--login-gradient-end) 100%)',
    padding: '20px',
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 40px 30px',
    background: 'linear-gradient(135deg, var(--login-gradient-start) 0%, var(--login-gradient-end) 100%)',
    color: 'white',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '4rem',
    marginBottom: '16px',
  };

  const h1Style: React.CSSProperties = {
    margin: '0 0 8px',
    fontSize: '1.75rem',
    fontWeight: 600,
  };

  const pStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '0.875rem',
    opacity: 0.9,
  };

  const formStyle: React.CSSProperties = {
    padding: '40px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
  };

  const footerPStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '0.75rem',
    color: '#6b7280',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>🎓</div>
          <h1 style={h1Style}>Sistema POA</h1>
          <p style={pStyle}>Universidad de Sonsonate</p>
        </div>

        <form onSubmit={handleLogin} style={formStyle}>
          {error && <ErrorMessage message={error} />}

          <FormGroup label="Correo Electrónico">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@uso.edu.sv"
              required
              disabled={loading}
              style={inputStyle}
            />
          </FormGroup>

          <FormGroup label="Contraseña">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={inputStyle}
            />
          </FormGroup>

          <Button
            type="submit"
            variant="main"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 600, marginTop: '8px' }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div style={footerStyle}>
          <p style={footerPStyle}>© 2024 Universidad de Sonsonate</p>
        </div>
      </div>
    </div>
  );
};
