const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

let dbPromise;

const initDb = async () => {
    dbPromise = open({
        filename: path.join(__dirname, '../database_v4.sqlite'),
        driver: sqlite3.Database
    });
    
    const db = await dbPromise;
    const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    await db.exec(schema);
    return db;
};

module.exports = {
    getDb: async () => {
        if (!dbPromise) {
            await initDb();
        }
        return dbPromise;
    }
};
