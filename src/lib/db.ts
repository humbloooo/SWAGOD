import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');

export async function readJSON<T>(filename: string): Promise<T> {
    const filePath = path.join(dataDir, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array/object depending on type?
        // For now assume files exist as we created them.
        console.error(`Error reading ${filename}:`, error);
        throw error;
    }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Typed helpers
import { Product, SiteSettings } from './types';

export async function getProducts(): Promise<Product[]> {
    return readJSON<Product[]>('products.json');
}

export async function saveProducts(products: Product[]): Promise<void> {
    return writeJSON('products.json', products);
}

export async function getArchives(): Promise<any[]> {
    return readJSON<any[]>('archives.json');
}

export async function saveArchives(archives: any[]): Promise<void> {
    return writeJSON('archives.json', archives);
}

export async function getAbout(): Promise<any> {
    return readJSON<any>('about.json');
}

export async function saveAbout(data: any): Promise<void> {
    return writeJSON('about.json', data);
}

export async function getPromos(): Promise<any[]> {
    return readJSON<any[]>('promos.json');
}

export async function savePromos(promos: any[]): Promise<void> {
    return writeJSON('promos.json', promos);
}

export async function getSettings(): Promise<SiteSettings> {
    return readJSON<SiteSettings>('settings.json');
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
    return writeJSON('settings.json', settings);
}

import { Feedback } from './types';

export async function getFeedback(): Promise<Feedback[]> {
    return readJSON<Feedback[]>('feedback.json');
}

export async function saveFeedback(feedback: Feedback[]): Promise<void> {
    return writeJSON('feedback.json', feedback);
}
