// lib/dbConnect.js
import { MongoClient } from 'mongodb';

let client;
let db;

async function connectToDatabase() {
  if (client && db) return { client, db };

  const uri = process.env.MONGODB_URI;  // Sua string de conexão do MongoDB Atlas
  client = new MongoClient(uri);

  await client.connect();
  db = client.db('AZA');
  // Ou o nome do seu banco de dados, se você preferir
  return { client, db };
}

export default connectToDatabase;
