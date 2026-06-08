const { Router } = require('express');
const { getSalones, getDisponibilidad } = require('../controllers/salonController');

const router = Router();

router.get('/', getSalones);
router.get('/disponibilidad/:salonId', getDisponibilidad);

module.exports = router;
