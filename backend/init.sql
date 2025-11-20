ALTER TABLE "users" RENAME COLUMN "id" to "user_id";
ALTER TABLE "users" ADD "profile_picture" VARCHAR(255);
ALTER TABLE "users" ADD "pronouns" VARCHAR(255);
ALTER TABLE "users" ADD "status" VARCHAR(255);
ALTER TABLE "users" ADD "bio" TEXT;
ALTER TABLE "users" ADD "permissions" TEXT;
ALTER TABLE "users" ADD "username" VARCHAR(255);


CREATE TABLE IF NOT EXISTS "characters" (
	"character_id" UUID NOT NULL UNIQUE,
	"owner_id" UUID NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"pronouns" VARCHAR(255),
	"status" VARCHAR(255),
	"description" TEXT,
	"permission" TEXT,
	"priority" INTEGER,
	"created_at" DATE NOT NULL,
	PRIMARY KEY("character_id")
	FOREIGN KEY("owner_id") REFERENCES "users"("user_id")
);




CREATE TABLE IF NOT EXISTS "ref_images" (
	"character_id" UUID NOT NULL,
	"image_id" UUID NOT NULL UNIQUE,
	"is_main_image" BOOLEAN NOT NULL,
	"image_link" TEXT,
	"artist" VARCHAR(255),
	"artist_link" TEXT,
	"priority" INTEGER,
	PRIMARY KEY("image_id")
	FOREIGN KEY("character_id") REFERENCES "characters"("character_id")
);




CREATE TABLE IF NOT EXISTS "attacks" (
	"attack_id" UUID NOT NULL UNIQUE,
	"title" VARCHAR(255) NOT NULL,
	"image_link" TEXT NOT NULL,
	"description" TEXT,
	"attacker_id" UUID NOT NULL,
	"warnings" TEXT,
	"created_at" DATE,
	PRIMARY KEY("attack_id")
	FOREIGN KEY("attacker_id") REFERENCES "users"("user_id")
);




CREATE TABLE IF NOT EXISTS "attack_defenders" (
	"attack_id" UUID NOT NULL,
	"defender_id" UUID NOT NULL,
	PRIMARY KEY("attack_id", "defender_id")
	FOREIGN KEY("attack_id") REFERENCES "attacks"("attack_id")
	FOREIGN KEY("defender_id") REFERENCES "users"("user_id")
);




CREATE TABLE IF NOT EXISTS "attack_characters" (
	"attack_id" UUID NOT NULL,
	"character_id" UUID NOT NULL,
	PRIMARY KEY("attack_id", "character_id")
	FOREIGN KEY("attack_id") REFERENCES "attacks"("attack_id")
	FOREIGN KEY("character_id") REFERENCES "characters"("character_id")
);

