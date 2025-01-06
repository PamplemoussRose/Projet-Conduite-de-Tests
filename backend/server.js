// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const mariadb = require('/Users/mac/Desktop/Polytech/S7/Conduite de projets/Autre/Projet-Conduite-de-Tests-1/backend/mariadb.js');
const fs = require('fs');

const corsOptions = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

const multer = require('multer');
const path = require('path');



// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

const upload = multer({ storage });


// Middleware pour gérer les requêtes JSON''
app.use(express.json());
// CORS pour les requetes depuis le front
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); // Frontend origin
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permet les credentials (cookies)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



app.get('/add-base-users', async (req, res) => {
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

        res.status(200).json({ message: 'Données de base ajoutées avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout des données' });
    }
});


// ###############################################################
// #                                                             #
// #                        LOGIN PAGE                           #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get('/', (req, res) => {
    const viewName = req.query.view || '';
    res.redirect(`http://localhost:8080/${viewName}`); // Frontend Vue.js
});
app.get('/user-login', (req, res) => {
    const viewName = req.query.view || '';
    res.redirect(`http://localhost:8080/${viewName}`); // Frontend Vue.js
});



// ###############################################################
// #                                                             #
// #                       ADMIN DASHBOARD                       #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get(`/admin-dashboard`, (req, res) => {
    const viewName = req.query.view || `admin-dashboard`;
    res.redirect(`http://localhost:8080/${viewName}`);
});



// ###############################################################
// #                                                             #
// #                       EQUIPMENT PAGE                        #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get(`/equipment-page`, (req, res) => {
    const viewName = req.query.view || `equipment-page`;
    res.redirect(`http://localhost:8080/${viewName}`);
});

// ########################### DELETE ###########################
app.delete(`/equipment-page/:id`, async (req, res) => {
    const id = req.params.id; // Récupération de l'ID depuis l'URL
    const requette = `DELETE FROM materiels WHERE IdMateriel = ${id}`;

    try {
        // Se connecter à la base de données
        connection = await mariadb.pool.getConnection();

        // Supprimer le fichier de l'image
        const [equipment] = await connection.query(
            "SELECT photoMateriel FROM materiels WHERE IdMateriel = ?",
            [id]
        );

        if (!equipment || equipment.length === 0) {
            return res.status(404).json({ message: "Équipement non trouvé" });
        }

        if (equipment.photoMateriel !== 'http://localhost:3000/uploads/GStRd1gWYAANG4q.jpeg') {
            const imageUrl = equipment.photoMateriel.replace('http://localhost:3000/uploads/', '');
            const imagePath = path.join(__dirname, 'uploads', imageUrl);

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'image :', err);
                } else {
                    console.log('Image supprimée avec succès :', imageUrl);
                }
            });
        }

        // Exécuter la requête de suppression
        const result = await connection.query(requette);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Renvoi d'une réponse de succès
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    } finally {
        if (connection) connection.release(); // Libérer la connexion
    }
});




// ###############################################################
// #                                                             #
// #                       EQUIPMENT DETAIL                      #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get('/equipment-detail/:id', (req, res) => {
    const id = req.params.id;

    // Redirection avec l'ID de l'équipement dans l'URL
    res.redirect(`http://localhost:8080/equipment-detail/${id}`);
});

// ########################### POST ###########################
app.post(`/equipment-detail/:id`, (req, res) => {
    res.json({message: `Je suis POST de detail!`});
});



// ###############################################################
// #                                                             #
// #                       EQUIPMENT MODIFY                      #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get(`/equipment-modify/:id`, (req, res) => {
      const id = req.params.id;

      res.redirect(`http://localhost:8080/equipment-modify/${id}`);
});

// ########################### PUT ###########################
app.put('/equipment-modify/:id', upload.single('photoMateriel'), async (req, res) => {
    const id = req.params.id; // Equipment ID
    const {
        nomMateriel,
        versionMateriel,
        referenceMateriel,
        etatMateriel,
        numeroTelephoneMateriel,
    } = req.body;

    let connection;

    try {
        connection = await mariadb.pool.getConnection();

        const [existingEquipment] = await connection.query(
            'SELECT photoMateriel FROM materiels WHERE IdMateriel = ?',
            [id]
        );

        if (!existingEquipment) {
            return res.status(404).json({ message: 'Équipement non trouvé' });
        }

        let photoMateriel = existingEquipment.photoMateriel;

        if (req.file) {
            photoMateriel = `http://localhost:3000/uploads/${req.file.filename}`;

            const oldImagePath = existingEquipment.photoMateriel.replace('http://localhost:3000/uploads/', 'uploads/');
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old image:', err);
                } else {
                    console.log('Old image deleted successfully');
                }
            });
        }

        const result = await connection.execute(
            `UPDATE materiels 
             SET nomMateriel = ?, versionMateriel = ?, referenceMateriel = ?, etatMateriel = ?, photoMateriel = ?, numeroTelephoneMateriel = ? 
             WHERE IdMateriel = ?`,
            [nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Équipement non trouvé' });
        }

        res.status(200).json({ message: 'Équipement mis à jour avec succès', photoMateriel });
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (connection) connection.release();
    }
});


// ###############################################################
// #                                                             #
// #                       EQUIPMENT ADD                         #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get('/equipment-add', (req, res) => {
    res.redirect(`http://localhost:8080/equipment-add`);
})

// ########################### POST ###########################
app.post('/equipment-add', upload.single('photoMateriel'), async (req, res) => {
    const { nomMateriel, versionMateriel, referenceMateriel, numeroTelephoneMateriel, etatMateriel } = req.body;

    try {

        const connection = await mariadb.pool.getConnection();

        //Matricule déjà attribué
        const existingMaterial = await connection.query(
            `SELECT COUNT(*) AS count FROM materiels WHERE referenceMateriel = ?`,
            [referenceMateriel]
        );
        if (existingMaterial[0].count > 0) {
            connection.release();
            return res.status(400).json({ message: 'Le matricule est déjà attribué.' });
        }

        const baseUrl = 'http://localhost:3000';
        const photoMateriel = req.file
            ? `${baseUrl}/uploads/${req.file.filename}`
            : `${baseUrl}/uploads/GStRd1gWYAANG4q.jpeg`; // Image par défaut si aucun fichier n'est téléchargé

        await connection.execute(
            `INSERT INTO materiels (nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel]
        );

        connection.release();

        res.status(201).json({ message: 'Équipement ajouté avec succès', photoMateriel });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'équipement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





// ###############################################################
// #                                                             #
// #                       USER MANAGEMENT                       #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
    app.get(`/user-management`, (req, res) => {
        const viewName = req.query.view || `user-management`;
        res.redirect(`http://localhost:8080/${viewName}`);
    });


const sendgrid = require('@sendgrid/mail');
const crypto = require('crypto');

// Clé API SendGrid
sendgrid.setApiKey('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');

// ########################### POST ###########################
app.post('/user-management', async (req, res) => {
    const { email, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body;

    let connection;
    try {
        // Check if the email already exists in the database
        connection = await mariadb.pool.getConnection();
        const rows = await connection.query(
            'SELECT * FROM utilisateurs WHERE emailUtilisateur = ?',
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const generatedPassword = crypto.randomBytes(4).toString('hex');

        const insertResult = await connection.query(
            'INSERT INTO utilisateurs (nomUtilisateur, prenomUtilisateur, emailUtilisateur, matriculeUtilisateur, roleUtilisateur) VALUES (?, ?, ?, ?, ?)',
            [nomUtilisateur, prenomUtilisateur, email, 'MAT0000', roleUtilisateur]
        );

        const newUserId = Number(insertResult.insertId);
        const matricule = `MAT${String(newUserId).padStart(4, '0')}`;


        await connection.query(
            'UPDATE utilisateurs SET matriculeUtilisateur = ? WHERE idUtilisateur = ?',
            [matricule, newUserId]
        );


        const message = {
            to: email,
            from: 'jghiffi@gmail.com',
            subject: 'Your Locamat Account Password',
            text: `Hello ${prenomUtilisateur} ${nomUtilisateur},\n\nYour Locamat account has been created. Here is your temporary password: ${generatedPassword}\n\nPlease log in and change your password immediately.`,
        };

        await sendgrid.send(message);
        console.log(`Email sent to ${email}`);


        res.status(201).json({
            message: 'User added successfully and email sent',
            userId: newUserId,
            matricule,
        });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
});






// ###############################################################
// #                                                             #
// #                       USER DETAILS                          #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get(`/user-details/:id`, async (req, res) => {
    const id = req.params.id; // Récupère l'ID depuis l'URL
    try {
        const connection = await mariadb.pool.getConnection();
        const rows = await connection.query(
            'SELECT nomUtilisateur, prenomUtilisateur, emailUtilisateur, roleUtilisateur FROM utilisateurs WHERE idUtilisateur = ?',
            [id]
        );

        if (rows.length > 0) {
            res.status(200).json(rows[0]); // Retourne uniquement l'utilisateur trouvé
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error('Erreur serveur :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



// ###############################################################
// #                                                             #
// #                       USER MODIFY                           #
// #                                                             #
// ###############################################################

// ########################### GET ###########################
app.get(`/user-modify/:id`, (req, res) => {
    const viewName = req.query.view || `user-modify`;
    res.redirect(`http://localhost:8080/${viewName}`);
});
// ########################### PUT ###########################


// Get equipment data
// Pour recuperer les données de la base de données
    app.get('/equipment-page/data', getBDDInfo('SELECT nomMateriel,photoMateriel,IdMateriel FROM materiels'));


// Get users data
// Pour recuperer les données de la base de données
    app.get('/user-management/data', getBDDInfo('SELECT * FROM utilisateurs'));



//Get equipement detail data
// Pour recuperer les données de la base de données
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
