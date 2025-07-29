const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const authMiddleware = require('../middleware/authMiddleware');

// 发布新帖子 (需要登录)
router.post('/', authMiddleware, showController.createShow);

// 获取所有帖子列表 (公开)
router.get('/', showController.getAllShows);

router.delete('/:showId', authMiddleware, showController.deleteShow);
module.exports = router;
