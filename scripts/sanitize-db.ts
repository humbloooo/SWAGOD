import dbConnect from '../src/lib/mongoose';
import Product from '../src/lib/models/Product';
import mongoose from 'mongoose';

async function sanitize() {
    console.log('🚀 Starting Database Sanitization...');
    await dbConnect();

    // 1. Migrate Promos to Products
    const promoCollection = mongoose.connection.db?.collection('promos');
    if (promoCollection) {
        const promos = await promoCollection.find({}).toArray();
        console.log(`📦 Found ${promos.length} promos to migrate.`);

        for (const promoData of promos) {
            const { _id, __v, ...data } = promoData;

            await Product.create({
                ...data,
                isPromo: true,
                active: true
            });
            console.log(`✅ Migrated promo: ${data.title}`);
        }
    } else {
        console.log('⚠️ Promos collection not found or already migrated.');
    }

    // 2. Normalize Product Categories
    const products = await Product.find({});
    for (const product of products) {
        let changed = false;

        // Normalize category to lowercase
        if (product.category && product.category !== product.category.toLowerCase()) {
            product.category = product.category.toLowerCase();
            changed = true;
        }

        // Ensure active is set
        if (product.active === undefined) {
            product.active = true;
            changed = true;
        }

        if (changed) {
            await product.save();
            console.log(`🔧 Normalized product: ${product.title}`);
        }
    }

    // 3. Remove Redundant Collections (Optional - handled by deletion of model files later)
    // We don't drop collections here for safety, just migrate.

    console.log('✨ Sanitization Complete!');
    process.exit(0);
}

sanitize().catch(err => {
    console.error('❌ Sanitization failed:', err);
    process.exit(1);
});
