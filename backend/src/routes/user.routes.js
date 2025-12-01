import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, getFeed, followUser, followHotel, getUserProfile, getUserByUsername, getMyProfile, updateMyProfile, deleteMyAccount } from '../controllers/user.controller.js';
import { getUserPosts } from '../controllers/post.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import validateObjectIdParam from '../middleware/validateObjectId.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.post('/',
	[
		body('username').isString().isLength({ min: 3 }).trim(),
		body('email').isEmail().normalizeEmail(),
		body('nombre').isString().notEmpty(),
		body('apellido').isString().notEmpty()
	],
	validateRequest,
	createUser
);

// Public profile
// Authenticated own profile + feed
router.get('/me', requireAuth, getMyProfile);
router.get('/me/feed', requireAuth, getFeed);

// Public profile (/:userId must come after static routes like /me)
router.get('/username/:username', getUserByUsername);
router.get('/:userId', validateObjectIdParam('userId'), getUserProfile);
router.get('/:userId/posts', validateObjectIdParam('userId'), getUserPosts);

router.put('/me', requireAuth, [
	body('nombre').optional().isString(),
	body('apellido').optional().isString(),
	body('imagen_perfil_url').optional().isURL(),
	body('biografia').optional().isString(),
	body('password').optional().isString().isLength({ min: 6 })
], validateRequest, updateMyProfile);

router.delete('/me', requireAuth, deleteMyAccount);

// Follow endpoints use authenticated user (no userId in body)
router.post('/follow-user',
	[
		body('targetId').isString().notEmpty()
	],
	validateRequest,
	requireAuth,
	followUser
);

router.post('/follow-hotel',
	[
		body('hotelId').isString().notEmpty()
	],
	validateRequest,
	requireAuth,
	followHotel
);

export default router;