const express = require('express');
const Property = require('../models/Property');
const upload = require('../middleware/upload');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Listar imóveis disponíveis (público)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true })
      .select('-createdBy -__v')
      .lean();
    res.json(properties);
  } catch (err) {
    console.error('Erro ao buscar imóveis:', err);
    res.status(500).json({ 
      error: 'Erro ao buscar imóveis',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Listar imóveis do corretor logado
router.get('/my-properties', authenticate, async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user._id })
      .select('-__v')
      .lean();
      
    if (!properties.length) {
      return res.status(404).json({ 
        message: 'Nenhum imóvel cadastrado para este usuário' 
      });
    }
    
    res.json(properties);
  } catch (err) {
    console.error('Erro ao buscar imóveis do usuário:', err);
    res.status(500).json({ 
      error: 'Erro ao carregar seus imóveis',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Buscar imóvel por ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .select('-__v')
      .lean();
      
    if (!property) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }
    
    res.json(property);
  } catch (err) {
    console.error('Erro ao buscar imóvel:', err);
    res.status(500).json({ 
      error: 'Erro ao buscar imóvel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Criar novo imóvel
router.post('/', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    // Converter os campos de string para objetos
    const address = typeof req.body.address === 'string' ? 
      JSON.parse(req.body.address) : req.body.address;
    
    const details = typeof req.body.details === 'string' ? 
      JSON.parse(req.body.details) : req.body.details;

    // Criar o imóvel
    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      price: parseFloat(req.body.price),
      address,
      details: {
        bedrooms: parseInt(details.bedrooms),
        bathrooms: parseInt(details.bathrooms),
        area: parseInt(details.area),
        garageSpaces: parseInt(details.garageSpaces)
      },
      images: req.files?.map(file => `/uploads/${file.filename}`) || [],
      createdBy: req.user._id,
      contactPhone: req.body.contactPhone || req.user.phone,
      status: req.body.status || 'disponivel',
      isAvailable: true // Adicionar este campo
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error('Erro ao cadastrar imóvel:', err);
    res.status(400).json({ 
      error: 'Erro ao cadastrar imóvel',
      details: err.message
    });
  }
});

// Atualizar imóvel
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Verificar se o imóvel existe e pertence ao usuário
    const property = await Property.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!property) {
      return res.status(404).json({ 
        error: 'Imóvel não encontrado ou não autorizado' 
      });
    }

    // Atualizar campos permitidos
    const updates = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      price: req.body.price,
      status: req.body.status,
      contactPhone: req.body.contactPhone,
      address: req.body.address,
      details: req.body.details
    };

    // Validar campos obrigatórios
    const requiredFields = ['title', 'price', 'description', 'type'];
    const missingFields = requiredFields.filter(field => !updates[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios faltando',
        missingFields 
      });
    }

    // Aplicar atualizações
    Object.assign(property, updates);
    await property.save();
    
    // Retornar resposta sem campos internos
    const response = property.toObject();
    delete response.__v;
    delete response.createdBy;
    
    res.json(response);
  } catch (err) {
    console.error('Erro ao atualizar imóvel:', err);
    res.status(400).json({ 
      error: 'Erro ao atualizar imóvel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Remover imóvel
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!property) {
      return res.status(404).json({ 
        error: 'Imóvel não encontrado ou não autorizado' 
      });
    }
    
    res.json({ 
      message: 'Imóvel removido com sucesso',
      property: {
        _id: property._id,
        title: property.title
      }
    });
  } catch (err) {
    console.error('Erro ao remover imóvel:', err);
    res.status(500).json({ 
      error: 'Erro ao remover imóvel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;