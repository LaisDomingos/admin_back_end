import { MongoClient } from 'mongodb';

let client;
let db;

async function connectToDatabase() {
  try {
    if (client && db) return { client, db };

    const uri = 'mongodb+srv://vercel-admin-user-675c3dfa6fd4044f569d99d0:PG6P6ypKpTzBsCmn@cluster0.h0plm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    console.log('Tentando conectar ao MongoDB com a URI: ', uri);

    client = new MongoClient(uri);
    await client.connect();
    db = client.db('AZA');  // Usando o nome do banco de dados 'AZA'
    console.log('Conectado ao MongoDB');

    return { client, db };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;
