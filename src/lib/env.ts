export const env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};

export function validateEnv() {
    const requiredVars = [
        'MONGODB_URI',
        'NEXTAUTH_SECRET',
        'CLOUDINARY_URL'
    ];

    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
        console.warn(`[WARNING] Missing critical environment variables: ${missing.join(', ')}. The application may fail.`);
    }
}
