require('dotenv').config();

const PORT = process.env.PORT || 8000;

const express = require('express');
const cors = require('cors');

const sequelize = require('./db');
const router = require('./routes');
const { User, Tel, Comments } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
