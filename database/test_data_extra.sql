-- ========================================
-- DATOS DE PRUEBA ADICIONALES PARA POA SYSTEM
-- ========================================
-- Ejecutar DESPUÉS de test_data.sql
-- Este archivo agrega más proyectos, actividades, evidencias y gastos

BEGIN;

-- ========================================
-- 1. MÁS USUARIOS
-- ========================================
INSERT INTO usuario (nombre_completo, correo, cargo, unidad, activo, contrasena) VALUES
('Ana María Rodríguez', 'ana.rodriguez@uso.edu.sv', 'Decana', 'Facultad de Ciencias Económicas', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte'),
('Roberto Carlos Gómez', 'roberto.gomez@uso.edu.sv', 'Jefe de Departamento', 'Facultad de Medicina', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte'),
('Laura Patricia Hernández', 'laura.hernandez@uso.edu.sv', 'Coordinadora de Investigación', 'Facultad de Ingeniería', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte'),
('Miguel Ángel Torres', 'miguel.torres@uso.edu.sv', 'Asistente Académico', 'Facultad de Ciencias Económicas', true, '$2a$10$/bUrFujA/x5LdVeJM555Iu1NJlREvO71V6cLqpkyGTUlQMu0KoWte');

-- ========================================
-- 2. MÁS PROYECTOS (2025)
-- ========================================
INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo) VALUES
(
  2025,
  'Facultad de Ciencias Económicas',
  'Innovación Pedagógica',
  'Implementar metodologías activas de enseñanza',
  'Implementación de simuladores empresariales',
  'Fortalecer el aprendizaje práctico mediante simuladores de negocios en las carreras de administración',
  5, -- Ana María Rodríguez
  18000.00,
  true
),
(
  2025,
  'Facultad de Medicina',
  'Extensión Social',
  'Ampliar el impacto de programas comunitarios',
  'Brigadas médicas en zonas rurales',
  'Realizar brigadas médicas mensuales en comunidades de difícil acceso',
  6, -- Roberto Carlos Gómez
  22000.00,
  true
),
(
  2025,
  'Facultad de Ingeniería',
  'Investigación y Desarrollo',
  'Incrementar la producción científica',
  'Fortalecimiento de grupos de investigación',
  'Consolidar 3 grupos de investigación en energías renovables y automatización',
  7, -- Laura Patricia Hernández
  30000.00,
  true
);

-- ========================================
-- 3. ACTIVIDADES DEL PROYECTO 3 (Simuladores)
-- ========================================
INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado) VALUES
(3, 'Evaluación y selección de plataformas', 'Análisis comparativo de simuladores empresariales disponibles', 5, 'Decana', 'Facultad de Ciencias Económicas', 3000.00),
(3, 'Adquisición de licencias de software', 'Compra de licencias para 100 estudiantes', 8, 'Asistente', 'Facultad de Ciencias Económicas', 12000.00),
(3, 'Capacitación docente en uso de simuladores', 'Formación de 15 docentes en el manejo de herramientas', 5, 'Decana', 'Facultad de Ciencias Económicas', 3000.00);

-- ========================================
-- 4. ACTIVIDADES DEL PROYECTO 4 (Brigadas)
-- ========================================
INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado) VALUES
(4, 'Planificación y logística de brigadas', 'Coordinación con alcaldías y comunidades', 6, 'Jefe', 'Facultad de Medicina', 5000.00),
(4, 'Ejecución de 12 brigadas médicas', 'Atención médica general, odontología y medicina preventiva', 6, 'Jefe', 'Facultad de Medicina', 15000.00),
(4, 'Evaluación de impacto y seguimiento', 'Medición de resultados y mejora continua', 6, 'Jefe', 'Facultad de Medicina', 2000.00);

-- ========================================
-- 5. ACTIVIDADES DEL PROYECTO 5 (Investigación)
-- ========================================
INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado) VALUES
(5, 'Conformación de grupos de investigación', 'Selección de investigadores y definición de líneas', 7, 'Coordinadora', 'Facultad de Ingeniería', 5000.00),
(5, 'Adquisición de equipamiento especializado', 'Compra de sensores, microcontroladores y paneles solares', 7, 'Coordinadora', 'Facultad de Ingeniería', 20000.00),
(5, 'Publicación de resultados', 'Escritura y publicación de al menos 5 artículos científicos', 7, 'Coordinadora', 'Facultad de Ingeniería', 5000.00);

-- ========================================
-- 6. PLANIFICACIÓN MENSUAL (Nuevas Actividades)
-- ========================================
-- Actividad 3: Recopilación - May a Ago
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(3, 5, true), (3, 6, true), (3, 7, true), (3, 8, true);

-- Actividad 4: Adquisición equipos - Ene a Mar
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(4, 1, true), (4, 2, true), (4, 3, true);

-- Actividad 5: Capacitación - Abr a Jun
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(5, 4, true), (5, 5, true), (5, 6, true);

-- Actividad 6: Evaluación simuladores - Ene a Feb
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(6, 1, true), (6, 2, true);

-- Actividad 7: Adquisición licencias - Mar a Abr
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(7, 3, true), (7, 4, true);

-- Actividad 8: Capacitación docente - May a Jul
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(8, 5, true), (8, 6, true), (8, 7, true);

-- Actividad 9: Planificación brigadas - Todo el año
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(9, 1, true), (9, 2, true), (9, 3, true), (9, 4, true), (9, 5, true), (9, 6, true),
(9, 7, true), (9, 8, true), (9, 9, true), (9, 10, true), (9, 11, true), (9, 12, true);

-- Actividad 10: Ejecución brigadas - Todo el año
INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES
(10, 1, true), (10, 2, true), (10, 3, true), (10, 4, true), (10, 5, true), (10, 6, true),
(10, 7, true), (10, 8, true), (10, 9, true), (10, 10, true), (10, 11, true), (10, 12, true);

-- ========================================
-- 7. SEGUIMIENTO MENSUAL (Nuevas Actividades)
-- ========================================
-- Actividad 3: Recopilación documentación
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(3, 5, 'P', 'Planificado'),
(3, 6, 'P', 'Planificado'),
(3, 7, 'P', 'En espera de aprobación'),
(3, 8, 'P', 'Planificado');

-- Actividad 6: Evaluación simuladores
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(6, 1, 'F', 'Completado - 5 plataformas evaluadas'),
(6, 2, 'F', 'Selección finalizada');

-- Actividad 7: Adquisición licencias
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(7, 3, 'I', 'En proceso de compra'),
(7, 4, 'P', 'Pendiente de entrega');

-- Actividad 9: Planificación brigadas
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(9, 1, 'F', 'Coordinación completada'),
(9, 2, 'F', 'Logística organizada'),
(9, 3, 'I', 'En coordinación con alcaldía'),
(9, 4, 'P', 'Planificado');

-- Actividad 10: Ejecución brigadas
INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES
(10, 1, 'F', 'Primera brigada exitosa - 150 atendidos'),
(10, 2, 'F', 'Segunda brigada - 200 atendidos'),
(10, 3, 'I', 'Brigada en preparación'),
(10, 4, 'P', 'Planificada para abril');

-- ========================================
-- 8. INDICADORES (Nuevas Actividades)
-- ========================================
INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento) VALUES
(4, 'Nº de productos / documentos generados', 'Equipos de laboratorio adquiridos', 8, 'Equipos', 'Estudiantes de Ingeniería Eléctrica', 5, 62.50),
(5, 'Nº de personas beneficiadas directamente', 'Docentes capacitados en uso de equipos', 10, 'Personas', 'Docentes', 0, 0.00),
(6, 'Nº de productos / documentos generados', 'Informe comparativo de plataformas', 1, 'Documento', 'Facultad de Economía', 1, 100.00),
(7, 'Nº de productos / documentos generados', 'Licencias de software adquiridas', 100, 'Licencias', 'Estudiantes', 0, 0.00),
(8, 'Nº de personas beneficiadas directamente', 'Docentes capacitados en simuladores', 15, 'Personas', 'Docentes', 0, 0.00),
(9, 'Nº de actividades ejecutadas', 'Brigadas médicas planificadas', 12, 'Brigadas', 'Comunidades rurales', 12, 100.00),
(10, 'Nº de personas beneficiadas directamente', 'Pacientes atendidos en brigadas', 1500, 'Personas', 'Habitantes zona rural', 350, 23.33),
(11, 'Nº de productos / documentos generados', 'Grupos de investigación conformados', 3, 'Grupos', 'Facultad de Ingeniería', 0, 0.00),
(12, 'Nº de productos / documentos generados', 'Equipos de investigación instalados', 15, 'Equipos', 'Investigadores', 0, 0.00),
(13, 'Nº de productos / documentos generados', 'Artículos científicos publicados', 5, 'Artículos', 'Comunidad académica', 0, 0.00);

-- ========================================
-- 9. GASTOS ADICIONALES
-- ========================================
-- Gastos Actividad 3
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(3, '2025-05-10', 'Contratación de consultor externo', 1500.00, 3),
(3, '2025-06-05', 'Material de oficina y papelería', 300.00, 3),
(3, '2025-07-15', 'Impresión de documentos', 200.00, 3);

-- Gastos Actividad 6
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(6, '2025-01-15', 'Licencias de prueba de simuladores', 500.00, 5),
(6, '2025-02-10', 'Consultoría especializada', 2000.00, 5);

-- Gastos Actividad 7
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(7, '2025-03-20', 'Pago inicial licencias software', 6000.00, 8),
(7, '2025-04-15', 'Segundo pago licencias', 6000.00, 8);

-- Gastos Actividad 9
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(9, '2025-01-10', 'Combustible para vehículos', 800.00, 6),
(9, '2025-02-12', 'Material médico', 1200.00, 6),
(9, '2025-03-08', 'Alimentación para equipo médico', 500.00, 6);

-- Gastos Actividad 10
INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) VALUES
(10, '2025-01-25', 'Medicamentos para brigada enero', 3000.00, 6),
(10, '2025-02-28', 'Medicamentos para brigada febrero', 3500.00, 6),
(10, '2025-03-15', 'Transporte de equipo médico', 1000.00, 6);

-- ========================================
-- 10. EVIDENCIAS ADICIONALES
-- ========================================
-- Evidencias Actividad 3
INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por) VALUES
(3, '2025-08-01', 'Documento', 'Expediente completo de autoevaluación', '/uploads/expediente_autoevaluacion.pdf', 'expediente_autoevaluacion.pdf', 'application/pdf', 3);

-- Evidencias Actividad 6
INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por) VALUES
(6, '2025-02-20', 'Informe', 'Informe comparativo de simuladores', '/uploads/informe_simuladores.pdf', 'informe_simuladores.pdf', 'application/pdf', 5),
(6, '2025-02-25', 'Documento', 'Acta de selección de plataforma', '/uploads/acta_seleccion.pdf', 'acta_seleccion.pdf', 'application/pdf', 5);

-- Evidencias Actividad 10
INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por) VALUES
(10, '2025-01-26', 'Fotografía', 'Fotos brigada enero', '/uploads/brigada_enero.jpg', 'brigada_enero.jpg', 'image/jpeg', 6),
(10, '2025-01-26', 'Informe', 'Informe brigada enero', '/uploads/informe_brigada_ene.pdf', 'informe_brigada_ene.pdf', 'application/pdf', 6),
(10, '2025-02-28', 'Fotografía', 'Fotos brigada febrero', '/uploads/brigada_febrero.jpg', 'brigada_febrero.jpg', 'image/jpeg', 6),
(10, '2025-02-28', 'Informe', 'Informe brigada febrero', '/uploads/informe_brigada_feb.pdf', 'informe_brigada_feb.pdf', 'application/pdf', 6);

-- ========================================
-- 11. PERMISOS DE NUEVOS PROYECTOS
-- ========================================
-- Proyecto 3 - Simuladores
INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES
(3, 5, 'OWNER'),   -- Ana es dueña
(3, 8, 'EDITOR'),  -- Miguel puede editar
(3, 1, 'VIEWER');  -- Carlos solo visualiza

-- Proyecto 4 - Brigadas
INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES
(4, 6, 'OWNER'),   -- Roberto es dueño
(4, 1, 'VIEWER');  -- Carlos solo visualiza

-- Proyecto 5 - Investigación
INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES
(5, 7, 'OWNER'),   -- Laura es dueña
(5, 1, 'EDITOR'),  -- Carlos puede editar
(5, 3, 'EDITOR');  -- Henry puede editar

COMMIT;

-- ========================================
-- VERIFICACIÓN
-- ========================================
-- Ahora tienes:
-- - 8 usuarios
-- - 5 proyectos
-- - 13 actividades
-- - Múltiples seguimientos, gastos y evidencias
-- 
-- Ejecuta para verificar:
-- SELECT COUNT(*) FROM usuario;        -- 8
-- SELECT COUNT(*) FROM proyecto;       -- 5
-- SELECT COUNT(*) FROM actividad;      -- 13
-- SELECT COUNT(*) FROM gasto_actividad; -- 22
-- SELECT COUNT(*) FROM evidencia_actividad; -- 12
