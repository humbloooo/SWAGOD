import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI is not defined in production environment.');
}

const uri = MONGODB_URI || "mongodb://localhost:27017/swagod_dummy";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    // @ts-expect-error global NextAuth mongodb caching
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        // @ts-expect-error global NextAuth mongodb caching
        global._mongoClientPromise = client.connect();
    }
    // @ts-expect-error global NextAuth mongodb caching
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch(err => {
        console.error("🚨 MongoDB Client connection failed at startup:", err.message);
        throw err;
    });
    // Suppress unhandled rejection crashing the entire Node server
    clientPromise.catch(() => { });
}

export default clientPromise;
