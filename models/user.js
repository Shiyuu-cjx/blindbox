const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    // --- 新增的字段 ---
    balance: {
        type: DataTypes.DECIMAL(10, 2), // 和价格用同一种类型，保证精度
        allowNull: false,
        defaultValue: 9999.00 // 默认初始余额为 9999
    }
});

module.exports = User;
