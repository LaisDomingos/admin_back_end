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
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Headers permitidos

    // Tratamento de requisições OPTIONS (Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // Retorna sem conteúdo para requisições OPTIONS
    }

    // Método GET para buscar os dados
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('planning');

            const data = await collection.find({}).toArray(); // Busca todos os documentos na coleção

            return res.status(200).json(data); // Retorna os dados encontrados
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar dados' });
        }
    }
}