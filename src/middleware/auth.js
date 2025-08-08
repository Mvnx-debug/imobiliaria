const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  console.log('HEADERS RECEBIDOS:', req.headers);
  
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).send({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Token inválido' });
  }
};

module.exports = authenticate;
