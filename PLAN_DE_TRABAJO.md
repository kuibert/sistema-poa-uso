# 📋 PLAN DE TRABAJO - SISTEMA DE GESTIÓN POA
## Universidad de Sonsonate

**Equipo:** 3 integrantes  
**Stack Tecnológico:** React + Node.js + Express + PostgreSQL  
**Duración estimada:** 4-6 semanas  
**Complejidad:** Fácil a Moderado

---

## 👥 DIVISIÓN DE TAREAS POR INTEGRANTE

### 🔵 **INTEGRANTE 1: Backend Developer (Node.js + PostgreSQL)**

#### Responsabilidades principales:
- Configuración inicial del servidor Node.js + Express
- Implementación de la base de datos PostgreSQL
- Desarrollo de APIs REST
- Autenticación y autorización
- Lógica de negocio del servidor

#### Tareas específicas:

**Sprint 1 (Semana 1-2):**
- ✅ Configurar proyecto Node.js con Express
- ✅ Ejecutar script `base_postgres.sql` en PostgreSQL
- ✅ Configurar conexión a BD con `pg` o `sequelize`
- ✅ Implementar middleware de autenticación (JWT)
- ✅ Crear estructura de carpetas del backend
- ✅ Configurar variables de entorno (.env)

**Sprint 2 (Semana 2-3):**
- ✅ API de Usuarios (CRUD)
- ✅ API de Proyectos (CRUD + filtros)
- ✅ API de Actividades (CRUD + relaciones)
- ✅ API de Planificación mensual
- ✅ API de Seguimiento mensual (estados P/I/F)

**Sprint 3 (Semana 3-4):**
- ✅ API de Indicadores de logro
- ✅ API de Costos (fijos y variables)
- ✅ API de Gastos por actividad
- ✅ API de Evidencias (con upload de archivos)
- ✅ API de Dashboard (cálculos agregados)

**Sprint 4 (Semana 5-6):**
- ✅ Validaciones y manejo de errores
- ✅ Optimización de consultas SQL
- ✅ Testing de endpoints (Postman/Jest)
- ✅ Documentación de API

---

### 🟢 **INTEGRANTE 2: Frontend Developer (React - Módulos principales)**

#### Responsabilidades principales:
- Configuración inicial de React
- Desarrollo de componentes principales
- Integración con APIs del backend
- Gestión de estado (Context API o Redux)
- Páginas de proyectos y actividades

#### Tareas específicas:

**Sprint 1 (Semana 1-2):**
- ✅ Configurar proyecto React (Vite o Create React App)
- ✅ Instalar dependencias (React Router, Axios, etc.)
- ✅ Crear estructura de carpetas
- ✅ Configurar rutas principales
- ✅ Implementar layout base (Header, Sidebar, Footer)
- ✅ Crear sistema de autenticación (Login/Logout)

**Sprint 2 (Semana 2-3):**
- ✅ **MIGRAR page0.html → Dashboard.jsx**
  - Extraer CSS a Dashboard.css
  - Crear componente KPICard.jsx
  - Crear componente ProyectosTable.jsx
  - Crear componente ActividadesMesTable.jsx
  - Reemplazar datos estáticos por llamadas a API
- ✅ Integrar API de Dashboard
- ✅ Gráficos y barras de progreso

**Sprint 3 (Semana 3-4):**
- ✅ **MIGRAR page1.html → RegistroProyecto.jsx**
  - Extraer CSS a RegistroProyecto.css
  - Crear componente ActividadBlock.jsx
  - Crear componente MesesCheckbox.jsx
  - Crear componente IndicadorForm.jsx
  - Crear componente CostosTable.jsx
  - Convertir lógica JavaScript a React hooks
  - Reemplazar datos estáticos por estado de React
- ✅ Integrar APIs de Proyectos y Actividades

**Sprint 4 (Semana 5-6):**
- ✅ Validaciones de formularios
- ✅ Mensajes de éxito/error
- ✅ Optimización de rendimiento
- ✅ Testing de componentes

---

### 🟡 **INTEGRANTE 3: Frontend Developer (React - Módulos de seguimiento)**

#### Responsabilidades principales:
- Desarrollo de módulos de seguimiento
- Implementación de Gantt mensual
- Gestión de gastos y evidencias
- Upload de archivos
- Reportes e impresión

#### Tareas específicas:

**Sprint 1 (Semana 1-2):**
- ✅ Familiarizarse con la estructura del proyecto React
- ✅ Crear componentes reutilizables:
  - Botones personalizados
  - Inputs y formularios
  - Modales
  - Tablas genéricas
- ✅ Implementar estilos globales (CSS/Styled Components)
- ✅ Crear componente de navegación

**Sprint 2 (Semana 2-3):**
- ✅ **MIGRAR page2.html → Seguimiento.jsx**
  - Extraer CSS a Seguimiento.css
  - Crear componente GanttMensual.jsx
  - Crear componente ProgressBar.jsx
  - Convertir selects de estados a componentes React
  - Implementar cálculo de progreso en React
  - Reemplazar datos estáticos por llamadas a API
- ✅ Integrar API de Seguimiento mensual

**Sprint 3 (Semana 3-4):**
- ✅ **MIGRAR gastos.html → Gastos.jsx**
  - Extraer CSS a Gastos.css
  - Crear componente GastoForm.jsx
  - Crear componente GastosTable.jsx
  - Convertir lógica de cálculos a React
  - Reemplazar datos estáticos por estado de React
- ✅ **MIGRAR evidencias.html → Evidencias.jsx**
  - Extraer CSS a Evidencias.css
  - Crear componente EvidenciaUpload.jsx
  - Crear componente EvidenciasTable.jsx
  - Implementar upload con FormData
  - Reemplazar datos estáticos por llamadas a API
- ✅ Integrar APIs de Gastos y Evidencias

**Sprint 4 (Semana 5-6):**
- ✅ Funcionalidad de impresión (PDF)
- ✅ Exportación de datos (Excel/CSV)
- ✅ Filtros y búsquedas
- ✅ Responsive design
- ✅ Testing de componentes

---

## 📅 PLAN DE DESARROLLO (4 SPRINTS)

### **SPRINT 1: Configuración y Fundamentos (Semana 1-2)**

**Objetivo:** Tener la infraestructura base funcionando

**Entregables:**
- ✅ Repositorio Git configurado
- ✅ Backend: Servidor Express corriendo + BD conectada
- ✅ Frontend: Aplicación React corriendo
- ✅ Autenticación básica funcionando
- ✅ Primera API de prueba (Usuarios)

**Reuniones:**
- Kick-off: Día 1 (definir estándares de código)
- Daily standup: 15 min diarios
- Review: Final de semana 2

---

### **SPRINT 2: Módulos Core (Semana 2-3)**

**Objetivo:** Implementar funcionalidades principales de proyectos y dashboard

**Entregables:**
- ✅ APIs de Proyectos, Actividades y Planificación
- ✅ Dashboard funcional con datos reales
- ✅ Formulario de registro de proyectos (50%)
- ✅ Página de seguimiento (estructura base)

**Reuniones:**
- Planning: Inicio de semana 3
- Daily standup: 15 min diarios
- Review + Retrospectiva: Final de semana 3

---

### **SPRINT 3: Funcionalidades Avanzadas (Semana 3-4)**

**Objetivo:** Completar todos los módulos funcionales

**Entregables:**
- ✅ APIs de Indicadores, Costos, Gastos y Evidencias
- ✅ Formulario de registro de proyectos (100%)
- ✅ Página de seguimiento completa con Gantt
- ✅ Módulo de gastos funcional
- ✅ Módulo de evidencias con upload

**Reuniones:**
- Planning: Inicio de semana 4
- Daily standup: 15 min diarios
- Review + Retrospectiva: Final de semana 4

---

### **SPRINT 4: Refinamiento y Testing (Semana 5-6)**

**Objetivo:** Pulir, optimizar y preparar para producción

**Entregables:**
- ✅ Validaciones completas
- ✅ Manejo de errores robusto
- ✅ Testing (unitario y de integración)
- ✅ Documentación técnica
- ✅ Responsive design
- ✅ Funcionalidades de impresión/exportación
- ✅ Deploy en servidor de pruebas

**Reuniones:**
- Planning: Inicio de semana 5
- Daily standup: 15 min diarios
- Review final: Semana 6
- Retrospectiva del proyecto: Semana 6

---

## 🎯 HITOS CLAVE

| Semana | Hito | Responsable |
|--------|------|-------------|
| 1 | Infraestructura base lista | Todos |
| 2 | Primera integración Frontend-Backend | Todos |
| 3 | Dashboard funcional | Integrante 2 |
| 4 | CRUD de proyectos completo | Integrante 1 + 2 |
| 5 | Todos los módulos integrados | Todos |
| 6 | Sistema listo para demo | Todos |

---

## 🛠️ HERRAMIENTAS DE COLABORACIÓN

### Control de versiones:
- **Git + GitHub/GitLab**
- Ramas: `main`, `develop`, `feature/nombre-feature`
- Pull Requests obligatorios antes de merge

### Comunicación:
- **WhatsApp/Telegram:** Comunicación rápida
- **Discord/Slack:** Reuniones y screen sharing
- **Google Meet/Zoom:** Reuniones formales

### Gestión de tareas:
- **Trello/Notion/GitHub Projects**
- Tablero Kanban: To Do → In Progress → Review → Done

### Documentación:
- **README.md** en cada carpeta importante
- **Postman Collection** para APIs
- **Comentarios en código** para lógica compleja

---

## 📊 MÉTRICAS DE ÉXITO

### Sprint 1:
- [ ] Backend responde en puerto 5000
- [ ] Frontend corre en puerto 3000
- [ ] Login funcional

### Sprint 2:
- [ ] Al menos 5 endpoints funcionando
- [ ] Dashboard muestra datos de BD
- [ ] Formulario guarda en BD

### Sprint 3:
- [ ] Todos los endpoints implementados
- [ ] Todas las páginas navegables
- [ ] Upload de archivos funcional

### Sprint 4:
- [ ] 0 errores críticos
- [ ] Responsive en móvil
- [ ] Documentación completa

---

## ⚠️ RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Retraso en configuración inicial | Media | Alto | Dedicar tiempo extra en Sprint 1 |
| Problemas de integración Frontend-Backend | Alta | Alto | Definir contrato de APIs desde el inicio |
| Complejidad del upload de archivos | Media | Medio | Usar librerías probadas (multer, react-dropzone) |
| Falta de tiempo para testing | Alta | Medio | Priorizar testing de funcionalidades críticas |

---

## 📝 NOTAS IMPORTANTES

1. **Comunicación diaria es clave:** 15 min de standup cada día
2. **Commits frecuentes:** Al menos 1 commit por día por persona
3. **Code review:** Revisar código de compañeros antes de merge
4. **Documentar decisiones:** Anotar por qué se tomó cada decisión técnica
5. **No reinventar la rueda:** Usar librerías establecidas cuando sea posible

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### Para empezar HOY:

**Todos:**
1. Crear repositorio Git compartido
2. Clonar repositorio localmente
3. Instalar herramientas necesarias (Node.js, PostgreSQL, VS Code)

**Integrante 1 (Backend):**
1. Crear carpeta `backend/`
2. Ejecutar `npm init -y`
3. Instalar: `express`, `pg`, `dotenv`, `cors`, `jsonwebtoken`
4. Crear estructura de carpetas

**Integrante 2 y 3 (Frontend):**
1. Crear carpeta `frontend/`
2. Ejecutar `npm create vite@latest . -- --template react`
3. Instalar: `react-router-dom`, `axios`
4. Crear estructura de carpetas

---

**¿Dudas o necesitas ajustar algo del plan?** 🤔
