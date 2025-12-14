import { Router } from 'express';
import { proyectosService } from '../services/proyectos.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { query } from '../db';


const router = Router();

router.get('/responsables', authMiddleware, async (req, res, next) => {
  try {
    const result = await query(
      "SELECT id, nombre_completo FROM usuario WHERE activo = true ORDER BY nombre_completo"
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
    const dashboard = await proyectosService.getDashboard(anio);
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
router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
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

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const proyecto = await proyectosService.updateProyecto(parseInt(req.params.id), req.body);
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/actividades', authMiddleware, async (req, res, next) => {
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

router.put('/actividades/:id/plan-mensual', authMiddleware, async (req, res, next) => {
  try {
    const result = await proyectosService.updatePlanMensual(parseInt(req.params.id), req.body.meses);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/actividades/:id/indicadores', authMiddleware, async (req, res, next) => {
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

router.put('/actividades/:id/seguimiento-mensual', authMiddleware, async (req, res, next) => {
  try {
    const result = await proyectosService.updateSeguimientoMensual(parseInt(req.params.id), req.body.seguimiento);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/indicadores/:id/avance', authMiddleware, async (req, res, next) => {
  try {
    const indicador = await proyectosService.updateAvanceIndicador(parseInt(req.params.id), req.body);
    res.json(indicador);
  } catch (error) {
    next(error);
  }
});

export default router;
