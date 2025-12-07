# ✅ CHECKLIST DE SEGUIMIENTO - SISTEMA POA

## 📊 PROGRESO GENERAL

```
Sprint 1: [░░░░░░░░░░] 0%
Sprint 2: [░░░░░░░░░░] 0%
Sprint 3: [░░░░░░░░░░] 0%
Sprint 4: [░░░░░░░░░░] 0%

TOTAL:    [░░░░░░░░░░] 0%
```

---

## 🔵 INTEGRANTE 1: Backend Developer

### SPRINT 1 - Configuración (Semana 1-2)
- [ ] Crear repositorio Git
- [ ] Crear estructura de carpetas backend
- [ ] Instalar Node.js y dependencias
- [ ] Configurar archivo `.env`
- [ ] Crear `server.js` y `app.js`
- [ ] Configurar conexión a PostgreSQL
- [ ] Ejecutar script `base_postgres.sql`
- [ ] Verificar que las 10 tablas se crearon correctamente
- [ ] Crear middleware de autenticación JWT
- [ ] Implementar endpoint `POST /api/auth/login`
- [ ] Implementar endpoint `POST /api/auth/register`
- [ ] Probar endpoints con Postman
- [ ] Configurar CORS
- [ ] Crear colección de Postman
- [ ] Documentar endpoints en README

**Entregable:** Backend corriendo en puerto 5000 con login funcional

---

### SPRINT 2 - APIs Core (Semana 2-3)
- [ ] Crear `usuarioController.js` y rutas
- [ ] Implementar CRUD de usuarios
- [ ] Crear `proyectoController.js` y rutas
- [ ] Implementar GET `/api/proyectos` (listar)
- [ ] Implementar GET `/api/proyectos/:id` (detalle)
- [ ] Implementar POST `/api/proyectos` (crear)
- [ ] Implementar PUT `/api/proyectos/:id` (actualizar)
- [ ] Implementar DELETE `/api/proyectos/:id` (eliminar)
- [ ] Crear `actividadController.js` y rutas
- [ ] Implementar CRUD de actividades
- [ ] Implementar GET `/api/proyectos/:id/actividades`
- [ ] Crear endpoint para planificación mensual
- [ ] Crear endpoint para seguimiento mensual
- [ ] Probar todos los endpoints
- [ ] Agregar validaciones básicas

**Entregable:** APIs de Usuarios, Proyectos y Actividades funcionando

---

### SPRINT 3 - APIs Avanzadas (Semana 3-4)
- [ ] Crear `indicadorController.js` y rutas
- [ ] Implementar CRUD de indicadores
- [ ] Crear `costoController.js` y rutas
- [ ] Implementar CRUD de costos (fijos y variables)
- [ ] Crear `gastoController.js` y rutas
- [ ] Implementar CRUD de gastos
- [ ] Crear `evidenciaController.js` y rutas
- [ ] Configurar multer para upload de archivos
- [ ] Implementar POST `/api/evidencias` (con archivo)
- [ ] Implementar GET `/api/evidencias/:id/download`
- [ ] Crear `dashboardController.js` y rutas
- [ ] Implementar cálculos de KPIs del portafolio
- [ ] Implementar endpoint de resumen de proyectos
- [ ] Implementar endpoint de actividades del mes
- [ ] Probar upload de archivos

**Entregable:** Todas las APIs implementadas y funcionando

---

### SPRINT 4 - Refinamiento (Semana 5-6)
- [ ] Agregar validaciones con express-validator
- [ ] Implementar manejo de errores robusto
- [ ] Optimizar consultas SQL (índices, joins)
- [ ] Agregar paginación a listados
- [ ] Implementar filtros en GET `/api/proyectos`
- [ ] Agregar logs con morgan
- [ ] Crear tests unitarios (opcional)
- [ ] Documentar API completa
- [ ] Revisar seguridad (SQL injection, XSS)
- [ ] Preparar para deploy
- [ ] Crear script de seeds (datos de prueba)
- [ ] Hacer code review con el equipo

**Entregable:** Backend completo, optimizado y documentado

---

## 🟢 INTEGRANTE 2: Frontend Developer (Módulos principales)

### SPRINT 1 - Configuración (Semana 1-2)
- [ ] Crear proyecto React con Vite
- [ ] Instalar dependencias (react-router-dom, axios)
- [ ] Crear estructura de carpetas frontend
- [ ] Configurar archivo `.env`
- [ ] Configurar React Router
- [ ] Crear componente `Layout.jsx`
- [ ] Crear componente `Header.jsx`
- [ ] Crear página `Login.jsx`
- [ ] Crear `AuthContext.jsx`
- [ ] Configurar Axios en `services/api.js`
- [ ] Implementar login funcional
- [ ] Crear componente `PrivateRoute.jsx`
- [ ] Configurar rutas protegidas
- [ ] Convertir estilos CSS de page0.html
- [ ] Crear componentes reutilizables (Button, Input, Table)

**Entregable:** React corriendo en puerto 3000 con login funcional

---

### SPRINT 2 - Dashboard (Semana 2-3)
- [ ] Crear `dashboardService.js`
- [ ] Crear página `Dashboard.jsx`
- [ ] Crear componente `KPICard.jsx`
- [ ] Implementar sección de KPIs del portafolio
- [ ] Crear componente `ProyectosTable.jsx`
- [ ] Implementar tabla de proyectos activos
- [ ] Crear componente `ActividadesMesTable.jsx`
- [ ] Implementar tabla de actividades del mes
- [ ] Integrar con API de dashboard
- [ ] Implementar barras de progreso
- [ ] Agregar funcionalidad de impresión
- [ ] Hacer responsive el dashboard
- [ ] Probar con datos reales del backend
- [ ] Agregar loading states
- [ ] Agregar manejo de errores

**Entregable:** Dashboard funcional con datos reales

---

### SPRINT 3 - Registro de Proyectos (Semana 3-4)
- [ ] Crear `proyectoService.js`
- [ ] Crear página `RegistroProyecto.jsx`
- [ ] Implementar formulario de información estratégica
- [ ] Implementar formulario de datos del proyecto
- [ ] Crear componente `ActividadBlock.jsx`
- [ ] Implementar gestión dinámica de actividades
- [ ] Crear componente `MesesCheckbox.jsx`
- [ ] Implementar tabla de meses de ejecución
- [ ] Crear componente `IndicadorForm.jsx`
- [ ] Implementar formulario de indicadores
- [ ] Crear componente `CostosTable.jsx`
- [ ] Implementar tabla de costos variables
- [ ] Implementar tabla de costos fijos
- [ ] Implementar cálculo automático de totales
- [ ] Integrar con API de proyectos
- [ ] Agregar validaciones de formulario
- [ ] Implementar modo edición
- [ ] Probar creación y edición de proyectos

**Entregable:** Formulario de registro de proyectos completo

---

### SPRINT 4 - Refinamiento (Semana 5-6)
- [ ] Agregar validaciones en todos los formularios
- [ ] Implementar mensajes de éxito/error
- [ ] Agregar confirmaciones antes de eliminar
- [ ] Optimizar re-renders de componentes
- [ ] Implementar lazy loading de componentes
- [ ] Mejorar UX con loaders y skeletons
- [ ] Hacer responsive todas las páginas
- [ ] Probar en diferentes navegadores
- [ ] Corregir bugs encontrados
- [ ] Hacer code review con el equipo
- [ ] Documentar componentes principales
- [ ] Preparar para deploy

**Entregable:** Módulos principales pulidos y optimizados

---

## 🟡 INTEGRANTE 3: Frontend Developer (Seguimiento y Evidencias)

### SPRINT 1 - Configuración (Semana 1-2)
- [ ] Familiarizarse con estructura del proyecto
- [ ] Crear componentes comunes (Modal, Loader, Alert)
- [ ] Crear componente `Sidebar.jsx`
- [ ] Implementar navegación entre páginas
- [ ] Convertir estilos CSS de page2.html
- [ ] Crear página `NotFound.jsx`
- [ ] Configurar rutas en `routes.jsx`
- [ ] Crear `utils/formatters.js`
- [ ] Crear `utils/constants.js`
- [ ] Documentar componentes creados
- [ ] Ayudar en testing de login
- [ ] Crear componente `ProgressBar.jsx`
- [ ] Crear componente `EstadoPill.jsx`
- [ ] Probar integración con backend

**Entregable:** Componentes base y navegación funcionando

---

### SPRINT 2 - Seguimiento (Semana 2-3)
- [ ] Crear `seguimientoService.js`
- [ ] Crear página `Seguimiento.jsx`
- [ ] Implementar selector de proyecto
- [ ] Crear componente `GanttMensual.jsx`
- [ ] Implementar grid de meses con estados P/I/F
- [ ] Implementar cambio de estados
- [ ] Crear componente `ActividadCard.jsx`
- [ ] Implementar barra de progreso por actividad
- [ ] Mostrar indicadores de cumplimiento
- [ ] Integrar con API de seguimiento
- [ ] Implementar cálculo de progreso automático
- [ ] Agregar botones de evidencias y gastos
- [ ] Implementar navegación a módulos relacionados
- [ ] Probar con múltiples actividades
- [ ] Hacer responsive el Gantt

**Entregable:** Página de seguimiento con Gantt funcional

---

### SPRINT 3 - Gastos y Evidencias (Semana 3-4)
- [ ] Crear `gastoService.js`
- [ ] Crear página `Gastos.jsx`
- [ ] Crear componente `GastoForm.jsx`
- [ ] Implementar formulario de registro de gastos
- [ ] Crear componente `GastosTable.jsx`
- [ ] Implementar tabla de gastos
- [ ] Implementar cálculo de disponible
- [ ] Integrar con API de gastos
- [ ] Crear `evidenciaService.js`
- [ ] Crear página `Evidencias.jsx`
- [ ] Crear componente `EvidenciaUpload.jsx`
- [ ] Implementar upload de archivos
- [ ] Crear componente `EvidenciasTable.jsx`
- [ ] Implementar tabla de evidencias
- [ ] Implementar descarga de archivos
- [ ] Integrar con API de evidencias
- [ ] Probar upload de diferentes tipos de archivo
- [ ] Agregar validaciones de tamaño y tipo

**Entregable:** Módulos de gastos y evidencias completos

---

### SPRINT 4 - Refinamiento (Semana 5-6)
- [ ] Implementar funcionalidad de impresión (PDF)
- [ ] Implementar exportación a Excel/CSV
- [ ] Agregar filtros en tablas
- [ ] Implementar búsqueda en listados
- [ ] Hacer responsive todas las páginas
- [ ] Optimizar carga de archivos grandes
- [ ] Agregar preview de imágenes
- [ ] Implementar paginación en tablas
- [ ] Probar en móviles y tablets
- [ ] Corregir bugs encontrados
- [ ] Hacer code review con el equipo
- [ ] Documentar componentes
- [ ] Preparar para deploy

**Entregable:** Módulos de seguimiento pulidos y optimizados

---

## 🎯 HITOS CLAVE DEL PROYECTO

### Semana 1
- [ ] Repositorio Git creado y compartido
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Base de datos PostgreSQL configurada
- [ ] Primera reunión de equipo completada

### Semana 2
- [ ] Login funcional (Frontend + Backend integrados)
- [ ] Primera API funcionando (Usuarios o Proyectos)
- [ ] Componentes base del frontend creados
- [ ] Reunión de review Sprint 1

### Semana 3
- [ ] APIs de Proyectos y Actividades completas
- [ ] Dashboard mostrando datos reales
- [ ] Formulario de proyectos al 50%
- [ ] Reunión de review Sprint 2

### Semana 4
- [ ] Todas las APIs implementadas
- [ ] Formulario de proyectos completo
- [ ] Página de seguimiento funcional
- [ ] Reunión de review Sprint 3

### Semana 5
- [ ] Módulos de gastos y evidencias completos
- [ ] Upload de archivos funcionando
- [ ] Todas las páginas navegables
- [ ] Testing de integración

### Semana 6
- [ ] Sistema completo funcionando
- [ ] Responsive en todos los dispositivos
- [ ] Documentación completa
- [ ] Demo final preparada
- [ ] Reunión de retrospectiva del proyecto

---

## 📈 MÉTRICAS DE CALIDAD

### Backend
- [ ] Todos los endpoints responden correctamente
- [ ] Manejo de errores implementado
- [ ] Validaciones en todos los inputs
- [ ] Consultas SQL optimizadas
- [ ] Documentación de API completa
- [ ] 0 errores críticos

### Frontend
- [ ] Todas las páginas navegables
- [ ] Integración con backend funcional
- [ ] Responsive en móvil y desktop
- [ ] Validaciones de formularios
- [ ] Manejo de estados de carga
- [ ] Manejo de errores
- [ ] 0 errores en consola

### General
- [ ] Código comentado donde es necesario
- [ ] Commits con mensajes descriptivos
- [ ] README actualizado
- [ ] Variables de entorno documentadas
- [ ] Sistema probado end-to-end

---

## 🚨 ALERTAS Y BLOQUEOS

### Registrar aquí cualquier problema:

**Fecha:** ___________  
**Integrante:** ___________  
**Problema:** ___________  
**Estado:** [ ] Bloqueado [ ] En progreso [ ] Resuelto  
**Solución:** ___________

---

## 📝 NOTAS DE REUNIONES

### Reunión 1 - Kick-off (Fecha: _______)
**Asistentes:**
- [ ] Integrante 1
- [ ] Integrante 2
- [ ] Integrante 3

**Acuerdos:**
- 
- 
- 

**Próxima reunión:** ___________

---

### Reunión 2 - Review Sprint 1 (Fecha: _______)
**Logros:**
- 
- 

**Problemas:**
- 
- 

**Próximos pasos:**
- 
- 

---

### Reunión 3 - Review Sprint 2 (Fecha: _______)
**Logros:**
- 
- 

**Problemas:**
- 
- 

**Próximos pasos:**
- 
- 

---

### Reunión 4 - Review Sprint 3 (Fecha: _______)
**Logros:**
- 
- 

**Problemas:**
- 
- 

**Próximos pasos:**
- 
- 

---

### Reunión 5 - Review Final (Fecha: _______)
**Logros del proyecto:**
- 
- 

**Lecciones aprendidas:**
- 
- 

**Mejoras para futuros proyectos:**
- 
- 

---

## 🎉 CELEBRACIÓN

**Fecha de finalización:** ___________  
**Sistema entregado:** [ ] Sí [ ] No  
**Demo exitosa:** [ ] Sí [ ] No  

**¡Felicitaciones al equipo!** 🎊

---

**Última actualización:** ___________  
**Actualizado por:** ___________
