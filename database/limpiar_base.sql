-- ===================================================
-- SCRIPT DE LIMPIEZA TOTAL
-- ===================================================
-- Borra TODOS los datos de las tablas para dejar la BD vacía
-- pero manteniendo la estructura (tablas y columnas).

DO $$ 
BEGIN

-- Desactivar triggers temporalmente si es necesario (postgres maneja constraints con CASCADE)

TRUNCATE TABLE 
    usuario, 
    proyecto, 
    actividad,
    proyecto_usuario_rol,
    actividad_mes_plan,
    actividad_mes_seguimiento,
    indicador_actividad,
    gasto_actividad,
    evidencia_actividad,
    costo_proyecto
RESTART IDENTITY CASCADE;

RAISE NOTICE 'Base de datos limpiada correctamente.';
END $$;
