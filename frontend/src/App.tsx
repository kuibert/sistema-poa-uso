import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardPOA } from './pages/DashboardPOA';
import { ProyectoPOA } from './pages/ProyectoPOA';
import { SeguimientoPage } from './pages/SeguimientoPage';
import ActividadGastos from './pages/ActividadGastos';
import ActividadEvidencias from './pages/ActividadEvidencias';
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

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPOA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPOA />
            </ProtectedRoute>
          }
        />

        {/* Registrar Proyecto */}
        <Route
          path="/proyecto"
          element={
            <ProtectedRoute>
              <ProyectoPOA />
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

        {/* Seguimiento */}
        <Route
          path="/seguimiento"
          element={
            <ProtectedRoute>
              <SeguimientoPage />
            </ProtectedRoute>
          }
        />

        {/* Gastos - con y sin ID */}
        <Route
          path="/gastos"
          element={
            <ProtectedRoute>
              <ActividadGastos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades/:id/gastos"
          element={
            <ProtectedRoute>
              <ActividadGastos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividad/:id/gastos"
          element={
            <ProtectedRoute>
              <ActividadGastos />
            </ProtectedRoute>
          }
        />

        {/* Evidencias - con y sin ID */}
        <Route
          path="/evidencias"
          element={
            <ProtectedRoute>
              <ActividadEvidencias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades/:id/evidencias"
          element={
            <ProtectedRoute>
              <ActividadEvidencias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividad/:id/evidencias"
          element={
            <ProtectedRoute>
              <ActividadEvidencias />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
