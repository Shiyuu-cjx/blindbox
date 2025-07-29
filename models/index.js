const sequelize = require('../config/database');
const User = require('./user');
const BlindBox = require('./blindBox');
const Item = require('./item');
const Order = require('./order');
const Show = require('./show');
const Comment = require('./comment');

BlindBox.hasMany(Item, { foreignKey: 'BlindBoxId', onDelete: 'CASCADE' });
Item.belongsTo(BlindBox, { foreignKey: 'BlindBoxId' });
User.hasMany(Order, { foreignKey: 'UserId' });
Order.belongsTo(User, { foreignKey: 'UserId' });
Item.hasMany(Order, { foreignKey: 'ItemId', onDelete: 'CASCADE' });
Order.belongsTo(Item, { foreignKey: 'ItemId' });
User.hasMany(Show, { foreignKey: 'UserId' });
Show.belongsTo(User, { foreignKey: 'UserId' });
Order.hasOne(Show, { foreignKey: 'OrderId', onDelete: 'CASCADE' });
Show.belongsTo(Order, { foreignKey: 'OrderId' });
User.hasMany(Comment, { foreignKey: 'UserId' });
Comment.belongsTo(User, { foreignKey: 'UserId' });
Show.hasMany(Comment, { foreignKey: 'ShowId', onDelete: 'CASCADE' });
Comment.belongsTo(Show, { foreignKey: 'ShowId' });

const db = { sequelize, User, BlindBox, Item, Order, Show, Comment };
module.exports = db;
