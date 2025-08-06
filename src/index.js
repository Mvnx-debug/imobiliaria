const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authenticate = require('./middleware/auth');
const upload = require('./middleware/upload');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao banco
connectDB();
//auth
app.use('/api/properties', authenticate, require('./routes/properties'));
//uploads
app.use('/upload', express.static(path.join(__dirname, '../upload')));


// Servir frontend
app.use(express.static(path.join(__dirname, '../public')));
app.use('/upload', express.static(path.join(__dirname, '../upload')));

// Rotas
app.use('/api', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));

// Rota padrão
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
