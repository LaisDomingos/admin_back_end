const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  // Verifica o método da requisição
  if (req.method === 'POST') {
    // Valida o corpo da requisição
    const { nome, rut } = req.body;
    if (!nome || !rut) {
      return res.status(400).json({ message: 'Nome e RUT são obrigatórios!' });
    }

    // Conecta ao MongoDB
    const uri = process.env.MONGODB_URI; // Certifique-se de definir este URI como uma variável de ambiente no Vercel
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db('seuBancoDeDados'); // Nome do banco de dados
      const collection = database.collection('motoristas'); // Nome da coleção onde os dados serão armazenados

      // Cria o motorista
      const newDriver = { nome, rut };
      const result = await collection.insertOne(newDriver);

      // Sucesso
      res.status(201).json({
        message: 'Motorista criado com sucesso!',
        driver: result.ops[0], // Retorna o motorista criado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar motorista!' });
    } finally {
      await client.close();
    }
  } else {
    // Método não permitido
    res.status(405).json({ message: 'Método não permitido' });
  }
};
