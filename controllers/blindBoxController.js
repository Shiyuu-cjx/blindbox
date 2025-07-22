const { BlindBox, Item, Op } = require('../models'); // 引入 Item 模型和 Op

// 获取所有盲盒系列列表（支持搜索）
exports.getAllBlindBoxes = async (req, res) => {
    try {
        const { search } = req.query;
        let options = {
            order: [['id', 'ASC']] // 按ID升序排列
        };

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
        res.status(500).json({ message: '获取盲盒系列列表失败', error: error.message });
    }
};

// --- 这是核心改动 ---
// 根据 ID 获取单个盲盒系列详情，并包含其下所有款式
exports.getBlindBoxById = async (req, res) => {
    try {
        const { id } = req.params;
        const box = await BlindBox.findByPk(id, {
            // 使用 include 来同时加载关联的所有 Item (款式)
            include: [{
                model: Item,
                // 为了保护隐藏款的神秘感，我们不直接显示 isSecret 字段
                attributes: ['id', 'name', 'image', 'description']
            }]
        });

        if (!box) {
            return res.status(404).json({ message: '找不到指定的盲盒系列' });
        }

        res.status(200).json(box);
    } catch (error) {
        res.status(500).json({ message: '获取盲盒系列详情失败', error: error.message });
    }
};


// --- 管理员功能保持不变，因为它们操作的是“系列”本身 ---

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
