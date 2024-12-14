// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const mariadb = require('../frontend/src/mariadb.js');


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




app.get('/add-fake-users', async (req, res) => {
    try {
        const fakeUsers = [
            ['Robin', 'Lmn', 'test@mail.com', 'MAT0003', 'EMPRUNTEUR'], // Changer 'USER' en 'EMPRUNTEUR'
            ['Thomas', 'Vlg', 'user@example.com', 'MAT0004', 'ADMINISTRATEUR'], // Changer 'ADMIN' en 'ADMINISTRATEUR'
        ];


        for (const user of fakeUsers) {
            await mariadb.executeQuery(
                `INSERT INTO utilisateurs (nomUtilisateur, prenomUtilisateur, emailUtilisateur, matriculeUtilisateur, roleUtilisateur) 
                 VALUES (?, ?, ?, ?, ?)`,
                user
            );
        }

        res.status(200).json({ message: 'Données fictives ajoutées avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout des données' });
    }
});


app.get('/add-fake-materials', async (req, res) => {
    try {


        const fakeMaterials = [
            ['Ordinateur Portable', '1.0', 'REF01', 'DISPONIBLE', 'http://example.com/photo1.jpg', '001'],
            ['Projecteur', '2.1', 'REF02', 'EMPRUNTER', 'http://example.com/photo2.jpg', '002'],
            ['Imprimante', '3.2', 'REF03', 'DISPONIBLE', 'http://example.com/photo3.jpg', '003']
        ];



        // Insertion des données fictives dans la table 'materiels'
        for (const material of fakeMaterials) {
            await mariadb.executeQuery(
                `INSERT INTO materiels (nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                material
            );
        }

        res.status(200).json({ message: 'Données fictives de matériels ajoutées avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout des données de matériels' });
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
// Route GET pour récupérer les détails de l'équipement par ID
app.get('/equipment-detail/:id', (req, res) => {
    const id = req.params.id;

    // Redirection avec l'ID de l'équipement dans l'URL
    res.redirect(`http://localhost:8080/equipment-detail/${id}`);
});



app.get('/equipment-detail/data/:id', async (req, res) => {
    let connection;
    try {
        connection = await mariadb.pool.getConnection();
        const id = req.params.id;
        const rows = await connection.query('SELECT * FROM materiels WHERE IdMateriel = ?', [id]);

        if (rows.length > 0) {
            res.status(200).json({ message: 'Données récupérées avec succès', data: rows[0] });
        } else {
            res.status(404).send('Équipement non trouvé');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});





//POST
    app.post(`/equipment-detail/:id`, (req, res) => {
        res.json({message: `Je suis POST de detail!`});
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


// Get equipment data
// Pour recuperer les données de la base de données
    app.get('/equipment-page/data', getBDDInfo('SELECT nomMateriel,photoMateriel,IdMateriel FROM materiels'));


// Get users data
// Pour recuperer les données de la base de données
    app.get('/user-management/data', getBDDInfo('SELECT * FROM utilisateurs'));


//app.get('/user-management/data',getBDDInfo('SELECT nomUtilisateur,idUtilisateur FROM utilisateurs'));


    app.get('/get-role', async (req, res) => {
        let email = req.query.email;

        if (!email) {
            return res.status(400).send('Email requis');
        }

        let requette = 'SELECT roleUtilisateur FROM utilisateurs WHERE emailUtilisateur = ?';
        let connection;

        try {
            // Obtenir une connexion à la base de données
            connection = await mariadb.pool.getConnection();

            // Exécuter la requête SQL avec les paramètres
            const rows = await connection.query(requette, [email]);

            if (rows.length === 0) {
                return res.status(404).json({message: 'Utilisateur non trouvé'});
            }

            res.status(200).json({
                message: 'Rôle utilisateur récupéré avec succès',
                data: rows[0].roleUtilisateur, // Retourne uniquement le rôle
            });
        } catch (err) {
            console.error('Erreur serveur :', err);
            res.status(500).send('Erreur serveur');
        } finally {
            if (connection) connection.release(); // Toujours libérer la connexion
        }
    });


    function getBDDInfo(filter) {
        return async (req, res) => {
            let connection;
            try {
                connection = await mariadb.pool.getConnection();

                // Exécute directement la requête SQL passée dans `filter`
                const rows = await connection.query(filter);

                res.status(200).json({message: `Résultats pour la requête: ${filter}`, data: rows});
            } catch (err) {
                console.error(err);
                res.status(500).send('Erreur serveur');
            } finally {
                if (connection) connection.release();
            }
        };
    }


    /**
     * Démarrer le serveur
     */

    app.listen(PORT, () => {
        console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
    });

