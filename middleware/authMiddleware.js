const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = jwt.verify(token, 'a_secret_key_that_should_be_long_and_random');

        // 关键修复：同时将 userId 和 role 挂载到请求对象上
        req.userData = { userId: decodedToken.id, role: decodedToken.role };

        next();
    } catch (error) {
        return res.status(401).json({
            message: '认证失败，请先登录！'
        });
    }
};
