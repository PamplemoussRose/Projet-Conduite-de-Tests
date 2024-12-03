const mariadb = require('mariadb');

// Créez un pool de connexions
const pool = mariadb.createPool({
    host: 'localhost', // Remplacez par l'adresse de votre serveur MariaDB
    user: 'votre_utilisateur', // Nom d'utilisateur
    password: 'votre_mot_de_passe', // Mot de passe
    database: 'nom_de_votre_base', // Nom de la base de données
    connectionLimit: 5, // Nombre maximum de connexions simultanées
});

module.exports = {
    // Fonction pour obtenir une connexion
    async getConnection() {
        try {
            const connection = await pool.getConnection();
            console.log('Connexion réussie à MariaDB!');
            return connection;
        } catch (err) {
            console.error('Erreur de connexion à MariaDB:', err);
            throw err;
        }
    },
};
