import { Router } from 'express';
import { body } from 'express-validator';
import { createHotel, getHotel, getHotelPosts, updateHotel, deleteHotel, getHotels } from '../controllers/hotel.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import validateObjectIdParam from '../middleware/validateObjectId.js';
import requireAuth from '../middleware/auth.js';

// GET /api/hotels/:id/posts?page=1&limit=20

const router = Router();

router.post('/',
	[
		body('nombre').isString().notEmpty(),
		body('direccion.ciudad').isString().notEmpty(),
		body('direccion.pais').isString().notEmpty()
	],
	validateRequest,
	createHotel
);

router.get('/:id', validateObjectIdParam('id'), getHotel);
router.get('/:id/posts', validateObjectIdParam('id'), getHotelPosts);

router.get('/', getHotels);

router.put('/:id', validateObjectIdParam('id'), [
	body('nombre').optional().isString(),
	body('direccion.ciudad').optional().isString(),
	body('direccion.pais').optional().isString()
], validateRequest, requireAuth, updateHotel);

router.delete('/:id', validateObjectIdParam('id'), requireAuth, deleteHotel);

export default router;