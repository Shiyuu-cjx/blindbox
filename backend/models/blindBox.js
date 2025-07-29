const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlindBox = sequelize.define('BlindBox', {
    name: {
        type: DataTypes.STRING,
        allowNull: false // 盲盒名称，不允许为空
    },
    series: {
        type: DataTypes.STRING, // 盲盒所属系列，如“太空漫游系列”
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // 价格，最多10位数，其中2位是小数
        allowNull: false
    },
    image: {
        type: DataTypes.STRING, // 存放盲盒图片的URL地址
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT, // 存放长篇的描述文字
        allowNull: true
    }
});

module.exports = BlindBox;
