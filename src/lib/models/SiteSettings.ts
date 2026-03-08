import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
    heroSlogan?: string;
    heroImage?: string;
    lightModeWallpaper?: string;
    latestDropsLimit?: number;
    footerText: string;
    marqueeText?: string;
    showMarquee?: boolean;
    showSocials?: boolean;
    showInstagram?: boolean;
    showTwitter?: boolean;
    showTiktok?: boolean;
    socials: {
        instagram: string;
        twitter: string;
        tiktok: string;
    };
    customSocials?: { name: string; url: string }[];
    maintenanceMode?: boolean;
    showScarcity?: boolean;
    showUrgency?: boolean;
    showSocialProof?: boolean;
    showPersonalization?: boolean;
    featuredCategory?: "male" | "female" | "merch" | "all" | "accessories" | "shirts" | "jerseys" | "hoodies" | "hats";
    freeShippingText?: string;
    faqItems?: { question: string; answer: string }[];
    contactInfo?: {
        email: string;
        phone: string;
        address: string;
        hours: string;
    };
    cloudinaryCloudName?: string;
    cloudinaryApiKey?: string;
    cloudinaryApiSecret?: string;
    psychologyTriggers?: {
        scarcity: { enabled: boolean; stockThreshold: number; text: string };
        urgency: { enabled: boolean; expiryMinutes: number; text: string };
        socialProof: { enabled: boolean; minLikes: number; recentPurchaseInterval: number };
    };
    marqueeSettings?: {
        speed: number;
        direction: "left" | "right";
        colors: { bg: string; text: string };
    };
}

const SiteSettingsSchema: Schema = new Schema({
    _id: { type: String, default: 'main' }, // We only want one settings document
    heroSlogan: { type: String },
    heroImage: { type: String },
    headerVideoBg: { type: String },
    lightModeWallpaper: { type: String },
    latestDropsLimit: { type: Number },
    footerText: { type: String, required: true, default: "© 2026 SWAGOD. ALL RIGHTS RESERVED." },
    footerAboutText: { type: String, default: "We're a local streetwear brand, born in SA, inspired by Hip-Hop and local streetwear." },
    marqueeText: { type: String },
    showMarquee: { type: Boolean, default: false },
    showSocials: { type: Boolean, default: true },
    showInstagram: { type: Boolean, default: true },
    showTwitter: { type: Boolean, default: true },
    showTiktok: { type: Boolean, default: true },
    socials: {
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        tiktok: { type: String, default: "" },
    },
    customSocials: [{
        name: { type: String },
        url: { type: String }
    }],
    maintenanceMode: { type: Boolean, default: false },
    showScarcity: { type: Boolean, default: true },
    showUrgency: { type: Boolean, default: true },
    showSocialProof: { type: Boolean, default: true },
    showPersonalization: { type: Boolean, default: true },
    featuredCategory: { type: String, enum: ["male", "female", "merch", "all", "accessories", "shirts", "jerseys", "hoodies", "hats"], default: "all" },
    freeShippingText: { type: String },
    faqItems: [{
        question: { type: String },
        answer: { type: String }
    }],
    contactInfo: {
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        hours: { type: String }
    },
    cloudinaryCloudName: { type: String },
    cloudinaryApiKey: { type: String },
    cloudinaryApiSecret: { type: String },
    marqueeSettings: {
        speed: { type: Number, default: 20 },
        direction: { type: String, enum: ["left", "right"], default: "left" },
        colors: {
            bg: { type: String, default: "#ff6400" },
            text: { type: String, default: "#ffffff" }
        }
    },
    psychologyTriggers: {
        scarcity: {
            enabled: { type: Boolean, default: true },
            stockThreshold: { type: Number, default: 5 },
            text: { type: String, default: "ONLY {count} LEFT IN STOCK" }
        },
        urgency: {
            enabled: { type: Boolean, default: true },
            expiryMinutes: { type: Number, default: 15 },
            text: { type: String, default: "OFFER EXPIRES IN {time}" }
        },
        socialProof: {
            enabled: { type: Boolean, default: true },
            minLikes: { type: Number, default: 10 },
            recentPurchaseInterval: { type: Number, default: 24 }
        }
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const returned = ret as any;
            returned.id = String(returned._id);
            delete returned._id;
            delete returned.__v;
            return returned;
        }
    }
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
