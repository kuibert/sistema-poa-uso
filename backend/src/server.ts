import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import proyectosRoutes from './routes/proyectos.routes';
import gastosRoutes from './routes/gastos.routes';
import evidenciasRoutes from './routes/evidencias.routes';
import reportesRoutes from './routes/reportes.routes';
import { query } from './config/db';

import cookieParser from 'cookie-parser';

// ... imports ...

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true // Allow cookies
}));
app.use(cookieParser());
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

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api', gastosRoutes);  // Ya incluye /actividades/:id/gastos
app.use('/api', evidenciasRoutes);  // Ya incluye /actividades/:id/evidencias
app.use('/api/reportes', reportesRoutes);

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error en el servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);


  // Verificar conexión a Base de Datos y ejecutar migraciones
  query('SELECT NOW()')
    .then(() => console.log('🔌 Base de datos conectada correctamente'))
    .catch((err: any) => console.error('❌ Error fatal al conectar a la BD:', err));
});

export default app;
