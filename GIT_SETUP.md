# 🔧 Configuración de Git y GitHub

## 📋 Paso 1: Inicializar Git Local

Ejecuta estos comandos en la carpeta raíz del proyecto:

```bash
cd "c:\Users\Moris\OneDrive\Documentos\POA DEVELOPMENT"
git init
git add .
git commit -m "feat: configuración inicial del proyecto POA"
```

## 🌐 Paso 2: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `sistema-poa-uso`
3. Descripción: `Sistema de Gestión de POA - Universidad de Sonsonate`
4. Visibilidad: **Privado** (para proyecto académico)
5. NO marcar "Initialize with README" (ya lo tenemos)
6. Click en "Create repository"

## 🔗 Paso 3: Conectar con GitHub

Copia la URL que te da GitHub y ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/sistema-poa-uso.git
git branch -M main
git push -u origin main
```

## 👥 Paso 4: Invitar a Salvador y Gabi

1. En GitHub, ve a tu repositorio
2. Click en "Settings" → "Collaborators"
3. Click en "Add people"
4. Busca por usuario o email de Salvador
5. Busca por usuario o email de Gabi
6. Enviar invitaciones

## 📥 Paso 5: Salvador y Gabi Clonan el Repo

Ellos deben ejecutar:

```bash
git clone https://github.com/TU_USUARIO/sistema-poa-uso.git
cd sistema-poa-uso
```

## 🌿 Estrategia de Ramas

### Ramas principales:
- `main` - Código en producción (protegida)
- `develop` - Código en desarrollo

### Ramas de trabajo:
- `feature/backend-auth` (Salvador)
- `feature/frontend-dashboard` (Gabi)
- `feature/frontend-seguimiento` (Moris)

### Crear rama de trabajo:

```bash
# Salvador
git checkout -b feature/backend-auth

# Gabi
git checkout -b feature/frontend-dashboard

# Moris
git checkout -b feature/frontend-seguimiento
```

## 📝 Flujo de Trabajo Git

### 1. Antes de empezar a trabajar:
```bash
git pull origin main
```

### 2. Hacer cambios y commit:
```bash
git add .
git commit -m "feat: descripción del cambio"
```

### 3. Subir cambios:
```bash
git push origin nombre-de-tu-rama
```

### 4. Crear Pull Request:
1. Ve a GitHub
2. Click en "Pull requests" → "New pull request"
3. Selecciona tu rama → `main`
4. Describe los cambios
5. Asigna a otro compañero para review
6. Click en "Create pull request"

### 5. Después de aprobación:
El revisor hace merge en GitHub

## 📋 Convención de Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
style: cambios de formato
refactor: refactorización de código
docs: cambios en documentación
test: agregar tests
```

Ejemplos:
```bash
git commit -m "feat: implementar login en backend"
git commit -m "fix: corregir error en Dashboard"
git commit -m "docs: actualizar README con instrucciones"
```

## 🚨 Comandos Útiles

### Ver estado:
```bash
git status
```

### Ver historial:
```bash
git log --oneline
```

### Deshacer cambios no guardados:
```bash
git checkout -- archivo.js
```

### Actualizar desde main:
```bash
git checkout main
git pull origin main
git checkout tu-rama
git merge main
```

### Resolver conflictos:
1. Git marca los archivos con conflictos
2. Abre el archivo y busca `<<<<<<<`
3. Decide qué código mantener
4. Elimina las marcas `<<<<<<<`, `=======`, `>>>>>>>`
5. Guarda el archivo
6. `git add archivo.js`
7. `git commit -m "fix: resolver conflicto en archivo.js"`

## ✅ Checklist Git

- [ ] Repositorio inicializado localmente
- [ ] Repositorio creado en GitHub
- [ ] Conectado local con remoto
- [ ] Salvador invitado como colaborador
- [ ] Gabi invitada como colaboradora
- [ ] Todos clonaron el repositorio
- [ ] Cada quien creó su rama de trabajo
- [ ] Primer commit realizado

## 📞 Ayuda

Si tienen problemas con Git:
1. Revisar este documento
2. Preguntar en el grupo
3. Buscar en: https://git-scm.com/docs

---

**¡Listo para empezar a colaborar!** 🚀
