// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());

/**
 * Route GET de base
 * @route GET /
 * @returns {Object} message - Retourne un message JSON
 */
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le serveur Node.js !' });
});

/**
 * Démarrer le serveur
 */
app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
