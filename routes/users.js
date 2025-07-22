const express = require('express');
const router = express.Router();

// 引入我们刚刚编写的 userController
const userController = require('../controllers/userController');

// 定义一个路由：
// 当有 POST 请求访问 /register 地址时，调用 userController.register 函数
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
