const { Order, BlindBox, Item, User } = require('../models');

// --- 升级后的抽盒函数 ---
exports.drawBox = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { blindBoxId } = req.body;

        // 1. 同时查找需要用到的数据：用户信息和盲盒系列信息
        const user = await User.findByPk(userId);
        const blindBoxSeries = await BlindBox.findByPk(blindBoxId);

        if (!blindBoxSeries) {
            return res.status(404).json({ message: '找不到指定的盲盒系列' });
        }

        // 2. 检查余额是否足够
        //    注意：数据库返回的 decimal 是字符串，需要转成数字再比较
        if (Number(user.balance) < Number(blindBoxSeries.price)) {
            return res.status(400).json({ message: `抽取失败，余额不足！需要 ${blindBoxSeries.price} 元。` });
        }

        // 3. 找到这个系列下的所有“款式”
        const itemsInBox = await Item.findAll({ where: { BlindBoxId: blindBoxId } });
        if (!itemsInBox || itemsInBox.length === 0) {
            return res.status(404).json({ message: '这个系列里还没有任何款式哦！' });
        }

        // 4. 实现随机抽取算法
        const randomIndex = Math.floor(Math.random() * itemsInBox.length);
        const drawnItem = itemsInBox[randomIndex];

        // 5. 扣除余额
        user.balance = Number(user.balance) - Number(blindBoxSeries.price);
        await user.save(); // 保存用户余额的变动

        // 6. 创建订单
        const newOrder = await Order.create({
            UserId: userId,
            ItemId: drawnItem.id
        });

        // 7. 返回一个包含惊喜和新余额的结果
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
            newBalance: user.balance // 返回扣费后的新余额
        });
    } catch (error) {
        console.error("抽盒时发生错误:", error);
        res.status(500).json({ message: '抽取失败，服务器错误', error: error.message });
    }
};

// 获取我的订单列表 (保持不变)
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const orders = await Order.findAll({
            where: { UserId: userId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Item,
                attributes: ['name', 'image', 'isSecret'],
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
