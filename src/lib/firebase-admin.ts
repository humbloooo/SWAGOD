import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_PRIVATE_KEY) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        } else {
            console.warn("⚠️ FIREBASE_PRIVATE_KEY is missing. Server-side auth verification will fail.");
            // Initialize with default application credentials (good for cloud run) or mock
            // For now, we just don't initialize if keys are missing to prevent crash, 
            // but exported `auth` and `firestore` might throw if accessed.
        }
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
    }
}

// Export safe accessors that throw specified errors if not initialized
export const firestore = admin.apps.length
    ? admin.firestore()
    : {
        collection: () => {
            throw new Error("❌ FIRBASE ADMIN ERROR: process.env.FIREBASE_PRIVATE_KEY is missing/invalid in .env.local. You cannot use server-side features without it.");
        }
    } as any;

export const auth = admin.apps.length
    ? admin.auth()
    : {
        verifyIdToken: () => {
            throw new Error("❌ FIRBASE ADMIN ERROR: process.env.FIREBASE_PRIVATE_KEY is missing/invalid in .env.local. Auth verification failed.");
        }
    } as any;
