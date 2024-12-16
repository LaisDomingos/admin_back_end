import connectToDatabase from '../../lib/dbConnect'; // Importa a conexão com o banco de dados
import { ObjectId } from 'mongodb';

const allowedOrigins = [
  'http://localhost:3000',
  'https://admin-front-end-pied.vercel.app',
];

export default async (req, res) => {
  // Configuração dinâmica de CORS
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // Define o origin dinamicamente
  }// Permite apenas o frontend especificado e o localhost
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Headers permitidos

  // Tratamento de requisições OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Retorna sem conteúdo para requisições OPTIONS
  }

  if (req.method === 'PUT') {
    const { id, ativo } = req.body;

    if (!id || ativo === undefined) {
      return res.status(400).json({ message: 'ID e ativo são obrigatórios!' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('drivers');

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ativo } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Motorista não encontrado' });
      }

      return res.status(200).json({ message: 'Status do motorista atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar motorista' });
    }
  }

  res.status(405).json({ message: 'Método não permitido' });
};
