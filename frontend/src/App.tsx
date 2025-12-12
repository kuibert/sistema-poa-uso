import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardPOA } from './pages/DashboardPOA';
import { ProyectoPOA } from './pages/ProyectoPOA';
import { authApi } from './services/authApi';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPOA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/nuevo"
          element={
            <ProtectedRoute>
              <ProyectoPOA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:id"
          element={
            <ProtectedRoute>
              <ProyectoPOA />
            </ProtectedRoute>
          }
        />
        {/* Rutas para Gaby - Seguimiento, Gastos, Evidencias */}
        {/* <Route path="/proyectos/:id/seguimiento" element={...} /> */}
        {/* <Route path="/actividades/:id/gastos" element={...} /> */}
        {/* <Route path="/actividades/:id/evidencias" element={...} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
