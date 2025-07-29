const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false // 款式名称，如“宇航员A”
    },
    image: {
        type: DataTypes.STRING, // 款式独立的图片URL
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, // 款式的描述
        allowNull: true
    },
    isSecret: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // 是否为隐藏款
    }
});

module.exports = Item;
