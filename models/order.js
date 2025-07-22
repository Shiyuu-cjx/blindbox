const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // 订单日期，默认为当前时间
    }
    // 这个模型看起来很简单，因为它最重要的信息（谁买的，买的啥）
    // 将通过“关系”来定义，而不是字段。
});

module.exports = Order;
