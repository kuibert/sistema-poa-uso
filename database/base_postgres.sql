BEGIN;

------------------------------------------------------------
-- 1. USUARIOS
------------------------------------------------------------
CREATE TABLE usuario (
    id                  BIGSERIAL PRIMARY KEY,
    nombre_completo     TEXT        NOT NULL,
    email               TEXT        UNIQUE NOT NULL,
    contrasena          TEXT        NOT NULL,
    rol                 VARCHAR(20) NOT NULL DEFAULT 'VIEWER' CHECK (rol IN ('ADMIN', 'EDITOR', 'VIEWER')),
    cargo               TEXT,
    unidad              TEXT,
    activo              BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------
-- 2. PROYECTOS
------------------------------------------------------------
CREATE TABLE proyecto (
    id                  BIGSERIAL PRIMARY KEY,
    anio                SMALLINT    NOT NULL,
    unidad_facultad     TEXT        NOT NULL,
    linea_estrategica   TEXT,
    objetivo_estrategico TEXT,
    accion_estrategica  TEXT,
    nombre              TEXT        NOT NULL,
    objetivo_proyecto   TEXT,
    id_responsable      BIGINT,
    presupuesto_total   NUMERIC(14,2),
    activo              BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------
-- 3. ACTIVIDADES DEL PROYECTO
------------------------------------------------------------
CREATE TABLE actividad (
    id                   BIGSERIAL PRIMARY KEY,
    id_proyecto          BIGINT     NOT NULL,
    nombre               TEXT       NOT NULL,
    descripcion          TEXT,
    id_responsable       BIGINT,
    cargo_responsable    TEXT,
    unidad_responsable   TEXT,
    presupuesto_asignado NUMERIC(14,2),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_actividad_id_proyecto ON actividad(id_proyecto);

------------------------------------------------------------
-- 4. PLANIFICACIÓN MENSUAL (CHECKBOX DE PÁGINA 1)
------------------------------------------------------------
CREATE TABLE actividad_mes_plan (
    id            BIGSERIAL PRIMARY KEY,
    id_actividad  BIGINT     NOT NULL,
    mes           SMALLINT   NOT NULL CHECK (mes BETWEEN 1 AND 12),
    planificado   BOOLEAN    NOT NULL DEFAULT TRUE,
    UNIQUE (id_actividad, mes)
);

CREATE INDEX idx_amp_id_actividad ON actividad_mes_plan(id_actividad);

------------------------------------------------------------
-- 5. SEGUIMIENTO MENSUAL (PÁGINA 2, GANTT)
------------------------------------------------------------
CREATE TABLE actividad_mes_seguimiento (
    id                         BIGSERIAL PRIMARY KEY,
    id_actividad               BIGINT     NOT NULL,
    mes                        SMALLINT   NOT NULL CHECK (mes BETWEEN 1 AND 12),
    estado                     CHAR(1)    NOT NULL CHECK (estado IN ('-', 'P', 'I', 'F')),
    comentario                 TEXT,
    fecha_ultima_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (id_actividad, mes)
);

CREATE INDEX idx_ams_id_actividad ON actividad_mes_seguimiento(id_actividad);

------------------------------------------------------------
-- 6. INDICADORES DE LOGRO (KPI) POR ACTIVIDAD
------------------------------------------------------------
CREATE TABLE indicador_actividad (
    id                      BIGSERIAL PRIMARY KEY,
    id_actividad            BIGINT     NOT NULL,
    categoria               TEXT       NOT NULL,
    descripcion_especifica  TEXT,
    meta_valor              NUMERIC(14,2),
    unidad_medida           TEXT,
    beneficiarios           TEXT,
    valor_logrado           NUMERIC(14,2),
    porcentaje_cumplimiento NUMERIC(5,2),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_indicador_id_actividad ON indicador_actividad(id_actividad);

------------------------------------------------------------
-- 7. COSTOS DEL PROYECTO (FIJOS Y VARIABLES) - PÁGINA 1
------------------------------------------------------------
CREATE TABLE costo_proyecto (
    id              BIGSERIAL PRIMARY KEY,
    id_proyecto     BIGINT     NOT NULL,
    tipo            VARCHAR(10) NOT NULL CHECK (tipo IN ('variable', 'fijo')),
    descripcion     TEXT       NOT NULL,
    cantidad        NUMERIC(14,2) NOT NULL DEFAULT 0,
    unidad          TEXT,
    precio_unitario NUMERIC(14,2) NOT NULL DEFAULT 0,
    costo_total     NUMERIC(14,2) NOT NULL DEFAULT 0,
    id_actividad    BIGINT,
    incluir_en_avance BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_costo_id_proyecto  ON costo_proyecto(id_proyecto);
CREATE INDEX idx_costo_id_actividad ON costo_proyecto(id_actividad);

------------------------------------------------------------
-- 8. GASTOS POR ACTIVIDAD (PÁGINA DE GASTOS)
------------------------------------------------------------
CREATE TABLE gasto_actividad (
    id                BIGSERIAL PRIMARY KEY,
    id_actividad      BIGINT     NOT NULL,
    fecha             DATE       NOT NULL,
    descripcion       TEXT       NOT NULL,
    monto             NUMERIC(14,2) NOT NULL,
    id_registrado_por BIGINT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gasto_id_actividad ON gasto_actividad(id_actividad);

------------------------------------------------------------
-- 9. EVIDENCIAS POR ACTIVIDAD (PÁGINA evidencias.html)
------------------------------------------------------------
CREATE TABLE evidencia_actividad (
    id                      BIGSERIAL PRIMARY KEY,
    id_actividad            BIGINT     NOT NULL,
    fecha                   DATE       NOT NULL,
    tipo                    TEXT,
    descripcion             TEXT,
    ruta_archivo            TEXT       NOT NULL,
    nombre_archivo_original TEXT,
    mime_type               TEXT,
    tamano_bytes            BIGINT,
    id_subido_por           BIGINT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidencia_id_actividad ON evidencia_actividad(id_actividad);

------------------------------------------------------------
-- 10. PERMISOS POR PROYECTO (OWNER / EDITOR / VIEWER)
------------------------------------------------------------
CREATE TABLE proyecto_usuario_rol (
    id          BIGSERIAL PRIMARY KEY,
    id_proyecto BIGINT     NOT NULL,
    id_usuario  BIGINT     NOT NULL,
    rol         VARCHAR(20) NOT NULL CHECK (rol IN ('OWNER','EDITOR','VIEWER')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (id_proyecto, id_usuario)
);

CREATE INDEX idx_pur_id_usuario  ON proyecto_usuario_rol(id_usuario);
CREATE INDEX idx_pur_id_proyecto ON proyecto_usuario_rol(id_proyecto);

------------------------------------------------------------
-- BLOQUE DE LLAVES FORÁNEAS
------------------------------------------------------------

-- PROYECTO
ALTER TABLE proyecto
  ADD CONSTRAINT fk_proyecto_responsable
  FOREIGN KEY (id_responsable)
  REFERENCES usuario(id);

-- ACTIVIDAD
ALTER TABLE actividad
  ADD CONSTRAINT fk_actividad_proyecto
  FOREIGN KEY (id_proyecto)
  REFERENCES proyecto(id)
  ON DELETE CASCADE;

ALTER TABLE actividad
  ADD CONSTRAINT fk_actividad_responsable
  FOREIGN KEY (id_responsable)
  REFERENCES usuario(id);

-- ACTIVIDAD_MES_PLAN
ALTER TABLE actividad_mes_plan
  ADD CONSTRAINT fk_amp_actividad
  FOREIGN KEY (id_actividad)
  REFERENCES actividad(id)
  ON DELETE CASCADE;

-- ACTIVIDAD_MES_SEGUIMIENTO
ALTER TABLE actividad_mes_seguimiento
  ADD CONSTRAINT fk_ams_actividad
  FOREIGN KEY (id_actividad)
  REFERENCES actividad(id)
  ON DELETE CASCADE;

-- INDICADOR_ACTIVIDAD
ALTER TABLE indicador_actividad
  ADD CONSTRAINT fk_indicador_actividad
  FOREIGN KEY (id_actividad)
  REFERENCES actividad(id)
  ON DELETE CASCADE;

-- COSTO_PROYECTO
ALTER TABLE costo_proyecto
  ADD CONSTRAINT fk_costo_proyecto
  FOREIGN KEY (id_proyecto)
  REFERENCES proyecto(id)
  ON DELETE CASCADE;

ALTER TABLE costo_proyecto
  ADD CONSTRAINT fk_costo_actividad
  FOREIGN KEY (id_actividad)
  REFERENCES actividad(id)
  ON DELETE SET NULL;

-- GASTO_ACTIVIDAD
ALTER TABLE gasto_actividad
  ADD CONSTRAINT fk_gasto_actividad
  FOREIGN KEY (id_actividad)
  REFERENCES actividad(id)
  ON DELETE CASCADE;

ALTER TABLE gasto_actividad
  ADD CONSTRAINT fk_gasto_registrado_por
  FOREIGN KEY (id_registrado_por)
  REFERENCES usuario(id);

-- EVIDENCIA_ACTIVIDAD
ALTER TABLE evidencia_actividad
  ADD CONSTRAINT fk_evidencia_actividad
  FOREIGN KEY (id_actividad)
  REFERENCES actividad(id)
  ON DELETE CASCADE;

ALTER TABLE evidencia_actividad
  ADD CONSTRAINT fk_evidencia_subido_por
  FOREIGN KEY (id_subido_por)
  REFERENCES usuario(id);

-- PROYECTO_USUARIO_ROL
ALTER TABLE proyecto_usuario_rol
  ADD CONSTRAINT fk_pur_proyecto
  FOREIGN KEY (id_proyecto)
  REFERENCES proyecto(id)
  ON DELETE CASCADE;

ALTER TABLE proyecto_usuario_rol
  ADD CONSTRAINT fk_pur_usuario
  FOREIGN KEY (id_usuario)
  REFERENCES usuario(id)
  ON DELETE CASCADE;

COMMIT;

