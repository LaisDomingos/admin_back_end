// testConnection.js
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://vercel-admin-user-675c3dfa6fd4044f569d99d0:PG6P6ypKpTzBsCmn@cluster0.h0plm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();  // Conecta ao MongoDB
    console.log('Conexão bem-sucedida ao MongoDB!');
    await client.close();  // Fecha a conexão após o teste
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

testConnection();
