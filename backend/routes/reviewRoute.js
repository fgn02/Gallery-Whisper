import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import { createReview, getReview, deleteReview, getAllReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protect, createReview);
router.delete('/', protect, deleteReview);
router.get('/', protect, getAllReviews);
router.get('/:id', protect, getReview);


export default router;