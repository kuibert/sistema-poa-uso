import { Router } from 'express';
import { gastosService } from '../services/gastos.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/actividades/:id/gastos', authMiddleware, async (req, res, next) => {
  try {
    const gastos = await gastosService.getGastosByActividad(parseInt(req.params.id));
    res.json(gastos);
  } catch (error) {
    next(error);
  }
});

router.post('/actividades/:id/gastos', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const gasto = await gastosService.crearGasto(parseInt(req.params.id), req.body, req.user!.id);
    res.status(201).json(gasto);
  } catch (error) {
    next(error);
  }
});

router.put('/gastos/:id', authMiddleware, async (req, res, next) => {
  try {
    const gasto = await gastosService.updateGasto(parseInt(req.params.id), req.body);
    res.json(gasto);
  } catch (error) {
    next(error);
  }
});

router.delete('/gastos/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await gastosService.deleteGasto(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
