const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('who-call', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
});

module.exports = sequelize;
