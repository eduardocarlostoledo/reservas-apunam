const { Router } = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const {
  loginUsuario,
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  toggleUsuario,
  uploadCSV,
} = require('../controllers/usuarioController');
const { authMiddleware } = require('../middlewares/auth');
const { handleValidation } = require('../middlewares/validation');

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  '/login',
  [
    body('nro_legaj').notEmpty().withMessage('Número de legajo requerido'),
    body('nro_docum').notEmpty().withMessage('Número de documento requerido'),
    handleValidation,
  ],
  loginUsuario
);

router.get('/', authMiddleware, getUsuarios);
router.get('/:id', authMiddleware, getUsuario);

router.post(
  '/',
  authMiddleware,
  [
    body('nro_legaj').isInt().withMessage('Legajo debe ser un número'),
    body('nro_docum').trim().notEmpty().withMessage('Documento requerido'),
    body('apellido').trim().notEmpty().withMessage('Apellido requerido'),
    body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
    handleValidation,
  ],
  createUsuario
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('nro_legaj').optional().isInt().withMessage('Legajo debe ser un número'),
    body('nro_docum').optional().trim().notEmpty().withMessage('Documento no puede estar vacío'),
    body('apellido').optional().trim().notEmpty().withMessage('Apellido no puede estar vacío'),
    body('nombre').optional().trim().notEmpty().withMessage('Nombre no puede estar vacío'),
    handleValidation,
  ],
  updateUsuario
);

router.patch('/:id/toggle', authMiddleware, toggleUsuario);
router.post('/upload-csv', authMiddleware, upload.single('file'), uploadCSV);

module.exports = router;
