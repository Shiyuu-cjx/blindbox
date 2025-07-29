const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

const adminOnly = [authMiddleware, checkAdmin];

router.post('/', adminOnly, itemController.createItem);
router.put('/:id', adminOnly, itemController.updateItem);
router.delete('/:id', adminOnly, itemController.deleteItem);

module.exports = router;
