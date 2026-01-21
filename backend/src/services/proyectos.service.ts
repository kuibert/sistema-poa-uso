import { query } from '../config/db';

export const proyectosService = {
  // Dashboard (Page0)
  async getDashboard(anio: number, mes: number, unidad?: string) {
    // 1. Proyectos con presupuesto y gasto
    // Nota: actividadesMes ahora cuenta SI existe plan para ese mes
    const proyectosResult = await query(
      `
    SELECT 
      p.id,
      p.nombre,
      p.anio,
      u.nombre_completo AS responsable,
      COUNT(DISTINCT CASE WHEN amp.planificado = true THEN a.id END) AS "actividadesMes",
      COALESCE(SUM(g.monto), 0) AS "gastado",
      COALESCE((
        SELECT SUM(c.costo_total) 
        FROM costo_proyecto c 
        WHERE c.id_proyecto = p.id AND c.incluir_en_avance = true
      ), p.presupuesto_total, 0) AS "presupuestoAprobado"
    FROM proyecto p
    LEFT JOIN usuario u ON p.id_responsable = u.id
    LEFT JOIN actividad a ON a.id_proyecto = p.id
    LEFT JOIN actividad_mes_plan amp ON amp.id_actividad = a.id AND amp.mes = $2
    LEFT JOIN gasto_actividad g ON g.id_actividad = a.id
    WHERE p.anio = $1
    ${unidad ? 'AND UPPER(p.unidad_facultad) = UPPER($3)' : ''}
    GROUP BY p.id, u.nombre_completo
    ORDER BY p.created_at DESC
    `,
      unidad ? [anio, mes, unidad] : [anio, mes]
    );

    // 2. Actividades del año para la LISTA (Filtrado por MES seleccionado)
    const actividadesMesResult = await query(
      `
    SELECT 
      a.id,
      a.nombre,
      p.id AS "proyectoId",
      p.nombre AS "proyectoNombre",
      u.nombre_completo AS responsable,
      COALESCE(ams.estado, 'P') AS estado,
      ia.porcentaje_cumplimiento AS "logroKpiActividad",
      CASE ams.estado
        WHEN 'P' THEN 0
        WHEN 'I' THEN 50
        WHEN 'F' THEN 100
        ELSE 0
      END AS "avanceActividad"
    FROM actividad a
    LEFT JOIN proyecto p ON a.id_proyecto = p.id
    LEFT JOIN usuario u ON a.id_responsable = u.id
    LEFT JOIN actividad_mes_seguimiento ams ON ams.id_actividad = a.id AND ams.mes = $2
    -- Solo mostramos actividades PLANIFICADAS para este mes
    JOIN actividad_mes_plan amp ON amp.id_actividad = a.id AND amp.mes = $2 AND amp.planificado = true
    LEFT JOIN indicador_actividad ia ON ia.id_actividad = a.id
    WHERE p.anio = $1
    ${unidad ? 'AND UPPER(p.unidad_facultad) = UPPER($3)' : ''}
    `,
      unidad ? [anio, mes, unidad] : [anio, mes]
    );

    // 3. Stats ANUALES por proyecto (Para la tabla de proyectos, independiente del mes)
    // Calcula el promedio de avance y logro de TODAS las actividades del proyecto en el año
    const statsResult = await query(
      `
      WITH ActivityStats AS (
         SELECT
            a.id AS id_actividad,
            COUNT(amp.mes) as total_plan,
            COALESCE(SUM(
                CASE
                  WHEN ams.estado = 'F' THEN 1.0
                  WHEN ams.estado = 'I' THEN 0.5
                  ELSE 0.0
                END
            ), 0) as puntos_ganados
         FROM actividad a
         LEFT JOIN actividad_mes_plan amp ON amp.id_actividad = a.id AND amp.planificado = true
         LEFT JOIN actividad_mes_seguimiento ams ON ams.id_actividad = a.id AND ams.mes = amp.mes
         GROUP BY a.id
      )
      SELECT 
        p.id as "proyectoId",
        AVG(COALESCE(ia.porcentaje_cumplimiento, 0))::numeric as "logroKpi",
        AVG(
          CASE
            WHEN s.total_plan > 0 THEN (s.puntos_ganados / s.total_plan::numeric) * 100
            ELSE 0
          END
        )::numeric as "avanceOperativo"
      FROM proyecto p
      JOIN actividad a ON a.id_proyecto = p.id
      LEFT JOIN indicador_actividad ia ON ia.id_actividad = a.id
      LEFT JOIN ActivityStats s ON s.id_actividad = a.id
      WHERE p.anio = $1
      GROUP BY p.id
      `,
      [anio]
    );


    // Map stats to dictionary for easy access
    const statsMap: Record<number, { avance: number, logro: number }> = {};
    statsResult.rows.forEach((s: any) => {
      statsMap[s.proyectoId] = {
        avance: Math.round(Number(s.avanceOperativo)),
        logro: Math.round(Number(s.logroKpi))
      };
    });

    // 4. Cálculo por proyecto (Mezclar datos)
    const proyectos = proyectosResult.rows.map((p: any) => {
      const stats = statsMap[p.id] || { avance: 0, logro: 0 };
      return {
        ...p,
        avanceOperativo: stats.avance,
        logroKpi: stats.logro
      };
    });

    return {
      proyectos,
      actividadesMes: actividadesMesResult.rows
    };
  },


  async getProyectos(anio: number, user?: any) {
    let queryStr = 'SELECT p.*, u.nombre_completo as responsable_nombre FROM proyecto p LEFT JOIN usuario u ON p.id_responsable = u.id WHERE p.anio = $1';
    const params: any[] = [anio];

    if (user && user.rol !== 'ADMIN') {
      // Si el usuario tiene unidad, filtramos. Si no tiene unidad (caso raro), no ve nada o ve todo? 
      // Asumiremos que debe tener unidad. Si no, no ve proyectos.
      if (user.unidad) {
        queryStr += ` AND UPPER(p.unidad_facultad) = UPPER($${params.length + 1})`;
        params.push(user.unidad);
      } else {
        // Usuario sin unidad (y no admin) -> return empty?
        // Para seguridad, retornamos vacio si no tiene unidad asignada
        return [];
      }
    }

    queryStr += ' ORDER BY p.created_at DESC';

    const result = await query(queryStr, params);
    return result.rows;
  },

  async getUnidades() {
    const result = await query(
      `SELECT DISTINCT unidad_facultad 
       FROM proyecto 
       WHERE unidad_facultad IS NOT NULL 
       ORDER BY unidad_facultad ASC`
    );
    return result.rows.map(row => row.unidad_facultad);
  },

  async getReporteFinanciero(proyectoId: number) {
    // Get project with budget
    const proyectoResult = await query(
      `SELECT p.*, u.nombre_completo as responsable_nombre
       FROM proyecto p
       LEFT JOIN usuario u ON p.id_responsable = u.id
       WHERE p.id = $1`,
      [proyectoId]
    );

    if (proyectoResult.rows.length === 0) {
      throw new Error('Proyecto no encontrado');
    }

    const proyecto = proyectoResult.rows[0];

    // Get activities with their budgets and expenses
    const actividadesResult = await query(
      `SELECT 
        a.id, a.nombre, a.presupuesto_asignado,
        COALESCE(SUM(g.monto), 0) as gastado
       FROM actividad a
       LEFT JOIN gasto_actividad g ON g.id_actividad = a.id
       WHERE a.id_proyecto = $1
       GROUP BY a.id, a.nombre, a.presupuesto_asignado
       ORDER BY a.id`,
      [proyectoId]
    );

    const actividades = actividadesResult.rows.map((act: any) => ({
      ...act,
      presupuesto_asignado: Number(act.presupuesto_asignado) || 0,
      gastado: Number(act.gastado) || 0,
      disponible: (Number(act.presupuesto_asignado) || 0) - (Number(act.gastado) || 0),
      porcentaje_ejecucion: ((Number(act.gastado) || 0) / (Number(act.presupuesto_asignado) || 1)) * 100
    }));

    const totalPresupuesto = Number(proyecto.presupuesto_total) || 0;
    const totalGastado = actividades.reduce((sum, act) => sum + act.gastado, 0);

    // Calcular presupuesto para avance (solo costos con incluir_en_avance = true)
    const presupuestoParaAvanceResult = await query(
      `SELECT COALESCE(SUM(costo_total), 0) as total 
       FROM costo_proyecto 
       WHERE id_proyecto = $1 AND incluir_en_avance = true`,
      [proyectoId]
    );
    const presupuestoParaAvance = Number(presupuestoParaAvanceResult.rows[0].total) || 0;

    const disponible = presupuestoParaAvance - totalGastado;
    const porcentajeEjecucion = presupuestoParaAvance > 0 ? (totalGastado / presupuestoParaAvance) * 100 : 0;

    // Get all costs for the report
    const costosResult = await query(
      `SELECT * FROM costo_proyecto WHERE id_proyecto = $1 ORDER BY id`,
      [proyectoId]
    );

    return {
      proyecto: {
        ...proyecto,
        presupuesto_total: totalPresupuesto
      },
      resumen: {
        totalPresupuesto,
        totalGastado,
        disponible,
        porcentajeEjecucion: Math.round(porcentajeEjecucion * 100) / 100
      },
      actividades,
      costos: costosResult.rows
    };
  },

  async getReporteFinancieroUnidades(anio: number, unidad?: string) {
    // Get all projects grouped by unit with financial data
    const params: any[] = [anio];
    let queryStr = `
        SELECT 
        p.unidad_facultad,
        COUNT(p.id) as num_proyectos,
        COALESCE(SUM(p.presupuesto_total), 0) as presupuesto_total,
        p.id as proyecto_id,
        p.nombre as proyecto_nombre,
        p.presupuesto_total as proyecto_presupuesto
        FROM proyecto p
        WHERE p.anio = $1 AND p.unidad_facultad IS NOT NULL
    `;

    if (unidad) {
      queryStr += ` AND UPPER(p.unidad_facultad) = UPPER($2)`;
      params.push(unidad);
    }

    queryStr += `
        GROUP BY p.unidad_facultad, p.id, p.nombre, p.presupuesto_total
        ORDER BY p.unidad_facultad, p.nombre
    `;

    const result = await query(queryStr, params);

    // Get gastos for all projects
    const gastosParams: any[] = [anio];
    let gastosQuery = `
       SELECT 
        p.id as proyecto_id,
        COALESCE(SUM(g.monto), 0) as total_gastado
       FROM proyecto p
       LEFT JOIN actividad a ON a.id_proyecto = p.id
       LEFT JOIN gasto_actividad g ON g.id_actividad = a.id
       WHERE p.anio = $1
    `;

    if (unidad) {
      gastosQuery += ` AND UPPER(p.unidad_facultad) = UPPER($2)`;
      gastosParams.push(unidad);
    }

    gastosQuery += ` GROUP BY p.id`;

    const gastosResult = await query(gastosQuery, gastosParams);

    const gastosMap: Record<number, number> = {};
    gastosResult.rows.forEach((row: any) => {
      gastosMap[row.proyecto_id] = Number(row.total_gastado) || 0;
    });

    // Group by unidad
    const unidadesMap: Record<string, any> = {};

    result.rows.forEach((row: any) => {
      const unidad = row.unidad_facultad;
      if (!unidadesMap[unidad]) {
        unidadesMap[unidad] = {
          unidad_facultad: unidad,
          num_proyectos: 0,
          presupuesto_total: 0,
          total_gastado: 0,
          proyectos: []
        };
      }

      const gastado = gastosMap[row.proyecto_id] || 0;
      const presupuesto = Number(row.proyecto_presupuesto) || 0;

      unidadesMap[unidad].num_proyectos += 1;
      unidadesMap[unidad].presupuesto_total += presupuesto;
      unidadesMap[unidad].total_gastado += gastado;
      unidadesMap[unidad].proyectos.push({
        id: row.proyecto_id,
        nombre: row.proyecto_nombre,
        presupuesto: presupuesto,
        gastado: gastado,
        disponible: presupuesto - gastado,
        porcentaje_ejecucion: (gastado / presupuesto) * 100
      });
    });

    // Convert to array and calculate additional metrics
    const unidades = Object.values(unidadesMap).map((unidad: any) => ({
      ...unidad,
      disponible: unidad.presupuesto_total - unidad.total_gastado,
      porcentaje_ejecucion: (unidad.total_gastado / unidad.presupuesto_total) * 100
    }));

    return unidades;
  },

  async getReporteMetricasAnual(anio: number, unidad?: string) {
    // 1. Obtener proyectos basicos
    let queryStr = `
        SELECT p.id, p.nombre, p.unidad_facultad, p.presupuesto_total, 
               u.nombre_completo as responsable_nombre
        FROM proyecto p
        LEFT JOIN usuario u ON p.id_responsable = u.id
        WHERE p.anio = $1
    `;
    const params: any[] = [anio];

    if (unidad) {
      queryStr += ` AND UPPER(p.unidad_facultad) = UPPER($2)`;
      params.push(unidad);
    }

    queryStr += ` ORDER BY p.nombre`;

    const proyectosResult = await query(queryStr, params);

    // 2. Calcular metricas para cada proyecto
    const reporte = [];

    for (const p of proyectosResult.rows) {
      // Gastos
      const gastoRes = await query(
        `SELECT COALESCE(SUM(g.monto), 0) as total_gastado
         FROM gasto_actividad g
         JOIN actividad a ON g.id_actividad = a.id
         WHERE a.id_proyecto = $1`,
        [p.id]
      );
      const totalGastado = Number(gastoRes.rows[0].total_gastado) || 0;
      const presupuesto = Number(p.presupuesto_total) || 0;
      const avanceFinanciero = presupuesto > 0 ? (totalGastado / presupuesto) * 100 : 0;

      // Avance Fisico (Promedio de todas las actividades del año)
      // Logica similar al dashboard:
      // Puntos: F=100, I=50, P=0. Promedio simple sobre el total de actividades PLANIFICADAS en el año.
      const avanceFisicoRes = await query(`
        WITH ActivityStats AS (
           SELECT
              a.id AS id_actividad,
              COUNT(amp.mes) as total_plan,
              COALESCE(SUM(
                  CASE
                    WHEN ams.estado = 'F' THEN 1.0
                    WHEN ams.estado = 'I' THEN 0.5
                    ELSE 0.0
                  END
              ), 0) as puntos_ganados
           FROM actividad a
           JOIN actividad_mes_plan amp ON amp.id_actividad = a.id AND amp.planificado = true
           LEFT JOIN actividad_mes_seguimiento ams ON ams.id_actividad = a.id AND ams.mes = amp.mes
           WHERE a.id_proyecto = $1
           GROUP BY a.id
        )
        SELECT 
          AVG(
            CASE
              WHEN s.total_plan > 0 THEN (s.puntos_ganados / s.total_plan::numeric) * 100
              ELSE 0
            END
          )::numeric as avance_fisico
        FROM ActivityStats s
      `, [p.id]);

      const avanceFisico = Number(avanceFisicoRes.rows[0]?.avance_fisico) || 0;

      // Logro KPI (Promedio de indicadores)
      const kpiRes = await query(`
        SELECT AVG(COALESCE(ia.porcentaje_cumplimiento, 0))::numeric as logro_kpi
        FROM actividad a
        JOIN indicador_actividad ia ON ia.id_actividad = a.id
        WHERE a.id_proyecto = $1
      `, [p.id]);

      const logroKpi = Number(kpiRes.rows[0]?.logro_kpi) || 0;

      reporte.push({
        id: p.id,
        proyecto: p.nombre,
        unidad: p.unidad_facultad,
        responsable: p.responsable_nombre,
        presupuesto: presupuesto,
        gastado: totalGastado,
        avanceFinanciero: Math.round(avanceFinanciero * 100) / 100,
        avanceFisico: Math.round(avanceFisico * 100) / 100,
        logroKpi: Math.round(logroKpi * 100) / 100
      });
    }

    return reporte;
  },

  // Planificación (Page1)
  async crearProyecto(data: any, userId: number) {
    const result = await query(
      `
    INSERT INTO proyecto (
      anio,
      unidad_facultad,
      linea_estrategica,
      objetivo_estrategico,
      accion_estrategica,
      nombre,
      objetivo_proyecto,
      presupuesto_total,
      id_responsable
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
      [
        data.anio,
        data.unidad_facultad,
        data.linea_estrategica || null,
        data.objetivo_estrategico || null,
        data.accion_estrategica || null,
        data.nombre,
        data.objetivo,
        data.presupuesto_total,
        data.id_responsable || null
      ]
    );

    const proyecto = result.rows[0];

    await query(
      `INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol)
     VALUES ($1, $2, 'OWNER')`,
      [proyecto.id, userId]
    );

    if (data.costos && Array.isArray(data.costos)) {
      await this.syncCostosProyecto(proyecto.id, data.costos);
    }

    return proyecto;
  },

  async syncCostosProyecto(proyectoId: number, costos: any[]) {
    // Borrar anteriores
    await query('DELETE FROM costo_proyecto WHERE id_proyecto = $1', [proyectoId]);

    if (!costos || !Array.isArray(costos)) return;

    console.log('Syncing Costos. Payload:', JSON.stringify(costos, null, 2));

    for (const c of costos) {
      // Validar campos minimos
      if (!c.descripcion) continue;

      const params = [
        proyectoId,
        c.tipo || 'fijo',
        c.descripcion,
        Number(c.cantidad) || 0,
        c.unidad || '',
        Number(c.precio_unitario) || 0,
        Number(c.costo_total) || 0,
        c.id_actividad || null,
        c.incluir_en_avance !== undefined ? c.incluir_en_avance : true // DEFAULT true
      ];

      console.log('Inserting Costo Params:', params);

      await query(`
            INSERT INTO costo_proyecto (
                id_proyecto, tipo, descripcion, cantidad, unidad, precio_unitario, costo_total, id_actividad, incluir_en_avance
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         `, params);
    }
  },


  async getProyecto(id: number) {
    const result = await query('SELECT * FROM proyecto WHERE id = $1', [id]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Proyecto no encontrado' };
    return result.rows[0];
  },

  async updateProyecto(id: number, data: any) {
    const result = await query(
      `UPDATE proyecto SET nombre = $1, objetivo_proyecto = $2, unidad_facultad = $3, id_responsable = $4, 
       presupuesto_total = $5, activo = $6
       WHERE id = $7 RETURNING *`,
      [data.nombre, data.objetivo, data.unidad_facultad, data.id_responsable, data.presupuesto_total, data.estado === 'Activo' || data.estado === true, id]
    );

    if (data.costos && Array.isArray(data.costos)) {
      await this.syncCostosProyecto(id, data.costos);
    }

    return result.rows[0];
  },


  async crearActividad(proyectoId: number, data: any) {
    // 1️⃣ Insertar actividad (YA CON TODOS LOS CAMPOS)
    const actividadResult = await query(
      `
    INSERT INTO actividad (
      id_proyecto,
      nombre,
      descripcion,
      id_responsable,
      cargo_responsable,
      unidad_responsable,
      presupuesto_asignado
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
      [
        proyectoId,
        data.nombre,
        data.descripcion,
        data.id_responsable || null,

        // 👇 aunque esté "mal", se guarda
        data.cargo_responsable || '',

        data.unidad_responsable || '',

        // 👇 MUY IMPORTANTE: numeric nunca debe recibir ''
        Number(data.presupuesto_asignado) || 0
      ]
    );

    const actividad = actividadResult.rows[0];

    // 2️⃣ Plan mensual
    if (Array.isArray(data.meses)) {
      for (const mes of data.meses) {
        await query(
          `
        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado)
        VALUES ($1, $2, true)
        `,
          [actividad.id, mes]
        );
      }
    }

    // 3️⃣ Indicador
    if (data.indicador) {
      await query(
        `
      INSERT INTO indicador_actividad (
        id_actividad,
        categoria,
        descripcion_especifica,
        meta_valor,
        unidad_medida,
        beneficiarios,
        valor_logrado,
        porcentaje_cumplimiento
      )
      VALUES ($1, $2, $3, $4, $5, $6, 0, 0)
      `,
        [
          actividad.id,
          data.indicador.categoria,
          data.indicador.descripcion,
          data.indicador.meta,
          data.indicador.unidad,
          data.indicador.beneficiarios
        ]
      );
    }

    return actividad;
  },




  async getActividad(id: number) {
    const result = await query(
      `SELECT a.*, p.nombre as proyecto_nombre, p.anio, u.nombre_completo as responsable_nombre
       FROM actividad a
       JOIN proyecto p ON a.id_proyecto = p.id
       LEFT JOIN usuario u ON a.id_responsable = u.id
       WHERE a.id = $1`,
      [id]
    );
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Actividad no encontrada' };
    return result.rows[0];
  },

  async updatePlanMensual(actividadId: number, meses: any[]) {
    await query('DELETE FROM actividad_mes_plan WHERE id_actividad = $1', [actividadId]);

    for (const item of meses) {
      let mesNum: number | null = null;
      if (typeof item === 'number') {
        mesNum = item;
      } else if (item && item.planificado) {
        mesNum = item.mes;
      }

      if (mesNum) {
        await query(
          'INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES ($1, $2, true)',
          [actividadId, mesNum]
        );
      }
    }

    return { success: true };
  },

  async crearIndicador(actividadId: number, data: any) {
    const result = await query(
      `INSERT INTO indicador_actividad (
        id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento
      )
      VALUES ($1, $2, $3, $4, $5, $6, 0, 0) RETURNING *`,
      [
        actividadId,
        data.categoria || 'Generico',
        data.descripcion_especifica,
        data.meta_valor,
        data.unidad_medida,
        data.beneficiarios
      ]
    );
    return result.rows[0];
  },


  // Seguimiento (Page2)
  async getSeguimientoProyecto(proyectoId: number) {
    // Obtener información del proyecto
    const proyectoResult = await query(
      'SELECT id, nombre, anio FROM proyecto WHERE id = $1',
      [proyectoId]
    );

    if (proyectoResult.rows.length === 0) {
      throw { statusCode: 404, message: 'Proyecto no encontrado' };
    }

    const proyecto = proyectoResult.rows[0];

    // Obtener actividades con sus datos relacionados
    const actividades = await query(
      `SELECT a.id as id_actividad, a.nombre, a.presupuesto_asignado, 
        a.id_responsable, a.cargo_responsable,
        u.nombre_completo as responsable_nombre,
        (SELECT json_agg(json_build_object('mes', mes, 'planificado', planificado)) 
         FROM actividad_mes_plan WHERE id_actividad = a.id) as plan_mensual,
        (SELECT json_agg(json_build_object('mes', mes, 'estado', estado, 'comentario', comentario)) 
         FROM actividad_mes_seguimiento WHERE id_actividad = a.id) as seguimiento_mensual,
        (SELECT json_agg(json_build_object(
          'id_indicador', i.id,
          'nombre', i.descripcion_especifica,
          'unidad_medida', i.unidad_medida,
          'meta', i.meta_valor,
          'valor_logrado', i.valor_logrado,
          'porcentaje_cumplimiento', i.porcentaje_cumplimiento,
          'categoria', i.categoria,
          'beneficiarios', i.beneficiarios
        )) FROM indicador_actividad i WHERE i.id_actividad = a.id) as indicadores,
        COALESCE(SUM(g.monto), 0) as total_gastado
       FROM actividad a
       LEFT JOIN usuario u ON a.id_responsable = u.id
       LEFT JOIN gasto_actividad g ON a.id = g.id_actividad
       WHERE a.id_proyecto = $1
       GROUP BY a.id, u.nombre_completo
       ORDER BY a.created_at`,
      [proyectoId]
    );

    // Obtener costos
    const costos = await query(
      `SELECT * FROM costo_proyecto WHERE id_proyecto = $1 ORDER BY id`,
      [proyectoId]
    );

    // Retornar en el formato esperado por el frontend
    return {
      id_proyecto: proyecto.id,
      nombre: proyecto.nombre,
      anio: proyecto.anio,
      actividades: actividades.rows,
      costos: costos.rows // Agregado
    };
  },

  async updateSeguimientoMensual(actividadId: number, seguimiento: any[]) {
    // 1. First delete all existing status for this activity to ensure we sync exactly with frontend
    // (This handles the case where user removes a status by setting it to empty/undefined)
    await query('DELETE FROM actividad_mes_seguimiento WHERE id_actividad = $1', [actividadId]);

    // 2. Insert the current valid statuses
    for (const item of seguimiento) {
      if (item.estado) { // Only insert if there is a status
        await query(
          `INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario)
           VALUES ($1, $2, $3, $4)`,
          [actividadId, item.mes, item.estado, item.comentario || '']
        );
      }
    }

    return { success: true };
  },

  async updateAvanceIndicador(indicadorId: number, data: any) {
    const result = await query(
      `UPDATE indicador_actividad SET valor_logrado = $1, porcentaje_cumplimiento = $2 WHERE id = $3 RETURNING *`,
      [data.valor_logrado, data.porcentaje_cumplimiento, indicadorId]
    );
    return result.rows[0];
  },

  // Gestión de Proyecto (Delete)
  async deleteProyecto(id: number) {
    // La eliminación en cascada depende de la configuración de FKs en la BD.
    // Asumiendo que NO hay ON DELETE CASCADE configurado, lo haremos manual por seguridad.

    // 1. Borrar gastos de actividades del proyecto
    await query(`
      DELETE FROM gasto_actividad 
      WHERE id_actividad IN (SELECT id FROM actividad WHERE id_proyecto = $1)
    `, [id]);

    // 2. Borrar indicadores
    await query(`
      DELETE FROM indicador_actividad 
      WHERE id_actividad IN (SELECT id FROM actividad WHERE id_proyecto = $1)
    `, [id]);

    // 3. Borrar planes mensuales
    await query(`
      DELETE FROM actividad_mes_plan 
      WHERE id_actividad IN (SELECT id FROM actividad WHERE id_proyecto = $1)
    `, [id]);

    // 4. Borrar seguimientos mensuales
    await query(`
      DELETE FROM actividad_mes_seguimiento 
      WHERE id_actividad IN (SELECT id FROM actividad WHERE id_proyecto = $1)
    `, [id]);

    // 5. Borrar roles de usuario en proyecto
    await query('DELETE FROM proyecto_usuario_rol WHERE id_proyecto = $1', [id]);

    // 6. Borrar actividades
    await query('DELETE FROM actividad WHERE id_proyecto = $1', [id]);

    // 7. Borrar proyecto
    const result = await query('DELETE FROM proyecto WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Proyecto no encontrado' };
    }

    return { success: true, message: 'Proyecto eliminado correctamente' };
  },

  // Gestión de Actividades (Update/Delete)
  async updateActividad(id: number, data: any) {
    const result = await query(
      `UPDATE actividad 
       SET nombre = $1, descripcion = $2, id_responsable = $3, cargo_responsable = $4, unidad_responsable = $5, presupuesto_asignado = $6
       WHERE id = $7 RETURNING *`,
      [
        data.nombre,
        data.descripcion,
        data.id_responsable || null,
        data.cargo_responsable || '',
        data.unidad_responsable || '',
        Number(data.presupuesto_asignado) || 0,
        id
      ]
    );

    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Actividad no encontrada' };
    }

    const actividad = result.rows[0];

    // Actualizar Plan Mensual si se envía
    if (Array.isArray(data.meses)) {
      await this.updatePlanMensual(id, data.meses);
    }

    // Actualizar Indicador si se envía
    if (data.indicador) {
      // Buscar indicador existente
      const indCheck = await query('SELECT id FROM indicador_actividad WHERE id_actividad = $1', [id]);
      if (indCheck.rows.length > 0) {
        await query(
          `UPDATE indicador_actividad 
                 SET categoria = $1, descripcion_especifica = $2, meta_valor = $3, unidad_medida = $4, beneficiarios = $5 
                 WHERE id = $6`,
          [
            data.indicador.categoria,
            data.indicador.descripcion,
            data.indicador.meta,
            data.indicador.unidad,
            data.indicador.beneficiarios,
            indCheck.rows[0].id
          ]
        );
      } else {
        // Crear si no existe (raro en update, pero posible)
        // Crear si no existe (raro en update, pero posible)
        await this.crearIndicador(id, {
          categoria: data.indicador.categoria,
          descripcion_especifica: data.indicador.descripcion,
          unidad_medida: data.indicador.unidad,
          meta_valor: data.indicador.meta,
          beneficiarios: data.indicador.beneficiarios
        });

        await query(
          `INSERT INTO indicador_actividad (
                  id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento
                ) VALUES ($1, $2, $3, $4, $5, $6, 0, 0)`,
          [
            id,
            data.indicador.categoria,
            data.indicador.descripcion,
            data.indicador.meta,
            data.indicador.unidad,
            data.indicador.beneficiarios
          ]
        );
      }
    }

    // Sincronización de Costo (Solo si existe UNO único asociado)
    const costosCheck = await query('SELECT id, cantidad FROM costo_proyecto WHERE id_actividad = $1', [id]);
    if (costosCheck.rows.length === 1) {
      const costoRow = costosCheck.rows[0];
      const nuevoTotal = Number(data.presupuesto_asignado) || 0;
      const cantidad = Number(costoRow.cantidad) || 1; // Avoid division by zero
      const nuevoUnitario = cantidad !== 0 ? nuevoTotal / cantidad : nuevoTotal;

      await query(
        'UPDATE costo_proyecto SET costo_total = $1, precio_unitario = $2 WHERE id = $3',
        [nuevoTotal, nuevoUnitario, costoRow.id]
      );
    }

    return actividad;
  },

  async deleteActividad(id: number) {
    // Borrado manual de dependencias
    await query('DELETE FROM gasto_actividad WHERE id_actividad = $1', [id]);
    await query('DELETE FROM indicador_actividad WHERE id_actividad = $1', [id]);
    await query('DELETE FROM actividad_mes_plan WHERE id_actividad = $1', [id]);
    await query('DELETE FROM actividad_mes_seguimiento WHERE id_actividad = $1', [id]);
    // evidencias? faltaba borrar evidencias en cascada manual
    await query('DELETE FROM evidencia_actividad WHERE id_actividad = $1', [id]); // Asumiendo nombre tabla

    const result = await query('DELETE FROM actividad WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Actividad no encontrada' };
    }
    return { success: true };
  },

  // Reporte Completo
  async getReporteProyecto(proyectoId: number) {
    // 1. Info Proyecto + Responsable
    const proyectoRes = await query(`
      SELECT p.*, u.nombre_completo as responsable, u.cargo as responsable_cargo
      FROM proyecto p 
      LEFT JOIN usuario u ON p.id_responsable = u.id 
      WHERE p.id = $1
    `, [proyectoId]);

    if (proyectoRes.rows.length === 0) throw { statusCode: 404, message: 'Proyecto no encontrado' };
    const proyecto = proyectoRes.rows[0];

    // 2. Equipo (Consolidado: Responsable Proyecto + Responsables Actividades)
    const equipoRes = await query(`
      WITH equipo_consolidado AS (
          -- Responsable del proyecto
          SELECT u.nombre_completo, u.email, 'Responsable del Proyecto' as rol, 1 as jerarquia
          FROM proyecto p
          JOIN usuario u ON p.id_responsable = u.id
          WHERE p.id = $1

          UNION

          -- Responsables de actividades (Excluyendo si ya es responsable del proyecto para no duplicar visualmente si se desea, o dejarlo para mostrar rol)
          SELECT DISTINCT u.nombre_completo, u.email, 'Responsable de Actividad' as rol, 2 as jerarquia
          FROM actividad a
          JOIN usuario u ON a.id_responsable = u.id
          WHERE a.id_proyecto = $1
      )
      SELECT nombre_completo, email as email, rol 
      FROM equipo_consolidado
      ORDER BY jerarquia, nombre_completo
    `, [proyectoId]);

    // 3. Costos (Fijos/Variables)
    const costosRes = await query(`
        SELECT * FROM costo_proyecto WHERE id_proyecto = $1 ORDER BY tipo, descripcion
    `, [proyectoId]);

    // 4. Actividades completas (con gastos, evidencias, indicadores, plan)
    const actividadesRes = await query(`
        SELECT 
            a.id, a.nombre, a.descripcion, a.presupuesto_asignado,
            u.nombre_completo as responsable,
            -- Plan Mensual
            (SELECT json_agg(mes) FROM actividad_mes_plan WHERE id_actividad = a.id AND planificado = true) as meses_plan,
            -- Seguimiento
            (SELECT json_agg(json_build_object('mes', mes, 'estado', estado)) FROM actividad_mes_seguimiento WHERE id_actividad = a.id) as seguimiento,
            -- Indicador
            (SELECT json_agg(json_build_object(
                'meta', meta_valor,
                'logrado', valor_logrado,
                'cumplimiento', porcentaje_cumplimiento,
                'unidad', unidad_medida,
                'descripcion', descripcion_especifica
            )) FROM indicador_actividad WHERE id_actividad = a.id) as indicadores,
            -- Gastos
            (SELECT json_agg(json_build_object(
                'fecha', fecha,
                'descripcion', descripcion,
                'monto', monto
            )) FROM gasto_actividad WHERE id_actividad = a.id) as gastos,
            -- Evidencias (Asumiendo tabla 'evidencia_actividad' o similar, revisar db.sql si falla)
            -- En routes/evidencias usa getEvidenciasByActividad.
            -- Asumiremos 'evidencia_actividad' por convención, si falla ajustamos.
            (SELECT json_agg(json_build_object(
                'tipo', tipo,
                'descripcion', descripcion,
                'archivo', ruta_archivo,
                'fecha', fecha
            )) FROM evidencia_actividad WHERE id_actividad = a.id) as evidencias
        FROM actividad a
        LEFT JOIN usuario u ON a.id_responsable = u.id
        WHERE a.id_proyecto = $1
        ORDER BY a.created_at
    `, [proyectoId]);

    return {
      proyecto,
      equipo: equipoRes.rows,
      costos: costosRes.rows,
      actividades: actividadesRes.rows
    };
  },
  async duplicarPOA(anioOrigen: number, anioDestino: number, userId: number) {
    const client = await import('../config/db').then(m => m.pool.connect());

    try {
      await client.query('BEGIN');

      // 1. Obtener proyectos del año origen
      const proyectosRes = await client.query('SELECT * FROM proyecto WHERE anio = $1', [anioOrigen]);
      const proyectos = proyectosRes.rows;

      if (proyectos.length === 0) {
        throw { statusCode: 400, message: `No hay proyectos en el año ${anioOrigen} para duplicar.` };
      }

      // 2. Verificar si ya existen proyectos en el año destino (Advertencia o Bloqueo? Por ahora permitimos, pero el usuario debe saber)
      // Opcional: const existe = await client.query('SELECT 1 FROM proyecto WHERE anio = $1 LIMIT 1', [anioDestino]);

      for (const p of proyectos) {
        // A. Insertar Proyecto Copia
        const nuevoPRes = await client.query(`
          INSERT INTO proyecto (
            anio, unidad_facultad, linea_estrategica, objetivo_estrategico, 
            accion_estrategica, nombre, objetivo_proyecto, presupuesto_total, id_responsable, activo
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
          RETURNING id
        `, [
          anioDestino, p.unidad_facultad, p.linea_estrategica, p.objetivo_estrategico,
          p.accion_estrategica, p.nombre, p.objetivo_proyecto, p.presupuesto_total, p.id_responsable
        ]);
        const nuevoId = nuevoPRes.rows[0].id;

        // B. Asignar Rol al OWNER (Mismo usuario que creó o el responsable original? Usaremos el que ejecuta la acción como owner administrativo)
        await client.query(`
          INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES ($1, $2, 'OWNER')
        `, [nuevoId, userId]);

        // C. Copiar Costos
        const costosRes = await client.query('SELECT * FROM costo_proyecto WHERE id_proyecto = $1', [p.id]);
        for (const c of costosRes.rows) {
          await client.query(`
            INSERT INTO costo_proyecto (id_proyecto, tipo, descripcion, precio_unitario, cantidad, costo_total, unidad, id_actividad, incluir_en_avance)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [nuevoId, c.tipo, c.descripcion, c.precio_unitario, c.cantidad, c.costo_total, c.unidad, null, c.incluir_en_avance ?? true]); // id_actividad set to null to avoid old references
        }

        // D. Copiar Actividades
        const actRes = await client.query('SELECT * FROM actividad WHERE id_proyecto = $1', [p.id]);
        for (const a of actRes.rows) {
          const nuevaActRes = await client.query(`
            INSERT INTO actividad (
              id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, 
              unidad_responsable, presupuesto_asignado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
          `, [
            nuevoId, a.nombre, a.descripcion, a.id_responsable, a.cargo_responsable,
            a.unidad_responsable, a.presupuesto_asignado
          ]);
          const nuevaActId = nuevaActRes.rows[0].id;

          // E. Copiar Plan Mensual
          const planRes = await client.query('SELECT * FROM actividad_mes_plan WHERE id_actividad = $1 AND planificado = true', [a.id]);
          for (const plan of planRes.rows) {
            await client.query(`
              INSERT INTO actividad_mes_plan (id_actividad, mes, planificado)
              VALUES ($1, $2, true)
            `, [nuevaActId, plan.mes]);
          }

          // F. Copiar Indicadores (Sin valores logrados)
          const indRes = await client.query('SELECT * FROM indicador_actividad WHERE id_actividad = $1', [a.id]);
          for (const ind of indRes.rows) {
            await client.query(`
              INSERT INTO indicador_actividad (
                id_actividad, categoria, descripcion_especifica, meta_valor, 
                unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento
              ) VALUES ($1, $2, $3, $4, $5, $6, 0, 0)
            `, [
              nuevaActId, ind.categoria, ind.descripcion_especifica, ind.meta_valor,
              ind.unidad_medida, ind.beneficiarios
            ]);
          }
        }
      }

      await client.query('COMMIT');
      return { success: true, message: `POA duplicado correctamente al año ${anioDestino}` };

    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Error duplicando POA:', e);
      // Re-lanzar con mensaje claro para el frontend
      throw { statusCode: 500, message: `Error SQL: ${(e as any).message}` };
    } finally {
      client.release();
    }
  }
};
