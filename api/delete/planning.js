import connectToDatabase from '../../lib/dbConnect'; // Importa a conexão com o banco de dados
import { ObjectId } from 'mongodb';

const allowedOrigins = [
    'http://localhost:3000',
    'https://admin-front-end-pied.vercel.app',
];

export default async (req, res) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID é obrigatório!' });
        }

        try {
            const { db } = await connectToDatabase();
            const collection = db.collection('planning');
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Planejamento não encontrado' });
            }

            return res.status(200).json({ message: 'Planejamento deletado com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao deletar planejamento' });
        }
    }

    res.status(405).json({ message: 'Método não permitido' });
};

