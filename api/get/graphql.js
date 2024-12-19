import { ApolloServer, gql } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import connectToDatabase from '../../lib/dbConnect'; // Atualize para o caminho correto
import { ObjectId } from 'mongodb'; // Certifique-se de importar o ObjectId

// Definição do Schema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // Busca um usuário específico pelo ID
    user: async (_parent, args) => {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ _id: new ObjectId(args.id) });
      if (!user) throw new Error('Usuário não encontrado');
      return { id: user._id.toString(), ...user }; // Retorna o usuário encontrado
    },
    // Busca todos os usuários
    users: async () => {
      const { db } = await connectToDatabase();
      const users = await db.collection('users').find().toArray();
      return users.map(user => ({
        id: user._id.toString(),
        ...user,
      }));
    },
  },
  Mutation: {
    // Cria um novo usuário
    createUser: async (_parent, args) => {
      const { db } = await connectToDatabase();
      const result = await db.collection('users').insertOne({
        name: args.name,
        email: args.email,
      });
      return { id: result.insertedId.toString(), name: args.name, email: args.email };
    },
  },
};

// Configurando o servidor Apollo
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server)
  );

});
