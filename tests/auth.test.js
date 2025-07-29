const request = require('supertest');
// 注意：我们现在只从 server.js 中导入 app
const { app } = require('../server');
const { sequelize } = require('../models');

// 在所有测试开始前，连接并清空数据库
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', '用户注册成功！');
    });

    it('should not register a user with an existing username', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser', // 使用和上面测试一样的用户名
                password: 'password123',
            });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', '注册失败，用户名可能已被占用。');
    });
});

// 在所有测试结束后，只关闭数据库连接
// 我们不再需要 server.close()，因为在测试环境中，我们从未真正启动过服务器。
afterAll(async () => {
    await sequelize.close();
});
