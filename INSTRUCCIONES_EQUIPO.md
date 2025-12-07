# 🚀 INSTRUCCIONES PARA EL EQUIPO

## 👥 Equipo de Desarrollo

- **Moris (Tú):** Coordinador + Frontend
- **Salvador:** Backend (Node.js + PostgreSQL)
- **Gabi:** Frontend (React)

---

## 📋 PASO 1: Clonar el Repositorio

Cuando crees el repositorio en GitHub/GitLab, cada integrante debe:

```bash
git clone <url-del-repositorio>
cd POA DEVELOPMENT
```

---

## 🔵 SALVADOR (Backend)

### Configuración Inicial (30 min)

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar base de datos:**
```bash
# Copiar archivo de ejemplo
copy .env.example .env

# Editar .env con tus credenciales de PostgreSQL
```

3. **Crear base de datos:**
```bash
psql -U postgres
CREATE DATABASE poa_db;
\q

# Ejecutar script
psql -U postgres -d poa_db -f ../database/base_postgres.sql
```

4. **Iniciar servidor:**
```bash
npm run dev
```

Deberías ver: `🚀 Servidor corriendo en puerto 5000`

### Tareas Semana 1:
- [ ] Implementar `authController.js` (login/register)
- [ ] Crear `authRoutes.js`
- [ ] Probar endpoints con Postman
- [ ] Documentar en README

**Archivos a crear:**
- `src/controllers/authController.js`
- `src/routes/authRoutes.js`
- `src/middlewares/authMiddleware.js`

Ver `EJEMPLOS_CODIGO.md` para código de ejemplo.

---

## 🟢 GABI (Frontend)

### Configuración Inicial (30 min)

1. **Instalar dependencias:**
```bash
cd frontend
npm install
```

2. **Configurar variables:**
```bash
# Copiar archivo de ejemplo
copy .env.example .env
```

3. **Iniciar aplicación:**
```bash
npm run dev
```

Deberías ver: `Local: http://localhost:3000`

### Tareas Semana 1:
- [ ] Crear página `Login.jsx`
- [ ] Crear `AuthContext.jsx`
- [ ] Crear componentes comunes (Button, Input)
- [ ] Probar login con backend de Salvador

**Archivos a crear:**
- `src/pages/Login.jsx`
- `src/context/AuthContext.jsx`
- `src/services/api.js`
- `src/components/common/Button.jsx`

Ver `GUIA_MIGRACION_HTML_A_REACT.md` para ejemplos.

---

## 📅 Cronograma Semanal

### Semana 1 (Configuración)
- **Salvador:** Backend base + Login API
- **Gabi:** Frontend base + Login página
- **Moris:** Coordinar + Ayudar donde se necesite

### Semana 2 (Dashboard)
- **Salvador:** APIs de Proyectos y Actividades
- **Gabi:** Migrar page0.html → Dashboard.jsx
- **Moris:** Migrar page2.html → Seguimiento.jsx

### Semana 3 (Formularios)
- **Salvador:** APIs de Costos, Gastos, Evidencias
- **Gabi:** Migrar page1.html → RegistroProyecto.jsx
- **Moris:** Migrar gastos.html y evidencias.html

### Semana 4 (Refinamiento)
- **Todos:** Testing, correcciones, documentación

---

## 🔗 Comunicación

### Daily Standup (15 min diarios)
Cada quien responde:
1. ¿Qué hice ayer?
2. ¿Qué haré hoy?
3. ¿Tengo algún bloqueo?

### Grupo de WhatsApp/Telegram
- Dudas rápidas
- Compartir avances
- Coordinar reuniones

### GitHub/GitLab
- Issues para bugs
- Pull Requests para code review
- Commits descriptivos

---

## 📚 Documentos Importantes

1. **PLAN_DE_TRABAJO.md** - Plan completo del proyecto
2. **EJEMPLOS_CODIGO.md** - Código para copiar (Backend)
3. **GUIA_MIGRACION_HTML_A_REACT.md** - Guía para migrar HTML
4. **EJEMPLOS_MIGRACION_HTML_REACT.md** - Ejemplos prácticos
5. **CHECKLIST_PROYECTO.md** - Seguimiento de tareas

---

## 🆘 ¿Problemas?

### Backend no inicia:
```bash
# Verificar PostgreSQL
psql --version

# Verificar puerto 5000
netstat -ano | findstr :5000
```

### Frontend no inicia:
```bash
# Limpiar cache
npm cache clean --force
rm -rf node_modules
npm install
```

### No conecta Frontend-Backend:
- Verificar que backend esté corriendo en puerto 5000
- Verificar CORS en `backend/src/app.js`
- Verificar `.env` en frontend tenga `VITE_API_URL=http://localhost:5000/api`

---

## ✅ Checklist Día 1

### Salvador:
- [ ] Node.js instalado
- [ ] PostgreSQL instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos creada
- [ ] Servidor corriendo en puerto 5000

### Gabi:
- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] React corriendo en puerto 3000
- [ ] Puede ver la página de inicio

### Todos:
- [ ] Repositorio clonado
- [ ] Grupo de comunicación creado
- [ ] Próxima reunión agendada

---

**¡Éxito en el proyecto!** 🚀
