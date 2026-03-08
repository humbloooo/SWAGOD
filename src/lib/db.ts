import dbConnect from './mongoose';
import ProductModel from './models/Product';
import GalleryModel from './models/Gallery';
import SiteSettingsModel from './models/SiteSettings';
import FeedbackModel from './models/Feedback';
import TourEventModel from './models/TourEvent';
import AboutModel from './models/About';
import UserModel from './models/User';
import AuditLogModel from './models/AuditLog';
import VisitModel from './models/Visit';
import NewsletterModel from './models/Newsletter';
import { Log } from './models/Log';
import { Product, SiteSettings, Feedback, TourEvent, AuditLog, AboutData } from './types';
import { PRODUCTS, TOURS, GALLERIES } from './data';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function isUserAdmin(email: string): Promise<boolean> {
    if (!email) return false;
    try {
        await dbConnect();
        if (email === 'admin@swagod.com' || email === 'kuntatswelope9@gmail.com') return true;

        const user = await UserModel.findOne({ email });
        if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
            return true;
        }
        return false;
    } catch (e) {
        console.error("Admin check failed", e);
        return false;
    }
}

// --- PRODUCTS ---

export async function getProducts(limit?: number): Promise<Product[]> {
    if (isMock) {
        return limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
    }
    try {
        await dbConnect();
        const query = ProductModel.find({ active: { $ne: false } }).sort({ createdAt: -1 });
        if (limit) query.limit(limit);

        const docs = await query.exec();
        if (!docs.length) {
            return limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
        }
        return docs.map(doc => doc.toJSON() as unknown as Product);
    } catch {
        console.warn("⚠️ Mongoose connection failed to fetch products. Falling back to mock data.");
        return limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    if (isMock) {
        return PRODUCTS.find(p => p.id === id) || { id, title: "Mock Product", price: 0, category: "male" } as Product;
    }
    try {
        await dbConnect();
        const doc = await ProductModel.findById(id);
        if (!doc) return null;
        return doc.toJSON() as unknown as Product;
    } catch {
        console.warn(`⚠️ Mongoose connection failed fetching product ${id}. Falling back to null.`);
        return null;
    }
}

export async function addProduct(product: Product): Promise<void> {
    await dbConnect();
    // Strip id from data to avoid Mongoose _id conflicts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = product;
    const now = new Date().toISOString();
    const finalData = { ...data, createdAt: data.createdAt || now };

    if (product.id) {
        await ProductModel.findByIdAndUpdate(product.id, finalData, { upsert: true, new: true, setDefaultsOnInsert: true });
    } else {
        await ProductModel.create(finalData);
    }
}

export async function updateProduct(product: Product): Promise<void> {
    if (!product.id) throw new Error("Product ID required for update");
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = product;
    await ProductModel.findByIdAndUpdate(product.id, data, { new: true });
}

export async function getAdminProducts(): Promise<Product[]> {
    await dbConnect();
    const docs = await ProductModel.find().sort({ createdAt: -1 });
    return docs.map(doc => doc.toJSON() as unknown as Product);
}

export async function deleteProduct(id: string): Promise<void> {
    if (isMock) return;
    await dbConnect();
    await ProductModel.findByIdAndUpdate(id, { active: false });
}

export async function hardDeleteProduct(id: string): Promise<void> {
    await dbConnect();
    await ProductModel.findByIdAndDelete(id);
}

// --- AUDIT LOGS ---

export async function addAuditLog(log: AuditLog): Promise<void> {
    await dbConnect();
    await AuditLogModel.create({
        ...log,
        timestamp: new Date().toISOString()
    });
}

// --- GALLERIES ---

export async function getGalleries(): Promise<Product[]> {
    try {
        await dbConnect();
        const docs = await GalleryModel.find().sort({ date: -1 });
        return docs.map(doc => doc.toJSON());
    } catch (_error) {
        console.warn("⚠️ Mongoose connection failed to fetch galleries. Falling back to mock data.", _error);
        return GALLERIES;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addGallery(item: any): Promise<void> {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = item;
    await GalleryModel.create(data);
}

export async function deleteGallery(id: string): Promise<void> {
    await dbConnect();
    await GalleryModel.findByIdAndDelete(id);
}

// --- FEEDBACK ---

export async function getFeedback(): Promise<Feedback[]> {
    try {
        await dbConnect();
        const docs = await FeedbackModel.find().sort({ date: -1 });
        return docs.map(doc => doc.toJSON() as unknown as Feedback);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return [];
    }
}

export async function addFeedback(feedback: Feedback): Promise<void> {
    await dbConnect();
    await FeedbackModel.create(feedback);
}

export async function deleteFeedback(id: string): Promise<void> {
    await dbConnect();
    await FeedbackModel.findByIdAndDelete(id);
}

// --- PROMOS ---

export async function getPromos(): Promise<Product[]> {
    try {
        await dbConnect();
        const docs = await ProductModel.find({ isPromo: true }).sort({ createdAt: -1 });
        return docs.map(doc => doc.toJSON() as unknown as Product);
    } catch (error) {
        console.error("Error fetching promos:", error);
        return [];
    }
}

export async function addPromo(promo: Product): Promise<void> {
    await addProduct({ ...promo, isPromo: true });
}

export async function deletePromo(id: string): Promise<void> {
    await deleteProduct(id);
}

export async function updatePromo(promo: Product): Promise<void> {
    if (!promo.id) throw new Error("Promo ID required");
    await updateProduct({ ...promo, isPromo: true } as Product & { id: string });
}

// --- SETTINGS ---

export async function getSettings(): Promise<SiteSettings> {
    try {
        await dbConnect();
        const doc = await SiteSettingsModel.findById('main');
        if (doc) {
            // Apply transformation to map _id to id and ensure correct type
            return doc.toJSON({
                transform: (doc: unknown, ret: Record<string, unknown>) => {
                    ret.id = ret._id;
                    delete ret._id;
                    return ret;
                }
            }) as unknown as SiteSettings;
        }
    } catch {
        console.warn("⚠️ Mongoose connection failed to fetch settings. Using defaults.");
    }
    return {
        footerText: "© 2026 SWAGOD. ALL RIGHTS RESERVED.",
        socials: { instagram: "", twitter: "", tiktok: "" },
        showMarquee: false,
        maintenanceMode: false,
        showScarcity: true,
        showUrgency: true,
        showSocialProof: true,
        showPersonalization: true
    };
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const { id, ...data } = settings as any;
    await SiteSettingsModel.findByIdAndUpdate('main', data, { upsert: true, new: true, setDefaultsOnInsert: true });
}

// --- ABOUT ---

export async function getAbout(): Promise<AboutData | null> {
    try {
        await dbConnect();
        const doc = await AboutModel.findById('main');
        if (doc) return doc.toJSON() as unknown as AboutData;
    } catch {
        console.warn("⚠️ Mongoose connection failed to fetch About configuration. Using safe fallback.");
    }
    return {
        heading: "ABOUT SWAGOD",
        paragraphs: ["WEAR THE FUTURE. FEAR THE PAST.", "EST. 2026 // WORLDWIDE"],
        footer: "EST. 2026 // WORLDWIDE"
    };
}

export async function saveAbout(data: AboutData): Promise<void> {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const { id, ...cleanedData } = data as any;
    await AboutModel.findByIdAndUpdate('main', cleanedData, { upsert: true, new: true, setDefaultsOnInsert: true });
}

// --- TOURS ---

export async function getTours(): Promise<TourEvent[]> {
    try {
        await dbConnect();
        const docs = await TourEventModel.find().sort({ date: 1 });
        return docs.map(doc => doc.toJSON() as unknown as TourEvent);
    } catch (_error) {
        console.warn("⚠️ Mongoose connection failed to fetch tours. Falling back to mock data.", _error);
        return TOURS as unknown as TourEvent[];
    }
}

export async function addTour(tour: TourEvent): Promise<void> {
    await dbConnect();
    if (tour.id) {
        await TourEventModel.findByIdAndUpdate(tour.id, tour, { upsert: true, new: true, setDefaultsOnInsert: true });
    } else {
        await TourEventModel.create(tour);
    }
}

export async function deleteTour(id: string): Promise<void> {
    await dbConnect();
    await TourEventModel.findByIdAndDelete(id);
}

// --- ANALYTICS ---

export async function trackVisit(): Promise<void> {
    try {
        await dbConnect();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        await VisitModel.findOneAndUpdate(
            { date: today },
            { $inc: { count: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    } catch (e) {
        console.error("Failed to track visit", e);
    }
}

interface AnalyticsData {
    todayVisits: number;
    monthlyVisits: number;
    chartData: number[];
    totalProducts: number;
}

export async function getAnalytics(): Promise<AnalyticsData> {
    try {
        await dbConnect();
        // Today
        const todayStr = new Date().toISOString().split('T')[0];
        const todayVisit = await VisitModel.findOne({ date: todayStr });

        // This Month
        const currentMonth = todayStr.substring(0, 7); // YYYY-MM
        const monthlyVisits = await VisitModel.find({ date: { $regex: `^${currentMonth}` } });
        const monthlyTotal = monthlyVisits.reduce((acc, curr) => acc + curr.count, 0);

        // Chart Data (Last 7 Days)
        const last7DaysData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            const v = await VisitModel.findOne({ date: dStr });
            last7DaysData.push(v ? v.count : 0);
        }

        // Get total products
        const totalProducts = await ProductModel.countDocuments({ active: true });

        return {
            todayVisits: todayVisit ? todayVisit.count : 0,
            monthlyVisits: monthlyTotal,
            chartData: last7DaysData,
            totalProducts
        };

    } catch (e) {
        console.error("Failed to get analytics", e);
        return {
            todayVisits: 0,
            monthlyVisits: 0,
            chartData: [0, 0, 0, 0, 0, 0, 0],
            totalProducts: 0
        };
    }
}

// --- NEWSLETTER ---

export async function addNewsletterEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
        await dbConnect();
        const existing = await NewsletterModel.findOne({ email: email.toLowerCase() });
        if (existing) {
            return { success: false, message: "ALREDY SUBSCRIBED" };
        }
        await NewsletterModel.create({ email });
        return { success: true, message: "JOINED THE CULT" };
    } catch (error) {
        console.error("Newsletter error:", error);
        return { success: false, message: "SYSTEM ERROR" };
    }
}

// --- LOGS / CHANGELOG ---

export async function getLogs(adminOnly = false) {
    try {
        await dbConnect();
        const query = adminOnly ? {} : { isAdminOnly: false };
        const docs = await Log.find(query).sort({ timestamp: -1 });
        return docs.map(doc => doc.toJSON());
    } catch (error) {
        console.error("Failed to fetch logs", error);
        return [];
    }
}

export async function addLog(log: { version: string; title: string; content: string; type?: string; isAdminOnly?: boolean }) {
    try {
        await dbConnect();
        await Log.create(log);
    } catch (error) {
        console.error("Failed to add log", error);
    }
}
