import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { members, events, wallets } from './schema.js';
import { hashPin } from '../auth.js';

const dbPath = process.env.DATABASE_URL || './data/tesorero.db';

import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const dir = dirname(dbPath);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: './drizzle' });

const defaultPin = hashPin('000000');

const memberData = [
	{ name: 'María García', email: 'maria@example.com', pinHash: defaultPin },
	{ name: 'Juan Pérez', email: 'juan@example.com', pinHash: defaultPin },
	{ name: 'Catalina Silva', email: 'catalina@example.com', pinHash: defaultPin },
	{ name: 'Pedro Muñoz', email: 'pedro@example.com', pinHash: defaultPin },
	{ name: 'Francisca López', email: 'francisca@example.com', pinHash: defaultPin },
	{ name: 'Diego Hernández', email: 'diego@example.com', pinHash: defaultPin },
	{ name: 'Valentina Torres', email: 'valentina@example.com', pinHash: defaultPin },
	{ name: 'Sebastián Rojas', email: 'sebastian@example.com', pinHash: defaultPin }
];

for (const m of memberData) {
	db.insert(members)
		.values(m)
		.onConflictDoNothing()
		.run();
}

db.insert(events)
	.values({
		name: 'Cuota mensual 2026',
		installmentAmountCents: 500000,
		numInstallments: 10,
		startDate: '2026-03-01',
		endDate: '2026-12-31',
		active: true
	})
	.onConflictDoNothing()
	.run();

db.insert(events)
	.values({
		name: 'Paseo fin de año',
		installmentAmountCents: 2000000,
		numInstallments: 1,
		startDate: '2026-06-01',
		endDate: '2026-11-30',
		active: true
	})
	.onConflictDoNothing()
	.run();

db.insert(wallets)
	.values({ name: 'Cuenta principal', initialBalanceCents: 0 })
	.onConflictDoNothing()
	.run();

db.insert(wallets)
	.values({ name: 'Caja chica', initialBalanceCents: 5000000 })
	.onConflictDoNothing()
	.run();

console.log('Seed complete!');
sqlite.close();
