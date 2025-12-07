# 🔄 GUÍA DE MIGRACIÓN HTML → REACT

## 📋 Archivos HTML a Migrar

Tienes **5 archivos HTML** que deben convertirse a **5 páginas React**:

| HTML Original | Página React | Responsable |
|---------------|--------------|-------------|
| `page0.html` | `Dashboard.jsx` | Integrante 2 |
| `page1.html` | `RegistroProyecto.jsx` | Integrante 2 |
| `page2.html` | `Seguimiento.jsx` | Integrante 3 |
| `gastos.html` | `Gastos.jsx` | Integrante 3 |
| `evidencias.html` | `Evidencias.jsx` | Integrante 3 |

---

## 🎯 ESTRATEGIA DE MIGRACIÓN

### Paso 1: Extraer CSS Global
Todos los archivos HTML comparten estilos similares (tema azul oscuro).

**Crear:** `frontend/src/assets/styles/global.css`

```css
:root {
  --banner-azul: #002b5c;
  --fondo-azul: #0b2447;
  --tarjeta-azul: #142d52;
  --panel-kpi: #163566;
  --panel-proyectos: #071730;
  --panel-actividades: #052a35;
  --texto-claro: #e9edf3;
  --texto-sec: #bfc7d1;
  --verde-hoja: #3fa65b;
  --borde: rgba(255,255,255,0.08);
  --estado-P: #a93226;
  --estado-I: #a5673f;
  --estado-F: #2ecc71;
}

* {
  box-sizing: border-box;
  margin: 0;
  font-family: "Segoe UI", system-ui, sans-serif;
}

body {
  background: var(--fondo-azul);
  color: var(--texto-claro);
  line-height: 1.45;
}

.card {
  background: var(--tarjeta-azul);
  border-radius: 14px;
  padding: 1.6rem 1.7rem 1.4rem;
  border: 1px solid var(--borde);
  box-shadow: 0 8px 20px rgba(0,0,0,.25);
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--verde-hoja), transparent);
  margin: 1.2rem 0;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: .4rem 1rem;
  font-size: .8rem;
  cursor: pointer;
}

.btn-main {
  background: var(--verde-hoja);
  color: #081a10;
  font-weight: 600;
}

.btn-alt {
  background: transparent;
  border: 1px solid var(--verde-hoja);
  color: var(--verde-hoja);
}

/* Agregar más estilos comunes aquí */
```

---

## 📄 MIGRACIÓN 1: page0.html → Dashboard.jsx

### Estructura del HTML:
```
page0.html
├── Header (usuario)
├── Panel KPIs del portafolio (4 tarjetas)
├── Tabla de proyectos activos
└── Tabla de actividades del mes
```

### Componentes React a crear:

```
Dashboard.jsx (página principal)
├── components/dashboard/KPICard.jsx
├── components/dashboard/ProyectosTable.jsx
└── components/dashboard/ActividadesMesTable.jsx
```

### Código de Dashboard.jsx:

```jsx
// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import KPICard from '../components/dashboard/KPICard';
import ProyectosTable from '../components/dashboard/ProyectosTable';
import ActividadesMesTable from '../components/dashboard/ActividadesMesTable';
import './Dashboard.css';

function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [kpisData, proyectosData, actividadesData] = await Promise.all([
        dashboardService.getKPIsPortafolio(),
        dashboardService.getProyectos(),
        dashboardService.getActividadesMes()
      ]);
      
      setKpis(kpisData);
      setProyectos(proyectosData);
      setActividades(actividadesData);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="dashboard-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Resumen del portafolio de proyectos POA</h1>
            <p className="card-sub">Visión global del presupuesto, avance y resultados</p>
          </div>
          <button className="btn btn-alt" onClick={() => window.print()}>
            🖨 Imprimir dashboard
          </button>
        </div>

        <div className="divider"></div>

        {/* KPIs del Portafolio */}
        <div className="kpi-grid">
          <KPICard
            label="Presupuesto del portafolio"
            value={kpis?.presupuestoDisponible}
            subtitle={`Aprobado: ${kpis?.presupuestoAprobado} · Gastado: ${kpis?.presupuestoGastado}`}
            percentage={kpis?.porcentajeGastado}
          />
          <KPICard
            label="Avance operativo promedio"
            value={`${kpis?.avancePromedio}%`}
            subtitle="Calculado a partir de los meses P/I/F"
            percentage={kpis?.avancePromedio}
          />
          <KPICard
            label="Logro promedio de indicadores (KPI)"
            value={`${kpis?.logroPromedio}%`}
            subtitle="Promedio de cumplimiento de metas"
            percentage={kpis?.logroPromedio}
          />
          <KPICard
            label="Actividades del mes"
            value={kpis?.actividadesMes}
            subtitle={`P: ${kpis?.pendientes} · I: ${kpis?.iniciadas} · F: ${kpis?.finalizadas}`}
          />
        </div>

        <div className="divider"></div>

        {/* Tabla de Proyectos */}
        <ProyectosTable proyectos={proyectos} />

        <div className="divider"></div>

        {/* Tabla de Actividades del Mes */}
        <ActividadesMesTable actividades={actividades} />
      </div>
    </div>
  );
}

export default Dashboard;
```

### Componente KPICard.jsx:

```jsx
// frontend/src/components/dashboard/KPICard.jsx
import './KPICard.css';

function KPICard({ label, value, subtitle, percentage }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{subtitle}</div>
      {percentage !== undefined && (
        <div className="kpi-bar-bg">
          <div className="kpi-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      )}
    </div>
  );
}

export default KPICard;
```

---

## 📄 MIGRACIÓN 2: page1.html → RegistroProyecto.jsx

### Estructura del HTML:
```
page1.html
├── Información estratégica (año, unidad, línea)
├── Datos del proyecto (nombre, responsable, objetivo)
├── Actividades (dinámicas)
│   ├── Nombre de actividad
│   ├── Meses de ejecución (checkboxes)
│   ├── Indicador de logro
│   └── Evidencias
├── Costos variables (tabla dinámica)
├── Costos fijos (tabla dinámica)
└── Total del proyecto
```

### Componentes React a crear:

```
RegistroProyecto.jsx (página principal)
├── components/proyecto/ActividadBlock.jsx
├── components/proyecto/MesesCheckbox.jsx
├── components/proyecto/IndicadorForm.jsx
└── components/proyecto/CostosTable.jsx
```

### Código de RegistroProyecto.jsx:

```jsx
// frontend/src/pages/RegistroProyecto.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import proyectoService from '../services/proyectoService';
import ActividadBlock from '../components/proyecto/ActividadBlock';
import CostosTable from '../components/proyecto/CostosTable';
import './RegistroProyecto.css';

function RegistroProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState({
    anio: new Date().getFullYear(),
    unidad_facultad: '',
    linea_estrategica: '',
    objetivo_estrategico: '',
    accion_estrategica: '',
    nombre: '',
    objetivo_proyecto: '',
    id_responsable: null
  });
  const [actividades, setActividades] = useState([]);
  const [costosVariables, setCostosVariables] = useState([]);
  const [costosFijos, setCostosFijos] = useState([]);

  useEffect(() => {
    if (id) cargarProyecto();
  }, [id]);

  const cargarProyecto = async () => {
    try {
      const data = await proyectoService.getById(id);
      setProyecto(data.proyecto);
      setActividades(data.actividades);
      setCostosVariables(data.costosVariables);
      setCostosFijos(data.costosFijos);
    } catch (error) {
      console.error('Error al cargar proyecto:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        proyecto,
        actividades,
        costosVariables,
        costosFijos
      };
      
      if (id) {
        await proyectoService.update(id, data);
      } else {
        await proyectoService.create(data);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    }
  };

  const agregarActividad = () => {
    setActividades([...actividades, {
      nombre: '',
      meses: Array(12).fill(false),
      indicador: {},
      evidencias: ''
    }]);
  };

  return (
    <div className="registro-proyecto-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">Registro de Proyecto POA</h1>
            <p className="card-sub">Información estratégica, actividades, indicadores y presupuesto</p>
          </div>
          <div>
            <button className="btn btn-alt" onClick={handleSubmit}>💾 Guardar</button>
            <button className="btn btn-main" onClick={() => window.print()}>🖨 Imprimir</button>
          </div>
        </div>

        <div className="divider"></div>

        <form onSubmit={handleSubmit}>
          {/* Información Estratégica */}
          <section className="section">
            <h2 className="section-title">Información estratégica</h2>
            <div className="section-divider"></div>
            
            <div className="grid-3">
              <div>
                <label>Año</label>
                <input
                  type="number"
                  value={proyecto.anio}
                  onChange={(e) => setProyecto({...proyecto, anio: e.target.value})}
                />
              </div>
              <div>
                <label>Unidad / Facultad</label>
                <input
                  type="text"
                  value={proyecto.unidad_facultad}
                  onChange={(e) => setProyecto({...proyecto, unidad_facultad: e.target.value})}
                />
              </div>
              <div>
                <label>Línea estratégica</label>
                <input
                  type="text"
                  value={proyecto.linea_estrategica}
                  onChange={(e) => setProyecto({...proyecto, linea_estrategica: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Datos del Proyecto */}
          <section className="section">
            <h2 className="section-title">Datos del proyecto</h2>
            <div className="section-divider"></div>
            
            <div className="grid-2">
              <div>
                <label>Nombre del proyecto</label>
                <input
                  type="text"
                  value={proyecto.nombre}
                  onChange={(e) => setProyecto({...proyecto, nombre: e.target.value})}
                  required
                />
              </div>
              <div>
                <label>Responsable</label>
                <input type="text" />
              </div>
            </div>
          </section>

          {/* Actividades */}
          <section className="section">
            <h2 className="section-title">Actividades</h2>
            <div className="section-divider"></div>
            
            {actividades.map((actividad, index) => (
              <ActividadBlock
                key={index}
                actividad={actividad}
                index={index}
                onChange={(updatedActividad) => {
                  const newActividades = [...actividades];
                  newActividades[index] = updatedActividad;
                  setActividades(newActividades);
                }}
                onDelete={() => {
                  setActividades(actividades.filter((_, i) => i !== index));
                }}
              />
            ))}
            
            <button type="button" className="btn btn-main" onClick={agregarActividad}>
              ➕ Agregar actividad
            </button>
          </section>

          {/* Costos Variables */}
          <section className="section">
            <h2 className="section-title">Presupuesto - Costos variables</h2>
            <div className="section-divider"></div>
            
            <CostosTable
              costos={costosVariables}
              onChange={setCostosVariables}
              tipo="variable"
            />
          </section>

          {/* Costos Fijos */}
          <section className="section">
            <h2 className="section-title">Presupuesto - Costos fijos</h2>
            <div className="section-divider"></div>
            
            <CostosTable
              costos={costosFijos}
              onChange={setCostosFijos}
              tipo="fijo"
            />
          </section>
        </form>
      </div>
    </div>
  );
}

export default RegistroProyecto;
```

---

## 📄 MIGRACIÓN 3: page2.html → Seguimiento.jsx

### Estructura del HTML:
```
page2.html
├── Selector de proyecto
├── Lista de actividades
│   ├── Nombre de actividad
│   ├── Responsable
│   ├── Gantt mensual (12 selects con estados P/I/F)
│   ├── Barra de progreso
│   ├── Indicador de logro
│   └── Botones (Evidencias, Gastos)
```

### Código de Seguimiento.jsx:

```jsx
// frontend/src/pages/Seguimiento.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import proyectoService from '../services/proyectoService';
import GanttMensual from '../components/seguimiento/GanttMensual';
import ProgressBar from '../components/seguimiento/ProgressBar';
import './Seguimiento.css';

function Seguimiento() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const proyectoData = await proyectoService.getById(id);
      setProyecto(proyectoData);
      setActividades(proyectoData.actividades);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

        {actividades.map((actividad, index) => (
          <div key={actividad.id} className="actividad-block">
            <h3>Actividad {index + 1}</h3>
            <input type="text" value={actividad.nombre} readOnly />
            
            <GanttMensual actividadId={actividad.id} />
            
            <ProgressBar actividadId={actividad.id} />
            
            <div className="actions">
              <button className="btn btn-alt">📎 Evidencias</button>
              <button className="btn btn-alt">💰 Gastos</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Seguimiento;
```

---

## 📄 MIGRACIÓN 4: gastos.html → Gastos.jsx

### Código de Gastos.jsx:

```jsx
// frontend/src/pages/Gastos.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import gastoService from '../services/gastoService';
import GastoForm from '../components/gastos/GastoForm';
import GastosTable from '../components/gastos/GastosTable';
import './Gastos.css';

function Gastos() {
  const { actividadId } = useParams();
  const [actividad, setActividad] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [montoAsignado, setMontoAsignado] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, [actividadId]);

  const cargarDatos = async () => {
    try {
      const data = await gastoService.getByActividad(actividadId);
      setActividad(data.actividad);
      setGastos(data.gastos);
      setMontoAsignado(data.montoAsignado);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const totalGastado = gastos.reduce((sum, g) => sum + g.monto, 0);
  const disponible = montoAsignado - totalGastado;

  return (
    <div className="gastos-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h1>Gastos de la actividad</h1>
            <p>Fecha, descripción y monto</p>
          </div>
          <button className="btn btn-alt" onClick={() => window.print()}>
            🖨 Imprimir
          </button>
        </div>

        <div className="divider"></div>

        <div className="resumen-panel">
          <div className="resumen-grid">
            <div>
              <label>Monto asignado ($)</label>
              <input type="number" value={montoAsignado} readOnly />
            </div>
            <div>
              <label>Total gastado ($)</label>
              <input type="number" value={totalGastado} readOnly />
            </div>
            <div>
              <label>Disponible ($)</label>
              <input type="number" value={disponible} readOnly />
            </div>
          </div>
        </div>

        <GastoForm actividadId={actividadId} onSave={cargarDatos} />
        
        <GastosTable gastos={gastos} onDelete={cargarDatos} />
      </div>
    </div>
  );
}

export default Gastos;
```

---

## 📄 MIGRACIÓN 5: evidencias.html → Evidencias.jsx

### Código de Evidencias.jsx:

```jsx
// frontend/src/pages/Evidencias.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import evidenciaService from '../services/evidenciaService';
import EvidenciaUpload from '../components/evidencias/EvidenciaUpload';
import EvidenciasTable from '../components/evidencias/EvidenciasTable';
import './Evidencias.css';

function Evidencias() {
  const { actividadId } = useParams();
  const [actividad, setActividad] = useState(null);
  const [evidencias, setEvidencias] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, [actividadId]);

  const cargarDatos = async () => {
    try {
      const data = await evidenciaService.getByActividad(actividadId);
      setActividad(data.actividad);
      setEvidencias(data.evidencias);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="evidencias-page">
      <div className="card">
        <div className="card-header">
          <div>
            <h1>Evidencias de la actividad</h1>
            <p>Subir, describir y consultar evidencias</p>
          </div>
          <button className="btn btn-alt" onClick={() => window.print()}>
            🖨 Imprimir
          </button>
        </div>

        <div className="divider"></div>

        <div className="proyecto-info">
          <h2>Proyecto y actividad</h2>
          <input type="text" value={actividad?.proyecto} readOnly />
          <input type="text" value={actividad?.nombre} readOnly />
        </div>

        <EvidenciaUpload actividadId={actividadId} onUpload={cargarDatos} />
        
        <EvidenciasTable evidencias={evidencias} onDelete={cargarDatos} />
      </div>
    </div>
  );
}

export default Evidencias;
```

---

## 📋 CHECKLIST DE MIGRACIÓN

### Integrante 2 (Dashboard y Proyectos)

#### Dashboard (page0.html → Dashboard.jsx)
- [ ] Crear `pages/Dashboard.jsx`
- [ ] Crear `components/dashboard/KPICard.jsx`
- [ ] Crear `components/dashboard/ProyectosTable.jsx`
- [ ] Crear `components/dashboard/ActividadesMesTable.jsx`
- [ ] Crear `Dashboard.css` (extraer de page0.html)
- [ ] Integrar con `dashboardService.js`
- [ ] Probar con datos del backend

#### Registro de Proyectos (page1.html → RegistroProyecto.jsx)
- [ ] Crear `pages/RegistroProyecto.jsx`
- [ ] Crear `components/proyecto/ActividadBlock.jsx`
- [ ] Crear `components/proyecto/MesesCheckbox.jsx`
- [ ] Crear `components/proyecto/IndicadorForm.jsx`
- [ ] Crear `components/proyecto/CostosTable.jsx`
- [ ] Crear `RegistroProyecto.css` (extraer de page1.html)
- [ ] Implementar lógica de actividades dinámicas
- [ ] Implementar cálculo de totales
- [ ] Integrar con `proyectoService.js`
- [ ] Probar creación y edición

### Integrante 3 (Seguimiento, Gastos y Evidencias)

#### Seguimiento (page2.html → Seguimiento.jsx)
- [ ] Crear `pages/Seguimiento.jsx`
- [ ] Crear `components/seguimiento/GanttMensual.jsx`
- [ ] Crear `components/seguimiento/ProgressBar.jsx`
- [ ] Crear `Seguimiento.css` (extraer de page2.html)
- [ ] Implementar cambio de estados P/I/F
- [ ] Implementar cálculo de progreso
- [ ] Integrar con `seguimientoService.js`
- [ ] Probar con múltiples actividades

#### Gastos (gastos.html → Gastos.jsx)
- [ ] Crear `pages/Gastos.jsx`
- [ ] Crear `components/gastos/GastoForm.jsx`
- [ ] Crear `components/gastos/GastosTable.jsx`
- [ ] Crear `Gastos.css` (extraer de gastos.html)
- [ ] Implementar cálculo de disponible
- [ ] Integrar con `gastoService.js`
- [ ] Probar registro y eliminación

#### Evidencias (evidencias.html → Evidencias.jsx)
- [ ] Crear `pages/Evidencias.jsx`
- [ ] Crear `components/evidencias/EvidenciaUpload.jsx`
- [ ] Crear `components/evidencias/EvidenciasTable.jsx`
- [ ] Crear `Evidencias.css` (extraer de evidencias.html)
- [ ] Implementar upload de archivos
- [ ] Implementar descarga de archivos
- [ ] Integrar con `evidenciaService.js`
- [ ] Probar con diferentes tipos de archivo

---

## 🎨 EXTRACCIÓN DE CSS

### Proceso para cada archivo HTML:

1. **Abrir el archivo HTML**
2. **Copiar todo el contenido del `<style>`**
3. **Crear archivo CSS correspondiente**
4. **Ajustar selectores si es necesario**

Ejemplo:
```html
<!-- page0.html -->
<style>
  .kpi-card { ... }
</style>
```

Se convierte en:
```css
/* Dashboard.css */
.kpi-card { ... }
```

---

## 🔗 SERVICIOS DE API

Crear estos servicios para conectar con el backend:

```javascript
// frontend/src/services/dashboardService.js
import api from './api';

const dashboardService = {
  getKPIsPortafolio: () => api.get('/dashboard/portafolio').then(res => res.data),
  getProyectos: () => api.get('/dashboard/proyectos').then(res => res.data),
  getActividadesMes: () => api.get('/dashboard/actividades-mes').then(res => res.data),
};

export default dashboardService;
```

---

## ⏱️ TIEMPO ESTIMADO DE MIGRACIÓN

| Página | Complejidad | Tiempo estimado |
|--------|-------------|-----------------|
| Dashboard | Media | 4-6 horas |
| RegistroProyecto | Alta | 8-10 horas |
| Seguimiento | Media | 6-8 horas |
| Gastos | Baja | 3-4 horas |
| Evidencias | Media | 4-5 horas |

**Total:** 25-33 horas de trabajo

---

## 🚀 ORDEN RECOMENDADO DE MIGRACIÓN

1. **Dashboard** (más simple, para familiarizarse)
2. **Gastos** (práctica con formularios)
3. **Evidencias** (práctica con upload)
4. **Seguimiento** (Gantt interactivo)
5. **RegistroProyecto** (más complejo, al final)

---

**¡Éxito en la migración!** 🎉
