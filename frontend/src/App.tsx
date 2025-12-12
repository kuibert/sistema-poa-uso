import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { Login } from "./pages/Login";
import { DashboardPOA } from "./pages/DashboardPOA";
import { ProyectoPOA } from "./pages/ProyectoPOA";
import ProyectoRegistroPage from "./pages/ProyectoRegistroPage";
import { SeguimientoPage } from "./pages/SeguimientoPage";
import ActividadGastos from "./pages/ActividadGastos";
import ActividadEvidencias from "./pages/ActividadEvidencias";
import { authApi } from "./services/authApi";

import "./styles/global.css";

// ========== RUTA PROTEGIDA ==========
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>

      {/* --------- HEADER SOLO SI ESTA LOGEADO --------- */}
      {authApi.isAuthenticated() && (
        <>
          <header className="header-banner">
            <div>
              <div className="titulo">UNIVERSIDAD DE SONSONATE</div>
              <div className="subtitulo">Sistema de Gestión POA</div>
            </div>

            <div className="usuario">
              Usuario:<br />
              <strong>Carlos Roberto Martínez Martínez</strong>
              {/* Aquí luego pones nombre dinámico desde backend */}
            </div>
          </header>

          {/* --------- NAVBAR GLOBAL --------- */}
          <nav className="navbar">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Dashboard
            </NavLink>
            <NavLink to="/proyectos/nuevo" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Registrar Proyecto
            </NavLink>
            <NavLink to="/seguimiento" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Seguimiento
            </NavLink>
            <NavLink to="/gastos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Gastos
            </NavLink>
            <NavLink to="/evidencias" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Evidencias
            </NavLink>
          </nav>
        </>
      )}

      {/* --------- RUTAS --------- */}
      <Routes>
        
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard principal (tuyo) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPOA />
            </ProtectedRoute>
          }
        />

        {/* Dashboard de tu compañera */}
        <Route
          path="/dashboard2"
          element={
            <ProtectedRoute>
              <DashboardPOA />
            </ProtectedRoute>
          }
        />

        {/* Registro / Proyecto */}
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

        <Route
          path="/registro"
          element={
            <ProtectedRoute>
              <ProyectoRegistroPage />
            </ProtectedRoute>
          }
        />

        {/* Otras páginas del equipo */}
        <Route
          path="/seguimiento"
          element={
            <ProtectedRoute>
              <SeguimientoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gastos"
          element={
            <ProtectedRoute>
              <ActividadGastos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/evidencias"
          element={
            <ProtectedRoute>
              <ActividadEvidencias />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
