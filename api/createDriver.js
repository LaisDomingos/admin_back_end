module.exports = (req, res) => {
  // Verifica o método da requisição
  if (req.method === 'POST') {
    // Valida o corpo da requisição
    const { nome, rut } = req.body;
    if (!nome || !rut) {
      return res.status(400).json({ message: 'Nome e RUT são obrigatórios!' });
    }

    // Sucesso
    return res.status(201).json({
      message: 'Motorista criado com sucesso!',
      driver: { nome, rut },
    });
  }

  // Método não permitido
  res.status(405).json({ message: 'Método não permitido' });
};
