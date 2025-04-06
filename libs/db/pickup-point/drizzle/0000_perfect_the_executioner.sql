CREATE TYPE "public"."shift_status" AS ENUM('busy', 'halfBusy', 'free', 'weekend');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('employee', 'volunteer', 'coordinator', 'guest');--> statement-breakpoint
CREATE TABLE "shift" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date_start" timestamp NOT NULL,
	"date_end" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"title" varchar(64) NOT NULL,
	"status" "shift_status" DEFAULT 'free'
);
--> statement-breakpoint
CREATE TABLE "user_shifts_table" (
	"user_id" uuid NOT NULL,
	"shift_id" uuid NOT NULL,
	"status" boolean,
	CONSTRAINT "user_shifts_pkey" PRIMARY KEY("user_id","shift_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tg_id" bigint NOT NULL,
	"tg_username" varchar(32),
	"name" varchar(64) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"gender" varchar(4) NOT NULL,
	"role" "user_role" DEFAULT 'guest'
);
--> statement-breakpoint
ALTER TABLE "user_shifts_table" ADD CONSTRAINT "user_shifts_table_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_shifts_table" ADD CONSTRAINT "user_shifts_table_shift_id_shift_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shift"("id") ON DELETE no action ON UPDATE no action;