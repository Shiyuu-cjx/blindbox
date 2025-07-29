const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);

// 受保护的路由
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
