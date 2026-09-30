import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCategories,
} from '../controllers/postController';
import {
  getCommentsByPost,
  createComment,
} from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Post routes
router.get('/', getPosts);
router.get('/categories', getCategories);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comments nested under post
router.get('/:postId/comments', getCommentsByPost);
router.post('/:postId/comments', protect, createComment);

export default router;
