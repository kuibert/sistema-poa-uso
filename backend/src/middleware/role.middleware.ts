
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth'; // Assuming auth interface is exported from here or auth.middleware

export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Autenticación requerida' });
        }

        if (!req.user.rol || !allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                error: 'Acceso denegado: No tienes permisos suficientes para realizar esta acción.'
            });
        }

        next();
    };
};
