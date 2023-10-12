require('dotenv').config();

const PORT = process.env.PORT || 8000;

const express = require('express');
const cors = require('cors');

const sequelize = require('./db');
const router = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);
// глобальный обработчик ошибок
app.use((err, req, res, next) => {
  res.status(500).json({});
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
