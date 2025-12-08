import { Router } from 'express';
import authRoutes from './auth.routes';
import proyectosRoutes from './proyectos.routes';
import gastosRoutes from './gastos.routes';
import evidenciasRoutes from './evidencias.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api/proyectos', proyectosRoutes);
router.use('/api', gastosRoutes);
router.use('/api', evidenciasRoutes);

export default router;
