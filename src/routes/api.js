const express = require('express');
const router = express.Router();
const PublicationController = require('../controllers/PublicationController');

router.post("/publications",PublicationController.Register);

module.exports = router;
