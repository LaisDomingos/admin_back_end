const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rota GET
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, Vercel!' });
});

// Rota POST
app.post('/api/createDriver', (req, res) => {
  const { nome, rut } = req.body;
  if (!nome || !rut) {
    return res.status(400).json({ message: 'Nome e RUT são obrigatórios!' });
  }
  return res.status(201).json({ message: 'Motorista criado com sucesso!', driver: { nome, rut } });
});

// Exporta o app como um handler para o Vercel
module.exports = app;
