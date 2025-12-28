import { Router } from 'express';
import { evidenciasService } from '../services/evidencias.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import path from 'path';

const router = Router();

router.get('/actividades/:id/evidencias', authMiddleware, async (req, res, next) => {
  try {
    const evidencias = await evidenciasService.getEvidenciasByActividad(parseInt(req.params.id));
    res.json(evidencias);
  } catch (error) {
    next(error);
  }
});

router.post('/actividades/:id/evidencias', authMiddleware, upload.single('archivo'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const evidencia = await evidenciasService.crearEvidencia(
      parseInt(req.params.id),
      {
        ...req.body,
        ruta_archivo: req.file.filename // Save only filename, not full path
      },
      req.user!.id
    );
    res.status(201).json(evidencia);
  } catch (error) {
    next(error);
  }
});

router.delete('/evidencias/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await evidenciasService.deleteEvidencia(parseInt(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Serve uploaded files
router.get('/uploads/:filename', authMiddleware, (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(process.cwd(), 'uploads', filename);

    // Security: prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Nombre de archivo inválido' });
    }

    res.sendFile(filepath, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
