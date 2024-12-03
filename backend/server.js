// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const db = require('../frontend/src/mariadb.js');


const corsOptions = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};


// Middleware pour gérer les requêtes JSON''
app.use(express.json());
// CORS pour les requetes depuis le front
app.use(cors(corsOptions));


//récupérer la BDD
app.get('/bdd', async (req, res) => {
    let connection;
    try {
        // Obtenez une connexion depuis le pool
        connection = await db.getConnection();

        // Exécutez une requête SQL
        const rows = await connection.query('SELECT * FROM users');
        res.json(rows); // Renvoyez les données au client
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    } finally {
        // Relâchez la connexion dans le pool
        if (connection) connection.release();
    }
});


//login-page
//GET
app.get('/', (req, res) => {
    const viewName = req.query.view || '';
    res.redirect(`http://localhost:8080/${viewName}`); // Frontend Vue.js
});
app.get('/user-login', (req, res) => {
    const viewName = req.query.view || '';
    res.redirect(`http://localhost:8080/${viewName}`); // Frontend Vue.js
});



//admin-dashboard

//GET
app.get(`/admin-dashboard`, (req, res) => {
    const viewName = req.query.view || `admin-dashboard`;
    res.redirect(`http://localhost:8080/${viewName}`);
});



//equipment-page

//GET
app.get(`/equipment-page`, (req, res) => {
    const viewName = req.query.view || `equipment-page`;
    res.redirect(`http://localhost:8080/${viewName}`);
});

//DELETE
app.delete(`/equipment-page/:id`, (req, res) => {
    const id = req.params.id; // Récupération de l'ID depuis l'URL
    res.set(id);
    const viewName = `equipment-detail`;
    res.redirect(`http://localhost:8080/${viewName}`);
});

//PUT
app.put('/equipment-page/:id', (req, res) => {
    const id = req.params.id; // Récupération de l'ID depuis l'URL
    const { key } = req.body; // Récupération des données envoyées dans le corps de la requête

    // Simulez un traitement ou une mise à jour dans la base de données
    console.log(`ID reçu : ${id}, Donnée : ${key}`);

    // Répondez au client avec un statut 200
    res.status(200).json({ message: `Équipement ${id} mis à jour avec succès`, data: { id, key } });
});



//equipment-detail

//GET
app.get('/equipment-detail/:id', (req, res) => {
    const id = req.params.id; // Récupération de l'ID depuis l'URL
    res.set(id);
    const viewName = `equipment-detail`;
    res.redirect(`http://localhost:8080/${viewName}`);
});

//POST
app.post(`/equipment-detail/:id`, (req, res) => {
    res.json({ message: `Je suis POST de detail!` });
});



//equipment-modify

//GET
app.get(`/equipment-modify/:id`, (req, res) => {
    const id = req.params.id;
    const viewName = req.query.view || `equipment-modify`;
    res.set(id);
    res.redirect(`http://localhost:8080/${viewName}`);
});



//user-management

//GET
app.get(`/user-management`, (req, res) => {
    const viewName = req.query.view || `user-management`;
    res.redirect(`http://localhost:8080/${viewName}`);
});

//POST
app.post(`/user-management`, (req, res) => {
    //create user using the field
    const viewName = req.query.view || `user-management`;
    res.redirect(`http://localhost:8080/${viewName}`);
});



//user-detail

//GET
app.get(`/user-details/:id`, (req, res) => {
    const viewName = req.query.view || `user-details`;
    res.redirect(`http://localhost:8080/${viewName}`);
});



//user-modify

//GET

//PUT


// Get equipments
// Pour recuperer les données de la base de données
app.get('/equipment-page/data', (req, res) => {
    res.json(
        [
            { id: 1, name: "Samsung A10", image: "https://via.placeholder.com/100" },
            { id: 2, name: "Apple iPad", image: "https://via.placeholder.com/100" },
            { id: 1, name: "Samsung A11", image: "https://via.placeholder.com/100" },
            { id: 2, name: "Apple iPad 2 ", image: "https://via.placeholder.com/100" },
            { id: 1, name: "Samsung A12", image: "https://via.placeholder.com/100" },
            { id: 2, name: "Apple iPad 3", image: "https://via.placeholder.com/100" },
            { id: 1, name: "Samsung A13", image: "https://via.placeholder.com/100" },
            { id: 2, name: "Apple iPad 4", image: "https://via.placeholder.com/100" },
            { id: 1, name: "Samsung A14", image: "https://via.placeholder.com/100" },
            { id: 2, name: "Apple iPad 5", image: "https://via.placeholder.com/100" },
        ]
    )
});



// Get users
// Pour recuperer les données de la base de données
app.get('/user-management/data', (req, res) => {
    res.json(
        [
            { firstName: "Jaafar", lastName: "Ghiffi", id: "001", email: "jaafar@example.com", role: "Admin" },
            { firstName: "Thomas", lastName: "Vanwalleghem", id: "002", email: "thomas@example.com", role: "User" },
            { firstName: "Chaimae", lastName: "Chaaibi", id: "003", email: "clara@example.com", role: "User" },
            { firstName: "Clara", lastName: "Rouxel", id: "004", email: "chaimae@example.com", role: "Admin" },
            { firstName: "Robin", lastName: "Laumonier", id: "005", email: "robin@example.com", role: "User" },
            { firstName: "N’Woumbornam", lastName: "N’Kouba", id: "006", email: "nwoumbornam@example.com", role: "User" }
        ]
    )
});






/**
 * Démarrer le serveur
 */

app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});

