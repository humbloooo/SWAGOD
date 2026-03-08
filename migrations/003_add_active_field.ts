/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');

async function up() {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');

    const products = db.collection('products');
    const result = await products.updateMany(
        { active: { $exists: false } },
        { $set: { active: true } }
    );
    console.log(`Updated ${result.modifiedCount} products with active: true`);
}

async function down() {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');
    await db.collection('products').updateMany(
        { active: true },
        { $unset: { active: "" } }
    );
}

module.exports = { up, down };
