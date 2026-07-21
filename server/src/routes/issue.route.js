const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/', issueController.createIssue);
router.get('/', issueController.getIssues);
router.put('/:id/status', issueController.updateIssueStatus);
router.post('/:id/transfer', issueController.transferIssue);

module.exports = router;
