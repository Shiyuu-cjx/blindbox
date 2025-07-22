const sequelize = require('../config/database');

// 引入所有模型
const User = require('./user');
const BlindBox = require('./blindBox'); // 代表“系列”
const Item = require('./item');       // 代表“款式”
const Order = require('./order');
const Show = require('./show');

// --- 重新定义所有关系 ---

// 1. 系列与款式的关系 (一个系列包含多个款式)
BlindBox.hasMany(Item);
Item.belongsTo(BlindBox);

// 2. 用户与订单的关系 (一个用户可以有多个订单)
User.hasMany(Order);
Order.belongsTo(User);

// 3. 款式与订单的关系 (这是关键改动！订单现在关联到具体的款式)
Item.hasMany(Order);
Order.belongsTo(Item); // 一个订单只包含一个抽中的款式

// 4. 用户与玩家秀的关系 (一个用户可以发多个帖子)
User.hasMany(Show);
Show.belongsTo(User);

// 5. 订单与玩家秀的关系 (一个订单可以被秀一次)
Order.hasOne(Show);
Show.belongsTo(Order);

// 统一导出
const db = {
    sequelize,
    User,
    BlindBox,
    Item,
    Order,
    Show
};

module.exports = db;
