import { Router } from 'express';
import { getUserById, updateUser, getDashboardStats } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/me/dashboard', protect, getDashboardStats);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);

export default router;
