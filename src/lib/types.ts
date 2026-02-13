export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: "merch" | "accessories" | "clothing";
    description: string;
    sizes?: string[]; // New for Phase 2
    images?: string[]; // New for Gallery Support
    createdAt?: string; // ISO String for "Newest" sorting
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
