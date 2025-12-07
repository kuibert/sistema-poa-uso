# 🚀 GUÍA DE INICIO RÁPIDO - SISTEMA POA

## 📌 PARA EMPEZAR HOY MISMO

### 🎯 Objetivo
Tener el proyecto configurado y corriendo en **menos de 2 horas**.

---

## 👥 PASO 1: ORGANIZACIÓN DEL EQUIPO (15 min)

### Asignar roles:
- **Integrante 1:** Backend (Node.js + PostgreSQL)
- **Integrante 2:** Frontend (React - Dashboard y Proyectos)
- **Integrante 3:** Frontend (React - Seguimiento y Evidencias)

### Crear canales de comunicación:
- [ ] Grupo de WhatsApp/Telegram
- [ ] Repositorio Git (GitHub/GitLab)
- [ ] Tablero Trello/Notion (opcional)

---

## 🔵 INTEGRANTE 1: Backend (45 min)

### 1. Instalar herramientas (10 min)
```bash
# Verificar Node.js
node --version  # Debe ser v18+

# Verificar PostgreSQL
psql --version  # Debe ser v14+
```

### 2. Crear proyecto backend (5 min)
```bash
mkdir poa-system
cd poa-system
mkdir backend
cd backend
npm init -y
```

### 3. Instalar dependencias (5 min)
```bash
npm install express pg dotenv cors jsonwebtoken bcryptjs multer
npm install --save-dev nodemon
```

### 4. Crear estructura de carpetas (5 min)
```bash
mkdir src
mkdir src/config src/controllers src/routes src/middlewares src/utils
mkdir uploads
```

### 5. Crear archivos base (10 min)
Copiar código de `EJEMPLOS_CODIGO.md`:
- `server.js`
- `src/app.js`
- `src/config/database.js`
- `.env`

### 6. Configurar PostgreSQL (10 min)
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE poa_db;
\q

# Ejecutar script
psql -U postgres -d poa_db -f ../base_postgres.sql
```

### 7. Probar servidor (5 min)
```bash
npm run dev
# Debe mostrar: 🚀 Servidor corriendo en puerto 5000
```

### ✅ Checkpoint Backend
- [ ] Servidor corriendo en puerto 5000
- [ ] Base de datos con 10 tablas creadas
- [ ] Endpoint GET http://localhost:5000 responde

---

## 🟢 INTEGRANTE 2: Frontend (45 min)

### 1. Crear proyecto React (10 min)
```bash
cd poa-system
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 2. Instalar dependencias (5 min)
```bash
npm install react-router-dom axios
```

### 3. Crear estructura de carpetas (5 min)
```bash
mkdir src/components src/pages src/services src/context src/utils
mkdir src/components/common src/components/layout
mkdir src/assets/styles
```

### 4. Crear archivos base (15 min)
Copiar código de `EJEMPLOS_CODIGO.md`:
- `src/App.jsx`
- `src/context/AuthContext.jsx`
- `src/services/api.js`
- `src/pages/Login.jsx`
- `.env`

### 5. Configurar estilos (5 min)
Copiar CSS de `page0.html` a `src/assets/styles/global.css`

### 6. Probar aplicación (5 min)
```bash
npm run dev
# Debe abrir http://localhost:3000
```

### ✅ Checkpoint Frontend
- [ ] React corriendo en puerto 3000
- [ ] Página de login visible
- [ ] Sin errores en consola

---

## 🟡 INTEGRANTE 3: Frontend (45 min)

### 1. Clonar repositorio (5 min)
```bash
git clone <url-repositorio>
cd poa-system/frontend
npm install
```

### 2. Familiarizarse con estructura (10 min)
- Revisar carpetas creadas por Integrante 2
- Leer `PLAN_DE_TRABAJO.md`
- Revisar `EJEMPLOS_CODIGO.md`

### 3. Crear componentes comunes (20 min)
```bash
cd src/components/common
```

Crear archivos:
- `Button.jsx` - Botón reutilizable
- `Modal.jsx` - Modal genérico
- `Loader.jsx` - Indicador de carga
- `Alert.jsx` - Mensajes de alerta

### 4. Crear utilidades (10 min)
```bash
cd src/utils
```

Crear `formatters.js` con funciones:
- `formatoDinero()`
- `formatoFecha()`
- `calcularPorcentaje()`

### ✅ Checkpoint Integrante 3
- [ ] Componentes comunes creados
- [ ] Utilidades implementadas
- [ ] Código documentado

---

## 🔗 PASO 2: INTEGRACIÓN (30 min)

### Todos juntos:

### 1. Implementar login completo (20 min)

**Integrante 1 (Backend):**
```bash
cd backend/src
```
Crear:
- `routes/authRoutes.js`
- `controllers/authController.js`

**Integrante 2 (Frontend):**
Verificar que `Login.jsx` esté conectado con backend

### 2. Probar integración (10 min)
```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

Probar login:
- Correo: `admin@uso.edu.sv`
- Password: `demo123`

### ✅ Checkpoint Integración
- [ ] Login funciona end-to-end
- [ ] Token se guarda en localStorage
- [ ] Redirección a dashboard después de login

---

## 📋 PASO 3: CONFIGURAR GIT (15 min)

### 1. Crear repositorio (5 min)
```bash
cd poa-system
git init
```

### 2. Crear `.gitignore` (2 min)
```
node_modules/
.env
uploads/
dist/
.DS_Store
```

### 3. Primer commit (3 min)
```bash
git add .
git commit -m "feat: configuración inicial del proyecto"
```

### 4. Conectar con GitHub/GitLab (5 min)
```bash
git remote add origin <url-repositorio>
git push -u origin main
```

---

## 🎯 PASO 4: PLANIFICACIÓN (15 min)

### Reunión de equipo:

1. **Revisar documentos** (5 min)
   - `PLAN_DE_TRABAJO.md`
   - `ESTRUCTURA_PROYECTO.md`
   - `CHECKLIST_PROYECTO.md`

2. **Definir horarios** (5 min)
   - ¿Cuándo trabajarán juntos?
   - ¿Cuándo harán daily standups?
   - ¿Cuándo harán code reviews?

3. **Establecer metas de la semana** (5 min)
   - ¿Qué debe estar listo al final de la semana 1?
   - ¿Quién hace qué?
   - ¿Cuándo es la próxima reunión?

---

## ✅ CHECKLIST FINAL DEL DÍA 1

### Backend (Integrante 1)
- [ ] Node.js y PostgreSQL instalados
- [ ] Proyecto backend creado
- [ ] Dependencias instaladas
- [ ] Base de datos creada con 10 tablas
- [ ] Servidor corriendo en puerto 5000
- [ ] Endpoint de login implementado
- [ ] Probado con Postman

### Frontend (Integrante 2)
- [ ] Proyecto React creado
- [ ] Dependencias instaladas
- [ ] Estructura de carpetas creada
- [ ] React corriendo en puerto 3000
- [ ] Página de login creada
- [ ] AuthContext implementado
- [ ] Login funcional con backend

### Frontend (Integrante 3)
- [ ] Repositorio clonado
- [ ] Dependencias instaladas
- [ ] Componentes comunes creados
- [ ] Utilidades implementadas
- [ ] Familiarizado con estructura
- [ ] Ayudó en testing de login

### General (Todos)
- [ ] Repositorio Git configurado
- [ ] Primer commit realizado
- [ ] Comunicación establecida
- [ ] Plan de trabajo revisado
- [ ] Próxima reunión agendada

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Backend no inicia
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql start  # Linux
brew services start postgresql  # Mac

# Verificar puerto 5000 libre
lsof -i :5000
```

### Frontend no conecta con backend
```bash
# Verificar archivo .env
cat frontend/.env
# Debe tener: VITE_API_URL=http://localhost:5000/api

# Verificar CORS en backend
# En backend/src/app.js debe tener: app.use(cors())
```

### Error de base de datos
```bash
# Verificar que la BD existe
psql -U postgres -l | grep poa_db

# Recrear BD si es necesario
psql -U postgres
DROP DATABASE IF EXISTS poa_db;
CREATE DATABASE poa_db;
\q
psql -U postgres -d poa_db -f database/base_postgres.sql
```

---

## 📞 AYUDA RÁPIDA

### Comandos útiles:

```bash
# Ver procesos en puerto
lsof -i :5000
lsof -i :3000

# Matar proceso
kill -9 <PID>

# Ver logs de PostgreSQL
tail -f /var/log/postgresql/postgresql-14-main.log

# Reiniciar servicios
sudo service postgresql restart
```

### Recursos:
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **JWT:** https://jwt.io/

---

## 🎉 ¡FELICITACIONES!

Si completaste todos los checkpoints, tienes:
- ✅ Backend funcionando
- ✅ Frontend funcionando
- ✅ Login integrado
- ✅ Git configurado
- ✅ Equipo organizado

**Estás listo para empezar el desarrollo real del proyecto!** 🚀

---

## 📅 PRÓXIMOS PASOS (Semana 1)

### Integrante 1 (Backend):
- Implementar CRUD de usuarios
- Implementar CRUD de proyectos
- Crear middleware de autenticación
- Documentar endpoints en Postman

### Integrante 2 (Frontend):
- Crear componente Layout
- Crear página Dashboard (estructura)
- Crear servicio de proyectos
- Implementar rutas protegidas

### Integrante 3 (Frontend):
- Crear componente Sidebar
- Crear componente Table genérico
- Implementar formateo de fechas y moneda
- Ayudar en testing

---

**Última actualización:** Enero 2025  
**Tiempo estimado total:** 2 horas  
**Dificultad:** ⭐⭐ (Fácil-Moderado)

**¡Éxito en el proyecto!** 💪
