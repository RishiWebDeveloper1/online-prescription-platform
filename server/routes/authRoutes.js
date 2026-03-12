import { Router } from 'express';
import { doctorSignup, doctorLogin, patientSignup, patientLogin } from '../controllers/authController.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/doctor/signup', uploadImage, doctorSignup);
router.post('/doctor/login', doctorLogin);
router.post('/patient/signup', uploadImage, patientSignup);
router.post('/patient/login', patientLogin);

export default router;
