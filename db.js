const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('who-call', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

module.exports = sequelize;
