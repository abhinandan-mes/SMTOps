const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', userController.getUsers);
router.post('/', authorizeRoles('SUPER_ADMIN', 'TEAM_LEADER'), userController.createUser);
router.put('/:id', authorizeRoles('SUPER_ADMIN', 'TEAM_LEADER'), userController.updateUser);
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), userController.deleteUser);

module.exports = router;
