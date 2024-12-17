import bcrypt from 'bcrypt'; // Importa o bcrypt para verificar a senha
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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
    }

    try {
      // Conecta ao banco de dados
      const { db } = await connectToDatabase();
      const collection = db.collection('users');
      const user = await collection.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Usuário ou senha inválidos!' });
      }

      // Verifica a senha
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: 'Usuário ou senha inválidos!' });
      }

      // Retorna a função do usuário
      const userFuncao = user.funcao;

      // Cria o token JWT
      const token = createToken(user._id);

      return res.status(200).json({
        message: 'Login bem-sucedido!',
        token,
        funcao: userFuncao 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao processar login', error: error.message });
    }
  }

  res.status(405).json({ message: 'Método não permitido' });
};
