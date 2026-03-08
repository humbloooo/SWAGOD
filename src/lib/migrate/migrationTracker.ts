/* eslint-disable @typescript-eslint/no-require-imports */
const Migration = require('../models/Migration').default || require('../models/Migration');

async function getExecutedMigrations() {
    const migrations = await Migration.find({}).select('name');
    return migrations.map((m: { name: string }) => m.name);
}

async function markMigrationAsExecuted(name: string) {
    await Migration.create({ name });
}

module.exports = {
    getExecutedMigrations,
    markMigrationAsExecuted
};
