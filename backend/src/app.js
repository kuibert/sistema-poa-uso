const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API POA - Universidad de Sonsonate',
    status: 'funcionando',
    version: '1.0.0'
  });
});

// Rutas (descomentar cuando estén creadas)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/usuarios', require('./routes/usuarioRoutes'));
// app.use('/api/proyectos', require('./routes/proyectoRoutes'));
// app.use('/api/actividades', require('./routes/actividadRoutes'));
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error en el servidor' });
});

module.exports = app;
