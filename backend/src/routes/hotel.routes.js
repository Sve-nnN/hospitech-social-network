import { Router } from 'express';
import { body } from 'express-validator';
import { createHotel, getHotel, getHotelBySlug, updateHotel, deleteHotel, getHotels } from '../controllers/hotel.controller.js';
import { getPostsByHotel } from '../controllers/post.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import validateObjectIdParam from '../middleware/validateObjectId.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', validateObjectIdParam('id'), getHotel);
router.get('/slug/:slug', getHotelBySlug);
router.get('/:id/posts', validateObjectIdParam('id'), getPostsByHotel);

router.post('/', [
    body('nombre').isString().notEmpty(),
    body('direccion.ciudad').isString().notEmpty(),
    body('direccion.pais').isString().notEmpty(),
    body('slug').optional().isString()
], validateRequest, requireAuth, createHotel);

router.put('/:id', validateObjectIdParam('id'), [
	body('nombre').optional().isString(),
	body('direccion.ciudad').optional().isString(),
	body('direccion.pais').optional().isString()
], validateRequest, requireAuth, updateHotel);

router.delete('/:id', validateObjectIdParam('id'), requireAuth, deleteHotel);

export default router;