const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// 注册新用户的逻辑
exports.register = async (req, res) => {
    try {
        // 从请求的 body 中获取用户名和密码
        const { username, password } = req.body;

        // !!重要：对密码进行哈希加密，增加安全性
        // 10 是加密的强度，数字越大越安全但越耗时
        const hashedPassword = await bcrypt.hash(password, 10);

        // 使用 User 模型在数据库中创建一个新用户
        const newUser = await User.create({
            username: username,
            password: hashedPassword // 将加密后的密码存入数据库
        });

        // 返回一个成功的响应
        res.status(201).json({
            message: '用户注册成功！',
            userId: newUser.id
        });

    } catch (error) {
        // 如果出错（比如用户名已存在），返回一个失败的响应
        res.status(500).json({
            message: '注册失败，用户名可能已被占用。',
            error: error.message
        });
    }
};
exports.login = async (req, res) => {
    try {
        // 1. 从请求体中获取用户名和密码
        const { username, password } = req.body;

        // 2. 根据用户名在数据库中查找用户
        const user = await User.findOne({ where: { username: username } });

        // 3. 如果找不到该用户，返回错误信息
        if (!user) {
            return res.status(404).json({ message: '登录失败，用户不存在！' });
        }

        // 4. 比较用户输入的密码和数据库中加密存储的密码是否一致
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: '登录失败，密码错误！' });
        }

        // 5. 登录成功，生成 JWT Token
        //    这个 Token 里包含了用户的 id 和 username，并设置了1小时的有效期
        const token = jwt.sign(
            { id: user.id, username: user.username },
            'a_secret_key_that_should_be_long_and_random', // 这是一个“密钥”，用于加密，后面可以替换成更复杂的
            { expiresIn: '1h' } // Token 有效期1小时
        );

        // 6. 将生成的 Token 返回给前端
        res.status(200).json({
            message: '登录成功！',
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: '服务器内部错误',
            error: error.message
        });
    }
};
