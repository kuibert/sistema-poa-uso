import { Router } from 'express';
import { proyectosService } from '../services/proyectos.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role.middleware';
import { query } from '../db';


const router = Router();

router.get('/responsables', authMiddleware, async (req, res, next) => {
  try {
    const result = await query(
      "SELECT id, nombre_completo, cargo FROM usuario WHERE activo = true ORDER BY nombre_completo"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Dashboard (Page0)
router.get('/dashboard', authMiddleware, async (req, res, next) => {
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
    const mes = parseInt(req.query.mes as string) || (new Date().getMonth() + 1);
    const dashboard = await proyectosService.getDashboard(anio, mes);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
    const proyectos = await proyectosService.getProyectos(anio);
    res.json(proyectos);
  } catch (error) {
    next(error);
  }
});

// Planificación (Page1)
router.post('/', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req: AuthRequest, res, next) => {
  try {
    const proyecto = await proyectosService.crearProyecto(req.body, req.user!.id);
    res.status(201).json(proyecto);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const proyecto = await proyectosService.getProyecto(parseInt(req.params.id));
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/reporte', authMiddleware, async (req, res, next) => {
  try {
    const reporte = await proyectosService.getReporteProyecto(parseInt(req.params.id));
    res.json(reporte);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const proyecto = await proyectosService.updateProyecto(parseInt(req.params.id), req.body);
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const result = await proyectosService.deleteProyecto(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
});


router.post('/:id/actividades', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const actividad = await proyectosService.crearActividad(parseInt(req.params.id), req.body);
    res.status(201).json(actividad);
  } catch (error) {
    next(error);
  }
});

router.get('/actividades/:id', authMiddleware, async (req, res, next) => {
  try {
    const actividad = await proyectosService.getActividad(parseInt(req.params.id));
    res.json(actividad);
  } catch (error) {
    next(error);
  }
});

router.put('/actividades/:id/plan-mensual', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const result = await proyectosService.updatePlanMensual(parseInt(req.params.id), req.body.meses);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/actividades/:id/indicadores', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const indicador = await proyectosService.crearIndicador(parseInt(req.params.id), req.body);
    res.status(201).json(indicador);
  } catch (error) {
    next(error);
  }
});

// Seguimiento (Page2)
router.get('/:id/seguimiento', authMiddleware, async (req, res, next) => {
  try {
    const seguimiento = await proyectosService.getSeguimientoProyecto(parseInt(req.params.id));
    res.json(seguimiento);
  } catch (error) {
    next(error);
  }
});

router.put('/actividades/:id/seguimiento-mensual', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const result = await proyectosService.updateSeguimientoMensual(parseInt(req.params.id), req.body.seguimiento);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/indicadores/:id/avance', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const indicador = await proyectosService.updateAvanceIndicador(parseInt(req.params.id), req.body);
    res.json(indicador);
  } catch (error) {
    next(error);
  }
});

router.put('/actividades/:id', authMiddleware, requireRole(['ADMIN', 'EDITOR']), async (req, res, next) => {
  try {
    const actividad = await proyectosService.updateActividad(parseInt(req.params.id), req.body);
    res.json(actividad);
  } catch (error) {
    next(error);
  }
});

router.delete('/actividades/:id', authMiddleware, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const result = await proyectosService.deleteActividad(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
