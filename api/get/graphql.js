import { ApolloServer, gql } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import connectToDatabase from '../../lib/dbConnect'; // Atualize para o caminho correto
import jwt from 'jsonwebtoken'; // Importa o jwt para validar tokens
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

dotenv.config();

const allowedOrigins = [
  'http://localhost:3000',
  'https://admin-front-end-pied.vercel.app',
];

// Middleware CORS
const corsOptions = (req, res, next) => {
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

  next();
};

// Definição do Schema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    me: User
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // Busca o usuário autenticado
    me: async (_parent, _args, context) => {
      const { token } = context;
      if (!token) throw new Error('Token não fornecido');

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
        if (!user) throw new Error('Usuário não encontrado');
        return { id: user._id.toString(), ...user }; // Retorna o usuário encontrado
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        throw new Error('Token inválido ou expirado');
      }
    },
  }
};

// Configurando o servidor Apollo
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(
    '/graphql',
    cors(corsOptions),
    json(),
    expressMiddleware(server, {
      context: ({ req }) => ({
        token: req.headers.authorization ? req.headers.authorization.split(' ')[1] : null,
      })
    })
  );
  
});
