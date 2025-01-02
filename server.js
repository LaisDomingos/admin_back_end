const express = require("express");
const axios = require("axios");

const app = express();
const port = 3001;

// Middleware para buscar motorista por RUT
const buscarPorRutMiddleware = async (req, res, next) => {
  const { rut } = req.query; // RUT enviado como query string (ex: /buscar?rut=12345678-9)

  if (!rut) {
    return res.status(400).json({ error: "RUT é obrigatório" });
  }

  try {
    // Substitua pela URL da sua API que retorna a lista de motoristas
    const response = await axios.get("https://radioactive-dev-api.azurewebsites.net/driver");

    // Encontrar o motorista pelo RUT
    const driver = response.data.find((driver) => driver.rutNumber === rut);

    if (driver) {
      req.driverData = {
        id: driver.id,
        name: driver.name,
        rutNumber: driver.rutNumber
      };
      return next(); // Passa para a próxima função (ou rota)
    } else {
      return res.status(404).json({ error: "Motorista não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar motoristas:", err);
    return res.status(500).json({ error: "Erro ao buscar motoristas" });
  }
};

// Rota de busca que utiliza o middleware
app.get("/buscar", buscarPorRutMiddleware, (req, res) => {
  const { id, name, rutNumber } = req.driverData;
  
  // Retorna os dados do motorista
  res.json({
    message: "Motorista encontrado!",
    driver: {
      id,
      name,
      rutNumber
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
