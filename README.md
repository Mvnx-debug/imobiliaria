### 🏠 Imobb - Sistema Imobiliário
Este projeto é uma aplicação backend desenvolvida em Node.js com Express e MongoDB Atlas, criada para gerenciar imóveis, clientes e informações relacionadas a uma imobiliária.

O objetivo é fornecer uma API robusta para ser utilizada em um futuro frontend web/mobile, facilitando o cadastro, consulta e atualização de dados.

🚀 Tecnologias Utilizadas
Node.js - Ambiente de execução JavaScript

Express - Framework web para Node.js

MongoDB Atlas - Banco de dados não relacional em nuvem

Mongoose - ODM para modelagem de dados no MongoDB

Nodemon - Monitoramento e reinício automático do servidor durante o desenvolvimento

📂 Estrutura do Projeto
text
imobb/
├── node_modules/         # Dependências do projeto
├── src/                  # Código-fonte principal
│   ├── config/           # Configurações (ex: conexão com MongoDB)
│   ├── controllers/      # Lógica de controle das rotas
│   ├── models/           # Modelos do banco de dados (Mongoose)
│   ├── routes/           # Definição das rotas da API
│   └── server.js         # Arquivo principal do servidor
├── .gitignore           # Arquivos ignorados pelo Git
├── package.json          # Dependências e scripts do projeto
└── README.md            # Documentação do projeto
⚙️ Instalação e Execução
1. Clonar o repositório
bash
git clone https://github.com/Mvnx-debug/imobiliaria.git
cd imobb
2. Instalar dependências
bash
npm install
3. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as informações abaixo:

env
PORT=5000
MONGO_URI=sua_string_de_conexao_mongodb_atlas
4. Rodar o servidor em modo desenvolvimento
bash
npm run dev
📌 Funcionalidades (Atualmente)
✅ Cadastro de imóveis

✅ Listagem de imóveis

✅ Atualização de dados

✅ Exclusão de registros

🔮 Próximos Passos / Melhorias
Implementar autenticação JWT

Criar relacionamento entre usuários e imóveis

Adicionar paginação nas listagens

Criar testes automatizados

Desenvolver frontend (React / React Native)

👨‍💻 Autor
Projeto desenvolvido por Marcos Nalin 🚀

linkedin: https://www.linkedin.com/in/marcos-vinicius-nalin-2a16361a2/
