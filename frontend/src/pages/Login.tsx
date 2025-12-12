import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { Button, FormGroup, ErrorMessage, Input, LoginCard, LoginHeader, LoginForm, LoginFooter } from '../components/common';

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

  return (
    <LoginCard>
      <LoginHeader
        title="Sistema POA"
        subtitle="Universidad de Sonsonate"
        icon="🎓"
      />

      <LoginForm onSubmit={handleLogin}>
        {error && <ErrorMessage message={error} />}

        <FormGroup label="Correo Electrónico">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@uso.edu.sv"
            required
            disabled={loading}
          />
        </FormGroup>

        <FormGroup label="Contraseña">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </FormGroup>

        <Button
          type="submit"
          variant="main"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 600, marginTop: '8px' }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </LoginForm>

      <LoginFooter text="© 2024 Universidad de Sonsonate" />
    </LoginCard>
  );
};
