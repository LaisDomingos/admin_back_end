const express = require('express');
const createDriver = require('../controllers/post/createDriver');

const router = express.Router();

// Rota para criar motorista
router.post('/drivers', createDriver);

module.exports = router;
