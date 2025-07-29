const { BlindBox, Item } = require('../models');
const { Op } = require('sequelize'); // 关键修正：Op 必须从 sequelize 直接引入

// 获取所有盲盒系列列表（支持搜索）
exports.getAllBlindBoxes = async (req, res) => {
    try {
        const { search } = req.query;
        let options = {
            order: [['id', 'ASC']]
        };

        // 只有当 search 参数存在且不为空时，才添加 where 条件
        if (search) {
            options.where = {
                name: {
                    [Op.like]: `%${search}%`
                }
            };
        }

        const boxes = await BlindBox.findAll(options);
        res.status(200).json(boxes);
    } catch (error) {
        console.error('搜索盲盒失败:', error);
        res.status(500).json({ message: '获取盲盒系列列表失败', error: error.message });
    }
};

// 根据 ID 获取单个盲盒系列详情
exports.getBlindBoxById = async (req, res) => {
    try {
        const { id } = req.params;
        const box = await BlindBox.findByPk(id, {
            include: [Item]
        });

        if (!box) {
            return res.status(404).json({ message: '找不到指定的盲盒系列' });
        }
        res.status(200).json(box);
    } catch (error) {
        console.error('获取盲盒详情失败:', error);
        res.status(500).json({ message: '获取盲盒系列详情失败', error: error.message });
    }
};


// --- 管理员功能 ---

// 创建新盲盒系列
exports.createBlindBox = async (req, res) => {
    try {
        const { name, series, price, image, description } = req.body;
        const newBox = await BlindBox.create({ name, series, price, image, description });
        res.status(201).json({ message: '盲盒系列创建成功', box: newBox });
    } catch (error) {
        res.status(500).json({ message: '创建盲盒系列失败', error: error.message });
    }
};

// 更新盲盒系列信息
exports.updateBlindBox = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, series, price, image, description } = req.body;
        const box = await BlindBox.findByPk(id);
        if (!box) {
            return res.status(404).json({ message: '找不到要更新的盲盒系列' });
        }
        await box.update({ name, series, price, image, description });
        res.status(200).json({ message: '盲盒系列更新成功', box: box });
    } catch (error) {
        res.status(500).json({ message: '更新盲盒系列失败', error: error.message });
    }
};

// 删除盲盒系列
exports.deleteBlindBox = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BlindBox.destroy({ where: { id: id } });
        if (result === 0) {
            return res.status(404).json({ message: '找不到要删除的盲盒系列' });
        }
        res.status(200).json({ message: '盲盒系列删除成功' });
    } catch (error) {
        res.status(500).json({ message: '删除盲盒系列失败', error: error.message });
    }
};
