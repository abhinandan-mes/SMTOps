const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machine.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', machineController.getMachines);
router.get('/:code', machineController.getMachineByCode);
router.post('/', authorizeRoles('SUPER_ADMIN', 'TEAM_LEADER'), machineController.createMachine);

module.exports = router;
