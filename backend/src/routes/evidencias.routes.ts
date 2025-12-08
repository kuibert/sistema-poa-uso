import { Router } from 'express';
import { evidenciasService } from '../services/evidencias.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/actividades/:id/evidencias', authMiddleware, async (req, res, next) => {
  try {
    const evidencias = await evidenciasService.getEvidenciasByActividad(parseInt(req.params.id));
    res.json(evidencias);
  } catch (error) {
    next(error);
  }
});

router.post('/actividades/:id/evidencias', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const evidencia = await evidenciasService.crearEvidencia(parseInt(req.params.id), req.body, req.user!.id);
    res.status(201).json(evidencia);
  } catch (error) {
    next(error);
  }
});

router.delete('/evidencias/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await evidenciasService.deleteEvidencia(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
