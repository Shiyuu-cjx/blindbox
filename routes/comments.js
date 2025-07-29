const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// 注意：这里的路由是挂载在 /api/comments 下的
router.post('/show/:showId', authMiddleware, commentController.createComment);

module.exports = router;
