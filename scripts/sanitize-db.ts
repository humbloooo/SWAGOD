import fs from 'fs';
import path from 'path';

// Manual env loading for standalone script
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log('📝 Loading environment variables from .env.local...');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0) {
            process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

import mongoose from 'mongoose'; // Mongoose is okay as it doesn't use the URI until connect

async function sanitize() {
    console.log('🚀 Starting Database Sanitization...');

    // Dynamically import to ensure env vars are set
    const { default: dbConnect } = await import('../src/lib/mongoose');
    const { default: Product } = await import('../src/lib/models/Product');

    try {
        await dbConnect();
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1); // Exit if connection fails
    }

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
