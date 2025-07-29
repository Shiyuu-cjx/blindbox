const { Show, Order, User, Item, BlindBox, Comment } = require('../models');

// 关键修复：补全创建帖子的完整逻辑
exports.createShow = async (req, res) => {
    try {
        const { title, content, image, orderId } = req.body;
        const userId = req.userData.userId;

        // 1. 安全检查：确认订单存在，并且属于当前登录的用户
        const order = await Order.findOne({
            where: {
                id: orderId,
                UserId: userId,
            },
        });

        if (!order) {
            return res.status(404).json({ message: '您要分享的订单不存在或不属于您' });
        }

        // 2. 逻辑检查：防止对同一个订单重复发帖
        const existingShow = await Show.findOne({ where: { OrderId: orderId } });
        if (existingShow) {
            return res.status(400).json({ message: '这个订单已经晒过单了，不能重复发布哦！' });
        }

        // 3. 创建帖子
        const newShow = await Show.create({
            title,
            content,
            image,
            OrderId: orderId,
            UserId: userId, // 明确记录发帖人
        });

        res.status(201).json({
            message: '帖子发布成功！',
            show: newShow,
        });
    } catch (error) {
        console.error("发布帖子时发生严重错误:", error);
        res.status(500).json({
            message: '服务器开小差了，发布失败',
            error: error.message,
        });
    }
};


// 获取所有帖子列表 (保持不变)
exports.getAllShows = async (req, res) => {
    try {
        const { search } = req.query; // 2. 获取 URL 中的 search 参数

        const findOptions = {
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Order, include: [{ model: Item, include: [BlindBox] }] },
                { model: Comment, include: [{ model: User, attributes: ['username'] }] }
            ]
        };

        // 如果有搜索词，则添加 where 条件进行模糊查询
        if (search) {
            findOptions.where = {
                title: {
                    [Op.like]: `%${search}%`
                }
            };
        }

        const shows = await Show.findAll(findOptions);
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ message: '获取帖子列表失败', error: error.message });
    }
};
// 删除帖子 (保持不变)
exports.deleteShow = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.userData.userId;
        const userRole = req.userData.role;
        const show = await Show.findByPk(showId);
        if (!show) return res.status(404).json({ message: '帖子未找到' });
        // 确保只有帖子的主人或管理员可以删除
        if (show.UserId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: '无权删除此帖子' });
        }
        await show.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: '删除帖子失败', error: error.message });
    }
};
