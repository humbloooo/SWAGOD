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
}

const SiteSettingsSchema: Schema = new Schema({
    _id: { type: String, default: 'main' }, // We only want one settings document
    heroSlogan: { type: String },
    heroImage: { type: String },
    lightModeWallpaper: { type: String },
    latestDropsLimit: { type: Number },
    footerText: { type: String, required: true, default: "© 2026 SWAGOD. ALL RIGHTS RESERVED." },
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
    maintenanceMode: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            // we use 'main' as ID but map it back to `id` if needed
            (ret as any).id = (ret as any)._id;
            Reflect.deleteProperty(ret, '_id');
            Reflect.deleteProperty(ret, '__v');
        }
    }
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
