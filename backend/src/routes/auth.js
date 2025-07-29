import express from 'express';
import { registrar, iniciarSesion } from '../controllers/authController.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);

export default router;
