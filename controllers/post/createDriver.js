const fs = require('fs');
const path = require('path');

const createDriver = (req, res) => {
    const { nome, rut } = req.body;

    if (!nome || !rut) {
        return res.status(400).json({ message: 'Nome e RUT são obrigatórios' });
    }

    // Caminho para o arquivo onde os dados serão armazenados
    const filePath = path.join(__dirname, '../../data/drivers.json');

    let drivers = [];

    try {
        // Verifica se o arquivo existe
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            drivers = fileData ? JSON.parse(fileData) : []; // Inicializa com [] se o arquivo estiver vazio
        }
    } catch (err) {
        console.error('Erro ao ler o arquivo JSON:', err.message);
        return res.status(500).json({ message: 'Erro interno ao acessar o banco de dados' });
    }

    // Adiciona o novo motorista
    const newDriver = { nome, rut, id: Date.now().toString() }; // Gera um ID único
    drivers.push(newDriver);

    try {
        // Salva os dados atualizados no arquivo
        fs.writeFileSync(filePath, JSON.stringify(drivers, null, 2));
    } catch (err) {
        console.error('Erro ao escrever no arquivo JSON:', err.message);
        return res.status(500).json({ message: 'Erro interno ao salvar os dados' });
    }

    // Retorna a resposta ao cliente
    res.status(201).json({
        message: 'Motorista criado com sucesso',
        driver: newDriver,
    });
};

module.exports = createDriver;
