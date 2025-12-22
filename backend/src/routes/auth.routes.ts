import { Router } from 'express';
import { authService } from '../services/auth.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    // Set HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true via https
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ user }); // Don't send token in body
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada correctamente' });
});

router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await authService.getUserById(req.user!.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});


// User Management (Admin Only)

router.post('/register', authMiddleware, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { nombre, email, rol, password } = req.body;
    const user = await authService.register(nombre, email, rol, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/users', authMiddleware, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const users = await authService.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/rol', authMiddleware, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { rol } = req.body;
    const user = await authService.updateUserRole(parseInt(req.params.id), rol);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
router.delete('/users/:id', authMiddleware, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    await authService.deleteUser(parseInt(req.params.id));
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
});

export default router;
