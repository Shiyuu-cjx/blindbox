const { Show, Order, User, Item, BlindBox } = require('../models');

// 创建一个新的“玩家秀”帖子 (逻辑基本不变)
exports.createShow = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { title, content, image, orderId } = req.body;

        const order = await Order.findOne({ where: { id: orderId, UserId: userId } });
        if (!order) {
            return res.status(403).json({ message: '操作被禁止：你不能为不属于你的订单创建玩家秀。' });
        }

        const existingShow = await Show.findOne({ where: { OrderId: orderId } });
        if (existingShow) {
            return res.status(400).json({ message: '创建失败：这个订单已经被秀过啦！' });
        }

        const newShow = await Show.create({ title, content, image, UserId: userId, OrderId: orderId });
        res.status(201).json({ message: '帖子发布成功！', show: newShow });
    } catch (error) {
        res.status(500).json({ message: '发布失败，服务器错误', error: error.message });
    }
};

// --- 更新获取帖子列表的逻辑 ---
exports.getAllShows = async (req, res) => {
    try {
        const shows = await Show.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Order,
                    attributes: ['id'],
                    include: [{
                        model: Item,
                        attributes: ['name', 'image', 'isSecret'],
                        include: [{
                            model: BlindBox,
                            attributes: ['name']
                        }]
                    }]
                }
            ]
        });
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ message: '获取帖子列表失败', error: error.message });
    }
};
