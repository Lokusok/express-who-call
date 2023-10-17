const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgres://ilxnoljr:8xfcdbWEBrSCWttfzfDerRuX8LpbRc2g@mouse.db.elephantsql.com/ilxnoljr'
);

module.exports = sequelize;
