const { Router } = require('express');
const { body } = require('express-validator');
const { login, getReservas, aprobarReserva, rechazarReserva } = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/auth');
const { handleValidation } = require('../middlewares/validation');

const router = Router();

router.post(
  '/login',
  [
    body('usuario').trim().notEmpty().withMessage('Usuario requerido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    handleValidation,
  ],
  login
);

router.get('/reservas', authMiddleware, getReservas);
router.patch('/reservas/:id/aprobar', authMiddleware, aprobarReserva);
router.patch('/reservas/:id/rechazar', authMiddleware, rechazarReserva);

module.exports = router;
