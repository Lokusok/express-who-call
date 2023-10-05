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
});

const Tel = sequelize.define('Tel', {
  telNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  viewsCount: {
    type: DataTypes.INTEGER,
  },
});

const Comment = sequelize.define('Comment', {
  description: {
    type: DataTypes.TEXT,
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
