-- Migración: Agregar columna para controlar inclusión en cálculo de avance
-- Fecha: 2026-01-10
-- Descripción: Permite excluir costos fijos (como salarios) del cálculo de % de ejecución financiera

BEGIN;

-- Agregar columna para indicar si el costo se incluye en cálculo de avance
ALTER TABLE costo_proyecto 
ADD COLUMN incluir_en_avance BOOLEAN NOT NULL DEFAULT true;

-- Comentario explicativo
COMMENT ON COLUMN costo_proyecto.incluir_en_avance IS 
  'Indica si este costo debe incluirse en el cálculo del porcentaje de avance financiero. '
  'Útil para excluir salarios u otros costos no gestionados directamente por el proyecto.';

COMMIT;
