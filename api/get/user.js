import jwt from 'jsonwebtoken'; // Importa o jwt para validar tokens
import connectToDatabase from '../../lib/dbConnect'; // Conexão com o banco de dados
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

dotenv.config();

const allowedOrigins = [
  'http://localhost:3000',
  'https://admin-front-end-pied.vercel.app',
];

export default async (req, res) => {
  // Configuração dinâmica de CORS
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Tratamento de requisições OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Método GET para buscar dados do usuário
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Captura o token JWT do Header

      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret not defined');
      }

      // Verifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { db } = await connectToDatabase();
      const collection = db.collection('users');

      // Busca os dados do usuário pelo ID
      const user = await collection.findOne(
        { _id: new ObjectId(decoded.id) }, // Converte o ID para ObjectId
        { projection: { password: 0 } } // Exclui a senha da resposta
      );

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.status(200).json({
        message: 'Usuário encontrado com sucesso!',
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token inválido ou expirado', error: error.message });
    }
  }

  res.status(405).json({ message: 'Método não permitido' });
};
