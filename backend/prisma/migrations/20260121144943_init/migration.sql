-- CreateTable
CREATE TABLE "actividad" (
    "id" BIGSERIAL NOT NULL,
    "id_proyecto" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "id_responsable" BIGINT,
    "cargo_responsable" TEXT,
    "unidad_responsable" TEXT,
    "presupuesto_asignado" DECIMAL(14,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividad_mes_plan" (
    "id" BIGSERIAL NOT NULL,
    "id_actividad" BIGINT NOT NULL,
    "mes" SMALLINT NOT NULL,
    "planificado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "actividad_mes_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividad_mes_seguimiento" (
    "id" BIGSERIAL NOT NULL,
    "id_actividad" BIGINT NOT NULL,
    "mes" SMALLINT NOT NULL,
    "estado" CHAR(1) NOT NULL,
    "comentario" TEXT,
    "fecha_ultima_actualizacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividad_mes_seguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costo_proyecto" (
    "id" BIGSERIAL NOT NULL,
    "id_proyecto" BIGINT NOT NULL,
    "tipo" VARCHAR(10) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "unidad" TEXT,
    "precio_unitario" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "costo_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "id_actividad" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incluir_en_avance" BOOLEAN DEFAULT true,

    CONSTRAINT "costo_proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencia_actividad" (
    "id" BIGSERIAL NOT NULL,
    "id_actividad" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "tipo" TEXT,
    "descripcion" TEXT,
    "ruta_archivo" TEXT NOT NULL,
    "nombre_archivo_original" TEXT,
    "mime_type" TEXT,
    "tamano_bytes" BIGINT,
    "id_subido_por" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidencia_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gasto_actividad" (
    "id" BIGSERIAL NOT NULL,
    "id_actividad" BIGINT NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "id_registrado_por" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gasto_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicador_actividad" (
    "id" BIGSERIAL NOT NULL,
    "id_actividad" BIGINT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion_especifica" TEXT,
    "meta_valor" DECIMAL(14,2),
    "unidad_medida" TEXT,
    "beneficiarios" TEXT,
    "valor_logrado" DECIMAL(14,2),
    "porcentaje_cumplimiento" DECIMAL(5,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicador_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyecto" (
    "id" BIGSERIAL NOT NULL,
    "anio" SMALLINT NOT NULL,
    "unidad_facultad" TEXT NOT NULL,
    "linea_estrategica" TEXT,
    "objetivo_estrategico" TEXT,
    "accion_estrategica" TEXT,
    "nombre" TEXT NOT NULL,
    "objetivo_proyecto" TEXT,
    "id_responsable" BIGINT,
    "presupuesto_total" DECIMAL(14,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyecto_usuario_rol" (
    "id" BIGSERIAL NOT NULL,
    "id_proyecto" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "rol" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proyecto_usuario_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" BIGSERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    "cargo" TEXT,
    "unidad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_actividad_id_proyecto" ON "actividad"("id_proyecto");

-- CreateIndex
CREATE INDEX "idx_amp_id_actividad" ON "actividad_mes_plan"("id_actividad");

-- CreateIndex
CREATE UNIQUE INDEX "actividad_mes_plan_id_actividad_mes_key" ON "actividad_mes_plan"("id_actividad", "mes");

-- CreateIndex
CREATE INDEX "idx_ams_id_actividad" ON "actividad_mes_seguimiento"("id_actividad");

-- CreateIndex
CREATE UNIQUE INDEX "actividad_mes_seguimiento_id_actividad_mes_key" ON "actividad_mes_seguimiento"("id_actividad", "mes");

-- CreateIndex
CREATE INDEX "idx_costo_id_actividad" ON "costo_proyecto"("id_actividad");

-- CreateIndex
CREATE INDEX "idx_costo_id_proyecto" ON "costo_proyecto"("id_proyecto");

-- CreateIndex
CREATE INDEX "idx_evidencia_id_actividad" ON "evidencia_actividad"("id_actividad");

-- CreateIndex
CREATE INDEX "idx_gasto_id_actividad" ON "gasto_actividad"("id_actividad");

-- CreateIndex
CREATE INDEX "idx_indicador_id_actividad" ON "indicador_actividad"("id_actividad");

-- CreateIndex
CREATE INDEX "idx_pur_id_proyecto" ON "proyecto_usuario_rol"("id_proyecto");

-- CreateIndex
CREATE INDEX "idx_pur_id_usuario" ON "proyecto_usuario_rol"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "proyecto_usuario_rol_id_proyecto_id_usuario_key" ON "proyecto_usuario_rol"("id_proyecto", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "actividad" ADD CONSTRAINT "fk_actividad_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "actividad" ADD CONSTRAINT "fk_actividad_responsable" FOREIGN KEY ("id_responsable") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "actividad_mes_plan" ADD CONSTRAINT "fk_amp_actividad" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "actividad_mes_seguimiento" ADD CONSTRAINT "fk_ams_actividad" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "costo_proyecto" ADD CONSTRAINT "fk_costo_actividad" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "costo_proyecto" ADD CONSTRAINT "fk_costo_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidencia_actividad" ADD CONSTRAINT "fk_evidencia_actividad" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidencia_actividad" ADD CONSTRAINT "fk_evidencia_subido_por" FOREIGN KEY ("id_subido_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gasto_actividad" ADD CONSTRAINT "fk_gasto_actividad" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gasto_actividad" ADD CONSTRAINT "fk_gasto_registrado_por" FOREIGN KEY ("id_registrado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "indicador_actividad" ADD CONSTRAINT "fk_indicador_actividad" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "fk_proyecto_responsable" FOREIGN KEY ("id_responsable") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_usuario_rol" ADD CONSTRAINT "fk_pur_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "proyecto"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_usuario_rol" ADD CONSTRAINT "fk_pur_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
