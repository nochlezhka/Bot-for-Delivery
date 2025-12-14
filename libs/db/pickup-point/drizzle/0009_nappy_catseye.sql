CREATE TABLE "pickup_point" (
	"id" uuid PRIMARY KEY NOT NULL,
	"schedule" text,
	"name" varchar(64) NOT NULL,
	"address" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tg_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pickup_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_pickup_id_pickup_point_id_fk" FOREIGN KEY ("pickup_id") REFERENCES "public"."pickup_point"("id") ON DELETE no action ON UPDATE no action;