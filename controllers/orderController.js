const { Order, BlindBox, Item, User } = require('../models');

// --- 这是核心改动：实现随机抽取 ---
exports.drawBox = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { blindBoxId } = req.body; // 用户选择要抽的“系列”ID

        // 1. 找到这个系列下的所有“款式”
        const itemsInBox = await Item.findAll({ where: { BlindBoxId: blindBoxId } });
        if (!itemsInBox || itemsInBox.length === 0) {
            return res.status(404).json({ message: '这个系列里还没有任何款式哦！' });
        }

        // 2. 实现随机抽取算法
        //    这里用一个最简单的随机算法：在所有款式中随机选一个
        const randomIndex = Math.floor(Math.random() * itemsInBox.length);
        const drawnItem = itemsInBox[randomIndex];

        // 3. 创建订单，关联到抽中的具体“款式”
        const newOrder = await Order.create({
            UserId: userId,
            ItemId: drawnItem.id // 关联到抽中的 ItemId
        });

        // 4. 返回一个包含惊喜的结果
        res.status(201).json({
            message: `恭喜你！成功抽取到了【${drawnItem.name}】！`, // 使用抽中的款式名称
            order: newOrder,
            drawnItem: { // 把抽中的款式信息也返回给前端，方便展示
                id: drawnItem.id,
                name: drawnItem.name,
                image: drawnItem.image,
                description: drawnItem.description,
                isSecret: drawnItem.isSecret
            }
        });
    } catch (error) {
        res.status(500).json({ message: '抽取失败，服务器错误', error: error.message });
    }
};

// --- 更新获取订单列表的逻辑 ---
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const orders = await Order.findAll({
            where: { UserId: userId },
            order: [['createdAt', 'DESC']], // 按创建时间排序
            // 使用嵌套的 include 来获取完整信息
            include: [{
                model: Item, // 订单 -> 款式
                attributes: ['name', 'image', 'isSecret'],
                include: [{
                    model: BlindBox, // 款式 -> 系列
                    attributes: ['name', 'series']
                }]
            }]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '获取订单列表失败', error: error.message });
    }
};
