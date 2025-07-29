const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        // 这个中间件会在 authMiddleware 之后运行
        // 所以我们可以安全地假设 req.userData.userId 已经存在
        const user = await User.findByPk(req.userData.userId);

        if (user && user.role === 'admin') {
            // 如果用户存在且角色是 'admin'，则放行
            next();
        } else {
            // 否则，返回 403 Forbidden 错误
            res.status(403).json({ message: '访问被拒绝：需要管理员权限！' });
        }
    } catch (error) {
        res.status(500).json({ message: '权限检查失败', error: error.message });
    }
};
