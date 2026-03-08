/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');

async function up() {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');

    const products = db.collection('products');
    const allProducts = await products.find({}).toArray();
    console.log(`Checking ${allProducts.length} products for category normalization`);

    for (const product of allProducts) {
        if (product.category && product.category !== product.category.toLowerCase()) {
            await products.updateOne(
                { _id: product._id },
                { $set: { category: product.category.toLowerCase() } }
            );
            console.log(`Normalized category for: ${product.title}`);
        }
    }
}

async function down() {
    console.log('Down migration for category normalization is a no-op');
}

module.exports = { up, down };
