-- ==============================================================================
-- SEMILLA DE DATOS MAESTRA - SISTEMA POA
-- ==============================================================================
-- Este script carga TODOS los datos de prueba necesarios para el sistema.
-- Incluye: Usuarios, Proyectos, Actividades, Planificación, Seguimiento, etc.
-- Es seguro de ejecutar múltiples veces (idempotente para usuarios, aditivo para proyectos).

SET client_encoding = 'UTF8';

BEGIN;

-- ==============================================================================
-- 1. USUARIOS (Se insertan si no existen)
-- ==============================================================================
INSERT INTO usuario (nombre_completo, email, cargo, unidad, activo, contrasena, rol) VALUES
-- Usuarios Originales
('Administrador Sistema', 'admin@uso.edu.sv', 'Admin', 'Gerencia', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'ADMIN'),
('Carlos Roberto Martínez Martínez', 'carlos.martinez@uso.edu.sv', 'Director de Ingeniería', 'Facultad de Ingeniería', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR'),
('Marvin Adonay Alarcón', 'marvin.alarcon@uso.edu.sv', 'Coordinador de Acreditación', 'Facultad de Ingeniería', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR'),
('Henry Manuel Pérez', 'henry.perez@uso.edu.sv', 'Docente Investigador', 'Facultad de Ingeniería', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR'),
('Gabriela López', 'gabriela.lopez@uso.edu.sv', 'Asistente Administrativa', 'Facultad de Ingeniería', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'VIEWER'),
-- Usuarios Adicionales
('Ana María Rodríguez', 'ana.rodriguez@uso.edu.sv', 'Decana', 'Facultad de Ciencias Económicas', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR'),
('Roberto Carlos Gómez', 'roberto.gomez@uso.edu.sv', 'Jefe de Departamento', 'Facultad de Medicina', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR'),
('Laura Patricia Hernández', 'laura.hernandez@uso.edu.sv', 'Coordinadora de Investigación', 'Facultad de Ingeniería', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR'),
('Miguel Ángel Torres', 'miguel.torres@uso.edu.sv', 'Asistente Académico', 'Facultad de Ciencias Económicas', true, '$2a$10$pTvJYodELFGUJ.7.K0duVuPnd842xQTdY4Ha3Wkzf45DLc5qnPOfu', 'EDITOR')
ON CONFLICT (email) DO NOTHING;


-- ==============================================================================
-- 2. CARGA LÓGICA DE PROYECTOS Y DETALLES
-- ==============================================================================
DO $$
DECLARE
    -- Variables Usuarios
    u_admin INT; u_carlos INT; u_marvin INT; u_henry INT; u_gaby INT;
    u_ana INT; u_rob INT; u_lau INT; u_mig INT;

    -- Variables Proyectos
    p_acred INT; p_lab INT; p_sim INT; p_brig INT; p_inv INT;

    -- Variables Actividades
    a_acred_1 INT; a_acred_2 INT; a_acred_3 INT;
    a_lab_1 INT; a_lab_2 INT;
    a_sim_1 INT; a_sim_2 INT; a_sim_3 INT;
    a_brig_1 INT; a_brig_2 INT;
    a_inv_1 INT; a_inv_2 INT;

BEGIN
    -- Recuperar IDs de Usuarios
    SELECT id INTO u_admin FROM usuario WHERE email = 'admin@uso.edu.sv';
    SELECT id INTO u_carlos FROM usuario WHERE email = 'carlos.martinez@uso.edu.sv';
    SELECT id INTO u_marvin FROM usuario WHERE email = 'marvin.alarcon@uso.edu.sv';
    SELECT id INTO u_henry FROM usuario WHERE email = 'henry.perez@uso.edu.sv';
    SELECT id INTO u_gaby FROM usuario WHERE email = 'gabriela.lopez@uso.edu.sv';
    SELECT id INTO u_ana FROM usuario WHERE email = 'ana.rodriguez@uso.edu.sv';
    SELECT id INTO u_rob FROM usuario WHERE email = 'roberto.gomez@uso.edu.sv';
    SELECT id INTO u_lau FROM usuario WHERE email = 'laura.hernandez@uso.edu.sv';
    SELECT id INTO u_mig FROM usuario WHERE email = 'miguel.torres@uso.edu.sv';


    -- =================================================
    -- P1: Gestión de Acreditación (Ingeniería)
    -- =================================================
    IF NOT EXISTS (SELECT 1 FROM proyecto WHERE nombre = 'Gestión de acreditación de Carrera Industrial' AND anio = 2025) THEN
        INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo)
        VALUES (2025, 'Facultad de Ingeniería', 'Calidad Académica', 'Acreditación internacional', 'Gestión de acreditación de Carrera Industrial', 'Lograr acreditación ACAAI', u_carlos, 15000.00, true)
        RETURNING id INTO p_acred;

        -- Roles
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_acred, u_carlos, 'OWNER');
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_acred, u_marvin, 'EDITOR');
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_acred, u_henry, 'EDITOR');

        -- Actividades
        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_acred, 'Acercamiento ACAAI', 'Reuniones y coordinación', u_carlos, 'Director', 'Ingeniería', 5000.00) RETURNING id INTO a_acred_1;
        
        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_acred, 'Capacitación actores USO', 'Formación de personal', u_marvin, 'Coordinador', 'Ingeniería', 6000.00) RETURNING id INTO a_acred_2;

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_acred, 'Autoevaluación', 'Elaboración de expediente', u_henry, 'Docente', 'Ingeniería', 4000.00) RETURNING id INTO a_acred_3;

        -- Detalles Act 1
        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_acred_1, 2, true), (a_acred_1, 3, true), (a_acred_1, 4, true);
        INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES 
            (a_acred_1, 2, 'I', 'En proceso'), (a_acred_1, 3, 'P', 'Pendiente'), (a_acred_1, 4, 'F', 'Completado');
        INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento)
        VALUES (a_acred_1, 'Ejecución', 'Reuniones realizadas', 4, 'Reuniones', 'Equipo', 2, 50.00);
        INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por)
        VALUES (a_acred_1, '2025-02-15', 'Costo inscripción', 500.00, u_carlos);
        INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por)
        VALUES (a_acred_1, '2025-02-15', 'Acta', 'Acta reunión 1', '/uploads/acta1.pdf', 'acta1.pdf', 'application/pdf', u_carlos);

        -- Detalles Act 2
        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_acred_2, 1, true), (a_acred_2, 2, true), (a_acred_2, 3, true), (a_acred_2, 5, true);
        INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES 
            (a_acred_2, 5, 'F', 'Completado exitosamente');
        INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento)
        VALUES (a_acred_2, 'Beneficiarios', 'Docentes capacitados', 12, 'Personas', 'Docentes', 8, 66.67);
    END IF;


    -- =================================================
    -- P2: Fortalecimiento Laboratorios (Ingeniería)
    -- =================================================
    IF NOT EXISTS (SELECT 1 FROM proyecto WHERE nombre = 'Fortalecimiento Laboratorios Eléctrica' AND anio = 2025) THEN
        INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo)
        VALUES (2025, 'Facultad de Ingeniería', 'Infraestructura', 'Modernizar labs', 'Fortalecimiento Laboratorios Eléctrica', 'Equipar laboratorios', u_marvin, 25000.00, true)
        RETURNING id INTO p_lab;

        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_lab, u_marvin, 'OWNER');
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_lab, u_carlos, 'VIEWER');
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_lab, u_henry, 'EDITOR');

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_lab, 'Adquisición equipos', 'Compra osciloscopios', u_marvin, 'Coord', 'Ingeniería', 15000.00) RETURNING id INTO a_lab_1;
        
        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_lab, 'Capacitación uso', 'Entrenamiento', u_henry, 'Docente', 'Ingeniería', 3000.00) RETURNING id INTO a_lab_2;

        -- Detalles P2
        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_lab_1, 1, true), (a_lab_1, 2, true);
        INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por)
        VALUES (a_lab_1, '2025-01-20', 'Material didáctico', 400.00, u_marvin);
        INSERT INTO evidencia_actividad (id_actividad, fecha, tipo, descripcion, ruta_archivo, nombre_archivo_original, mime_type, id_subido_por)
        VALUES (a_lab_2, '2025-02-01', 'Informe', 'Informe cap', '/uploads/inf_cap.pdf', 'inf_cap.pdf', 'application/pdf', u_marvin);
    END IF;


    -- =================================================
    -- P3: Simuladores Empresariales (Economía)
    -- =================================================
    IF NOT EXISTS (SELECT 1 FROM proyecto WHERE nombre = 'Simuladores Empresariales' AND anio = 2025) THEN
        INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo)
        VALUES (2025, 'Facultad de Ciencias Económicas', 'Innovación', 'Metodologías activas', 'Simuladores Empresariales', 'Aprendizaje práctico', u_ana, 18000.00, true)
        RETURNING id INTO p_sim;

        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_sim, u_ana, 'OWNER');
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_sim, u_mig, 'EDITOR');

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_sim, 'Evaluación Plataformas', 'Comparativa', u_ana, 'Decana', 'Economía', 3000.00) RETURNING id INTO a_sim_1;

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_sim, 'Licencias Software', 'Compra anual', u_mig, 'Asistente', 'Economía', 12000.00) RETURNING id INTO a_sim_2;

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_sim, 'Capacitación Docente', 'Formación', u_ana, 'Decana', 'Economía', 3000.00) RETURNING id INTO a_sim_3;

        -- Detalles P3
        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_sim_1, 1, true), (a_sim_1, 2, true);
        INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES (a_sim_1, 1, 'F', 'OK'), (a_sim_1, 2, 'F', 'OK');
        INSERT INTO indicador_actividad (id_actividad, categoria, descripcion_especifica, meta_valor, unidad_medida, beneficiarios, valor_logrado, porcentaje_cumplimiento)
        VALUES (a_sim_1, 'Producto', 'Plataformas evaluadas', 3, 'Plataformas', 'Facultad', 3, 100);

        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_sim_2, 3, true), (a_sim_2, 4, true);
        INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por)
        VALUES (a_sim_2, '2025-03-20', 'Pago inicial', 6000.00, u_mig);
        
        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_sim_3, 5, true), (a_sim_3, 6, true);
    END IF;


    -- =================================================
    -- P4: Brigadas Médicas (Medicina)
    -- =================================================
    IF NOT EXISTS (SELECT 1 FROM proyecto WHERE nombre = 'Brigadas Médicas Rurales' AND anio = 2025) THEN
        INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo)
        VALUES (2025, 'Facultad de Medicina', 'Social', 'Impacto comunitario', 'Brigadas Médicas Rurales', 'Atención mensual zonas rurales', u_rob, 22000.00, true)
        RETURNING id INTO p_brig;

        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_brig, u_rob, 'OWNER');

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_brig, 'Logística Transportes', 'Coordinación', u_rob, 'Jefe', 'Medicina', 5000.00) RETURNING id INTO a_brig_1;
        
        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_brig, 'Ejecución Brigadas', 'Atención médica', u_rob, 'Jefe', 'Medicina', 15000.00) RETURNING id INTO a_brig_2;

        -- Detalles P4
        FOR i IN 1..12 LOOP
            INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_brig_2, i, true);
        END LOOP;
        INSERT INTO actividad_mes_seguimiento (id_actividad, mes, estado, comentario) VALUES (a_brig_2, 1, 'F', 'Ene OK'), (a_brig_2, 2, 'F', 'Feb OK');
        INSERT INTO gasto_actividad (id_actividad, fecha, descripcion, monto, id_registrado_por) 
        VALUES (a_brig_2, '2025-01-25', 'Medicamentos', 3000.00, u_rob);
    END IF;


    -- =================================================
    -- P5: Investigación Energías (Ingeniería)
    -- =================================================
    IF NOT EXISTS (SELECT 1 FROM proyecto WHERE nombre = 'Investigación Energías Renovables' AND anio = 2025) THEN
        INSERT INTO proyecto (anio, unidad_facultad, linea_estrategica, objetivo_estrategico, nombre, objetivo_proyecto, id_responsable, presupuesto_total, activo)
        VALUES (2025, 'Facultad de Ingeniería', 'Investigación', 'Producción científica', 'Investigación Energías Renovables', 'Grupos y papers', u_lau, 30000.00, true)
        RETURNING id INTO p_inv;

        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_inv, u_lau, 'OWNER');
        INSERT INTO proyecto_usuario_rol (id_proyecto, id_usuario, rol) VALUES (p_inv, u_carlos, 'EDITOR');

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_inv, 'Conformación Grupos', 'Selección', u_lau, 'Coord', 'Ingeniería', 5000.00) RETURNING id INTO a_inv_1;

        INSERT INTO actividad (id_proyecto, nombre, descripcion, id_responsable, cargo_responsable, unidad_responsable, presupuesto_asignado)
        VALUES (p_inv, 'Equipamiento IOT', 'Sensores', u_lau, 'Coord', 'Ingeniería', 20000.00) RETURNING id INTO a_inv_2;

        INSERT INTO actividad_mes_plan (id_actividad, mes, planificado) VALUES (a_inv_2, 6, true), (a_inv_2, 7, true);
    END IF;


    RAISE NOTICE 'Carga Exitosa. Proyectos IDs: %, %, %, %, %', p_acred, p_lab, p_sim, p_brig, p_inv;
END $$;

COMMIT;
