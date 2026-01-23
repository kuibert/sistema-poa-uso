import { query } from '../config/db';
import PDFDocument from 'pdfkit';

export const reportesService = {
    async generarReportePDF(unidad: string, anio: number): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const buffers: Buffer[] = [];

                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                // 1. Obtener proyectos
                const proyectosResult = await query(
                    `SELECT 
              p.id, p.nombre, p.objetivo_proyecto, p.presupuesto_total, 
              u.nombre_completo as responsable
           FROM proyecto p
           LEFT JOIN usuario u ON p.id_responsable = u.id
           WHERE p.anio = $1 AND UPPER(p.unidad_facultad) = UPPER($2)
           ORDER BY p.nombre`,
                    [anio, unidad]
                );

                const proyectos = proyectosResult.rows;

                // --- ENCABEZADO ---
                doc.font('Helvetica-Bold').fontSize(14).text('UNIVERSIDAD DE SONSONATE', { align: 'center' });
                doc.font('Helvetica').fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
                doc.moveDown(0.5);

                doc.fontSize(16).text(`REPORTE DE PROYECTOS - ${unidad.toUpperCase()} - ${anio}`, { align: 'center' });
                doc.moveDown();
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown();

                if (proyectos.length === 0) {
                    doc.fontSize(12).text(`No se encontraron proyectos para la unidad ${unidad} en el año ${anio}.`, { align: 'center' });
                    doc.end();
                    return;
                }

                for (const p of proyectos) {
                    // Verificar espacio en página
                    if (doc.y > 650) {
                        doc.addPage();
                    } else {
                        doc.moveDown(2);
                    }

                    // TÍTULO PROYECTO
                    doc.rect(50, doc.y, 500, 24).fill('#f0f0f0').stroke();
                    doc.fillColor('black').font('Helvetica-Bold').fontSize(11)
                        .text(`PROYECTO: ${p.nombre}`, 55, doc.y - 17);

                    doc.moveDown(0.8);

                    // INFO PROYECTO
                    doc.font('Helvetica').fontSize(10);
                    doc.text(`Responsable: ${p.responsable || 'Sin asignar'}`);
                    doc.text(`Presupuesto Total: $${Number(p.presupuesto_total).toFixed(2)}`);
                    doc.text(`Objetivo: ${p.objetivo_proyecto || 'Sin objetivo definido'}`);
                    doc.moveDown(1.5);

                    // 2. ACTIVIDADES
                    const actividadesResult = await query(
                        `SELECT a.id, a.nombre, a.presupuesto_asignado
             FROM actividad a
             WHERE a.id_proyecto = $1
             ORDER BY a.id`,
                        [p.id]
                    );
                    const actividades = actividadesResult.rows;

                    // Título Actividades (Siempre visible)
                    doc.font('Helvetica-Bold').fontSize(10).text('ACTIVIDADES', { underline: true });
                    doc.moveDown(0.5);

                    if (actividades.length > 0) {
                        // Table Headers
                        const colWidths = [200, 80, 80, 80, 60]; // Actividad, Presupuesto, Gastado, Disponible, %
                        const startX = 50;
                        let currentY = doc.y;

                        // Draw Header Background
                        doc.rect(startX, currentY, 500, 20).fill('#e0e0e0').stroke();
                        doc.fillColor('#000000'); // Reset fill color

                        // Headers Text
                        doc.font('Helvetica-Bold').fontSize(8);
                        doc.text('Actividad', startX + 5, currentY + 6, { width: colWidths[0] });
                        doc.text('Presupuesto', startX + colWidths[0], currentY + 6, { width: colWidths[1], align: 'right' });
                        doc.text('Gastado', startX + colWidths[0] + colWidths[1], currentY + 6, { width: colWidths[2], align: 'right' });
                        doc.text('Disponible', startX + colWidths[0] + colWidths[1] + colWidths[2], currentY + 6, { width: colWidths[3], align: 'right' });
                        doc.text('% Ejec.', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY + 6, { width: colWidths[4], align: 'center' });

                        currentY += 20;

                        for (const act of actividades) {
                            // Check page break
                            if (currentY > 700) {
                                doc.addPage();
                                currentY = 50;
                                // Redraw headers on new page
                                doc.rect(startX, currentY, 500, 20).fill('#e0e0e0').stroke();
                                doc.fillColor('#000000');
                                doc.font('Helvetica-Bold').fontSize(8);
                                doc.text('Actividad', startX + 5, currentY + 6, { width: colWidths[0] });
                                doc.text('Presupuesto', startX + colWidths[0], currentY + 6, { width: colWidths[1], align: 'right' });
                                doc.text('Gastado', startX + colWidths[0] + colWidths[1], currentY + 6, { width: colWidths[2], align: 'right' });
                                doc.text('Disponible', startX + colWidths[0] + colWidths[1] + colWidths[2], currentY + 6, { width: colWidths[3], align: 'right' });
                                doc.text('% Ejec.', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY + 6, { width: colWidths[4], align: 'center' });
                                currentY += 20;
                            }

                            // Calculate Expenses
                            const gastosResult = await query(
                                `SELECT COALESCE(SUM(monto), 0) as total_gastado 
                                 FROM gasto_actividad 
                                 WHERE id_actividad = $1`,
                                [act.id]
                            );
                            const gastado = Number(gastosResult.rows[0].total_gastado || 0);
                            const presupuesto = Number(act.presupuesto_asignado || 0);
                            const disponible = presupuesto - gastado;
                            const porcentaje = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;

                            // Draw Row
                            doc.font('Helvetica').fontSize(8);
                            doc.text(act.nombre, startX + 5, currentY + 5, { width: colWidths[0] - 10 });
                            doc.text(`$${presupuesto.toFixed(2)}`, startX + colWidths[0], currentY + 5, { width: colWidths[1], align: 'right' });
                            doc.text(`$${gastado.toFixed(2)}`, startX + colWidths[0] + colWidths[1], currentY + 5, { width: colWidths[2], align: 'right' });
                            doc.text(`$${disponible.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2], currentY + 5, { width: colWidths[3], align: 'right' });
                            doc.text(`${porcentaje.toFixed(1)}%`, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY + 5, { width: colWidths[4], align: 'center' });

                            // Draw bottom border line
                            doc.moveTo(startX, currentY + 18).lineTo(startX + 500, currentY + 18).lineWidth(0.5).opacity(0.3).stroke().opacity(1);

                            currentY += 18;
                        }
                        doc.moveDown();
                        // Reset Y for next section
                        doc.y = currentY + 10;
                    } else {
                        doc.font('Helvetica-Oblique').fontSize(9).text('No hay registros');
                        doc.moveDown(1.5);
                    }

                    // 3. DETALLE DE COSTOS
                    const costosResult = await query(
                        `SELECT descripcion, cantidad, unidad, precio_unitario, costo_total, tipo 
                         FROM costo_proyecto 
                         WHERE id_proyecto = $1 
                         ORDER BY descripcion`,
                        [p.id]
                    );
                    const costos = costosResult.rows;

                    // 3.1 GASTOS REGISTRADOS POR ACTIVIDAD (Datos Reales de `gasto_actividad`)
                    const costosFijos = costos.filter((c: any) => c.tipo && c.tipo.toUpperCase() === 'FIJO');
                    doc.x = 50; // Reset X

                    // Query real expenses
                    const gastosRealesResult = await query(
                        `SELECT g.fecha, a.nombre as nombre_actividad, g.descripcion, g.monto
                         FROM gasto_actividad g
                         JOIN actividad a ON g.id_actividad = a.id
                         WHERE a.id_proyecto = $1
                         ORDER BY g.fecha DESC`,
                        [p.id]
                    );
                    const gastosReales = gastosRealesResult.rows;


                    // Function to draw Real Expenses Table
                    const dibujarTablaGastosReales = (listaGastos: any[], titulo: string) => {
                        if (doc.y > 650) doc.addPage();

                        doc.font('Helvetica-Bold').fontSize(10).text(titulo, { underline: true, align: 'left' });
                        doc.moveDown(0.5);

                        if (listaGastos.length === 0) {
                            doc.font('Helvetica-Oblique').fontSize(9).text('No hay registros');
                            doc.moveDown(1.5);
                            return;
                        }

                        // Table Config
                        const expenseColWidths = [60, 150, 200, 70]; // Fecha, Actividad, Descripcion, Monto
                        const startX = 50;
                        let currentY = doc.y;

                        // Header
                        doc.rect(startX, currentY, 480, 15).fill('#e0e0e0').stroke();
                        doc.fillColor('#000000');
                        doc.font('Helvetica-Bold').fontSize(8);
                        doc.text('Fecha', startX + 5, currentY + 4, { width: expenseColWidths[0] });
                        doc.text('Actividad', startX + expenseColWidths[0], currentY + 4, { width: expenseColWidths[1] });
                        doc.text('Descripción', startX + expenseColWidths[0] + expenseColWidths[1], currentY + 4, { width: expenseColWidths[2] });
                        doc.text('Monto', startX + expenseColWidths[0] + expenseColWidths[1] + expenseColWidths[2], currentY + 4, { width: expenseColWidths[3], align: 'right' });

                        currentY += 15;

                        for (const g of listaGastos) {
                            if (currentY > 700) {
                                doc.addPage();
                                currentY = 50;
                                // Redraw header
                                doc.rect(startX, currentY, 480, 15).fill('#e0e0e0').stroke();
                                doc.fillColor('#000000');
                                doc.font('Helvetica-Bold').fontSize(8);
                                doc.text('Fecha', startX + 5, currentY + 4, { width: expenseColWidths[0] });
                                doc.text('Actividad', startX + expenseColWidths[0], currentY + 4, { width: expenseColWidths[1] });
                                doc.text('Descripción', startX + expenseColWidths[0] + expenseColWidths[1], currentY + 4, { width: expenseColWidths[2] });
                                doc.text('Monto', startX + expenseColWidths[0] + expenseColWidths[1] + expenseColWidths[2], currentY + 4, { width: expenseColWidths[3], align: 'right' });
                                currentY += 15;
                            }

                            doc.font('Helvetica').fontSize(8);
                            // Format date safely
                            const fechaObj = new Date(g.fecha);
                            const fechaStr = !isNaN(fechaObj.getTime()) ? fechaObj.toLocaleDateString() : 'N/A';

                            doc.text(fechaStr, startX + 5, currentY + 4, { width: expenseColWidths[0] - 5 });
                            doc.text(g.nombre_actividad, startX + expenseColWidths[0], currentY + 4, { width: expenseColWidths[1] - 5 });
                            doc.text(g.descripcion, startX + expenseColWidths[0] + expenseColWidths[1], currentY + 4, { width: expenseColWidths[2] - 5 });
                            doc.text(`$${Number(g.monto).toFixed(2)}`, startX + expenseColWidths[0] + expenseColWidths[1] + expenseColWidths[2], currentY + 4, { width: expenseColWidths[3], align: 'right' });

                            doc.moveTo(startX, currentY + 15).lineTo(startX + 480, currentY + 15).lineWidth(0.5).opacity(0.3).stroke().opacity(1);
                            currentY += 15;
                        }
                        doc.y = currentY + 15;
                    };

                    // Function to draw Original Cost Table (for Fixed Costs)
                    const dibujarTablaCostos = (listaCostos: any[], titulo: string) => {
                        if (doc.y > 650) doc.addPage();

                        doc.font('Helvetica-Bold').fontSize(10).text(titulo, { underline: true, align: 'left' });
                        doc.moveDown(0.5);

                        if (listaCostos.length === 0) {
                            doc.font('Helvetica-Oblique').fontSize(9).text('No hay registros');
                            doc.moveDown(1.5);
                            return;
                        }

                        const costColWidths = [200, 60, 60, 80, 80];
                        const startX = 50;
                        let currentY = doc.y;

                        doc.rect(startX, currentY, 500, 15).fill('#e0e0e0').stroke();
                        doc.fillColor('#000000');
                        doc.font('Helvetica-Bold').fontSize(8);
                        doc.text('Descripción', startX + 5, currentY + 4, { width: costColWidths[0] });
                        doc.text('Cantidad', startX + costColWidths[0], currentY + 4, { width: costColWidths[1], align: 'right' });
                        doc.text('Unidad', startX + costColWidths[0] + costColWidths[1], currentY + 4, { width: costColWidths[2], align: 'center' });
                        doc.text('Precio Unitario', startX + costColWidths[0] + costColWidths[1] + costColWidths[2], currentY + 4, { width: costColWidths[3], align: 'right' });
                        doc.text('Costo Total', startX + costColWidths[0] + costColWidths[1] + costColWidths[2] + costColWidths[3], currentY + 4, { width: costColWidths[4], align: 'right' });

                        currentY += 15;

                        for (const c of listaCostos) {
                            if (currentY > 700) {
                                doc.addPage();
                                currentY = 50;
                                doc.rect(startX, currentY, 500, 15).fill('#e0e0e0').stroke();
                                doc.fillColor('#000000');
                                doc.font('Helvetica-Bold').fontSize(8);
                                doc.text('Descripción', startX + 5, currentY + 4, { width: costColWidths[0] });
                                doc.text('Cantidad', startX + costColWidths[0], currentY + 4, { width: costColWidths[1], align: 'right' });
                                doc.text('Unidad', startX + costColWidths[0] + costColWidths[1], currentY + 4, { width: costColWidths[2], align: 'center' });
                                doc.text('Precio Unitario', startX + costColWidths[0] + costColWidths[1] + costColWidths[2], currentY + 4, { width: costColWidths[3], align: 'right' });
                                doc.text('Costo Total', startX + costColWidths[0] + costColWidths[1] + costColWidths[2] + costColWidths[3], currentY + 4, { width: costColWidths[4], align: 'right' });
                                currentY += 15;
                            }

                            doc.font('Helvetica').fontSize(8);
                            doc.text(c.descripcion, startX + 5, currentY + 4, { width: costColWidths[0] - 5 });
                            doc.text(Number(c.cantidad).toString(), startX + costColWidths[0], currentY + 4, { width: costColWidths[1], align: 'right' });
                            doc.text(c.unidad || '', startX + costColWidths[0] + costColWidths[1], currentY + 4, { width: costColWidths[2], align: 'center' });
                            doc.text(`$${Number(c.precio_unitario).toFixed(2)}`, startX + costColWidths[0] + costColWidths[1] + costColWidths[2], currentY + 4, { width: costColWidths[3], align: 'right' });
                            doc.text(`$${Number(c.costo_total).toFixed(2)}`, startX + costColWidths[0] + costColWidths[1] + costColWidths[2] + costColWidths[3], currentY + 4, { width: costColWidths[4], align: 'right' });

                            doc.moveTo(startX, currentY + 15).lineTo(startX + 500, currentY + 15).lineWidth(0.5).opacity(0.3).stroke().opacity(1);
                            currentY += 15;
                        }
                        doc.y = currentY + 15;
                    };

                    dibujarTablaGastosReales(gastosReales, 'GASTOS REGISTRADOS POR ACTIVIDAD');

                    // 3.2 COSTOS FIJOS DEL PROYECTO
                    doc.x = 50; // Ensure X is reset for next section too
                    dibujarTablaCostos(costosFijos, 'COSTOS FIJOS DEL PROYECTO');

                    doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(1).stroke();
                    doc.moveDown(1);
                }

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
};
