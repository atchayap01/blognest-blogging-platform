import { Router } from 'express';
import { deleteComment } from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.delete('/:id', protect, deleteComment);

export default router;
