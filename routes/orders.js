const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// 两个接口都需要登录后才能访问，所以都用 authMiddleware 保护
router.post('/', authMiddleware, orderController.drawBox);
router.get('/', authMiddleware, orderController.getMyOrders);

module.exports = router;
