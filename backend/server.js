// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour gérer les requêtes JSON''
app.use(express.json());

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


//equipment-detail
//GET
app.get('/equipment-detail/:id', (req, res) => {
    const id = req.params.id; // Récupération de l'ID depuis l'URL
    res.set(id);
    const viewName = `equipment-detail`;
    res.redirect(`http://localhost:8080/${viewName}`);
});





//equipment-detail
//POST
app.post(`/equipment-detail/:id`, (req, res) => {
    res.json({ message: `Je suis POST de detail!` });
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



//equipment-modify
//GET
app.get(`/equipment-modify`, (req, res) => {
    const viewName = req.query.view || `equipment-modify`;
    res.redirect(`http://localhost:8080/${viewName}`);
});


//admin-dashboard
//GET
app.get(`/admin-dashboard`, (req, res) => {
    const viewName = req.query.view || `admin-dashboard`;
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
app.get(`/user-detail`, (req, res) => {
    const viewName = req.query.view || `user-detail`;
    res.redirect(`http://localhost:8080/${viewName}`);
});


//equipment-page
//GET
app.get(`/equipment-page`, (req, res) => {
    const viewName = req.query.view || `equipment-page`;
    res.redirect(`http://localhost:8080/${viewName}`);
});


//equipment-modification
//GET
app.get(`/equipment-modification`, (req, res) => {
    const viewName = req.query.view || `equipment-modification`;
    res.redirect(`http://localhost:8080/${viewName}`);
});

/**
 * Démarrer le serveur
 */

app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});

