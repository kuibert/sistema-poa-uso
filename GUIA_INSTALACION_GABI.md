# 🟡 GUÍA DE TRABAJO - GABY (FRONTEND)

## 👋 ¡Hola Gaby!

Esta guía te explica **exactamente** qué debes hacer para completar tu parte del frontend.

---

## 📊 TU RESPONSABILIDAD

Debes crear **3 páginas** y **7 componentes** del sistema POA.

| Categoría | Archivos | Tiempo Estimado |
|-----------|----------|-----------------|
| **Página Seguimiento** | 4 archivos | 2 horas |
| **Página Gastos** | 3 archivos | 1.5 horas |
| **Página Evidencias** | 3 archivos | 1.5 horas |
| **TOTAL** | **10 archivos** | **5 horas** |

---

## 📋 CHECKLIST DE TUS TAREAS

### ✅ Antes de empezar (15 min)
- [ ] Leer esta guía completa
- [ ] Revisar `frontend/src/services/README.md`
- [ ] Abrir los prototipos HTML en el navegador:
  - `docs/Sistema de Gestión de POA/page2.html`
  - `docs/Sistema de Gestión de POA/gastos.html`
  - `docs/Sistema de Gestión de POA/evidencias.html`

### 📄 Página 1: Seguimiento (2 horas)
- [ ] `components/Seguimiento/SeguimientoTable.tsx` (45 min)
- [ ] `components/Seguimiento/ProgressBar.tsx` (15 min)
- [ ] `components/Proyecto/IndicadorCard.tsx` (30 min)
- [ ] `pages/ProyectoSeguimiento.tsx` (30 min)

### 📄 Página 2: Gastos (1.5 horas)
- [ ] `components/Gastos/GastoForm.tsx` (30 min)
- [ ] `components/Gastos/GastosTable.tsx` (30 min)
- [ ] `pages/ActividadGastos.tsx` (30 min)

### 📄 Página 3: Evidencias (1.5 horas)
- [ ] `components/Evidencias/EvidenciaUpload.tsx` (30 min)
- [ ] `components/Evidencias/EvidenciasTable.tsx` (30 min)
- [ ] `pages/ActividadEvidencias.tsx` (30 min)

---

## 📋 PASO 0: VERIFICAR REQUISITOS (2 min)

**Antes de empezar, verifica que Carlos haya terminado:**

### ✅ Checklist de requisitos
- [ ] Los services existen:
  - `src/services/apiClient.ts`
  - `src/services/authApi.ts`
  - `src/services/poaApi.ts`
- [ ] Los tipos existen:
  - `src/types/index.ts`
- [ ] El backend está corriendo:
  - `http://localhost:5000` responde
- [ ] El frontend está corriendo:
  - `http://localhost:3000` responde

**Si falta algo, avísale a Carlos antes de empezar.**

---

## 🚀 PASO 1: CONFIGURACIÓN INICIAL (5 min)

### 1. Abrir el proyecto
```bash
cd frontend
code .
```

### 2. Instalar dependencias (si no lo has hecho)
```bash
npm install
```

### 3. Iniciar el servidor
```bash
npm run dev
```

Deberías ver:
```
➜  Local:   http://localhost:3000/
```

### 4. Verificar que los services existen
Abre VS Code y verifica que existen estos archivos:
- ✅ `src/services/apiClient.ts`
- ✅ `src/services/authApi.ts`
- ✅ `src/services/poaApi.ts`

**Si no existen, avísale a Carlos.**

---

## 📄 TAREA 1: PÁGINA DE SEGUIMIENTO (2 horas)

### Objetivo
Migrar `page2.html` a React con TypeScript.

### Archivos a crear

#### 1.1. SeguimientoTable.tsx (45 min)

**Ubicación:** `src/components/Seguimiento/SeguimientoTable.tsx`

**🎯 OBJETIVO:**
Crear una tabla tipo Gantt que muestre el avance mensual de cada actividad del proyecto. Esta tabla permite al usuario actualizar el estado de cada actividad por mes.

**📋 QUÉ DEBE HACER:**
1. Mostrar una tabla con:
   - Filas: Una por cada actividad
   - Columnas: 12 meses del año (Ene-Dic)
2. En cada celda, mostrar un select con 4 opciones:
   - `-` = No planificado
   - `P` = Planificado
   - `I` = Iniciado
   - `F` = Finalizado
3. Cuando el usuario cambie un estado:
   - Llamar a `poaApi.updateSeguimientoMensual()`
   - Actualizar la tabla automáticamente
4. Cargar los estados guardados desde el backend

**💡 EJEMPLO DE USO:**
Si una actividad "Capacitación docente" está en Enero con estado "F" (Finalizado) y en Febrero con estado "I" (Iniciado), la tabla debe mostrar esos estados en los selects correspondientes.

**Código base:**
```typescript
import React, { useState } from 'react';
import { Actividad, MesSeguimiento } from '@/types';
import { poaApi } from '@/services/poaApi';

interface SeguimientoTableProps {
  actividades: Actividad[];
  onUpdate: () => void;
}

export const SeguimientoTable: React.FC<SeguimientoTableProps> = ({ actividades, onUpdate }) => {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const handleEstadoChange = async (actividadId: number, mes: number, estado: string) => {
    try {
      const seguimiento: MesSeguimiento[] = [{ mes, estado: estado as any, comentario: '' }];
      await poaApi.updateSeguimientoMensual(actividadId, seguimiento);
      onUpdate();
    } catch (error) {
      console.error('Error al actualizar seguimiento:', error);
    }
  };

  const getEstado = (actividad: Actividad, mes: number): string => {
    const seguimiento = actividad.seguimiento_mensual?.find(s => s.mes === mes);
    return seguimiento?.estado || '-';
  };

  return (
    <table className="seguimiento-table">
      <thead>
        <tr>
          <th>Actividad</th>
          {meses.map((mes, i) => <th key={i}>{mes}</th>)}
        </tr>
      </thead>
      <tbody>
        {actividades.map(actividad => (
          <tr key={actividad.id_actividad}>
            <td>{actividad.nombre}</td>
            {meses.map((_, mes) => (
              <td key={mes}>
                <select
                  value={getEstado(actividad, mes + 1)}
                  onChange={(e) => handleEstadoChange(actividad.id_actividad, mes + 1, e.target.value)}
                >
                  <option value="-">-</option>
                  <option value="P">P</option>
                  <option value="I">I</option>
                  <option value="F">F</option>
                </select>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

**Instrucciones:**
1. Crea la carpeta `src/components/Seguimiento/`
2. Crea el archivo `SeguimientoTable.tsx`
3. Copia el código base
4. Agrega estilos CSS si es necesario

---

#### 1.2. ProgressBar.tsx (15 min)

**Ubicación:** `src/components/Seguimiento/ProgressBar.tsx`

**🎯 OBJETIVO:**
Crear un componente reutilizable que muestre visualmente el progreso de algo (actividad, indicador, etc.) mediante una barra de color.

**📋 QUÉ DEBE HACER:**
1. Recibir un número de 0 a 100 (porcentaje)
2. Mostrar una barra horizontal:
   - Fondo gris claro
   - Relleno verde que ocupa el % indicado
3. Mostrar el porcentaje dentro de la barra
4. Opcional: Recibir un label (texto descriptivo)

**💡 EJEMPLO DE USO:**
```typescript
<ProgressBar percentage={75} label="Avance de actividad" />
// Muestra: [████████████████████░░░░░] 75%
```

**Código base:**
```typescript
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, label }) => {
  return (
    <div className="progress-bar-container">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};
```

**CSS sugerido:**
```css
.progress-bar-container {
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 25px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: width 0.3s ease;
}
```

---

#### 1.3. IndicadorCard.tsx (30 min)

**Ubicación:** `src/components/Proyecto/IndicadorCard.tsx`

**🎯 OBJETIVO:**
Crear una tarjeta que muestre la información de un indicador de logro (KPI) de una actividad, incluyendo su meta, avance actual y porcentaje de cumplimiento.

**📋 QUÉ DEBE HACER:**
1. Mostrar:
   - Nombre del indicador (ej: "Docentes capacitados")
   - Meta: Número objetivo (ej: 50 personas)
   - Logrado: Número actual (ej: 30 personas)
   - Barra de progreso con % de cumplimiento
   - Beneficiarios directos/indirectos (si existen)
2. Usar el componente `ProgressBar` para mostrar el avance
3. Formatear los números con su unidad de medida

**💡 EJEMPLO DE USO:**
Si el indicador es "Docentes capacitados" con meta de 50 y se han capacitado 30, debe mostrar:
```
Docentes capacitados
Meta: 50 personas
Logrado: 30 personas
[████████████░░░░░░░░] 60%
Beneficiarios directos: 500
```

**Código base:**
```typescript
import React from 'react';
import { Indicador } from '@/types';
import { ProgressBar } from '@/components/Seguimiento/ProgressBar';

interface IndicadorCardProps {
  indicador: Indicador;
}

export const IndicadorCard: React.FC<IndicadorCardProps> = ({ indicador }) => {
  return (
    <div className="indicador-card">
      <h4>{indicador.nombre}</h4>
      <p>Meta: {indicador.meta} {indicador.unidad_medida}</p>
      <p>Logrado: {indicador.valor_logrado} {indicador.unidad_medida}</p>
      <ProgressBar percentage={indicador.porcentaje_cumplimiento} />
      {indicador.beneficiarios_directos && (
        <p>Beneficiarios directos: {indicador.beneficiarios_directos}</p>
      )}
    </div>
  );
};
```

---

#### 1.4. ProyectoSeguimiento.tsx (30 min)

**Ubicación:** `src/pages/ProyectoSeguimiento.tsx`

**🎯 OBJETIVO:**
Crear la página completa de seguimiento del proyecto (equivalente a `page2.html`). Esta es la página donde los usuarios actualizan el avance mensual de las actividades.

**📋 QUÉ DEBE HACER:**
1. Obtener el ID del proyecto desde la URL (usando `useParams`)
2. Cargar todas las actividades con su seguimiento:
   - Llamar a `poaApi.getSeguimiento(proyectoId)`
3. Mostrar dos secciones:
   - **Gantt Mensual:** Tabla con estados por mes (usar `SeguimientoTable`)
   - **Indicadores:** Tarjetas con el avance de cada indicador (usar `IndicadorCard`)
4. Mostrar un mensaje de "Cargando..." mientras se obtienen los datos
5. Actualizar la página cuando se cambie un estado en el Gantt

**💡 FLUJO DE USUARIO:**
1. Usuario entra a `/proyectos/5/seguimiento`
2. Se cargan las actividades del proyecto 5
3. Usuario ve la tabla Gantt y puede cambiar estados
4. Usuario ve las tarjetas de indicadores con su avance
5. Al cambiar un estado, la tabla se actualiza automáticamente

**Código base:**
```typescript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Actividad } from '@/types';
import { poaApi } from '@/services/poaApi';
import { SeguimientoTable } from '@/components/Seguimiento/SeguimientoTable';
import { IndicadorCard } from '@/components/Proyecto/IndicadorCard';

const ProyectoSeguimiento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarSeguimiento = async () => {
    try {
      const { data } = await poaApi.getSeguimiento(Number(id));
      setActividades(data);
    } catch (error) {
      console.error('Error al cargar seguimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSeguimiento();
  }, [id]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="proyecto-seguimiento">
      <h1>Seguimiento del Proyecto</h1>
      
      <section>
        <h2>Gantt Mensual</h2>
        <SeguimientoTable actividades={actividades} onUpdate={cargarSeguimiento} />
      </section>

      <section>
        <h2>Indicadores</h2>
        <div className="indicadores-grid">
          {actividades.map(actividad => 
            actividad.indicadores?.map(indicador => (
              <IndicadorCard key={indicador.id_indicador} indicador={indicador} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProyectoSeguimiento;
```

---

## 📄 TAREA 2: PÁGINA DE GASTOS (1.5 horas)

### Objetivo
Migrar `gastos.html` a React con TypeScript.

### Archivos a crear

#### 2.1. GastoForm.tsx (30 min)

**Ubicación:** `src/components/Gastos/GastoForm.tsx`

**🎯 OBJETIVO:**
Crear un formulario para registrar un nuevo gasto de una actividad. Este formulario captura la fecha, descripción y monto del gasto.

**📋 QUÉ DEBE HACER:**
1. Mostrar 3 campos:
   - **Fecha:** Input tipo date
   - **Descripción:** Input de texto (ej: "Material didáctico")
   - **Monto:** Input numérico (ej: 500.00)
2. Validar que todos los campos estén llenos
3. Al hacer submit:
   - Llamar a la función `onSubmit` con los datos
   - El componente padre se encarga de guardar en el backend
4. Botón "Cancelar" para cerrar el formulario

**💡 EJEMPLO DE USO:**
Usuario llena:
- Fecha: 2026-01-15
- Descripción: "Compra de laptops"
- Monto: 5000
Al dar "Guardar", se crea el gasto en el backend.

**Código base:**
```typescript
import React, { useState } from 'react';
import { Gasto } from '@/types';

interface GastoFormProps {
  onSubmit: (gasto: Partial<Gasto>) => void;
  onCancel: () => void;
}

export const GastoForm: React.FC<GastoFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fecha_gasto: '',
    descripcion: '',
    monto: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="gasto-form">
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={formData.fecha_gasto}
          onChange={(e) => setFormData({ ...formData, fecha_gasto: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Monto:</label>
        <input
          type="number"
          value={formData.monto}
          onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};
```

---

#### 2.2. GastosTable.tsx (30 min)

**Ubicación:** `src/components/Gastos/GastosTable.tsx`

**🎯 OBJETIVO:**
Crear una tabla que liste todos los gastos de una actividad, mostrando fecha, descripción, monto y quién lo registró. Debe calcular el total automáticamente.

**📋 QUÉ DEBE HACER:**
1. Mostrar una tabla con columnas:
   - Fecha (formato: dd/mm/yyyy)
   - Descripción
   - Monto (formato: $X,XXX.XX)
   - Registrado por (nombre del usuario)
   - Acciones (botón Eliminar)
2. En el footer de la tabla:
   - Mostrar el **Total** de todos los gastos
3. Botón "Eliminar" en cada fila:
   - Al hacer clic, llamar a `onDelete(gastoId)`
4. Si no hay gastos, mostrar mensaje "No hay gastos registrados"

**💡 EJEMPLO:**
```
| Fecha      | Descripción        | Monto    | Registrado por | Acciones |
|------------|-------------------|----------|----------------|----------|
| 15/01/2026 | Material didáctico| $500.00  | Juan Pérez     | [Eliminar]|
| 20/01/2026 | Transporte        | $150.00  | María López    | [Eliminar]|
|------------|-------------------|----------|----------------|----------|
| TOTAL:                          | $650.00  |                |          |
```

**Código base:**
```typescript
import React from 'react';
import { Gasto } from '@/types';

interface GastosTableProps {
  gastos: Gasto[];
  onDelete: (id: number) => void;
}

export const GastosTable: React.FC<GastosTableProps> = ({ gastos, onDelete }) => {
  const total = gastos.reduce((sum, g) => sum + g.monto, 0);

  return (
    <div>
      <table className="gastos-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Registrado por</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map(gasto => (
            <tr key={gasto.id_gasto}>
              <td>{new Date(gasto.fecha_gasto).toLocaleDateString()}</td>
              <td>{gasto.descripcion}</td>
              <td>${gasto.monto.toFixed(2)}</td>
              <td>{gasto.registrado_por_nombre}</td>
              <td>
                <button onClick={() => onDelete(gasto.id_gasto)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}><strong>Total:</strong></td>
            <td><strong>${total.toFixed(2)}</strong></td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
```

---

#### 2.3. ActividadGastos.tsx (30 min)

**Ubicación:** `src/pages/ActividadGastos.tsx`

**🎯 OBJETIVO:**
Crear la página completa de gestión de gastos de una actividad (equivalente a `gastos.html`). Permite ver, crear y eliminar gastos.

**📋 QUÉ DEBE HACER:**
1. Obtener el ID de la actividad desde la URL
2. Cargar todos los gastos de esa actividad:
   - Llamar a `poaApi.getGastos(actividadId)`
3. Mostrar:
   - Título: "Gastos de la Actividad"
   - Botón "Nuevo Gasto"
   - Tabla con todos los gastos (usar `GastosTable`)
4. Al hacer clic en "Nuevo Gasto":
   - Mostrar el formulario (usar `GastoForm`)
5. Al guardar un gasto:
   - Llamar a `poaApi.crearGasto()`
   - Ocultar el formulario
   - Recargar la lista de gastos
6. Al eliminar un gasto:
   - Pedir confirmación
   - Llamar a `poaApi.deleteGasto()`
   - Recargar la lista

**💡 FLUJO DE USUARIO:**
1. Usuario entra a `/actividades/10/gastos`
2. Ve la lista de gastos de la actividad 10
3. Hace clic en "Nuevo Gasto"
4. Llena el formulario y guarda
5. El gasto aparece en la tabla
6. Puede eliminar gastos con el botón "Eliminar"

**Código base:**
```typescript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gasto } from '@/types';
import { poaApi } from '@/services/poaApi';
import { GastoForm } from '@/components/Gastos/GastoForm';
import { GastosTable } from '@/components/Gastos/GastosTable';

const ActividadGastos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [showForm, setShowForm] = useState(false);

  const cargarGastos = async () => {
    try {
      const { data } = await poaApi.getGastos(Number(id));
      setGastos(data);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    }
  };

  useEffect(() => {
    cargarGastos();
  }, [id]);

  const handleCrearGasto = async (gasto: Partial<Gasto>) => {
    try {
      await poaApi.crearGasto(Number(id), gasto);
      setShowForm(false);
      cargarGastos();
    } catch (error) {
      console.error('Error al crear gasto:', error);
    }
  };

  const handleEliminarGasto = async (gastoId: number) => {
    if (confirm('¿Eliminar este gasto?')) {
      try {
        await poaApi.deleteGasto(gastoId);
        cargarGastos();
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
      }
    }
  };

  return (
    <div className="actividad-gastos">
      <h1>Gastos de la Actividad</h1>
      
      <button onClick={() => setShowForm(true)}>Nuevo Gasto</button>

      {showForm && (
        <GastoForm 
          onSubmit={handleCrearGasto} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <GastosTable gastos={gastos} onDelete={handleEliminarGasto} />
    </div>
  );
};

export default ActividadGastos;
```

---

## 📄 TAREA 3: PÁGINA DE EVIDENCIAS (1.5 horas)

### Objetivo
Migrar `evidencias.html` a React con TypeScript.

### Archivos a crear

#### 3.1. EvidenciaUpload.tsx (30 min)

**Ubicación:** `src/components/Evidencias/EvidenciaUpload.tsx`

**🎯 OBJETIVO:**
Crear un formulario para subir archivos (evidencias) de una actividad. Permite seleccionar un archivo, elegir su tipo y agregar una descripción.

**📋 QUÉ DEBE HACER:**
1. Mostrar 3 campos:
   - **Archivo:** Input tipo file (acepta cualquier archivo)
   - **Tipo:** Select con opciones:
     - Fotografía
     - Documento
     - Video
     - Otro
   - **Descripción:** Textarea (ej: "Foto del evento de capacitación")
2. Validar que se haya seleccionado un archivo
3. Al hacer submit:
   - Crear un `FormData` con el archivo y los datos
   - Llamar a `onSubmit(formData)`
   - El componente padre se encarga de subir al backend
4. Botón "Cancelar" para cerrar el formulario

**💡 EJEMPLO DE USO:**
Usuario:
1. Selecciona archivo: `foto_evento.jpg`
2. Elige tipo: "Fotografía"
3. Escribe descripción: "Foto grupal del evento"
4. Da clic en "Subir"
5. El archivo se sube al servidor

**⚠️ IMPORTANTE:**
Debes usar `FormData` para enviar archivos:
```typescript
const formData = new FormData();
formData.append('file', archivo);
formData.append('tipo_evidencia', tipo);
formData.append('descripcion', descripcion);
```

**Código base:**
```typescript
import React, { useState } from 'react';

interface EvidenciaUploadProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export const EvidenciaUpload: React.FC<EvidenciaUploadProps> = ({ onSubmit, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo_evidencia', tipo);
    formData.append('descripcion', descripcion);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="evidencia-form">
      <div>
        <label>Archivo:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      <div>
        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          <option value="">Seleccionar...</option>
          <option value="Fotografía">Fotografía</option>
          <option value="Documento">Documento</option>
          <option value="Video">Video</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">Subir</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};
```

---

#### 3.2. EvidenciasTable.tsx (30 min)

**Ubicación:** `src/components/Evidencias/EvidenciasTable.tsx`

**🎯 OBJETIVO:**
Crear una tabla que liste todas las evidencias (archivos) de una actividad, mostrando tipo, descripción, enlace al archivo y quién lo subió.

**📋 QUÉ DEBE HACER:**
1. Mostrar una tabla con columnas:
   - Tipo (Fotografía, Documento, Video, Otro)
   - Descripción
   - Archivo (enlace para descargar/ver)
   - Fecha de subida (formato: dd/mm/yyyy)
   - Subido por (nombre del usuario)
   - Acciones (botón Eliminar)
2. El enlace "Ver archivo" debe:
   - Abrir el archivo en una nueva pestaña
   - Usar `target="_blank"`
3. Botón "Eliminar" en cada fila:
   - Al hacer clic, llamar a `onDelete(evidenciaId)`
4. Si no hay evidencias, mostrar mensaje "No hay evidencias registradas"

**💡 EJEMPLO:**
```
| Tipo       | Descripción      | Archivo      | Fecha      | Subido por  | Acciones |
|------------|------------------|--------------|------------|-------------|----------|
| Fotografía | Foto del evento  | [Ver archivo]| 15/01/2026 | Juan Pérez  | [Eliminar]|
| Documento  | Lista asistencia | [Ver archivo]| 20/01/2026 | María López | [Eliminar]|
```

**Código base:**
```typescript
import React from 'react';
import { Evidencia } from '@/types';

interface EvidenciasTableProps {
  evidencias: Evidencia[];
  onDelete: (id: number) => void;
}

export const EvidenciasTable: React.FC<EvidenciasTableProps> = ({ evidencias, onDelete }) => {
  return (
    <table className="evidencias-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Archivo</th>
          <th>Fecha</th>
          <th>Subido por</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {evidencias.map(evidencia => (
          <tr key={evidencia.id_evidencia}>
            <td>{evidencia.tipo_evidencia}</td>
            <td>{evidencia.descripcion}</td>
            <td>
              <a href={evidencia.ruta_archivo} target="_blank" rel="noopener noreferrer">
                Ver archivo
              </a>
            </td>
            <td>{new Date(evidencia.fecha_subida).toLocaleDateString()}</td>
            <td>{evidencia.subido_por_nombre}</td>
            <td>
              <button onClick={() => onDelete(evidencia.id_evidencia)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

#### 3.3. ActividadEvidencias.tsx (30 min)

**Ubicación:** `src/pages/ActividadEvidencias.tsx`

**🎯 OBJETIVO:**
Crear la página completa de gestión de evidencias de una actividad (equivalente a `evidencias.html`). Permite ver, subir y eliminar archivos.

**📋 QUÉ DEBE HACER:**
1. Obtener el ID de la actividad desde la URL
2. Cargar todas las evidencias de esa actividad:
   - Llamar a `poaApi.getEvidencias(actividadId)`
3. Mostrar:
   - Título: "Evidencias de la Actividad"
   - Botón "Subir Evidencia"
   - Tabla con todas las evidencias (usar `EvidenciasTable`)
4. Al hacer clic en "Subir Evidencia":
   - Mostrar el formulario (usar `EvidenciaUpload`)
5. Al subir una evidencia:
   - Llamar a `poaApi.subirEvidencia(actividadId, formData)`
   - Ocultar el formulario
   - Recargar la lista de evidencias
6. Al eliminar una evidencia:
   - Pedir confirmación
   - Llamar a `poaApi.deleteEvidencia()`
   - Recargar la lista

**💡 FLUJO DE USUARIO:**
1. Usuario entra a `/actividades/10/evidencias`
2. Ve la lista de evidencias de la actividad 10
3. Hace clic en "Subir Evidencia"
4. Selecciona un archivo, elige tipo y descripción
5. Da clic en "Subir"
6. La evidencia aparece en la tabla
7. Puede ver el archivo haciendo clic en "Ver archivo"
8. Puede eliminar evidencias con el botón "Eliminar"

**⚠️ IMPORTANTE:**
La función `subirEvidencia` recibe un `FormData`, no un objeto JSON normal.

**Código base:**
```typescript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Evidencia } from '@/types';
import { poaApi } from '@/services/poaApi';
import { EvidenciaUpload } from '@/components/Evidencias/EvidenciaUpload';
import { EvidenciasTable } from '@/components/Evidencias/EvidenciasTable';

const ActividadEvidencias: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [showForm, setShowForm] = useState(false);

  const cargarEvidencias = async () => {
    try {
      const { data } = await poaApi.getEvidencias(Number(id));
      setEvidencias(data);
    } catch (error) {
      console.error('Error al cargar evidencias:', error);
    }
  };

  useEffect(() => {
    cargarEvidencias();
  }, [id]);

  const handleSubirEvidencia = async (formData: FormData) => {
    try {
      await poaApi.subirEvidencia(Number(id), formData);
      setShowForm(false);
      cargarEvidencias();
    } catch (error) {
      console.error('Error al subir evidencia:', error);
    }
  };

  const handleEliminarEvidencia = async (evidenciaId: number) => {
    if (confirm('¿Eliminar esta evidencia?')) {
      try {
        await poaApi.deleteEvidencia(evidenciaId);
        cargarEvidencias();
      } catch (error) {
        console.error('Error al eliminar evidencia:', error);
      }
    }
  };

  return (
    <div className="actividad-evidencias">
      <h1>Evidencias de la Actividad</h1>
      
      <button onClick={() => setShowForm(true)}>Subir Evidencia</button>

      {showForm && (
        <EvidenciaUpload 
          onSubmit={handleSubirEvidencia} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <EvidenciasTable evidencias={evidencias} onDelete={handleEliminarEvidencia} />
    </div>
  );
};

export default ActividadEvidencias;
```

---

## ✅ CHECKLIST FINAL

### Página Seguimiento
- [ ] `components/Seguimiento/SeguimientoTable.tsx`
- [ ] `components/Seguimiento/ProgressBar.tsx`
- [ ] `components/Proyecto/IndicadorCard.tsx`
- [ ] `pages/ProyectoSeguimiento.tsx`

### Página Gastos
- [ ] `components/Gastos/GastoForm.tsx`
- [ ] `components/Gastos/GastosTable.tsx`
- [ ] `pages/ActividadGastos.tsx`

### Página Evidencias
- [ ] `components/Evidencias/EvidenciaUpload.tsx`
- [ ] `components/Evidencias/EvidenciasTable.tsx`
- [ ] `pages/ActividadEvidencias.tsx`

---

## 🚨 SI TIENES PROBLEMAS

### Error: "Cannot find module '@/types'"
**Solución:** Reinicia el servidor de Vite
```bash
# Ctrl+C para detener
npm run dev
```

### Error: "poaApi is not defined"
**Solución:** Verifica el import
```typescript
import { poaApi } from '@/services/poaApi';
```

### Error al compilar TypeScript
**Solución:** Revisa que los tipos coincidan con `src/types/index.ts`

---

## 📞 COMUNICACIÓN CON CARLOS

**Pregúntale si:**
- No entiendes cómo usar `poaApi`
- Tienes errores de TypeScript
- Necesitas ayuda con los componentes comunes (Modal, Button)

**Avísale cuando:**
- Termines cada página
- Encuentres un bug
- Necesites que pruebe tu código

---

## 🎯 CRITERIOS DE ÉXITO

### Página Seguimiento
- [ ] La tabla Gantt muestra todas las actividades
- [ ] Los selects de estado funcionan
- [ ] Se actualiza el seguimiento en el backend
- [ ] Los indicadores se muestran correctamente

### Página Gastos
- [ ] Se listan todos los gastos
- [ ] Se puede crear un nuevo gasto
- [ ] Se puede eliminar un gasto
- [ ] El total se calcula correctamente

### Página Evidencias
- [ ] Se listan todas las evidencias
- [ ] Se puede subir un archivo
- [ ] Se puede eliminar una evidencia
- [ ] Los archivos se pueden descargar

---

## 📚 RECURSOS ÚTILES

- **Documentación de services:** `frontend/src/services/README.md`
- **Tipos TypeScript:** `frontend/src/types/index.ts`
- **Prototipos HTML:** `docs/Sistema de Gestión de POA/`
- **React + TypeScript:** https://react-typescript-cheatsheet.netlify.app/

---

**¡Éxito Gaby!** 🚀

**Tiempo estimado:** 5 horas
**Archivos a crear:** 10

**Cualquier duda, pregúntale a Carlos.** 💬
