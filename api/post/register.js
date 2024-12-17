import bcrypt from 'bcrypt'; // Importa o bcrypt para encriptar a senha
import jwt from 'jsonwebtoken'; // Importa o jwt para criar tokens
import connectToDatabase from '../../lib/dbConnect'; // Importa a conexão com o banco de dados
import dotenv from 'dotenv'; // Importa o dotenv para carregar variáveis de ambiente

dotenv.config(); // Carrega variáveis de ambiente do .env

const allowedOrigins = [
  'http://localhost:3000',
  'https://admin-front-end-pied.vercel.app',
];

// Função para criar o token JWT
const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not defined');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expira em 1 hora
  });
};

export default async (req, res) => {
  // Configuração dinâmica de CORS
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // Define o origin dinamicamente
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Headers permitidos

  // Tratamento de requisições OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Retorna sem conteúdo para requisições OPTIONS
  }

  if (req.method === 'POST') {
    const { nome, email, password, funcao } = req.body;
    if (!email || !password || !funcao || !nome) {
      return res.status(400).json({ message: 'Email, senha e funcao são obrigatórios!' });
    }

    try {
      // Verifica se o email já existe no banco de dados
      const { db } = await connectToDatabase();
      const collection = db.collection('users');
      const user = await collection.findOne({ email });

      if (user) {
        return res.status(400).json({ message: 'Este email já está em uso!' });
      }

      // Encripta a senha usando bcrypt
      const saltRounds = 10; // Número de rounds para gerar o hash (quanto maior, mais seguro)
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Salva o novo usuário com a senha encriptada
      const result = await collection.insertOne({ nome, email, password: hashedPassword, funcao });

      if (!result || !result.insertedId) {
        return res.status(500).json({ message: 'Erro ao salvar usuário' });
      }

      // Cria o token JWT
      const token = createToken(result.insertedId);

      return res.status(201).json({
        message: 'Usuário criado com sucesso!',
        user: { email, funcao },
        token, // Retorna o token para o usuário
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar usuário', error: error.message });
    }
  }

  res.status(405).json({ message: 'Método não permitido' });
};
