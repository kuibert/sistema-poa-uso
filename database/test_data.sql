-- ========================================
-- DATOS DE PRUEBA PARA POA SYSTEM
-- ========================================
-- Ejecutar DESPUÉS de base_postgres.sql

BEGIN;

-- ========================================
-- 1. USUARIOS DE PRUEBA
-- ========================================
INSERT INTO usuario (nombre_completo, correo, cargo, unidad, activo, contrasena, rol) VALUES
('Administrador Sistema', 'admin@uso.edu.sv', 'Admin', 'Gerencia', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte', 'ADMIN'),
('Carlos Roberto Martínez Martínez', 'carlos.martinez@uso.edu.sv', 'Director de Ingeniería', 'Facultad de Ingeniería', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte', 'EDITOR'),
('Marvin Adonay Alarcón', 'marvin.alarcon@uso.edu.sv', 'Coordinador de Acreditación', 'Facultad de Ingeniería', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte', 'EDITOR'),
('Henry Manuel Pérez', 'henry.perez@uso.edu.sv', 'Docente Investigador', 'Facultad de Ingeniería', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte', 'EDITOR'),
('Gabriela López', 'gabriela.lopez@uso.edu.sv', 'Asistente Administrativa', 'Facultad de Ingeniería', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte', 'VIEWER');

-- ========================================
-- 2. PROYECTOS DE PRUEBA (2025)
-- ========================================
INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo) VALUES
(
  2025, 
  'Facultad de Ingeniería',
  'Calidad Académica',
  'Alcanzar la acreditación internacional de programas académicos',
  'Gestión de acreditación de la Carrera de Ingeniería Industrial',
  'Lograr la acreditación de la carrera de Ingeniería Industrial ante ACAAI antes de diciembre 2025',
  1, -- Carlos Martínez
  15000.00,
  true
),
(
  2025,
  'Facultad de Ingeniería',
  'Infraestructura Tecnológica',
  'Modernizar los laboratorios de enseñanza',
  'Fortalecimiento de laboratorios de Ingeniería Eléctrica',
  'Equipar y modernizar los laboratorios de circuitos y sistemas de potencia',
  2, -- Marvin Alarcón
  25000.00,
  true
);

-- ========================================
-- 3. ACTIVIDADES DEL PROYECTO 1 (Acreditación)
-- ========================================
INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado) VALUES
(1, 'Acercamiento y entendimiento con ACAAI', 'Reuniones y coordinación con la entidad acreditadora', 1, 'Director', 'Facultad de Ingeniería', 5000.00),
(1, 'Capacitación de actores de la USO', 'Formación del personal en procesos de acreditación', 2, 'Coordinador', 'Facultad de Ingeniería', 6000.00),
(1, 'Recopilación de documentación y autoevaluación', 'Elaboración del expediente completo de acreditación', 3, 'Docente', 'Facultad de Ingeniería', 4000.00);

-- ========================================
-- 4. ACTIVIDADES DEL PROYECTO 2 (Laboratorios)
-- ========================================
INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado) VALUES
(2, 'Adquisición de equipos de medición', 'Compra de osciloscopios y multímetros digitales', 2, 'Coordinador', 'Facultad de Ingeniería', 15000.00),
(2, 'Capacitación en uso de equipos', 'Entrenamiento de docentes y estudiantes', 3, 'Docente', 'Facultad de Ingeniería', 3000.00);

-- ========================================
-- 5. PLANIFICACIÓN MENSUAL (Actividad 1)
-- ========================================
-- Actividad 1: Acercamiento ACAAI - Feb, Mar, Abr
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(1, 2, true),  -- Febrero
(1, 3, true),  -- Marzo
(1, 4, true);  -- Abril

-- Actividad 2: Capacitación - Ene, Feb, Mar, May
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(2, 1, true),  -- Enero
(2, 2, true),  -- Febrero
(2, 3, true),  -- Marzo
(2, 5, true);  -- Mayo

-- ========================================
-- 6. SEGUIMIENTO MENSUAL
-- ========================================
-- Actividad 1
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(1, 2, 'I', 'En proceso - Primera reunión realizada'),
(1, 3, 'P', 'Planificado para marzo'),
(1, 4, 'F', 'Completado - Acuerdos firmados');

-- Actividad 2
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(2, 1, 'P', 'Planificado'),
(2, 2, 'I', 'En proceso - Material preparado'),
(2, 3, 'I', 'En proceso - Talleres iniciados'),
(2, 5, 'F', 'Completado exitosamente');

-- ========================================
-- 7. INDICADORES DE ACTIVIDADES
-- ========================================
-- Indicador Actividad 1
INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento) VALUES
(1, '% de actividades ejecutadas', 'Reuniones realizadas con la entidad acreditadora', 4, 'Reuniones', 'Equipo de acreditación', 2, 50.00);

-- Indicador Actividad 2
INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento) VALUES
(2, 'Nº de personas beneficiadas directamente', 'Docentes capacitados en el modelo de acreditación', 12, 'Personas', 'Docentes USO', 8, 66.67);

-- Indicador Actividad 3
INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento) VALUES
(3, 'Nº de productos / documentos generados', 'Expediente completo de autoevaluación elaborado', 1, 'Documento', 'Carrera / Facultad', 0, 0.00);

-- ========================================
-- 8. GASTOS DE ACTIVIDADES
-- ========================================
-- Gastos Actividad 1
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(1, '2025-02-15', 'Costo de inscripción ACAAI', 500.00, 1),
(1, '2025-03-10', 'Viáticos para reunión presencial', 300.00, 1),
(1, '2025-03-20', 'Material de presentación', 200.00, 1);

-- Gastos Actividad 2
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(2, '2025-01-20', 'Material didáctico para taller', 400.00, 2),
(2, '2025-02-15', 'Alquiler de sala de capacitación', 600.00, 2),
(2, '2025-03-05', 'Refrigerios para participantes', 1000.00, 2);

-- ========================================
-- 9. EVIDENCIAS DE ACTIVIDADES
-- ========================================
-- Evidencias Actividad 1
INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por) VALUES
(1, '2025-02-15', 'Acta', 'Acta de primera reunión con ACAAI', '/uploads/acta_reunion_acaai_feb2025.pdf', 'acta_reunion_acaai_feb2025.pdf', 'application/pdf', 1),
(1, '2025-03-10', 'Fotografía', 'Foto del equipo en reunión presencial', '/uploads/foto_reunion_marzo.jpg', 'foto_reunion_marzo.jpg', 'image/jpeg', 1),
(1, '2025-04-05', 'Documento', 'Acuerdo de cooperación firmado', '/uploads/acuerdo_acaai.pdf', 'acuerdo_acaai.pdf', 'application/pdf', 1);

-- Evidencias Actividad 2
INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por) VALUES
(2, '2025-02-01', 'Informe', 'Informe de capacitación mes 1', '/uploads/informe_cap_febrero.pdf', 'informe_cap_febrero.pdf', 'application/pdf', 2),
(2, '2025-03-15', 'Fotografía', 'Evidencia fotográfica del taller', '/uploads/fotos_taller_marzo.jpg', 'fotos_taller_marzo.jpg', 'image/jpeg', 2);

-- ========================================
-- 10. PERMISOS DE PROYECTOS
-- ========================================
-- Proyecto 1 - Acreditación
INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES
(1, 1, 'OWNER'),   -- Carlos es dueño
(1, 2, 'EDITOR'),  -- Marvin puede editar
(1, 3, 'EDITOR');  -- Henry puede editar

-- Proyecto 2 - Laboratorios
INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES
(2, 2, 'OWNER'),   -- Marvin es dueño
(2, 1, 'VIEWER'),  -- Carlos solo visualiza
(2, 3, 'EDITOR');  -- Henry puede editar

COMMIT;

-- ========================================
-- VERIFICACIÓN
-- ========================================
-- Ejecuta estas queries para verificar los datos:
-- SELECT * FROM usuario;
-- SELECT * FROM proyecto;
-- SELECT * FROM actividad;
-- SELECT * FROM gasto_actividad;
-- SELECT * FROM evidencia_actividad;
