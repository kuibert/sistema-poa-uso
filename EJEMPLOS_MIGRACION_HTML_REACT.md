# 🔄 EJEMPLOS PRÁCTICOS: HTML → REACT

## 📌 Conversiones Comunes

### 1. Header del HTML → Componente Header React

**ANTES (HTML):**
```html
<header>
  <div>
    <div class="brand-title">Universidad de Sonsonate</div>
    <div class="brand-sub">Dashboard POA - Portafolio de Proyectos</div>
  </div>
  <div class="user">
    Usuario:<br>
    <strong>Carlos Roberto Martínez Martínez</strong>
  </div>
</header>
```

**DESPUÉS (React):**
```jsx
// components/layout/Header.jsx
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const { usuario } = useContext(AuthContext);

  return (
    <header>
      <div>
        <div className="brand-title">Universidad de Sonsonate</div>
        <div className="brand-sub">Dashboard POA - Portafolio de Proyectos</div>
      </div>
      <div className="user">
        Usuario:<br />
        <strong>{usuario?.nombre_completo}</strong>
      </div>
    </header>
  );
}

export default Header;
```

---

### 2. Tabla con datos estáticos → Tabla con datos dinámicos

**ANTES (HTML con JavaScript):**
```html
<table id="tabla-proyectos">
  <thead>
    <tr>
      <th>Proyecto</th>
      <th>Año</th>
      <th>Responsable</th>
    </tr>
  </thead>
  <tbody>
    <!-- JavaScript llena esto -->
  </tbody>
</table>

<script>
const proyectos = [
  { id: 1, nombre: "Proyecto 1", anio: 2025, responsable: "Juan" },
  { id: 2, nombre: "Proyecto 2", anio: 2025, responsable: "María" }
];

const tbody = document.querySelector("#tabla-proyectos tbody");
proyectos.forEach(p => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.nombre}</td>
    <td>${p.anio}</td>
    <td>${p.responsable}</td>
  `;
  tbody.appendChild(tr);
});
</script>
```

**DESPUÉS (React):**
```jsx
// components/dashboard/ProyectosTable.jsx
import './ProyectosTable.css';

function ProyectosTable({ proyectos }) {
  return (
    <table className="tabla-proyectos">
      <thead>
        <tr>
          <th>Proyecto</th>
          <th>Año</th>
          <th>Responsable</th>
        </tr>
      </thead>
      <tbody>
        {proyectos.map(p => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td>{p.anio}</td>
            <td>{p.responsable}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProyectosTable;
```

**Uso en página:**
```jsx
// pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import proyectoService from '../services/proyectoService';
import ProyectosTable from '../components/dashboard/ProyectosTable';

function Dashboard() {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    proyectoService.getAll().then(setProyectos);
  }, []);

  return (
    <div>
      <ProyectosTable proyectos={proyectos} />
    </div>
  );
}
```

---

### 3. Formulario con inputs → Formulario React controlado

**ANTES (HTML):**
```html
<form>
  <label>Nombre del proyecto</label>
  <input type="text" id="nombreProyecto" placeholder="Ingrese nombre">
  
  <label>Año</label>
  <input type="number" id="anioProyecto" value="2025">
  
  <button type="button" onclick="guardar()">Guardar</button>
</form>

<script>
function guardar() {
  const nombre = document.getElementById("nombreProyecto").value;
  const anio = document.getElementById("anioProyecto").value;
  console.log({ nombre, anio });
}
</script>
```

**DESPUÉS (React):**
```jsx
// pages/RegistroProyecto.jsx
import { useState } from 'react';

function RegistroProyecto() {
  const [proyecto, setProyecto] = useState({
    nombre: '',
    anio: 2025
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(proyecto);
    // Aquí llamar a la API
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre del proyecto</label>
      <input
        type="text"
        value={proyecto.nombre}
        onChange={(e) => setProyecto({...proyecto, nombre: e.target.value})}
        placeholder="Ingrese nombre"
      />
      
      <label>Año</label>
      <input
        type="number"
        value={proyecto.anio}
        onChange={(e) => setProyecto({...proyecto, anio: e.target.value})}
      />
      
      <button type="submit">Guardar</button>
    </form>
  );
}

export default RegistroProyecto;
```

---

### 4. Checkboxes de meses → Componente React

**ANTES (HTML):**
```html
<table class="tabla-meses">
  <thead>
    <tr>
      <th>Ene</th><th>Feb</th><th>Mar</th>
      <!-- ... más meses -->
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <td><input type="checkbox"></td>
      <!-- ... más checkboxes -->
    </tr>
  </tbody>
</table>
```

**DESPUÉS (React):**
```jsx
// components/proyecto/MesesCheckbox.jsx
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function MesesCheckbox({ mesesSeleccionados, onChange }) {
  const handleChange = (index) => {
    const newMeses = [...mesesSeleccionados];
    newMeses[index] = !newMeses[index];
    onChange(newMeses);
  };

  return (
    <table className="tabla-meses">
      <thead>
        <tr>
          {MESES.map(mes => <th key={mes}>{mes}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          {mesesSeleccionados.map((checked, index) => (
            <td key={index}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleChange(index)}
              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default MesesCheckbox;
```

**Uso:**
```jsx
function ActividadBlock() {
  const [meses, setMeses] = useState(Array(12).fill(false));

  return (
    <div>
      <h3>Meses de ejecución</h3>
      <MesesCheckbox mesesSeleccionados={meses} onChange={setMeses} />
    </div>
  );
}
```

---

### 5. Select con estados P/I/F → Componente React

**ANTES (HTML con JavaScript):**
```html
<select class="estado-mes" onchange="aplicarClaseEstado(this)">
  <option value="">-</option>
  <option value="P">P</option>
  <option value="I">I</option>
  <option value="F">F</option>
</select>

<script>
function aplicarClaseEstado(sel) {
  sel.classList.remove("estado-vacio", "estado-P", "estado-I", "estado-F");
  const v = sel.value;
  if (v === "P") sel.classList.add("estado-P");
  else if (v === "I") sel.classList.add("estado-I");
  else if (v === "F") sel.classList.add("estado-F");
  else sel.classList.add("estado-vacio");
}
</script>
```

**DESPUÉS (React):**
```jsx
// components/seguimiento/EstadoMesSelect.jsx
import './EstadoMesSelect.css';

function EstadoMesSelect({ value, onChange }) {
  const getClaseEstado = () => {
    if (value === 'P') return 'estado-P';
    if (value === 'I') return 'estado-I';
    if (value === 'F') return 'estado-F';
    return 'estado-vacio';
  };

  return (
    <select
      className={`estado-mes ${getClaseEstado()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-</option>
      <option value="P">P</option>
      <option value="I">I</option>
      <option value="F">F</option>
    </select>
  );
}

export default EstadoMesSelect;
```

---

### 6. Gantt mensual completo → Componente React

**ANTES (HTML con JavaScript):**
```html
<div class="meses-grid">
  <!-- 12 selects generados con JavaScript -->
</div>

<script>
const meses = ["Ene", "Feb", "Mar", ...];
const estados = Array(12).fill("");

function renderGantt() {
  const container = document.querySelector(".meses-grid");
  container.innerHTML = "";
  
  meses.forEach((mes, index) => {
    const div = document.createElement("div");
    div.className = "mes";
    div.innerHTML = `
      <div class="mes-label">${mes}</div>
      <select class="estado-mes" onchange="cambiarEstado(${index}, this.value)">
        <option value="">-</option>
        <option value="P">P</option>
        <option value="I">I</option>
        <option value="F">F</option>
      </select>
    `;
    container.appendChild(div);
  });
}

function cambiarEstado(index, valor) {
  estados[index] = valor;
  // Guardar en servidor
}
</script>
```

**DESPUÉS (React):**
```jsx
// components/seguimiento/GanttMensual.jsx
import { useState, useEffect } from 'react';
import seguimientoService from '../../services/seguimientoService';
import EstadoMesSelect from './EstadoMesSelect';
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
      const estadosArray = Array(12).fill('');
      data.forEach(item => {
        estadosArray[item.mes - 1] = item.estado;
      });
      setEstados(estadosArray);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = async (mes, valor) => {
    const nuevosEstados = [...estados];
    nuevosEstados[mes] = valor;
    setEstados(nuevosEstados);

    try {
      await seguimientoService.update(actividadId, mes + 1, valor);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="meses-grid">
      {MESES.map((mes, index) => (
        <div key={index} className="mes">
          <div className="mes-label">{mes}</div>
          <EstadoMesSelect
            value={estados[index]}
            onChange={(valor) => handleChange(index, valor)}
          />
        </div>
      ))}
    </div>
  );
}

export default GanttMensual;
```

---

### 7. Tabla dinámica con agregar/eliminar filas → React

**ANTES (HTML con JavaScript):**
```html
<table id="tabla-costos">
  <tbody>
    <!-- Filas dinámicas -->
  </tbody>
</table>
<button onclick="agregarFila()">Agregar</button>

<script>
function agregarFila() {
  const tbody = document.querySelector("#tabla-costos tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" placeholder="Descripción"></td>
    <td><input type="number" class="qty"></td>
    <td><input type="number" class="unit"></td>
    <td><button onclick="eliminarFila(this)">✖</button></td>
  `;
  tbody.appendChild(tr);
}

function eliminarFila(btn) {
  btn.closest("tr").remove();
}
</script>
```

**DESPUÉS (React):**
```jsx
// components/proyecto/CostosTable.jsx
import { useState } from 'react';
import './CostosTable.css';

function CostosTable({ costos, onChange, tipo }) {
  const agregarFila = () => {
    onChange([...costos, {
      descripcion: '',
      cantidad: 0,
      unidad: '',
      precio_unitario: 0,
      costo_total: 0
    }]);
  };

  const eliminarFila = (index) => {
    onChange(costos.filter((_, i) => i !== index));
  };

  const actualizarFila = (index, campo, valor) => {
    const nuevosCostos = [...costos];
    nuevosCostos[index][campo] = valor;
    
    // Calcular total
    if (campo === 'cantidad' || campo === 'precio_unitario') {
      const cantidad = parseFloat(nuevosCostos[index].cantidad) || 0;
      const precio = parseFloat(nuevosCostos[index].precio_unitario) || 0;
      nuevosCostos[index].costo_total = cantidad * precio;
    }
    
    onChange(nuevosCostos);
  };

  const totalGeneral = costos.reduce((sum, c) => sum + (c.costo_total || 0), 0);

  return (
    <div>
      <button className="btn btn-mini btn-main" onClick={agregarFila}>
        ➕ Agregar costo {tipo}
      </button>
      
      <table className="tabla-costos">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Precio unitario ($)</th>
            <th>Costo total ($)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {costos.map((costo, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={costo.descripcion}
                  onChange={(e) => actualizarFila(index, 'descripcion', e.target.value)}
                  placeholder="Descripción"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={costo.cantidad}
                  onChange={(e) => actualizarFila(index, 'cantidad', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={costo.unidad}
                  onChange={(e) => actualizarFila(index, 'unidad', e.target.value)}
                  placeholder="Unidad"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={costo.precio_unitario}
                  onChange={(e) => actualizarFila(index, 'precio_unitario', e.target.value)}
                  step="0.01"
                />
              </td>
              <td>
                <input type="number" value={costo.costo_total.toFixed(2)} readOnly />
              </td>
              <td>
                <button
                  className="btn btn-mini btn-alt"
                  onClick={() => eliminarFila(index)}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ textAlign: 'right' }}>
              Total costos {tipo}s ($):
            </td>
            <td>
              <input type="number" value={totalGeneral.toFixed(2)} readOnly />
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default CostosTable;
```

---

### 8. Upload de archivos → React con FormData

**ANTES (HTML):**
```html
<input type="file" id="archivo">
<button onclick="subirArchivo()">Subir</button>

<script>
function subirArchivo() {
  const input = document.getElementById("archivo");
  const file = input.files[0];
  
  const formData = new FormData();
  formData.append("archivo", file);
  
  fetch("/api/evidencias", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => console.log(data));
}
</script>
```

**DESPUÉS (React):**
```jsx
// components/evidencias/EvidenciaUpload.jsx
import { useState } from 'react';
import evidenciaService from '../../services/evidenciaService';
import './EvidenciaUpload.css';

function EvidenciaUpload({ actividadId, onUpload }) {
  const [archivo, setArchivo] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!archivo) {
      alert('Seleccione un archivo');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('descripcion', descripcion);
      formData.append('id_actividad', actividadId);

      await evidenciaService.upload(formData);
      
      // Limpiar formulario
      setArchivo(null);
      setDescripcion('');
      
      // Recargar lista
      onUpload();
      
      alert('Evidencia subida exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir evidencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="evidencia-upload">
      <div>
        <label>Archivo</label>
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
      </div>
      
      <div>
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe la evidencia"
        />
      </div>
      
      <button type="submit" className="btn btn-main" disabled={loading}>
        {loading ? 'Subiendo...' : '➕ Subir evidencia'}
      </button>
    </form>
  );
}

export default EvidenciaUpload;
```

---

### 9. Modal simple → React

**ANTES (HTML con JavaScript):**
```html
<div id="modal" class="modal-backdrop hidden">
  <div class="modal">
    <h2 id="modal-titulo">Título</h2>
    <p id="modal-texto">Contenido</p>
    <button onclick="cerrarModal()">Cerrar</button>
  </div>
</div>

<script>
function abrirModal(titulo, texto) {
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-texto").textContent = texto;
  document.getElementById("modal").classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("modal").classList.add("hidden");
}
</script>
```

**DESPUÉS (React):**
```jsx
// components/common/Modal.jsx
import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn btn-alt" onClick={onClose}>✖</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-alt" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
```

**Uso:**
```jsx
function MiComponente() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div>
      <button onClick={() => setModalAbierto(true)}>Abrir Modal</button>
      
      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Mi Modal"
      >
        <p>Contenido del modal aquí</p>
      </Modal>
    </div>
  );
}
```

---

## 🎨 CONVERSIÓN DE CSS

### class → className
```html
<!-- HTML -->
<div class="card">

<!-- React JSX -->
<div className="card">
```

### Estilos inline
```html
<!-- HTML -->
<div style="width: 50%; color: red;">

<!-- React JSX -->
<div style={{ width: '50%', color: 'red' }}>
```

### Variables CSS (se mantienen igual)
```css
/* Funciona igual en HTML y React */
:root {
  --color-principal: #002b5c;
}

.card {
  background: var(--color-principal);
}
```

---

## 📝 RESUMEN DE CONVERSIONES

| HTML/JS | React |
|---------|-------|
| `document.getElementById()` | `useState()` + `value` |
| `document.querySelector()` | `useRef()` o estado |
| `onclick="funcion()"` | `onClick={funcion}` |
| `innerHTML` | JSX con `{}` |
| `for` loop | `.map()` |
| `if/else` en JS | Operador ternario o `&&` |
| Variables globales | `useState()` o Context |
| `addEventListener` | Props como `onChange`, `onClick` |
| Manipulación DOM | Estado de React |

---

**¡Con estos ejemplos puedes migrar cualquier parte del HTML a React!** 🚀
