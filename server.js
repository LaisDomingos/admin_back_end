const express = require('express');
const cors = require('cors');
const driverRoutes = require('./routes/driverRoutes'); // Importa as rotas

const app = express();
const port = 5000;

// Configura o CORS para permitir múltiplos origins
app.use(cors({
  origin: ['https://admin-front-end-pied.vercel.app', 'http://localhost:3000'],
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
}));

// Configuração para interpretar o corpo da requisição em JSON
app.use(express.json());

// Usando as rotas
app.use('/api', driverRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
