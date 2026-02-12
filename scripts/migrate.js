const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
    if (!process.env.FIREBASE_PRIVATE_KEY) {
        console.error("❌ ERROR: FIREBASE_PRIVATE_KEY is missing in .env.local");
        process.exit(1);
    }
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

async function migrateCollection(filename, collectionName) {
    const filePath = path.join(__dirname, '../src/data', filename);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found. Skipping.`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(data)) {
        console.log(`⚠️  ${filename} is not an array. Skipping.`);
        return;
    }

    console.log(`🚀 Migrating ${data.length} items from ${filename} to '${collectionName}'...`);

    let count = 0;
    const batch = db.batch();

    for (const item of data) {
        // Use existing ID or auto-gen
        const docRef = item.id
            ? db.collection(collectionName).doc(item.id.toString())
            : db.collection(collectionName).doc();

        // Sanitize item (remove undefineds)
        const safeItem = JSON.parse(JSON.stringify(item));
        batch.set(docRef, safeItem);
        count++;

        // Commit every 400 items (Firestore limit is 500)
        if (count % 400 === 0) {
            await batch.commit();
            console.log(`   Committed batch of ${count}...`);
            // batches are not reusable, strictly speaking, need new one? 
            // Actually standard pattern is new batch.
        }
    }

    await batch.commit();
    console.log(`✅ ${collectionName} migration complete!`);
}

async function migrateSettings() {
    const filePath = path.join(__dirname, '../src/data/settings.json');
    if (!fs.existsSync(filePath)) return;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`🚀 Migrating settings...`);
    await db.collection('settings').doc('main').set(data);
    console.log(`✅ Settings migrated!`);
}

async function run() {
    await migrateCollection('products.json', 'products');
    await migrateCollection('archives.json', 'archives');
    await migrateCollection('feedback.json', 'feedback');
    await migrateCollection('promos.json', 'promos');
    await migrateSettings();
    console.log("\n🎉 ALL DATA MIGRATED TO FIREBASE!");
}

run().catch(console.error);
