import { Router } from 'express';
import { reportesService } from '../services/reportes.service';

const router = Router();

router.get('/proyectos-texto', async (req, res) => {
    try {
        const { unidad, anio } = req.query;

        if (!unidad || !anio) {
            return res.status(400).send('Faltan parámetros requeridos: unidad, anio');
        }

        const reportePdfBuffer = await reportesService.generarReportePDF(String(unidad), Number(anio));

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_proyectos_${unidad}_${anio}.pdf"`);
        res.send(reportePdfBuffer);
    } catch (error) {
        console.error('Error generando reporte PDF:', error);
        res.status(500).send('Error interno completando el reporte');
    }
});

export default router;
