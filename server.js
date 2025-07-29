const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { sequelize, User, BlindBox, Item } = require('./models');
const userRoutes = require('./routes/users');
const blindBoxRoutes = require('./routes/blindBoxes');
const orderRoutes = require('./routes/orders');
const showRoutes = require('./routes/shows');
const itemRoutes = require('./routes/items');
const commentRoutes = require('./routes/comments');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.static('public'));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blindboxes', blindBoxRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('<h1>盲盒项目后端服务器已启动</h1>');
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ 数据库连接成功.');
        await sequelize.sync();
        console.log('🔄 数据库表结构已同步.');

        // --- 新增：创建管理员账号 ---
        try {
            const adminPassword = 'Shiyuu'; // 这是一个示例密码
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.findOrCreate({
                where: { username: 'Shiyuu' },
                defaults: {
                    username: 'Shiyuu',
                    password: hashedPassword,
                    role: 'admin'
                }
            });
            console.log('👑 管理员用户(Shiyuu)已成功添加或确认存在.');
        } catch (error) {
            console.error('❌ 添加管理员用户失败:', error);
        }

        // 只有在非测试环境下才监听端口
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`✅ 服务器已在 http://localhost:${PORT} 上成功启动`);
            });
        }
    } catch (err) {
        console.error('❌ 无法连接到数据库或启动服务器:', err);
    }
};

startServer();

// 只导出 app 供测试文件使用
module.exports = { app };
