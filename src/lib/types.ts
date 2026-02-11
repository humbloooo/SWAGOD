export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: "merch" | "accessories" | "clothing";
    description: string;
    sizes?: string[]; // New for Phase 2
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string; // New for Phase 2
}

export interface SiteSettings {
    footerText: string;
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
