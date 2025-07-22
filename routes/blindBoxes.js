const express = require('express');
const router = express.Router();
const blindBoxController = require('../controllers/blindBoxController');

// 引入两个中间件
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// --- 公开路由 ---
router.get('/', blindBoxController.getAllBlindBoxes);
router.get('/:id', blindBoxController.getBlindBoxById);

// --- 受保护的管理员路由 ---
// 注意：我们把两个中间件放进一个数组里，它们会按顺序执行
const adminOnly = [authMiddleware, checkAdmin];

// POST /api/blindboxes - 创建新盲盒
router.post('/', adminOnly, blindBoxController.createBlindBox);

// PUT /api/blindboxes/:id - 更新指定ID的盲盒
router.put('/:id', adminOnly, blindBoxController.updateBlindBox);

// DELETE /api/blindboxes/:id - 删除指定ID的盲盒
router.delete('/:id', adminOnly, blindBoxController.deleteBlindBox);

module.exports = router;
