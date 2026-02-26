import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const ZAR_TO_USD_RATE = 1 / 18; // approx 18 ZAR = 1 USD

export function formatPrice(price: number, currency: "ZAR" | "USD") {
    if (currency === "USD") {
        return `$${(price * ZAR_TO_USD_RATE).toFixed(2)}`;
    }
    return `R ${price.toFixed(2)}`;
}
