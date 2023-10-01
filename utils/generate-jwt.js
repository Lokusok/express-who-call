const jsonwebtoken = require('jsonwebtoken');

const generateJWT = (payload, expiresIn) => {
  return jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
    expiresIn,
  });
};

module.exports = generateJWT;
