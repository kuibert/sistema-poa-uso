# Frontend - Sistema POA

## 🚀 Inicio Rápido (Gabi)

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env`:
```bash
copy .env.example .env
```

### 3. Iniciar aplicación
```bash
npm run dev
```

La aplicación estará en: http://localhost:3000

## 📁 Estructura de Carpetas

```
frontend/
├── src/
│   ├── assets/          # Imágenes y estilos
│   ├── components/      # Componentes React
│   │   ├── common/      # Componentes reutilizables
│   │   ├── layout/      # Header, Sidebar, Footer
│   │   ├── dashboard/   # Componentes del Dashboard
│   │   ├── proyecto/    # Componentes de Proyectos
│   │   ├── seguimiento/ # Componentes de Seguimiento
│   │   ├── gastos/      # Componentes de Gastos
│   │   └── evidencias/  # Componentes de Evidencias
│   ├── pages/           # Páginas principales
│   ├── services/        # Llamadas a API
│   ├── context/         # Context API
│   ├── hooks/           # Custom hooks
│   └── utils/           # Utilidades
├── index.html
└── package.json
```

## 📋 Archivos HTML a Migrar

1. **page0.html** → `pages/Dashboard.jsx`
2. **page1.html** → `pages/RegistroProyecto.jsx`
3. **page2.html** → `pages/Seguimiento.jsx`
4. **gastos.html** → `pages/Gastos.jsx`
5. **evidencias.html** → `pages/Evidencias.jsx`

Ver `GUIA_MIGRACION_HTML_A_REACT.md` para instrucciones detalladas.

## 📋 Tareas Pendientes

- [ ] Crear componente Login
- [ ] Migrar page0.html a Dashboard.jsx
- [ ] Migrar page1.html a RegistroProyecto.jsx
- [ ] Crear componentes reutilizables
- [ ] Integrar con backend

Ver `PLAN_DE_TRABAJO.md` para más detalles.
