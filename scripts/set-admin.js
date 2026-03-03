import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

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

async function setAdmin(email) {
    if (!email) {
        console.error("❌ Please provide an email address.");
        console.log("Usage: node scripts/set-admin.js <email>");
        process.exit(1);
    }

    console.log(`🚀 Promoting ${email} to Admin...`);

    try {
        // Add to 'admins' collection
        await db.collection('admins').doc(email).set({
            role: 'admin',
            promotedAt: new Date().toISOString()
        });

        console.log(`✅ SUCCESS: ${email} is now an Admin!`);
        console.log(`   (They may need to log out and log back in for changes to take effect)`);
    } catch (error) {
        console.error("❌ ERROR:", error);
    }
}

const email = process.argv[2];
setAdmin(email);
