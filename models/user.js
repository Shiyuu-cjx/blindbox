const { DataTypes } = require('sequelize');
const sequelize =require('../config/database');

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
    // --- 新增的字段 ---
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user' // 默认新注册的用户都是 'user' 角色
    }
});

module.exports = User;
