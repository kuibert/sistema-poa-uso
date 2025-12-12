import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import { SeguimientoPage } from "./pages/SeguimientoPage";
import ProyectoRegistroPage from "./pages/ProyectoRegistroPage";



import "./assets/styles/global.css";
import ActividadGastos from "./pages/ActividadGastos";
import ActividadEvidencias from "./pages/ActividadEvidencias";

function App() {
  return (
    <Router>
      {/* BANNER SUPERIOR */}
      <header className="header-banner">
        <div>
          <div className="titulo">UNIVERSIDAD DE SONSONATE</div>
          <div className="subtitulo">Sistema de Gestión POA</div>
        </div>

        <div className="usuario">
          Usuario:<br />
          <strong>Carlos Roberto Martínez Martínez</strong>
        </div>
      </header>

      {/* NAVBAR GLOBAL */}
      <nav className="navbar">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/registro" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
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

      {/* RUTAS */}
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/seguimiento" element={<SeguimientoPage />} />
        <Route path="/registro" element={<ProyectoRegistroPage />} />
        <Route path="/gastos" element={<ActividadGastos />} />
        <Route path="/evidencias" element={<ActividadEvidencias />} />

      </Routes>
    </Router>
  );
}

export default App;
