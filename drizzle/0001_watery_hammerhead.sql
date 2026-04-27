ALTER TABLE `events` ADD `is_default` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `wallets` ADD `is_default` integer DEFAULT false NOT NULL;