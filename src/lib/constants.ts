// Global Constants for SWAGOD App

export const SITE_NAME = "SWAGOD";
export const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const CURRENCY = {
    DEFAULT: "ZAR",
    ALTERNATE: "USD",
    EXCHANGE_RATE: 18.5, // Mock exchange rate, ideally fetched from an API
};

export const BREAKPOINTS = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
};

export const UI = {
    SCROLL_THROTTLE_MS: 100,
    TOAST_DURATION_MS: 3000,
    MARQUEE_SPEED: "20s",
    ANIMATION_DURATION: 0.3,
};

export const PAGINATION = {
    DEFAULT_ADMIN_LIMIT: 20,
    DEFAULT_SHOP_LIMIT: 24,
};

export const FALLBACK_IMAGES = {
    PRODUCT: "/assets/placeholder-product.jpg",
    AVATAR: "/assets/placeholder-avatar.png",
};

export const ORDER_STATUSES = {
    PENDING: { label: "PENDING", color: "white/40" },
    VERIFIED: { label: "VERIFIED", color: "blue-500" },
    IN_PRODUCTION: { label: "IN_PRODUCTION", color: "primary" },
    SHIPPED: { label: "SHIPPED", color: "green-500" },
    DELIVERED: { label: "DELIVERED", color: "white" },
    ARCHIVED: { label: "ARCHIVED", color: "white/20" },
};

export const ADMIN_MENU = [
    { title: "DASHBOARD", path: "/admin", icon: "LayoutDashboard" },
    { title: "PRODUCTS", path: "/admin/products", icon: "Package" },
    { title: "ORDERS", path: "/admin/orders", icon: "ShoppingCart" },
    { title: "TOUR", path: "/admin/tour", icon: "MapPin" },
    { title: "SETTINGS", path: "/admin/settings", icon: "Settings" },
];

