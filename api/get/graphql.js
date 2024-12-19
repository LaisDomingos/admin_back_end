import { ApolloServer, gql } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import connectToDatabase from '../../lib/dbConnect'; // Atualize para o caminho correto
import jwt from 'jsonwebtoken'; // Adicione a biblioteca jwt para decodificação do token
import { ObjectId } from 'mongodb'; // Certifique-se de importar o ObjectId

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
        throw new Error('Token inválido');
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
    cors(),
    json(),
    expressMiddleware(server, {
      context: ({ req }) => ({
        token: req.headers.authorization ? req.headers.authorization.split(' ')[1] : null,
      })
    })
  );
  
  app.listen(4000, () => {
    console.log('Servidor rodando em http://localhost:4000/graphql');
  });
});
