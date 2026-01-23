import { Router } from 'express';
import authRoutes from './auth.routes';
import proyectosRoutes from './proyectos.routes';
import gastosRoutes from './gastos.routes';
import evidenciasRoutes from './evidencias.routes';
import reportesRoutes from './reportes.routes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/proyectos', proyectosRoutes);
router.use('/api', gastosRoutes);
router.use('/api', evidenciasRoutes);
router.use('/api/reportes', reportesRoutes);

export default router;
