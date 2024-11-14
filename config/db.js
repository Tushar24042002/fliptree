const pool = require("./config");

async function executeQuery(connection, query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

async function withConnection(callback) {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            resolve(conn);
        });
    });

    try {
        return await callback(connection);
    } finally {
        connection.release();
    }
}

module.exports = {
    executeQuery,
    withConnection,
};
