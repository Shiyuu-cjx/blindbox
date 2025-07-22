const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 从请求的 'Authorization' header 中获取 token
        // 请求头通常是 'Bearer TOKEN_STRING'，所以我们用 split(' ')[1] 来提取 token 部分
        const token = req.headers.authorization.split(' ')[1];

        // 验证 token 是否有效
        // 'a_secret_key_that_should_be_long_and_random' 必须和登录时生成 token 的密钥一致
        const decodedToken = jwt.verify(token, 'a_secret_key_that_should_be_long_and_random');

        // 将解码后的用户信息（比如用户ID）附加到请求对象上，方便后续的控制器使用
        req.userData = { userId: decodedToken.id };

        // 调用 next()，让请求继续往下走，进入真正的控制器逻辑
        next();
    } catch (error) {
        // 如果 token 不存在或无效，则返回 401 Unauthorized 错误
        return res.status(401).json({
            message: '认证失败，请先登录！'
        });
    }
};
