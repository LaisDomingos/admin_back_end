import connectToDatabase from '../lib/dbConnect';  // Correção no caminho

export default async (req, res) => {
  if (req.method === 'POST') {
    const { nome, rut } = req.body;
    if (!nome || !rut) {
      return res.status(400).json({ message: 'Nome e RUT são obrigatórios!' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('drivers');

      const result = await collection.insertOne({ nome, rut });

      return res.status(201).json({
        message: 'Motorista criado com sucesso!',
        driver: { nome, rut },
        _id: result.insertedId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar motorista' });
    }
  }

  res.status(405).json({ message: 'Método não permitido' });
};
