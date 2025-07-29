const { Show, Order, User, Item, BlindBox, Comment } = require('../models');

exports.createShow = async (req, res) => { /* ... */ }; // (这部分代码你已经有了，保持不变)

exports.getAllShows = async (req, res) => {
    try {
        const shows = await Show.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Order, include: [{ model: Item, include: [BlindBox] }] },
                { model: Comment, include: [{ model: User, attributes: ['username'] }] }
            ]
        });
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ message: '获取帖子列表失败', error: error.message });
    }
};

exports.deleteShow = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.userData.userId;
        const userRole = req.userData.role;
        const show = await Show.findByPk(showId);
        if (!show) return res.status(404).json({ message: '帖子未找到' });
        if (show.UserId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: '无权删除此帖子' });
        }
        await show.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: '删除帖子失败', error: error.message });
    }
};
