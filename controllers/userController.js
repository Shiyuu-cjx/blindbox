const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 注册新用户的逻辑
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username: username,
            password: hashedPassword
        });
        res.status(201).json({
            message: '用户注册成功！',
            userId: newUser.id
        });
    } catch (error) {
        res.status(500).json({
            message: '注册失败，用户名可能已被占用。',
            error: error.message
        });
    }
};

// 登录函数
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ message: '登录失败，用户不存在！' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: '登录失败，密码错误！' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            'a_secret_key_that_should_be_long_and_random',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: '登录成功！',
            token: token,
            balance: user.balance
        });

    } catch (error) {
        res.status(500).json({
            message: '服务器内部错误',
            error: error.message
        });
    }
};

// --- 新增：修改密码函数 ---
exports.changePassword = async (req, res) => {
    try {
        const userId = req.userData.userId; // 从 token 中获取用户ID
        const { oldPassword, newPassword } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        // 1. 验证旧密码是否正确
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: '旧密码不正确！' });
        }

        // 2. 将新密码哈希加密
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // 3. 更新数据库中的密码
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: '密码修改成功！' });
    } catch (error) {
        console.error("修改密码失败:", error);
        res.status(500).json({ message: '服务器内部错误' });
    }
};
