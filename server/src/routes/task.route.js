const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', taskController.getTasks);
router.post('/', authorizeRoles('SUPER_ADMIN', 'TEAM_LEADER'), taskController.createTask);
router.put('/:id/status', taskController.updateTaskStatus);

module.exports = router;
