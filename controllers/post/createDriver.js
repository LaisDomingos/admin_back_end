const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Adicionando CORS
const corsOptions = {
  origin: '*', // Permite requisições de qualquer origem. Você pode mudar para um domínio específico, como 'https://frontend-app.vercel.app'
};

module.exports = async (req, res) => {
  cors(corsOptions)(req, res, () => {
    if (req.method === 'POST') {
      const { nome, rut } = req.body;

      if (!nome || !rut) {
        return res.status(400).json({ message: 'Nome e RUT são obrigatórios!' });
      }

      try {
        // Caminho para o arquivo drivers.json
        const filePath = path.join(__dirname, '../../data/drivers.json');

        // Lê os dados do arquivo JSON existente
        let drivers = [];
        if (fs.existsSync(filePath)) {
          const data = fs.readFileSync(filePath);
          drivers = JSON.parse(data);
        }

        // Adiciona o novo motorista ao arquivo
        drivers.push({ nome, rut });

        // Salva os dados no arquivo drivers.json
        fs.writeFileSync(filePath, JSON.stringify(drivers, null, 2));

        return res.status(201).json({ message: 'Motorista adicionado com sucesso!', driver: { nome, rut } });
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao salvar motorista.', error: error.message });
      }
    } else {
      // Caso o método não seja POST
      res.status(405).json({ message: 'Método não permitido' });
    }
  });
};
