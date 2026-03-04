import dbConnect from './mongoose';
import ProductModel from './models/Product';
import ArchiveModel from './models/Archive';
import PromoModel from './models/Promo';
import SiteSettingsModel from './models/SiteSettings';
import FeedbackModel from './models/Feedback';
import TourEventModel from './models/TourEvent';
import AboutModel from './models/About';
import UserModel from './models/User';
import AuditLogModel from './models/AuditLog';
import VisitModel from './models/Visit';
import { Product, SiteSettings, Feedback, TourEvent, AuditLog, AboutData } from './types';
import { PRODUCTS } from './data';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function isUserAdmin(email: string): Promise<boolean> {
    if (!email) return false;
    try {
        await dbConnect();
        if (email === 'admin@swagod.com') return true;

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
    const now = new Date().toISOString();
    const data = { ...product, createdAt: product.createdAt || now };

    if (product.id) {
        await ProductModel.findByIdAndUpdate(product.id, data, { upsert: true, new: true, setDefaultsOnInsert: true });
    } else {
        await ProductModel.create(data);
    }
}

export async function updateProduct(product: Product): Promise<void> {
    if (!product.id) throw new Error("Product ID required for update");
    await dbConnect();
    await ProductModel.findByIdAndUpdate(product.id, product, { new: true });
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

// --- ARCHIVES ---

export async function getArchives(): Promise<Product[]> {
    try {
        await dbConnect();
        const docs = await ArchiveModel.find().sort({ date: -1 });
        return docs.map(doc => doc.toJSON() as unknown as Product);
    } catch (error) {
        console.error("Error fetching archives:", error);
        return [];
    }
}

export async function addArchive(item: Product): Promise<void> {
    await dbConnect();
    const data = { ...item, date: item.createdAt || new Date().toISOString() };
    if (item.id) {
        await ArchiveModel.findByIdAndUpdate(item.id, data, { upsert: true, new: true, setDefaultsOnInsert: true });
    } else {
        await ArchiveModel.create(data);
    }
}

export async function deleteArchive(id: string): Promise<void> {
    await dbConnect();
    await ArchiveModel.findByIdAndDelete(id);
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
        const docs = await PromoModel.find().sort({ createdAt: -1 });
        return docs.map(doc => doc.toJSON() as unknown as Product);
    } catch (error) {
        console.error("Error fetching promos:", error);
        return [];
    }
}

export async function addPromo(promo: Product): Promise<void> {
    await dbConnect();
    await PromoModel.create(promo);
}

export async function deletePromo(id: string): Promise<void> {
    await dbConnect();
    await PromoModel.findByIdAndDelete(id);
}

export async function updatePromo(promo: Product): Promise<void> {
    if (!promo.id) throw new Error("Promo ID required");
    await dbConnect();
    await PromoModel.findByIdAndUpdate(promo.id, promo, { new: true });
}

// --- SETTINGS ---

export async function getSettings(): Promise<SiteSettings> {
    try {
        await dbConnect();
        const doc = await SiteSettingsModel.findById('main');
        if (doc) {
            return doc.toJSON() as unknown as SiteSettings;
        }
    } catch {
        console.warn("⚠️ Mongoose connection failed to fetch settings. Using defaults.");
    }
    return {
        footerText: "© 2026 SWAGOD. ALL RIGHTS RESERVED.",
        socials: { instagram: "", twitter: "", tiktok: "" }
    };
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
    await dbConnect();
    await SiteSettingsModel.findByIdAndUpdate('main', settings, { upsert: true, new: true, setDefaultsOnInsert: true });
}

// --- ABOUT ---

export async function getAbout(): Promise<AboutData | null> {
    try {
        await dbConnect();
        const doc = await AboutModel.findById('main');
        if (doc) return doc.toJSON() as unknown as AboutData;
    } catch {
        console.warn("⚠️ Mongoose connection failed to fetch About configuration. Using safe null fallback.");
    }
    return null;
}

export async function saveAbout(data: AboutData): Promise<void> {
    await dbConnect();
    await AboutModel.findByIdAndUpdate('main', data, { upsert: true, new: true, setDefaultsOnInsert: true });
}

// --- TOURS ---

export async function getTours(): Promise<TourEvent[]> {
    try {
        await dbConnect();
        const docs = await TourEventModel.find().sort({ date: 1 });
        return docs.map(doc => doc.toJSON() as unknown as TourEvent);
    } catch (error) {
        console.error("Error fetching tours:", error);
        return [];
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

        // We can just calculate percentage relative to the max of the last 7 days for the chart
        const maxVisits = Math.max(...last7DaysData, 1); // prevent division by zero
        const chartData = last7DaysData.map(val => Math.round((val / maxVisits) * 100));

        // Get total products and total sales (mock for sales for now as orders aren't fully implemented in DB yet)
        const totalProducts = await ProductModel.countDocuments({ active: true });

        return {
            todayVisits: todayVisit ? todayVisit.count : 0,
            monthlyVisits: monthlyTotal,
            chartData,
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
