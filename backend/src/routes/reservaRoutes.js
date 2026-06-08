const { Router } = require('express');
const { body } = require('express-validator');
const { crearReserva } = require('../controllers/reservaController');
const { handleValidation } = require('../middlewares/validation');

const router = Router();

router.post(
  '/',
  [
    body('salon_id').isInt({ min: 1 }).withMessage('Salón inválido'),
    body('nombre_completo').trim().notEmpty().withMessage('Nombre completo requerido').escape(),
    body('dni').trim().notEmpty().withMessage('DNI requerido').escape(),
    body('numero_afiliado').trim().notEmpty().withMessage('Número de afiliado requerido').escape(),
    body('telefono').trim().notEmpty().withMessage('Teléfono requerido').escape(),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('fecha_reserva').isDate().withMessage('Fecha inválida'),
    body('observaciones').optional().trim().escape(),
    handleValidation,
  ],
  crearReserva
);

module.exports = router;
