const { Sequelize } = require('sequelize');
const path = require('path');

// 这段代码是核心：初始化 Sequelize 并告诉它如何连接数据库
const sequelize = new Sequelize({
    // dialect 告诉 Sequelize 我们用的是什么类型的数据库
    dialect: 'sqlite',

    // storage 告诉 Sequelize 数据库文件应该存放在哪里
    // path.join(__dirname, '..', 'database.sqlite') 是一个安全创建文件路径的方法
    // __dirname: 代表当前文件 (database.js) 所在的文件夹路径 (即 .../backend/config)
    // '..': 代表“上一级目录” (即 .../backend)
    // 'database.sqlite': 我们数据库文件的名字
    // 所以，最终的路径就是 .../backend/database.sqlite
    storage: path.join(__dirname, '..', 'database.sqlite'),

    // logging: false 可以关闭在控制台显示每次数据库操作的SQL语句，让界面更干净
    logging: false
});

module.exports = sequelize;
