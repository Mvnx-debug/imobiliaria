const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DB_PATH = path.join(__dirname, 'data', 'imoveis.json');

app.get('/api/imoveis', (req, res) => {
  try {
    const imoveis = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(imoveis);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o banco de dados' });
  }
});

app.post('/api/imoveis', upload.array('fotos'), (req, res) => {
  if (req.body.senha !== 'senhaSegura123') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const imoveis = JSON.parse(fs.readFileSync(DB_PATH));
    const fotos = req.files.map(file => file.filename);

    const novoImovel = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      preco: parseFloat(req.body.preco),
      fotos
    };

    imoveis.push(novoImovel);
    fs.writeFileSync(DB_PATH, JSON.stringify(imoveis, null, 2));
    res.json({ message: 'Imóvel cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar o imóvel' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});