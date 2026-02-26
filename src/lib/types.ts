export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: "merch" | "accessories" | "clothing";
    description: string;
    sizes?: string[];
    images?: string[];
    createdAt?: string;
    likes?: string[]; // Array of user emails who liked the product
    active?: boolean; // Item 82: Soft Delete Flag
}

export interface AuditLog {
    id?: string;
    action: string;
    entity: string;
    entityId: string;
    adminEmail: string;
    timestamp?: string;
    details?: string;
}


export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string; // New for Phase 2
}

export interface SiteSettings {
    heroImage?: string; // New field for Hero Wallpaper
    latestDropsLimit?: number; // Control number of items on home page
    footerText: string;
    // Marquee Settings
    marqueeText?: string;
    showMarquee?: boolean;
    socials: {
        instagram: string;
        twitter: string;
        tiktok: string;
    };
    maintenanceMode?: boolean; // Item 98: Maintenance Mode Toggle
}

export interface Feedback {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
}

export interface TourEvent {
    id: string;
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
