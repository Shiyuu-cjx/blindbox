const { Order, BlindBox, Item, User } = require('../models');

// 抽盒函数 (保持不变)
exports.drawBox = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { blindBoxId } = req.body;

        const user = await User.findByPk(userId);
        const blindBoxSeries = await BlindBox.findByPk(blindBoxId);

        if (!blindBoxSeries) {
            return res.status(404).json({ message: '找不到指定的盲盒系列' });
        }

        if (Number(user.balance) < Number(blindBoxSeries.price)) {
            return res.status(400).json({ message: `抽取失败，余额不足！需要 ${blindBoxSeries.price} 元。` });
        }

        const itemsInBox = await Item.findAll({ where: { BlindBoxId: blindBoxId } });
        if (!itemsInBox || itemsInBox.length === 0) {
            return res.status(404).json({ message: '这个系列里还没有任何款式哦！' });
        }

        const randomIndex = Math.floor(Math.random() * itemsInBox.length);
        const drawnItem = itemsInBox[randomIndex];

        user.balance = Number(user.balance) - Number(blindBoxSeries.price);
        await user.save();

        const newOrder = await Order.create({
            UserId: userId,
            ItemId: drawnItem.id
        });

        res.status(201).json({
            message: `恭喜你！成功抽取到了【${drawnItem.name}】！`,
            order: newOrder,
            drawnItem: {
                id: drawnItem.id,
                name: drawnItem.name,
                image: drawnItem.image,
                description: drawnItem.description,
                isSecret: drawnItem.isSecret
            },
            newBalance: user.balance
        });
    } catch (error) {
        console.error("抽盒时发生错误:", error);
        res.status(500).json({ message: '抽取失败，服务器错误', error: error.message });
    }
};

// --- 升级后的获取订单列表函数 ---
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const orders = await Order.findAll({
            where: { UserId: userId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Item,
                // 关键修正：在 attributes 数组中加入 'description'
                attributes: ['name', 'image', 'isSecret', 'description'],
                include: [{
                    model: BlindBox,
                    attributes: ['name', 'series']
                }]
            }]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: '获取订单列表失败', error: error.message });
    }
};
