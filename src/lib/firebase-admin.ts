import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const projectId = process.env.FIREBASE_PROJECT_ID;

        if (privateKey && clientEmail && projectId) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log("✅ FIREBASE ADMIN: Initialized successfully via environment variables.");
        } else {
            console.warn("⚠️ FIREBASE ADMIN: Environment variables missing. Operating in MOCK MODE.");
        }
    } catch (error) {
        console.error("❌ FIREBASE ADMIN: Initialization Error:", error);
    }
}

// Export safe accessors that DON'T throw errors if not initialized, 
// allowing the app to build/run with fallback data in db.ts
export const isMock = !admin.apps.length;

export const firestore = admin.apps.length
    ? admin.firestore()
    : {
        collection: (name: string) => ({
            doc: (id: string) => ({
                get: async () => ({ exists: false, data: () => ({}) }),
                set: async () => { },
                delete: async () => { },
            }),
            where: () => ({
                get: async () => ({ empty: true, docs: [] }),
            }),
            orderBy: () => ({
                get: async () => ({ empty: true, docs: [] }),
            }),
            get: async () => ({ empty: true, docs: [] }),
            add: async () => ({ id: 'mock-id' }),
        })
    } as any;

export const auth = admin.apps.length
    ? admin.auth()
    : {
        verifyIdToken: async () => {
            console.warn("MOCK AUTH: verifyIdToken called but no Firebase keys found.");
            return { email: 'admin@swagod.com' }; // Default mock admin for local testing
        }
    } as any;
