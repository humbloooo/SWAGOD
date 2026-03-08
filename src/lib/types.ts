export interface Product {
    id?: string;
    title: string;
    price: number;
    image: string;
    category: "merch" | "male" | "female";
    subCategory?: "accessories" | "shirts" | "jerseys" | "hoodies" | "hats" | "other" | string;
    description: string;
    sizes?: string[];
    images?: string[];
    createdAt?: string;
    likes?: string[]; // Array of user emails who liked the product
    active?: boolean; // Item 82: Soft Delete Flag
    stockCount?: number;
    isPromo?: boolean;
}

export interface AuditLog {
    id?: string;
    action: string;
    entity: string;
    entityId?: string;
    adminEmail?: string;
    userEmail?: string;
    timestamp?: string;
    details?: string;
}


export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string; // New for Phase 2
}

export interface SiteSettings {
    id?: string;
    heroSlogan?: string; // New field for dynamic slogan
    heroImage?: string; // New field for Hero Wallpaper
    headerVideoBg?: string; // Video background for Header
    lightModeWallpaper?: string; // Wallpaper specifically for light mode
    latestDropsLimit?: number; // Control number of items on home page
    footerText: string;
    footerAboutText?: string; // Brand summary in the footer
    // Marquee Settings
    marqueeText?: string;
    showMarquee?: boolean;
    featuredCategory?: string; // New field for Home Page Category Selection
    showSocials?: boolean; // Control visibility of entire block
    showInstagram?: boolean;
    showTwitter?: boolean;
    showTiktok?: boolean;
    socials: {
        instagram: string;
        twitter: string;
        tiktok: string;
    };
    customSocials?: { name: string; url: string }[];
    maintenanceMode?: boolean; // Item 98: Maintenance Mode Toggle
    showScarcity?: boolean;
    showUrgency?: boolean;
    showSocialProof?: boolean;
    showPersonalization?: boolean;
    freeShippingText?: string;
    contactInfo?: {
        email: string;
        phone: string;
        address: string;
        hours: string;
    };
    faqItems?: {
        question: string;
        answer: string;
    }[];
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

export interface Feedback {
    id?: string;
    name: string;
    email: string;
    message: string;
    date: string;
}

export interface TourEvent {
    id?: string;
    date: string; // ISO String
    city: string;
    venue: string;
    ticketLink?: string;
    soldOut?: boolean;
}

export interface AboutData {
    heading: string;
    paragraphs: string[];
    footer: string;
}

export interface Order {
    id?: string;
    orderId: string;
    userEmail: string;
    items: CartItem[];
    total: number;
    currency: "ZAR" | "USD";
    status: "pending" | "paid" | "failed" | "shipped";
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        province: string;
        zipCode: string;
        phoneNumber: string;
    };
    paystackReference?: string;
    createdAt?: string;
}

export interface CheckoutData {
    fullName: string;
    email: string;
    address: string;
    city: string;
    province: string;
    zipCode: string;
    phone: string;
}
