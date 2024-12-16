import connectToDatabase from '../../lib/dbConnect'; // Importa a conexão com o banco de dados

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

  if (req.method === 'POST') {
    const { code, description, id_mat_operation_type, label } = req.body;
    if (!code || !description || !id_mat_operation_type || !label) {
      return res.status(400).json({ message: 'Código, descrição, id operação e label são obrigatórios!' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('material');

      const result = await collection.insertOne({ code, description, id_mat_operation_type, label });

      return res.status(201).json({
        message: 'Material criado com sucesso!',
        planning: { code, description, id_mat_operation_type, label},
        _id: result.insertedId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar motorista' });
    }
  }

  res.status(405).json({ message: 'Método não permitido' });
};
