const express = require('express');
const Property = require('../models/Property');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/auth');


const router = express.Router();

// Listar imóveis disponíveis
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true });
    res.send(properties);
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar imóveis' });
  }
});

// Buscar imóvel por ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).send({ error: 'Imóvel não encontrado' });
    res.send(property);
  } catch (err) {
    res.status(500).send({ error: 'Erro ao buscar imóvel' });
  }
});

// Criar novo imóvel
router.post('/', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.body.title || !req.body.price || !req.body.description) {
      return res.status(400).send({ error: 'Campos obrigatórios não preenchidos.' });
    }

    const address = JSON.parse(req.body.address);
    const details = JSON.parse(req.body.details);
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      price: req.body.price,
      address,
      details,
      images,
      createdBy: req.user._id,
      contactPhone: req.user.phone
    });

    await property.save();
    res.status(201).send(property);
  } catch (err) {
    console.error('Erro ao cadastrar imóvel:', err);
    res.status(400).send({ error: 'Erro ao cadastrar imóvel' });
  }
});

// Atualizar imóvel
router.put('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!property) return res.status(404).send({ error: 'Imóvel não encontrado ou não autorizado' });
    res.send(property);
  } catch (err) {
    res.status(400).send({ error: 'Erro ao atualizar imóvel' });
  }
});

// Remover imóvel
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!property) return res.status(404).send({ error: 'Imóvel não encontrado ou não autorizado' });
    res.send(property);
  } catch (err) {
    res.status(400).send({ error: 'Erro ao remover imóvel' });
  }
});

module.exports = router;
