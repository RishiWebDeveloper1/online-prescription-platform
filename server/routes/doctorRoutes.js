import { Router } from 'express';
import { getAllDoctors, getDoctorById, updateDoctorProfile, getDoctorAvatar } from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/avatar', getDoctorAvatar);
router.put('/me', protect(['doctor']), uploadImage, updateDoctorProfile);

export default router;
