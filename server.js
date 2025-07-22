const express = require('express');
const bcrypt = require('bcryptjs');

// 从统一的出口引入所有需要的模型
const { sequelize, User, BlindBox, Item } = require('./models');

// 引入路由文件
const userRoutes = require('./routes/users');
const blindBoxRoutes = require('./routes/blindBoxes');
const orderRoutes = require('./routes/orders');
const showRoutes = require('./routes/shows');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blindboxes', blindBoxRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shows', showRoutes);

app.get('/', (req, res) => {
    res.send('<h1>盲盒项目后端服务器已启动</h1>');
});

sequelize.authenticate()
    .then(() => {
        console.log('✅ 数据库连接成功.');
        // 同步所有模型
        return sequelize.sync({ alter: true });
    })
    .then(async () => {
        console.log('🔄 数据库表结构同步完成.');

        try {
            // --- 创建管理员 ---
            const adminPassword = 'admin_password_123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.findOrCreate({
                where: { username: 'admin' },
                defaults: {
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin'
                }
            });
            console.log('👑 管理员用户(admin)已成功添加或确认存在.');

            // --- 创建系列和款式数据 ---

            // 1. 创建系列1：太空漫游
            const [spaceBox] = await BlindBox.findOrCreate({
                where: { id: 1 },
                defaults: { name: '太空漫游系列', series: '太空系列', price: 59.00, image: 'https://placehold.co/400x400/2D3748/E2E8F0?text=太空漫游系列', description: '内含3款常规款和1款隐藏款。' }
            });
            // 为系列1添加具体款式，并确保关联正确
            await Item.findOrCreate({ where: { name: '宇航员A' }, defaults: { name: '宇航员A', image: 'https://placehold.co/200x200/CBD5E0/2D3748?text=宇航员A', description: '勇敢的探险家', BlindBoxId: spaceBox.id }});
            await Item.findOrCreate({ where: { name: '宇航员B' }, defaults: { name: '宇航员B', image: 'https://placehold.co/200x200/A0AEC0/2D3748?text=宇航员B', description: '冷静的观察者', BlindBoxId: spaceBox.id }});
            await Item.findOrCreate({ where: { name: '月球车' }, defaults: { name: '月球车', image: 'https://placehold.co/200x200/718096/E2E8F0?text=月球车', description: '忠实的伙伴', BlindBoxId: spaceBox.id }});
            await Item.findOrCreate({ where: { name: '隐藏款-火箭' }, defaults: { name: '隐藏款-火箭', image: 'https://placehold.co/200x200/E53E3E/FFFFFF?text=隐藏款', description: '星际穿梭的梦想', isSecret: true, BlindBoxId: spaceBox.id }});

            // 2. 创建系列2：深海探险
            const [seaBox] = await BlindBox.findOrCreate({
                where: { id: 2 },
                defaults: { name: '深海探险系列', series: '海洋系列', price: 69.00, image: 'https://placehold.co/400x400/4A5568/E2E8F0?text=深海探险系列', description: '探索神秘的海底世界。' }
            });
            // 为系列2添加具体款式
            await Item.findOrCreate({ where: { name: '潜水员' }, defaults: { name: '潜水员', image: 'https://placehold.co/200x200/4299E1/FFFFFF?text=潜水员', description: '无畏的深海行者', BlindBoxId: seaBox.id }});
            await Item.findOrCreate({ where: { name: '小丑鱼' }, defaults: { name: '小丑鱼', image: 'https://placehold.co/200x200/ED8936/FFFFFF?text=小丑鱼', description: '珊瑚丛中的精灵', BlindBoxId: seaBox.id }});

            console.log('📦 测试系列和款式数据已成功添加或确认存在.');
        } catch (error) {
            console.error('❌ 添加测试数据失败:', error);
        }

        app.listen(PORT, () => {
            console.log(`✅ 服务器已在 http://localhost:${PORT} 上成功启动`);
        });
    })
    .catch(err => {
        console.error('❌ 无法连接到数据库或启动服务器:', err);
    });
