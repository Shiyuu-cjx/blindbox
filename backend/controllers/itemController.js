const { Item } = require('../models');

// 创建新款式
exports.createItem = async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: '创建款式失败', error: error.message });
    }
};

// 更新款式
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Item.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedItem = await Item.findByPk(id);
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ message: '找不到要更新的款式' });
        }
    } catch (error) {
        res.status(500).json({ message: '更新款式失败', error: error.message });
    }
};

// 删除款式
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Item.destroy({ where: { id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: '找不到要删除的款式' });
        }
    } catch (error) {
        res.status(500).json({ message: '删除款式失败', error: error.message });
    }
};
