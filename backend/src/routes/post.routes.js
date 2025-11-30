import { Router } from 'express';
import { body } from 'express-validator';
import { createPost, getPost, updatePost, deletePost, getPosts } from '../controllers/post.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import requireAuth from '../middleware/auth.js';
import validateObjectIdParam from '../middleware/validateObjectId.js';

const router = Router();

router.get('/',
  [
    // query params validated in controller; basic numeric checks here
  ],
  getPosts
);

router.post('/',
	[
		body('contenido').isString().notEmpty(),
		body('rating').isInt({ min: 1, max: 5 }),
		body('hotel_id').isString().notEmpty()
	],
	validateRequest,
	requireAuth,
	createPost
);

router.get('/:id', validateObjectIdParam('id'), getPost);

router.put('/:id',
	[
		body('contenido').optional().isString().notEmpty(),
		body('rating').optional().isInt({ min: 1, max: 5 })
	],
	validateRequest,
	requireAuth,
	updatePost
);

router.delete('/:id', validateObjectIdParam('id'), requireAuth, deletePost);

export default router;