import connectToDatabase from '../lib/dbConnect'; // Importa a conexão com o banco de dados

export default async (req, res) => {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://admin-front-end-pied.vercel.app'); // Permite apenas o frontend especificado
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Headers permitidos

  // Tratamento de requisições OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Retorna sem conteúdo para requisições OPTIONS
  }

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
