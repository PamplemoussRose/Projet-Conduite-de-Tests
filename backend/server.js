// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());


app.get('/testCo', (req, res) => {
    res.json({ message: 'Bienvenue sur le serveur Node.js !' });
});

app.get('/hello', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
});

app.get('/', (req, res) => {
    const viewName = req.query.view || '';
    res.redirect(`http://localhost:8080/${viewName}`); // Frontend Vue.js
});

/**
 * Démarrer le serveur
 */
app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
