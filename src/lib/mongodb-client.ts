import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/swagod_dummy";
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
    clientPromise = client.connect();
}

export default clientPromise;
