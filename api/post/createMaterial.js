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
    // Desestruturação dos campos recebidos
    const { code, description, id_mat_operation_type, label, process_id } = req.body;

    // Validação dos campos obrigatórios
    if (!code || !description || !id_mat_operation_type || !label || !process_id) {
      return res.status(400).json({ message: 'Código, descrição, id operação, label e processo de transformação são obrigatórios!' });
    }

    try {
      // Conexão com o banco de dados
      const { db } = await connectToDatabase();
      const collection = db.collection('material');

      // Inserção do material no banco
      const result = await collection.insertOne({ code, description, id_mat_operation_type, label, process_id });

      // Retorno de sucesso com os dados do material
      return res.status(201).json({
        message: 'Material criado com sucesso!',
        material: { code, description, id_mat_operation_type, label, process_id },
        _id: result.insertedId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar material' });
    }
  }

  // Se o método não for POST, retorna erro 405
  res.status(405).json({ message: 'Método não permitido' });
};
