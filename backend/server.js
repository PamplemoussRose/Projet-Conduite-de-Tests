// Importer les modules nécessaires
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
const mariadb = require('./mariadb.js');
const fs = require('fs');
const admin = require("firebase-admin");

const corsOptions = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

const multer = require('multer');
const path = require('path');

// 
const serviceAccount = require("./config/locamat-7cf78-firebase-adminsdk-2n7yc-3ea14cfee7.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
app.delete('/equipment-page/:id', async (req, res) => {
    const equipmentId = req.params.id;
    try {
        await deleteEquipmentFromMariaDB(equipmentId);
        res.status(200).json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ message: 'Server error' });
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
app.post('/equipment-reserve/:id', async (req, res) => {
    const { id } = req.params; // ID du matériel
    const { userId } = req.body; // ID de l'utilisateur effectuant la réservation

    try {
        const connection = await mariadb.pool.getConnection();

        // Vérifier si le matériel est disponible
        const [material] = await connection.query(
            'SELECT etatMateriel, reservedBy FROM materiels WHERE IdMateriel = ?',
            [id]
        );

        if (!material || material.etatMateriel !== 'DISPONIBLE') {
            connection.release();
            return res.status(400).json({ message: 'Matériel non disponible ou introuvable.' });
        }

        // Réserver le matériel
        await connection.query(
            'UPDATE materiels SET etatMateriel = ?, reservedBy = ? WHERE IdMateriel = ?',
            ['EMPRUNTER', userId, id]
        );

        // Récupérer l'état mis à jour pour l'envoyer en réponse
        const [updatedMaterial] = await connection.query(
            'SELECT * FROM materiels WHERE IdMateriel = ?',
            [id]
        );

        connection.release();
        res.status(200).json({ message: 'Matériel réservé avec succès.', updatedEquipment: updatedMaterial });
    } catch (error) {
        console.error('Erreur lors de la réservation du matériel:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

app.post('/equipment-return/:id', async (req, res) => {
    const { id } = req.params; // ID du matériel
    const { userId } = req.body; // ID de l'utilisateur effectuant l'action

    try {
        const connection = await mariadb.pool.getConnection();

        // Vérifier si le matériel est réservé par cet utilisateur
        const [material] = await connection.query(
            'SELECT etatMateriel, reservedBy FROM materiels WHERE IdMateriel = ?',
            [id]
        );

        if (!material || material.reservedBy !== userId) {
            connection.release();
            return res.status(400).json({ message: 'Vous ne pouvez pas rendre ce matériel.' });
        }

        // Rendre le matériel disponible
        await connection.query(
            'UPDATE materiels SET etatMateriel = ?, reservedBy = NULL WHERE IdMateriel = ?',
            ['DISPONIBLE', id]
        );

        // Récupérer l'état mis à jour pour l'envoyer en réponse
        const [updatedMaterial] = await connection.query(
            'SELECT * FROM materiels WHERE IdMateriel = ?',
            [id]
        );

        connection.release();
        res.status(200).json({ message: 'Matériel rendu avec succès.', updatedEquipment: updatedMaterial });
    } catch (error) {
        console.error('Erreur lors du rendu du matériel:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

app.post('/equipment-force-available/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const connection = await mariadb.pool.getConnection();

        await connection.query(
            'UPDATE materiels SET etatMateriel = ?, reservedBy = NULL WHERE IdMateriel = ?',
            ['DISPONIBLE', id]
        );

        const [updatedEquipment] = await connection.query(
            'SELECT * FROM materiels WHERE IdMateriel = ?',
            [id]
        );

        connection.release();
        res.status(200).json({
            message: 'Equipment has been made available successfully.',
            updatedEquipment,
        });
    } catch (error) {
        console.error('Error making equipment available:', error);
        res.status(500).json({ message: 'Server error.' });
    }
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
    const equipmentId = req.params.id;
    const { nomMateriel, versionMateriel, referenceMateriel, etatMateriel, numeroTelephoneMateriel } = req.body;
    const newPhotoPath = req.file ? req.file.filename : null;

    try {
        await modifyEquipmentInMariaDB(equipmentId, { nomMateriel, versionMateriel, referenceMateriel, etatMateriel, numeroTelephoneMateriel }, newPhotoPath);
        res.status(200).json({ message: 'Equipment updated successfully' });
    } catch (error) {
        console.error('Error modifying equipment:', error);
        res.status(500).json({ message: 'Server error' });
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
    const { nomMateriel, versionMateriel, referenceMateriel, etatMateriel, numeroTelephoneMateriel } = req.body;
    const photoMateriel = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : 'http://localhost:3000/uploads/default.png';

    try {
        await addEquipmentToMariaDB({ nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel });
        res.status(201).json({ message: 'Equipment added successfully' });
    } catch (error) {
        console.error('Error adding equipment:', error);
        res.status(500).json({ message: 'Server error' });
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
    const { email, nomUtilisateur, prenomUtilisateur, roleUtilisateur, matriculeUtilisateur } = req.body;
  
    let connection;
    try {
    connection = await mariadb.pool.getConnection();
  
        // Vérifier si l'email existe déjà
        const emailExists = await connection.query('SELECT * FROM utilisateurs WHERE emailUtilisateur = ?', [email]);
        if (emailExists.length > 0) return res.status(400).json({ message: 'Email already in use' });
    
        // Vérifier si le matricule existe déjà
        const matriculeExists = await connection.query('SELECT * FROM utilisateurs WHERE matriculeUtilisateur = ?', [matriculeUtilisateur]);
        if (matriculeExists.length > 0) return res.status(400).json({ message: 'Matricule already in use' });
    
        const generatedPassword = crypto.randomBytes(4).toString('hex');
  
        // Add user to Firebase
        const firebaseUid = await addUserToFirebase({ emailUtilisateur: email, nomUtilisateur, prenomUtilisateur }, generatedPassword);

        // Add user to MariaDB
        await addUserToMariaDB({ nomUtilisateur, prenomUtilisateur, emailUtilisateur: email, matriculeUtilisateur, roleUtilisateur });
  
      const message = {
        to: email,
        from: 'jghiffi@gmail.com',
        subject: 'Your Locamat Account Password',
        text: `Hello ${prenomUtilisateur} ${nomUtilisateur},\n\nYour Locamat account has been created. Here is your password: ${generatedPassword}\n\n`,
      };
  
      await sendgrid.send(message);
      console.log(`Email sent to ${email}`);
  
      res.status(201).json({
        message: 'User added successfully to Firebase and MariaDB, email sent',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
      if (connection) connection.release();
    }
  });
  


// ########################### DELETE ###########################
app.delete('/user-management/:id', async (req, res) => {
    const userId = req.params.id;
    let connection;

    try {
        connection = await mariadb.pool.getConnection();

        const [user] = await connection.query('SELECT emailUtilisateur FROM utilisateurs WHERE idUtilisateur = ?', [userId]);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'User not found in MariaDB' });
        }

        const userEmail = user.emailUtilisateur;
        const firebaseUser = await admin.auth().getUserByEmail(userEmail);

        await deleteUserFromFirebase(firebaseUser.uid);
        await deleteUserFromMariaDB(userId);

        console.log(`Successfully deleted user: Email = ${userEmail}, ID = ${userId}`);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
    let connection;
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
    }finally {
        if (connection) connection.release(); // Libère la connexion
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
app.put('/user-modify/:id', async (req, res) => {
    const userId = req.params.id;
    const { nomUtilisateur, prenomUtilisateur, emailUtilisateur, roleUtilisateur } = req.body;

    let connection;
    try {
        connection = await mariadb.pool.getConnection();
        const [existingUser] = await connection.query('SELECT emailUtilisateur FROM utilisateurs WHERE idUtilisateur = ?', [userId]);
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        //Firebase
        const firebaseUser = await admin.auth().getUserByEmail(existingUser.emailUtilisateur);
        await modifyUserInFirebase(firebaseUser.uid, { emailUtilisateur, nomUtilisateur, prenomUtilisateur });

        //MariaDB
        await modifyUserInMariaDB(userId, { nomUtilisateur, prenomUtilisateur, emailUtilisateur, roleUtilisateur });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
});



// Get equipment data
// Pour recuperer les données de la base de données
    app.get('/equipment-page/data', getBDDInfo('SELECT nomMateriel,photoMateriel,IdMateriel,referenceMateriel,etatMateriel FROM materiels'));


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


    async function initializeDatabase() {
        try {
            const fakeUsers = [
                ['Robin', 'Lmn', 'test@mail.com', 'MAT0003', 'EMPRUNTEUR'],
                ['Thomas', 'Vlg', 'user@example.com', 'MAT0004', 'ADMINISTRATEUR'],
                ['Clara', 'Rouxel', 'rouxel.clara0@gmail.com', 'MAT0018', 'ADMINISTRATEUR'],
            ];
    
            const fakeMaterials = [
                ['Macbook Pro', '2019', 'AP001', 'DISPONIBLE', 'http://localhost:3000/uploads/1736343714760-2016-04-25-product-2.png.webp', null],
                ['Samsung Galaxy A71', 'A71', 'SA001', 'DISPONIBLE', 'http://localhost:3000/uploads/1735993340096-Samsung-Galaxy-Transparent.png', '0698765432'],
                ['Apple Watch', '2020', 'AP002', 'DISPONIBLE', 'http://localhost:3000/uploads/1735993994868-watchpng.parspng.com-9.png', null],
                ['iMac', '2020', 'AP003', 'DISPONIBLE', 'http://localhost:3000/uploads/1735994052622-1280px-Imac_16-9.png', null],
                ['Iphone X', 'X (10)', 'AP004', 'DISPONIBLE', 'http://localhost:3000/uploads/1736345082781-IPhone-X-PNG-High-Quality-Image.png', '0612345678'],
                ['Samsung Galaxy Z FLIP 4', 'Z FLIP 4', 'SA002', 'DISPONIBLE', 'http://localhost:3000/uploads/1736345649193-Galaxy-Z-Flip4-PNG-Images.png', '0712345678'],
                ['Ipad Mini', 'Pro 2019', 'AP005', 'DISPONIBLE', 'http://localhost:3000/uploads/1736345681096-ipad-mini-6-header.png', null],
                ['AirPods Pro', '3eme Generation', 'AP006', 'DISPONIBLE', 'http://localhost:3000/uploads/1736345902365-pngtree-airpods-png-image_9149137.png', null],
                ['Google Pixel 7', 'Pixel 7', 'GO001', 'DISPONIBLE', 'http://localhost:3000/uploads/1736348609475-unnamed.png', '0672866544'],
                ['Iphone 13', '13eme', 'AP000', 'DISPONIBLE', 'http://localhost:3000/uploads/1736348669203-pngimg.com - iphone_13_PNG18.png', '0683524688'],
            ];
    
            // Vérifier et insérer les utilisateurs
            const usersCount = await mariadb.executeQuery('SELECT COUNT(*) as count FROM utilisateurs');
            console.log("Résultat brut pour utilisateurs :", usersCount);
    
            if (Number(usersCount[0]?.count) === 0) {
                for (const user of fakeUsers) {
                    await mariadb.executeQuery(
                        `INSERT INTO utilisateurs (nomUtilisateur, prenomUtilisateur, emailUtilisateur, matriculeUtilisateur, roleUtilisateur)
                         VALUES (?, ?, ?, ?, ?)`,
                        user
                    );
                    console.log(`Utilisateur ajouté : ${user[0]} ${user[1]}`);
                }
            } else {
                console.log("Les utilisateurs existent déjà, aucune insertion effectuée.");
            }
    
            // Vérifier et insérer les matériels
            const materialsCount = await mariadb.executeQuery('SELECT COUNT(*) as count FROM materiels');
            console.log("Résultat brut pour matériels :", materialsCount);
    
            if (Number(materialsCount[0]?.count) === 0) {
                for (const material of fakeMaterials) {
                    await mariadb.executeQuery(
                        `INSERT INTO materiels (nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        material
                    );
                    console.log(`Matériel ajouté : ${material[0]}`);
                }
            } else {
                console.log("Les matériels existent déjà, aucune insertion effectuée.");
            }
    
            console.log("Initialisation de la base de données terminée avec succès.");
        } catch (err) {
            console.error('Erreur lors de l\'initialisation de la base de données :', err);
        }
    }    
    

    /**
     * Démarrer le serveur
     */
    app.listen(PORT, async () => {
        console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
        await initializeDatabase();
        console.log('Initialisation de la base de données terminée.');
    });

    
// ###############################################################
// #                                                             #
// #                     MARIADB FUNCTIONS                       #
// #                                                             #
// ###############################################################

// #####################        USERS       ######################

async function addUserToMariaDB(userDetails) {
    const { nomUtilisateur, prenomUtilisateur, emailUtilisateur, matriculeUtilisateur, roleUtilisateur } = userDetails;
    let connection;
    try {
        connection = await mariadb.pool.getConnection();
        await connection.query(
            `INSERT INTO utilisateurs (nomUtilisateur, prenomUtilisateur, emailUtilisateur, matriculeUtilisateur, roleUtilisateur)
             VALUES (?, ?, ?, ?, ?)`,
            [nomUtilisateur, prenomUtilisateur, emailUtilisateur, matriculeUtilisateur, roleUtilisateur]
        );
        console.log('User added to MariaDB successfully');
    } catch (error) {
        console.error('Error adding user to MariaDB:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function deleteUserFromMariaDB(userId) {
    let connection;
    try {
        connection = await mariadb.pool.getConnection();
        await connection.query(`DELETE FROM utilisateurs WHERE idUtilisateur = ?`, [userId]);
        console.log('User deleted from MariaDB successfully');
    } catch (error) {
        console.error('Error deleting user from MariaDB:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function modifyUserInMariaDB(userId, userDetails) {
    const { nomUtilisateur, prenomUtilisateur, emailUtilisateur, roleUtilisateur } = userDetails;
    let connection;
    try {
        connection = await mariadb.pool.getConnection();
        await connection.query(
            `UPDATE utilisateurs SET nomUtilisateur = ?, prenomUtilisateur = ?, emailUtilisateur = ?, roleUtilisateur = ?
             WHERE idUtilisateur = ?`,
            [nomUtilisateur, prenomUtilisateur, emailUtilisateur, roleUtilisateur, userId]
        );
        console.log('User updated in MariaDB successfully');
    } catch (error) {
        console.error('Error modifying user in MariaDB:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// #################          EQUIPMENT         ##################

async function addEquipmentToMariaDB(equipmentDetails) {
    const { nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel } = equipmentDetails;
    let connection;
    try {
        connection = await mariadb.pool.getConnection();
        await connection.query(
            `INSERT INTO materiels (nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel || null]
        );
        console.log('Equipment added to MariaDB successfully');
    } catch (error) {
        console.error('Error adding equipment to MariaDB:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function deleteEquipmentFromMariaDB(equipmentId) {
    let connection;
    try {
        connection = await mariadb.pool.getConnection();

        // Retrieve the photo URL for deletion
        const [equipment] = await connection.query(
            'SELECT photoMateriel FROM materiels WHERE IdMateriel = ?',
            [equipmentId]
        );

        if (equipment && equipment.photoMateriel) {
            const photoPath = equipment.photoMateriel.replace('http://localhost:3000/uploads/', '');
            fs.unlinkSync(path.join(__dirname, 'uploads', photoPath));
            console.log('Equipment photo deleted successfully');
        }

        // Delete the equipment
        await connection.query('DELETE FROM materiels WHERE IdMateriel = ?', [equipmentId]);
        console.log('Equipment deleted from MariaDB successfully');
    } catch (error) {
        console.error('Error deleting equipment from MariaDB:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function modifyEquipmentInMariaDB(equipmentId, equipmentDetails, newPhotoPath = null) {
    const { nomMateriel, versionMateriel, referenceMateriel, etatMateriel, numeroTelephoneMateriel } = equipmentDetails;
    let connection;

    try {
        connection = await mariadb.pool.getConnection();

        // Get the current photo for possible deletion
        const [existingEquipment] = await connection.query(
            'SELECT photoMateriel FROM materiels WHERE IdMateriel = ?',
            [equipmentId]
        );

        let photoMateriel = existingEquipment.photoMateriel;

        // If a new photo is provided, update the path and delete the old photo
        if (newPhotoPath) {
            photoMateriel = `http://localhost:3000/uploads/${newPhotoPath}`;
            const oldPhotoPath = existingEquipment.photoMateriel.replace('http://localhost:3000/uploads/', '');
            fs.unlinkSync(path.join(__dirname, 'uploads', oldPhotoPath));
            console.log('Old photo deleted successfully');
        }

        // Update the equipment
        await connection.query(
            `UPDATE materiels SET nomMateriel = ?, versionMateriel = ?, referenceMateriel = ?, etatMateriel = ?, photoMateriel = ?, numeroTelephoneMateriel = ?
             WHERE IdMateriel = ?`,
            [nomMateriel, versionMateriel, referenceMateriel, etatMateriel, photoMateriel, numeroTelephoneMateriel || null, equipmentId]
        );
        console.log('Equipment updated in MariaDB successfully');
    } catch (error) {
        console.error('Error modifying equipment in MariaDB:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}



// ###############################################################
// #                                                             #
// #                    FIREBASE FUNCTIONS                       #
// #                                                             #
// ###############################################################

async function addUserToFirebase(userDetails, password) {
    const { emailUtilisateur, nomUtilisateur, prenomUtilisateur } = userDetails;
    try {
        const firebaseUser = await admin.auth().createUser({
            email: emailUtilisateur,
            password,
            displayName: `${prenomUtilisateur} ${nomUtilisateur}`,
        });
        console.log('User added to Firebase successfully:', firebaseUser.uid);
        return firebaseUser.uid;
    } catch (error) {
        console.error('Error adding user to Firebase:', error);
        throw error;
    }
}

async function deleteUserFromFirebase(firebaseUid) {
    try {
        await admin.auth().deleteUser(firebaseUid);
        console.log('User deleted from Firebase successfully');
    } catch (error) {
        console.error('Error deleting user from Firebase:', error);
        throw error;
    }
}

async function modifyUserInFirebase(firebaseUid, userDetails) {
    const { emailUtilisateur, nomUtilisateur, prenomUtilisateur } = userDetails;
    try {
        await admin.auth().updateUser(firebaseUid, {
            email: emailUtilisateur,
            displayName: `${prenomUtilisateur} ${nomUtilisateur}`,
        });
        console.log('User updated in Firebase successfully');
    } catch (error) {
        console.error('Error modifying user in Firebase:', error);
        throw error;
    }
}






app.get('/debug/delete-extra-firebase-users', async (req, res) => {
    try {
        const firebaseUsers = [];
        let nextPageToken = undefined; // Ensure this starts as `undefined`, not null or an empty string

        // Fetch all users from Firebase
        do {
            const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
            listUsersResult.users.forEach(userRecord => {
                firebaseUsers.push({ uid: userRecord.uid, email: userRecord.email });
            });
            nextPageToken = listUsersResult.pageToken; // Assign the nextPageToken for the next iteration
        } while (nextPageToken); // Loop until nextPageToken is undefined

        // Fetch all users from MariaDB
        const connection = await mariadb.pool.getConnection();
        const mariaDbUsers = await connection.query('SELECT emailUtilisateur FROM utilisateurs');
        connection.release();

        const mariaDbEmails = mariaDbUsers.map(user => user.emailUtilisateur);

        // Identify extra Firebase users not in MariaDB
        const extraFirebaseUsers = firebaseUsers.filter(fbUser => !mariaDbEmails.includes(fbUser.email));

        // Log and delete each extra user
        for (const user of extraFirebaseUsers) {
            console.log(`User found: ${user.email}`);
            try {
                await admin.auth().deleteUser(user.uid);
                console.log(`User deleted from Firebase: ${user.email}`);
            } catch (deleteError) {
                console.error(`Failed to delete user from Firebase: ${user.email}`, deleteError);
            }
        }

        res.status(200).json({
            message: 'Extra Firebase users processed successfully',
            extraFirebaseUsers,
        });
    } catch (error) {
        console.error('Error deleting extra Firebase users:', error);
        res.status(500).json({ message: 'Error deleting extra Firebase users', error });
    }
});

app.get('/debug/list-user-emails', async (req, res) => {
    try {
      const emails = [];
      let nextPageToken;
  
      do {
        const result = await admin.auth().listUsers(1000, nextPageToken);
        result.users.forEach((userRecord) => {
          // Ajout uniquement de l'email de chaque utilisateur
          if (userRecord.email) {
            emails.push(userRecord.email);
          }
        });
        nextPageToken = result.pageToken;
      } while (nextPageToken);
  
      res.status(200).json({ emails });
    } catch (error) {
      console.error("Erreur lors de la récupération des emails des utilisateurs :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des emails.", error });
    }
  });