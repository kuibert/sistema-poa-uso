import { query } from '../db';

export const proyectosService = {
  // Dashboard (Page0)
async getDashboard(anio: number) {
  // 1. Proyectos con presupuesto y gasto
  const proyectosResult = await query(
    `
    SELECT 
      p.id,
      p.nombre,
      p.anio,
      u.nombre_completo AS responsable,
      COUNT(DISTINCT a.id) AS "actividadesMes",
      COALESCE(SUM(g.monto), 0) AS "gastado",
      COALESCE(p.presupuesto_total, 0) AS "presupuestoAprobado"
    FROM proyecto p
    LEFT JOIN usuario u ON p.id_responsable = u.id
    LEFT JOIN actividad a ON a.id_proyecto = p.id
    LEFT JOIN gasto_actividad g ON g.id_actividad = a.id
    WHERE p.anio = $1
    GROUP BY p.id, u.nombre_completo
    ORDER BY p.created_at DESC
    `,
    [anio]
  );

  // 2. Actividades del año con seguimiento + KPI
  const actividadesResult = await query(
    `
    SELECT 
      a.id,
      a.nombre,
      p.id AS "proyectoId",
      p.nombre AS "proyectoNombre",
      u.nombre_completo AS responsable,
      COALESCE(ams.estado, 'P') AS estado,
      -- KPI REAL de la base
      ia.porcentaje_cumplimiento AS "logroKpiActividad",
      -- Avance operativo según estado
      CASE ams.estado
        WHEN 'P' THEN 0
        WHEN 'I' THEN 50
        WHEN 'F' THEN 100
        ELSE 0
      END AS "avanceActividad"
    FROM actividad a
    LEFT JOIN proyecto p ON a.id_proyecto = p.id
    LEFT JOIN usuario u ON a.id_responsable = u.id
    LEFT JOIN actividad_mes_seguimiento ams ON ams.id_actividad = a.id
    LEFT JOIN indicador_actividad ia ON ia.id_actividad = a.id
    WHERE EXTRACT(YEAR FROM a.created_at) = $1
    `,
    [anio]
  );

  // 3. Cálculo por proyecto
  const proyectos = proyectosResult.rows.map((p: any) => {
    const actividades = actividadesResult.rows.filter((a: any) => a.proyectoId === p.id);

    const avanceOperativo = actividades.length
      ? Math.round(
          actividades.reduce((sum: number, a: any) => sum + a.avanceActividad, 0) /
          actividades.length
        )
      : 0;

    const logroKpi = actividades.length
      ? Math.round(
          actividades.reduce(
            (sum: number, a: any) => sum + (a.logroKpiActividad || 0),
            0
          ) / actividades.length
        )
      : 0;

    return { ...p, avanceOperativo, logroKpi };
  });

  return {
    proyectos,
    actividadesMes: actividadesResult.rows
  };
},


  async getProyectos(anio: number) {
    const result = await query(
      'SELECT p.*, u.nombre as responsable_nombre FROM proyecto p LEFT JOIN usuario u ON p.id_responsable = u.id_usuario WHERE p.anio = $1 ORDER BY p.fecha_creacion DESC',
      [anio]
    );
    return result.rows;
  },

  // Planificación (Page1)
  async crearProyecto(data: any, userId: number) {
    const result = await query(
      `INSERT INTO proyecto (nombre, objetivo, unidad_responsable, id_responsable, anio, fecha_inicio, fecha_fin, presupuesto_total, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PLANIFICACION') RETURNING *`,
      [data.nombre, data.objetivo, data.unidad_responsable, data.id_responsable, data.anio, data.fecha_inicio, data.fecha_fin, data.presupuesto_total]
    );

    const proyecto = result.rows[0];

    await query(
      'INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES ($1, $2, $3)',
      [proyecto.id_proyecto, userId, 'OWNER']
    );

    return proyecto;
  },

  async getProyecto(id: number) {
    const result = await query('SELECT * FROM proyecto WHERE id_proyecto = $1', [id]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Proyecto no encontrado' };
    return result.rows[0];
  },

  async updateProyecto(id: number, data: any) {
    const result = await query(
      `UPDATE proyecto SET nombre = $1, objetivo = $2, unidad_responsable = $3, id_responsable = $4, 
       fecha_inicio = $5, fecha_fin = $6, presupuesto_total = $7, estado = $8 
       WHERE id_proyecto = $9 RETURNING *`,
      [data.nombre, data.objetivo, data.unidad_responsable, data.id_responsable, data.fecha_inicio, data.fecha_fin, data.presupuesto_total, data.estado, id]
    );
    return result.rows[0];
  },

  async crearActividad(proyectoId: number, data: any) {
    const result = await query(
      `INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, presupuesto_asignado, orden)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [proyectoId, data.nombre, data.descripcion, data.id_responsable, data.presupuesto_asignado, data.orden]
    );
    return result.rows[0];
  },

  async updatePlanMensual(actividadId: number, meses: any[]) {
    await query('DELETE FROM actividad_mes_plan WHERE id_actividad = $1', [actividadId]);

    for (const mes of meses) {
      if (mes.planificado) {
        await query(
          'INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES ($1, $2, true)',
          [actividadId, mes.mes]
        );
      }
    }

    return { success: true };
  },

  async crearIndicador(actividadId: number, data: any) {
    const result = await query(
      `INSERT INTO indicador_actividad (id_actividad, nombre, unidad_medida, meta, valor_logrado, porcentaje_cumplimiento, beneficiarios_directos, beneficiarios_indirectos)
       VALUES ($1, $2, $3, $4, 0, 0, $5, $6) RETURNING *`,
      [actividadId, data.nombre, data.unidad_medida, data.meta, data.beneficiarios_directos, data.beneficiarios_indirectos]
    );
    return result.rows[0];
  },

  // Seguimiento (Page2)
  async getSeguimientoProyecto(proyectoId: number) {
    const actividades = await query(
      `SELECT a.*, u.nombre as responsable_nombre,
        (SELECT json_agg(json_build_object('mes', mes, 'planificado', planificado)) 
         FROM actividad_mes_plan WHERE id_actividad = a.id_actividad) as plan_mensual,
        (SELECT json_agg(json_build_object('mes', mes, 'estado', estado, 'comentario', comentario)) 
         FROM actividad_mes_seguimiento WHERE id_actividad = a.id_actividad) as seguimiento_mensual,
        (SELECT json_agg(i.*) FROM indicador_actividad i WHERE i.id_actividad = a.id_actividad) as indicadores,
        COALESCE(SUM(g.monto), 0) as total_gastado
       FROM actividad a
       LEFT JOIN usuario u ON a.id_responsable = u.id_usuario
       LEFT JOIN gasto_actividad g ON a.id_actividad = g.id_actividad
       WHERE a.id_proyecto = $1
       GROUP BY a.id_actividad, u.nombre
       ORDER BY a.orden`,
      [proyectoId]
    );

    return actividades.rows;
  },

  async updateSeguimientoMensual(actividadId: number, seguimiento: any[]) {
    for (const item of seguimiento) {
      await query(
        `INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_actividad, mes) DO UPDATE SET estado = $3, comentario = $4, fecha_actualizacion = NOW()`,
        [actividadId, item.mes, item.estado, item.comentario]
      );
    }

    return { success: true };
  },

  async updateAvanceIndicador(indicadorId: number, data: any) {
    const result = await query(
      `UPDATE indicador_actividad SET valor_logrado = $1, porcentaje_cumplimiento = $2 WHERE id_indicador = $3 RETURNING *`,
      [data.valor_logrado, data.porcentaje_cumplimiento, indicadorId]
    );
    return result.rows[0];
  },
};
