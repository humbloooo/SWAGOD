/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');

async function up() {
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');

    const collections = await db.listCollections({ name: 'promos' }).toArray();
    if (collections.length === 0) {
        console.log('No promos collection found, skipping migration 001');
        return;
    }

    const promos = await db.collection('promos').find({}).toArray();
    console.log(`Found ${promos.length} promos to migrate`);

    if (promos.length > 0) {
        const products = db.collection('products');

        for (const promo of promos) {
            const { _id: _unused_id, ...promoData } = promo;
            // Check if product already exists to ensure idempotency
            const existing = await products.findOne({ title: promoData.title });

            if (!existing) {
                await products.insertOne({
                    ...promoData,
                    isPromo: true,
                    active: true,
                    createdAt: promoData.createdAt || new Date().toISOString()
                });
                console.log(`Migrated promo: ${promoData.title}`);
            } else {
                console.log(`Skipping existing promo: ${promoData.title}`);
            }
        }
    }
}

async function down() {
    // Rollback logic: remove products that were marked as isPromo: true
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection not established');
    await db.collection('products').deleteMany({ isPromo: true });
}

module.exports = { up, down };
