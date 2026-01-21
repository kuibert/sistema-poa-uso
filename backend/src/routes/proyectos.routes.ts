import { Router } from 'express';
import { proyectosService } from '../services/proyectos.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role.middleware';
import { query } from '../config/db';


const router = Router();

router.get('/responsables', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    let queryStr = "SELECT id, nombre_completo, cargo FROM usuario WHERE activo = true AND rol != 'ADMIN'";
    const params: any[] = [];

    if (req.user && req.user.rol !== 'ADMIN' && req.user.unidad) {
      queryStr += " AND unidad = $1";
      params.push(req.user.unidad);
    }

    queryStr += " ORDER BY nombre_completo";

    const result = await query(queryStr, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Dashboard (Page0)
router.get('/dashboard', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
    const mes = parseInt(req.query.mes as string) || (new Date().getMonth() + 1);

    let unidad = req.query.unidad as string | undefined;

    // Si usuario no es admin, forzar su unidad
    if (req.user && req.user.rol !== 'ADMIN') {
      if (!req.user.unidad) {
        // Si no tiene unidad, retornamos dashboard vacío por seguridad
        return res.json({ proyectos: [], actividadesMes: [] });
      }
      unidad = req.user.unidad;
    }

    const dashboard = await proyectosService.getDashboard(anio, mes, unidad);
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});

router.get('/unidades', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    // Si no es admin, solo puede ver su propia unidad en la lista
    if (req.user && req.user.rol !== 'ADMIN') {
      return res.json(req.user.unidad ? [req.user.unidad] : []);
    }
    const unidades = await proyectosService.getUnidades();
    res.json(unidades);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
    const proyectos = await proyectosService.getProyectos(anio, req.user);
    res.json(proyectos);
  } catch (error) {
    next(error);
  }
});

// Financial reports
router.get('/reporte-financiero/:id', authMiddleware, async (req, res, next) => {
  try {
    const reporte = await proyectosService.getReporteFinanciero(parseInt(req.params.id));
    res.json(reporte);
  } catch (error) {
    next(error);
  }
});

router.get('/reporte-financiero-unidades', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
    let unidad: string | undefined = undefined;

    if (req.user && req.user.rol !== 'ADMIN') {
      unidad = req.user.unidad;
    }

    const reporte = await proyectosService.getReporteFinancieroUnidades(anio, unidad);
    res.json(reporte);
  } catch (error) {
    next(error);
  }
});


router.get('/reporte-metricas-anual', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();
    let unidad: string | undefined = undefined;

    if (req.user && req.user.rol !== 'ADMIN') {
      unidad = req.user.unidad;
    }

    const reporte = await proyectosService.getReporteMetricasAnual(anio, unidad);
    res.json(reporte);
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

router.post('/duplicar', authMiddleware, requireRole(['ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { anioOrigen, anioDestino } = req.body;

    if (!anioOrigen || !anioDestino) {
      return res.status(400).json({ message: 'Se requieren año origen y año destino.' });
    }

    const result = await proyectosService.duplicarPOA(
      parseInt(anioOrigen),
      parseInt(anioDestino),
      req.user!.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de proyecto inválido' });
    }
    const proyecto = await proyectosService.getProyecto(id);
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
