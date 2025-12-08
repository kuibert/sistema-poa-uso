# 📡 SERVICES - API CLIENT

## 📦 Archivos

### `apiClient.ts`
Cliente HTTP base con axios.

**Características:**
- BaseURL: `http://localhost:5000`
- Interceptor de request: Agrega token JWT automáticamente
- Interceptor de response: Maneja errores 401 (redirige a login)

**Uso:**
```typescript
import apiClient from '@/services/apiClient';

const response = await apiClient.get('/api/proyectos');
```

---

### `authApi.ts`
Funciones de autenticación.

**Funciones:**
- `login(credentials)` - Login con email/password
- `me()` - Obtener usuario actual
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar si hay token

**Uso:**
```typescript
import { authApi } from '@/services/authApi';

// Login
const { token, user } = await authApi.login({ 
  email: 'admin@uso.edu.sv', 
  password: '123456' 
});

// Obtener usuario actual
const user = await authApi.me();

// Logout
authApi.logout();

// Verificar autenticación
if (authApi.isAuthenticated()) {
  // Usuario autenticado
}
```

---

### `poaApi.ts`
Funciones de dominio POA (proyectos, actividades, gastos, evidencias).

**Secciones:**

#### Dashboard (Page0)
```typescript
import { poaApi } from '@/services/poaApi';

const dashboard = await poaApi.getDashboard(2026);
const proyectos = await poaApi.getProyectos(2026);
```

#### Planificación (Page1)
```typescript
// Proyectos
const proyecto = await poaApi.crearProyecto({
  nombre: 'Proyecto 2026',
  objetivo: 'Mejorar la calidad educativa',
  anio: 2026,
  presupuesto_total: 50000
});

// Actividades
const actividad = await poaApi.crearActividad(proyectoId, {
  nombre: 'Capacitación docente',
  presupuesto_asignado: 10000
});

// Planificación mensual
await poaApi.updatePlanMensual(actividadId, [
  { mes: 1, planificado: true },
  { mes: 2, planificado: true }
]);

// Indicadores
const indicador = await poaApi.crearIndicador(actividadId, {
  nombre: 'Docentes capacitados',
  unidad_medida: 'personas',
  meta: 50
});
```

#### Seguimiento (Page2)
```typescript
// Obtener seguimiento
const seguimiento = await poaApi.getSeguimiento(proyectoId);

// Actualizar estados mensuales
await poaApi.updateSeguimientoMensual(actividadId, [
  { mes: 1, estado: 'F', comentario: 'Completado' },
  { mes: 2, estado: 'I', comentario: 'En proceso' }
]);

// Actualizar avance de indicador
await poaApi.updateAvanceIndicador(indicadorId, {
  valor_logrado: 30,
  porcentaje_cumplimiento: 60
});
```

#### Gastos
```typescript
// Listar gastos
const gastos = await poaApi.getGastos(actividadId);

// Crear gasto
const gasto = await poaApi.crearGasto(actividadId, {
  fecha_gasto: '2026-01-15',
  descripcion: 'Material didáctico',
  monto: 500
});

// Actualizar gasto
await poaApi.updateGasto(gastoId, { monto: 600 });

// Eliminar gasto
await poaApi.deleteGasto(gastoId);
```

#### Evidencias
```typescript
// Listar evidencias
const evidencias = await poaApi.getEvidencias(actividadId);

// Subir evidencia
const formData = new FormData();
formData.append('file', file);
formData.append('tipo_evidencia', 'Fotografía');
formData.append('descripcion', 'Foto del evento');

const evidencia = await poaApi.subirEvidencia(actividadId, formData);

// Eliminar evidencia
await poaApi.deleteEvidencia(evidenciaId);
```

---

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/login`) requieren token JWT.

El token se guarda automáticamente en `localStorage` al hacer login y se agrega automáticamente en cada request.

---

## 🚨 Manejo de Errores

```typescript
try {
  const proyectos = await poaApi.getProyectos(2026);
} catch (error: any) {
  if (error.response) {
    // Error de respuesta del servidor
    console.error('Error:', error.response.data.error);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    // No hubo respuesta del servidor
    console.error('No hay respuesta del servidor');
  } else {
    // Error al configurar el request
    console.error('Error:', error.message);
  }
}
```

---

## 📋 Endpoints Disponibles

| Método | Endpoint | Función |
|--------|----------|---------|
| **Auth** |
| POST | `/auth/login` | `authApi.login()` |
| GET | `/auth/me` | `authApi.me()` |
| **Dashboard** |
| GET | `/api/proyectos/dashboard?anio=2026` | `poaApi.getDashboard()` |
| GET | `/api/proyectos?anio=2026` | `poaApi.getProyectos()` |
| **Proyectos** |
| POST | `/api/proyectos` | `poaApi.crearProyecto()` |
| GET | `/api/proyectos/:id` | `poaApi.getProyecto()` |
| PUT | `/api/proyectos/:id` | `poaApi.updateProyecto()` |
| DELETE | `/api/proyectos/:id` | `poaApi.deleteProyecto()` |
| **Actividades** |
| POST | `/api/proyectos/:id/actividades` | `poaApi.crearActividad()` |
| PUT | `/api/actividades/:id` | `poaApi.updateActividad()` |
| DELETE | `/api/actividades/:id` | `poaApi.deleteActividad()` |
| **Seguimiento** |
| GET | `/api/proyectos/:id/seguimiento` | `poaApi.getSeguimiento()` |
| PUT | `/api/proyectos/actividades/:id/seguimiento-mensual` | `poaApi.updateSeguimientoMensual()` |
| **Gastos** |
| GET | `/api/actividades/:id/gastos` | `poaApi.getGastos()` |
| POST | `/api/actividades/:id/gastos` | `poaApi.crearGasto()` |
| PUT | `/api/gastos/:id` | `poaApi.updateGasto()` |
| DELETE | `/api/gastos/:id` | `poaApi.deleteGasto()` |
| **Evidencias** |
| GET | `/api/actividades/:id/evidencias` | `poaApi.getEvidencias()` |
| POST | `/api/actividades/:id/evidencias` | `poaApi.subirEvidencia()` |
| DELETE | `/api/evidencias/:id` | `poaApi.deleteEvidencia()` |

---

## ✅ CHECKLIST

- [x] `apiClient.ts` - Cliente HTTP base
- [x] `authApi.ts` - API de autenticación
- [x] `poaApi.ts` - API de POA completa
- [x] Interceptores de request/response
- [x] Manejo de errores 401
- [x] Tipos TypeScript
- [x] Documentación

---

**¡Services listos para usar!** 🎉

**Siguiente paso:** Crear páginas que usen estos services.
