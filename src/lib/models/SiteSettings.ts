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
    featuredCategory?: "male" | "female" | "merch" | "all";
    freeShippingText?: string;
    faqItems?: { question: string; answer: string }[];
    contactInfo?: {
        email: string;
        phone: string;
        address: string;
        hours: string;
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
    featuredCategory: { type: String, enum: ["male", "female", "merch", "all"], default: "all" },
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
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            // we use 'main' as ID but map it back to `id` if needed
            (ret as Record<string, unknown>).id = (ret as Record<string, unknown>)._id;
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
        }
    }
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
