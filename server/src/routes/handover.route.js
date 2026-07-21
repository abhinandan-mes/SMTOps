const express = require('express');
const router = express.Router();
const handoverController = require('../controllers/handover.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/', handoverController.submitHandover);
router.get('/', handoverController.getHandovers);
router.put('/:id/acknowledge', handoverController.acknowledgeHandover);

module.exports = router;
