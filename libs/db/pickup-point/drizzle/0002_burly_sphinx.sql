CREATE TYPE "public"."user_gender" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "gender" SET DATA TYPE user_gender USING gender::user_gender;