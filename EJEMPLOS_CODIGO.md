# 💻 EJEMPLOS DE CÓDIGO - INICIO RÁPIDO

## 🔵 INTEGRANTE 1: Backend (Node.js + Express)

### 1. `backend/server.js` (Punto de entrada)
```javascript
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

### 2. `backend/src/app.js` (Configuración de Express)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/proyectos', require('./routes/proyectoRoutes'));
app.use('/api/actividades', require('./routes/actividadRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API POA funcionando' });
});

// Manejo de errores
app.use(require('./middlewares/errorHandler'));

module.exports = app;
```

### 3. `backend/src/config/database.js` (Conexión PostgreSQL)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

module.exports = pool;
```

### 4. `backend/src/routes/authRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
```

### 5. `backend/src/controllers/authController.js`
```javascript
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM usuario WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];

    // Verificar password (en producción usar bcrypt)
    // const isValid = await bcrypt.compare(password, usuario.password);
    
    // Por ahora, comparación simple
    if (password !== 'demo123') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        cargo: usuario.cargo
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombre_completo, correo, cargo, unidad } = req.body;

    const result = await pool.query(
      `INSERT INTO usuario (nombre_completo, correo, cargo, unidad) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre_completo, correo, cargo, unidad]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};
```

### 6. `backend/src/routes/proyectoRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

router.get('/', proyectoController.getAll);
router.get('/:id', proyectoController.getById);
router.post('/', proyectoController.create);
router.put('/:id', proyectoController.update);
router.delete('/:id', proyectoController.delete);

module.exports = router;
```

### 7. `backend/src/controllers/proyectoController.js`
```javascript
const pool = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nombre_completo as responsable_nombre
      FROM proyecto p
      LEFT JOIN usuario u ON p.id_responsable = u.id
      WHERE p.activo = true
      ORDER BY p.anio DESC, p.nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proyecto WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      anio, unidad_facultad, linea_estrategica, objetivo_estrategico,
      accion_estrategica, nombre, objetivo_proyecto, id_responsable,
      presupuesto_total
    } = req.body;

    const result = await pool.query(
      `INSERT INTO proyecto (
        anio, unidad_facultad, linea_estrategica, objetivo_estrategico,
        accion_estrategica, nombre, objetivo_proyecto, id_responsable,
        presupuesto_total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [anio, unidad_facultad, linea_estrategica, objetivo_estrategico,
       accion_estrategica, nombre, objetivo_proyecto, id_responsable,
       presupuesto_total]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;
    
    // Construir query dinámicamente
    const keys = Object.keys(campos);
    const values = Object.values(campos);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const result = await pool.query(
      `UPDATE proyecto SET ${setClause}, updated_at = NOW() 
       WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete
    const result = await pool.query(
      'UPDATE proyecto SET activo = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};
```

### 8. `backend/src/middlewares/authMiddleware.js`
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

---

## 🟢 INTEGRANTE 2: Frontend React (Dashboard y Proyectos)

### 1. `frontend/src/main.jsx`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 2. `frontend/src/App.jsx`
```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistroProyecto from './pages/RegistroProyecto';
import Seguimiento from './pages/Seguimiento';
import Gastos from './pages/Gastos';
import Evidencias from './pages/Evidencias';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="proyectos/nuevo" element={<RegistroProyecto />} />
            <Route path="proyectos/:id/editar" element={<RegistroProyecto />} />
            <Route path="seguimiento/:id" element={<Seguimiento />} />
            <Route path="gastos/:actividadId" element={<Gastos />} />
            <Route path="evidencias/:actividadId" element={<Evidencias />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 3. `frontend/src/context/AuthContext.jsx`
```javascript
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    const data = await authService.login(correo, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. `frontend/src/services/api.js`
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5. `frontend/src/services/proyectoService.js`
```javascript
import api from './api';

const proyectoService = {
  getAll: async () => {
    const response = await api.get('/proyectos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/proyectos/${id}`);
    return response.data;
  },

  create: async (proyecto) => {
    const response = await api.post('/proyectos', proyecto);
    return response.data;
  },

  update: async (id, proyecto) => {
    const response = await api.put(`/proyectos/${id}`, proyecto);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/proyectos/${id}`);
    return response.data;
  },
};

export default proyectoService;
```

### 6. `frontend/src/pages/Login.jsx`
```javascript
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(correo, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sistema POA</h1>
        <h2>Universidad de Sonsonate</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
```

### 7. `frontend/src/components/layout/Layout.jsx`
```javascript
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
```

### 8. `frontend/src/components/common/PrivateRoute.jsx`
```javascript
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function PrivateRoute({ children }) {
  const { usuario, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return usuario ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
```

---

## 🟡 INTEGRANTE 3: Frontend React (Seguimiento y Evidencias)

### 1. `frontend/src/pages/Seguimiento.jsx` (Estructura básica)
```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import proyectoService from '../services/proyectoService';
import actividadService from '../services/actividadService';
import GanttMensual from '../components/seguimiento/GanttMensual';
import './Seguimiento.css';

function Seguimiento() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const proyectoData = await proyectoService.getById(id);
      const actividadesData = await actividadService.getByProyecto(id);
      
      setProyecto(proyectoData);
      setActividades(actividadesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="seguimiento-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h1>Avance por actividad</h1>
            <p>Gantt mensual, responsable y cumplimiento de indicadores</p>
          </div>
          <button className="btn btn-alt" onClick={() => window.print()}>
            🖨 Imprimir
          </button>
        </div>

        <div className="divider"></div>

        <div className="proyecto-info">
          <h2>Proyecto seleccionado</h2>
          <input type="text" value={proyecto?.nombre} readOnly />
        </div>

        <div className="divider"></div>

        <div className="actividades-list">
          {actividades.map((actividad, index) => (
            <div key={actividad.id} className="actividad-block">
              <h3>Actividad {index + 1}</h3>
              <input type="text" value={actividad.nombre} readOnly />
              
              <GanttMensual actividadId={actividad.id} />
              
              {/* Más componentes aquí */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Seguimiento;
```

### 2. `frontend/src/components/seguimiento/GanttMensual.jsx`
```javascript
import { useState, useEffect } from 'react';
import seguimientoService from '../../services/seguimientoService';
import './GanttMensual.css';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function GanttMensual({ actividadId }) {
  const [estados, setEstados] = useState(Array(12).fill(''));

  useEffect(() => {
    cargarEstados();
  }, [actividadId]);

  const cargarEstados = async () => {
    try {
      const data = await seguimientoService.getByActividad(actividadId);
      // Convertir array de BD a array de 12 posiciones
      const estadosArray = Array(12).fill('');
      data.forEach(item => {
        estadosArray[item.mes - 1] = item.estado;
      });
      setEstados(estadosArray);
    } catch (error) {
      console.error('Error al cargar estados:', error);
    }
  };

  const handleChange = async (mes, valor) => {
    const nuevosEstados = [...estados];
    nuevosEstados[mes] = valor;
    setEstados(nuevosEstados);

    try {
      await seguimientoService.update(actividadId, mes + 1, valor);
    } catch (error) {
      console.error('Error al guardar estado:', error);
    }
  };

  const getClaseEstado = (estado) => {
    if (estado === 'P') return 'estado-P';
    if (estado === 'I') return 'estado-I';
    if (estado === 'F') return 'estado-F';
    return 'estado-vacio';
  };

  return (
    <div className="gantt-mensual">
      <div className="meses-grid">
        {MESES.map((mes, index) => (
          <div key={index} className="mes">
            <div className="mes-label">{mes}</div>
            <select
              className={`estado-mes ${getClaseEstado(estados[index])}`}
              value={estados[index]}
              onChange={(e) => handleChange(index, e.target.value)}
            >
              <option value="">-</option>
              <option value="P">P</option>
              <option value="I">I</option>
              <option value="F">F</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GanttMensual;
```

### 3. `frontend/src/utils/formatters.js`
```javascript
export const formatoDinero = (valor) => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(valor);
};

export const formatoFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatoFechaCorta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-SV');
};

export const calcularPorcentaje = (valor, total) => {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
};
```

---

## 📝 NOTAS IMPORTANTES

### Para todos los integrantes:

1. **Usar async/await** para todas las operaciones asíncronas
2. **Manejar errores** con try-catch
3. **Validar datos** antes de enviar al servidor
4. **Comentar código complejo**
5. **Hacer commits frecuentes** con mensajes descriptivos

### Convención de commits:
```
feat: agregar endpoint de proyectos
fix: corregir error en login
style: aplicar estilos al dashboard
refactor: reorganizar componentes
docs: actualizar README
```

---

**¡Estos ejemplos son suficientes para empezar!** 🚀

Cada integrante puede copiar y adaptar estos códigos según su responsabilidad.
