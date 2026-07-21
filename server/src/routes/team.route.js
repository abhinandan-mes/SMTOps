const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', teamController.getTeams);
router.post('/', authorizeRoles('SUPER_ADMIN'), teamController.createTeam);
router.put('/:id', authorizeRoles('SUPER_ADMIN'), teamController.updateTeam);
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), teamController.deleteTeam);

module.exports = router;
