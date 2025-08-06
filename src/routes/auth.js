const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/auth');

const router = express.Router();


// Registro
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ error: 'Erro ao registrar usuário' });
  }
});
// upload
router.post(
  '/',
  authenticate,
  upload.array('images', 10), // permite até 10 imagens
  async (req, res) => {
    try {
      const files = req.files;
      const images = files.map(file => `/uploads/${file.filename}`);

      const property = new Property({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        address: JSON.parse(req.body.address),
        details: JSON.parse(req.body.details),
        images,
        createdBy: req.user._id,
        contactPhone: req.user.phone
      });

      await property.save();
      res.status(201).send(property);
    } catch (err) {
      console.error(err);
      res.status(400).send({ error: 'Erro ao cadastrar imóvel' });
    }
  }
);

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ error: 'Login falhou' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;
