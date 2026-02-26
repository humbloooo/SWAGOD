import { firestore, isMock } from './firebase-admin';
import { Product, SiteSettings, Feedback, TourEvent } from './types';
import { PRODUCTS } from './data';

// Enforce Firestore collection names
const PRODUCTS_COLLECTION = 'products';
const ARCHIVES_COLLECTION = 'archives';
const FEEDBACK_COLLECTION = 'feedback';
const PROMOS_COLLECTION = 'promos';
const SETTINGS_COLLECTION = 'settings';
const ABOUT_COLLECTION = 'about';
const ADMINS_COLLECTION = 'admins'; // New collection for authorized admin emails
const TOURS_COLLECTION = 'tours';

export async function isUserAdmin(email: string): Promise<boolean> {
    if (!email) return false;
    try {
        // Check 1: Is strict admin in 'admins' collection?
        const doc = await firestore.collection(ADMINS_COLLECTION).doc(email).get();
        if (doc.exists) return true;

        // Check 2: Maybe we store it in 'users' with role: 'admin'?
        const userQuery = await firestore.collection('users').where('email', '==', email).where('role', '==', 'admin').get();
        if (!userQuery.empty) return true;

        // FALLBACK: Allow specific hardcoded email for initial setup if migration isn't perfect yet
        // Remove this later!
        if (email === 'admin@swagod.com') return true;

        return false;
    } catch (e) {
        console.error("Admin check failed", e);
        return false;
    }
}

// --- PRODUCTS ---

export async function getProducts(): Promise<Product[]> {
    if (isMock) {
        console.log("DATABASE: Returning mock products from data.ts");
        return PRODUCTS;
    }
    try {
        const snapshot = await firestore.collection(PRODUCTS_COLLECTION).get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error("Error fetching products:", error);
        return PRODUCTS; // Final fallback
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const doc = await firestore.collection(PRODUCTS_COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Product;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

// Replaces saveProducts (bulk) with specific operations
export async function addProduct(product: Product): Promise<void> {
    // If ID is provided, use it, otherwise auto-gen
    const now = new Date().toISOString();
    const data = { ...product, createdAt: product.createdAt || now };

    if (product.id) {
        await firestore.collection(PRODUCTS_COLLECTION).doc(product.id).set(data, { merge: true });
    } else {
        await firestore.collection(PRODUCTS_COLLECTION).add(data);
    }
}

export async function updateProduct(product: Product): Promise<void> {
    if (!product.id) throw new Error("Product ID required for update");
    await firestore.collection(PRODUCTS_COLLECTION).doc(product.id).set(product, { merge: true });
}

export async function deleteProduct(id: string): Promise<void> {
    await firestore.collection(PRODUCTS_COLLECTION).doc(id).delete();
}

// For backward compatibility during migration, if any code still calls saveProducts(array)
// we should ideally warn or implement a batch write, but better to refactor the caller.
// Let's keep it but make it rewrite the whole collection (EXPENSIVE/DANGEROUS)?
// No, the user wants "Strictly based on Firebase". We will refactor the callers (API routes).

// --- ARCHIVES ---

export async function getArchives(): Promise<any[]> {
    try {
        const snapshot = await firestore.collection(ARCHIVES_COLLECTION).orderBy('date', 'desc').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching archives:", error);
        return [];
    }
}

export async function addArchive(item: any): Promise<void> {
    const data = { ...item, date: item.date || new Date().toISOString() };
    if (item.id) {
        await firestore.collection(ARCHIVES_COLLECTION).doc(item.id).set(data);
    } else {
        await firestore.collection(ARCHIVES_COLLECTION).add(data);
    }
}

export async function deleteArchive(id: string): Promise<void> {
    await firestore.collection(ARCHIVES_COLLECTION).doc(id).delete();
}

// --- FEEDBACK ---

export async function getFeedback(): Promise<Feedback[]> {
    try {
        const snapshot = await firestore.collection(FEEDBACK_COLLECTION).orderBy('date', 'desc').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Feedback));
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return [];
    }
}

export async function addFeedback(feedback: Feedback): Promise<void> {
    await firestore.collection(FEEDBACK_COLLECTION).add(feedback);
}

export async function deleteFeedback(id: string): Promise<void> {
    await firestore.collection(FEEDBACK_COLLECTION).doc(id).delete();
}

// --- PROMOS ---

export async function getPromos(): Promise<any[]> {
    try {
        const snapshot = await firestore.collection(PROMOS_COLLECTION).get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching promos:", error);
        return [];
    }
}

export async function addPromo(promo: any): Promise<void> {
    await firestore.collection(PROMOS_COLLECTION).add(promo);
}

export async function deletePromo(id: string): Promise<void> {
    await firestore.collection(PROMOS_COLLECTION).doc(id).delete();
}

export async function updatePromo(promo: any): Promise<void> {
    if (!promo.id) throw new Error("Promo ID required");
    await firestore.collection(PROMOS_COLLECTION).doc(promo.id).set(promo, { merge: true });
}


// --- SETTINGS ---

export async function getSettings(): Promise<SiteSettings> {
    try {
        const doc = await firestore.collection(SETTINGS_COLLECTION).doc('main').get();
        if (doc.exists) {
            return doc.data() as SiteSettings;
        }
    } catch (error) {
        console.error("Error fetching settings:", error);
    }
    // Default
    return {
        footerText: "© 2026 SWAGOD. ALL RIGHTS RESERVED.",
        socials: { instagram: "", twitter: "", tiktok: "" }
    };
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
    await firestore.collection(SETTINGS_COLLECTION).doc('main').set(settings, { merge: true });
}

// --- ABOUT ---

export async function getAbout(): Promise<any> {
    try {
        const doc = await firestore.collection(ABOUT_COLLECTION).doc('main').get();
        if (doc.exists) return doc.data();
    } catch (error) {
        console.error("Error fetching about:", error);
    }
    return {};
}

export async function saveAbout(data: any): Promise<void> {
    await firestore.collection(ABOUT_COLLECTION).doc('main').set(data, { merge: true });
}

// --- TOURS ---

export async function getTours(): Promise<TourEvent[]> {
    try {
        const snapshot = await firestore.collection(TOURS_COLLECTION).orderBy('date', 'asc').get();
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as TourEvent));
    } catch (error) {
        console.error("Error fetching tours:", error);
        return [];
    }
}

export async function addTour(tour: TourEvent): Promise<void> {
    if (tour.id) {
        await firestore.collection(TOURS_COLLECTION).doc(tour.id).set(tour);
    } else {
        await firestore.collection(TOURS_COLLECTION).add(tour);
    }
}

export async function deleteTour(id: string): Promise<void> {
    await firestore.collection(TOURS_COLLECTION).doc(id).delete();
}
