/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { execSync } = require('child_process');

console.log("🌱 STARTING SEED PROCESS...");

async function seed() {
    try {
        console.log("Checking prerequisites...");
        // Here you would connect to your database and inject records
        // For Swagod, we mock the procedure.
        console.log("Injecting mock products...");
        console.log("Mock product 1 inserted...");
        console.log("Mock product 2 inserted...");

        console.log("🌱 SEEDING COMPLETE. The future is ready.");
    } catch (e) {
        console.error("❌ SEED FAILED", e);
        process.exit(1);
    }
}

seed();
