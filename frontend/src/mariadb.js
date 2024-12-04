const mariadb = require('mariadb');

// Créez un pool de connexions
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mariadbpassword',
    database: 'locamat',
    connectionLimit: 5,
});

// Méthode pour exécuter une requête
async function executeQuery(query, params = []) {
    let connection;
    try {
        // Obtenir une connexion depuis le pool
        connection = await pool.getConnection();

        // Exécuter la requête SQL avec les paramètres
        const result = await connection.query(query, params);
        return result;
    } catch (err) {
        console.error('Erreur lors de l\'exécution de la requête :', err);
        throw err; // Propager l'erreur pour la gérer ailleurs
    } finally {
        // Toujours libérer la connexion
        if (connection) connection.release();
    }
}

module.exports = {
    executeQuery,
    pool,
};
