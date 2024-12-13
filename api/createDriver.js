// pages/api/criarMotorista.js

import connectToDatabase from '../../lib/dbConnect';  // Importa a função de conexão

module.exports = async (req, res) => {
  // Verifica o método da requisição
  if (req.method === 'POST') {
    // Valida o corpo da requisição
    const { nome, rut } = req.body;
    if (!nome || !rut) {
      return res.status(400).json({ message: 'Nome e RUT são obrigatórios!' });
    }

    try {
      // Conecta ao MongoDB
      const { db } = await connectToDatabase();
      const collection = db.collection('motoristas');  // 'motoristas' é o nome da coleção

      // Insere o motorista na coleção
      const result = await collection.insertOne({ nome, rut });

      // Sucesso
      return res.status(201).json({
        message: 'Motorista criado com sucesso!',
        driver: { nome, rut },
        _id: result.insertedId,  // Retorna o ID gerado no MongoDB
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar motorista' });
    }
  }

  // Método não permitido
  res.status(405).json({ message: 'Método não permitido' });
};
