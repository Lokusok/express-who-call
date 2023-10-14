const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Tel = sequelize.define('Tel', {
  telNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

const Comment = sequelize.define('Comment', {
  description: {
    type: DataTypes.TEXT,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

User.hasMany(Comment);
Comment.belongsTo(User);

Tel.hasMany(Comment);
Comment.belongsTo(Tel);

module.exports = {
  User,
  Tel,
  Comment,
};
