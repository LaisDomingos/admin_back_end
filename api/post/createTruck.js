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
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Para outras origens, considere usar '*', se necessário
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Headers permitidos

  // Tratamento de requisições OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Retorna sem conteúdo para requisições OPTIONS
  }

  if (req.method === 'POST') {
    const { plate, brand } = req.body;
    // Verificando se os dados necessários estão presentes
    if (!plate || !brand ) {
      return res.status(400).json({ message: 'Patente e marca são obrigatórios!' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('truck');

      // Inserindo o caminhão no banco de dados
      const subscribeDate = new Date().toISOString(); // Adicionando a data de inscrição no formato especificado
      const result = await collection.insertOne({ plate, brand, subscribeDate });

      // Retorno com dados do novo caminhão
      return res.status(201).json({
        message: 'Caminhão criado com sucesso!',
        truck: { _id: result.insertedId, plate, brand, subscribeDate },
      });
    } catch (error) {
      console.error('Erro ao salvar caminhão:', error); // Mensagem de erro mais informativa
      return res.status(500).json({ message: 'Erro ao salvar caminhão' });
    }
  }

  // Método não permitido para outros tipos de requisição
  res.status(405).json({ message: 'Método não permitido' });
};
