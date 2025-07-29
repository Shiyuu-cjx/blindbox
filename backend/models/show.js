const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Show = sequelize.define('Show', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false // 帖子标题
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false // 帖子内容
    },
    image: {
        type: DataTypes.STRING, // 玩家上传的图片URL
        allowNull: true
    }
});

module.exports = Show;
