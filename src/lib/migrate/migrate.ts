/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env variables from .env or .env.local
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config();
}

// We'll use require for the dbConnect to avoid ESM resolution issues in ts-node
const dbConnect = require('../mongoose').default;
const { getExecutedMigrations, markMigrationAsExecuted } = require('./migrationTracker');

const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations');

async function runMigrations() {
    console.log('--- STARTING MIGRATIONS ---');

    try {
        await dbConnect();
        console.log('✔ Connected to MongoDB');

        if (!fs.existsSync(MIGRATIONS_DIR)) {
            fs.mkdirSync(MIGRATIONS_DIR);
        }

        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'))
            .sort();

        const executedMigrations = await getExecutedMigrations();

        for (const file of files) {
            const migrationName = path.parse(file).name;

            if (executedMigrations.includes(migrationName)) {
                console.log(`Skipping migration ${migrationName} (already executed)`);
                continue;
            }

            console.log(`Running migration ${migrationName}...`);

            try {
                const migration = require(path.join(MIGRATIONS_DIR, file));

                if (typeof migration.up !== 'function') {
                    throw new Error(`Migration ${file} does not export an up() function`);
                }

                await migration.up();
                await markMigrationAsExecuted(migrationName);
                console.log(`✔ completed ${migrationName}`);
            } catch (err) {
                console.error(`✘ Failed migration ${migrationName}:`, err);
                process.exit(1);
            }
        }

        console.log('--- MIGRATIONS COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('✘ Migration Runner Failed:', err);
        process.exit(1);
    }
}

runMigrations();
