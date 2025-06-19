ALTER TABLE "products" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variations" jsonb NOT NULL;