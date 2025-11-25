/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1764012286074 implements MigrationInterface {
    name = 'InitialMigration1764012286074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`people\` (\`person_id\` varchar(36) NOT NULL, \`first_name\` varchar(100) NOT NULL, \`last_name\` varchar(100) NOT NULL, \`username\` varchar(50) NOT NULL, \`bio\` text NULL, \`date_of_birth\` date NULL, \`nationality\` varchar(100) NULL, \`photo_url\` varchar(500) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_419f6907f97a4fc72335a2df96\` (\`username\`), PRIMARY KEY (\`person_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movie_people\` (\`movie_id\` varchar(255) NOT NULL, \`person_id\` varchar(255) NOT NULL, \`role\` enum ('ACTOR', 'DIRECTOR', 'WRITER', 'PRODUCER') NOT NULL DEFAULT 'ACTOR', PRIMARY KEY (\`movie_id\`, \`person_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`geners\` (\`genre_id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_0dc8ef2378912db6ef30d61f42\` (\`name\`), PRIMARY KEY (\`genre_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movies\` (\`movie_id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL COMMENT 'title must be unique', \`description\` text NOT NULL, \`releaseYear\` int NOT NULL DEFAULT 2000, \`duration\` int NOT NULL, \`language\` varchar(100) NOT NULL, \`contentRating\` varchar(20) NOT NULL DEFAULT 'PG-13', \`posterUrl\` varchar(500) NULL, \`trailerUrl\` varchar(500) NULL, \`videoUrl\` varchar(500) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_5aa0bbd146c0082d3fc5a0ad5d\` (\`title\`), UNIQUE INDEX \`IDX_084fdfd0516fb0b2c6b10e33ff\` (\`posterUrl\`), UNIQUE INDEX \`IDX_3aee245780e7dc26b82c62cdb6\` (\`trailerUrl\`), UNIQUE INDEX \`IDX_372b382f5c7b4213dc82a21fd3\` (\`videoUrl\`), PRIMARY KEY (\`movie_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ratings\` (\`rating_id\` varchar(36) NOT NULL, \`rating\` int NOT NULL, \`comment\` text NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`userUserId\` varchar(36) NOT NULL, \`movieMovieId\` varchar(36) NOT NULL, PRIMARY KEY (\`rating_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`payment_id\` varchar(36) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`method\` enum ('CARD', 'PAYPAL', 'WALLET') NOT NULL, \`status\` enum ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED', 'EXPIRED', 'REFUNDED') NOT NULL DEFAULT 'PENDING', \`transaction_id\` varchar(255) NULL, \`checkout_session_id\` varchar(255) NULL, \`billing_cycle\` varchar(50) NULL, \`payment_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userUserId\` varchar(36) NOT NULL, \`subscriptionSubscriptionId\` varchar(36) NULL, UNIQUE INDEX \`IDX_3c324ca49dabde7ffc0ef64675\` (\`transaction_id\`), PRIMARY KEY (\`payment_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_coupons\` (\`user_id\` varchar(255) NOT NULL, \`coupon_id\` varchar(255) NOT NULL, \`redeemed_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`is_valid\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`user_id\`, \`coupon_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` varchar(36) NOT NULL, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`username\` varchar(50) NOT NULL, \`phone\` varchar(15) NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`subscriptionType\` enum ('FREE', 'BASIC', 'PREMIUM', 'FAMILY', 'STANDARD', 'STUDENT', 'LITE') NOT NULL DEFAULT 'FREE', \`role\` enum ('USER', 'ADMIN', 'MODERATOR') NOT NULL DEFAULT 'USER', \`isVerified\` tinyint NOT NULL DEFAULT 0, \`verificationToken\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscription_plans\` (\`plan_id\` varchar(36) NOT NULL, \`name\` enum ('FREE', 'BASIC', 'PREMIUM', 'FAMILY', 'STANDARD', 'STUDENT', 'LITE') NOT NULL, \`price\` float NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'USD', \`duration_days\` int NOT NULL, \`max_devices\` int NOT NULL DEFAULT '1', \`video_quality\` varchar(20) NOT NULL DEFAULT 'HD', \`description\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ae18a0f6e0143f06474aa8cef1\` (\`name\`), PRIMARY KEY (\`plan_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscriptions\` (\`subscription_id\` varchar(36) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`start_date\` date NULL, \`end_date\` date NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`discount_amount\` float NULL DEFAULT '0', \`final_price\` float NOT NULL, \`user_id\` varchar(36) NULL, \`plan_id\` varchar(36) NULL, \`coupon_id\` varchar(36) NULL, PRIMARY KEY (\`subscription_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`coupons\` (\`coupon_id\` varchar(36) NOT NULL, \`code\` varchar(50) NOT NULL, \`description\` varchar(255) NULL, \`discount_percent\` int NOT NULL, \`valid_from\` date NOT NULL, \`valid_to\` date NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`max_uses\` int NULL, \`use_count\` int NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e025109230e82925843f2a14c4\` (\`code\`), PRIMARY KEY (\`coupon_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movie_genres\` (\`moviesMovieId\` varchar(36) NOT NULL, \`genersGenreId\` varchar(36) NOT NULL, INDEX \`IDX_ef372e7c7acf617e13a4fa4ba5\` (\`moviesMovieId\`), INDEX \`IDX_d404ddfee93042487b35afe152\` (\`genersGenreId\`), PRIMARY KEY (\`moviesMovieId\`, \`genersGenreId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`movie_people\` ADD CONSTRAINT \`FK_993ab2a4c9943194cc878c8a459\` FOREIGN KEY (\`movie_id\`) REFERENCES \`movies\`(\`movie_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movie_people\` ADD CONSTRAINT \`FK_23ee3e8179ed848849ff2341f66\` FOREIGN KEY (\`person_id\`) REFERENCES \`people\`(\`person_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ratings\` ADD CONSTRAINT \`FK_c823a6706ae86f0fe0ea9f3209b\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ratings\` ADD CONSTRAINT \`FK_c9107ee7e48ef9fbe2c6fb060be\` FOREIGN KEY (\`movieMovieId\`) REFERENCES \`movies\`(\`movie_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_24526171618809c2e8e9cc023f4\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_1e05f5ad5e3def25490a5d27e99\` FOREIGN KEY (\`subscriptionSubscriptionId\`) REFERENCES \`subscriptions\`(\`subscription_id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_coupons\` ADD CONSTRAINT \`FK_4765af200afa62c263bcc9a9541\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_coupons\` ADD CONSTRAINT \`FK_8051e26a8b74e9b53696cb9625d\` FOREIGN KEY (\`coupon_id\`) REFERENCES \`coupons\`(\`coupon_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_d0a95ef8a28188364c546eb65c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_e45fca5d912c3a2fab512ac25dc\` FOREIGN KEY (\`plan_id\`) REFERENCES \`subscription_plans\`(\`plan_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_5759fd98f5e56940654ba474041\` FOREIGN KEY (\`coupon_id\`) REFERENCES \`coupons\`(\`coupon_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movie_genres\` ADD CONSTRAINT \`FK_ef372e7c7acf617e13a4fa4ba5c\` FOREIGN KEY (\`moviesMovieId\`) REFERENCES \`movies\`(\`movie_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`movie_genres\` ADD CONSTRAINT \`FK_d404ddfee93042487b35afe152e\` FOREIGN KEY (\`genersGenreId\`) REFERENCES \`geners\`(\`genre_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`movie_genres\` DROP FOREIGN KEY \`FK_d404ddfee93042487b35afe152e\``);
        await queryRunner.query(`ALTER TABLE \`movie_genres\` DROP FOREIGN KEY \`FK_ef372e7c7acf617e13a4fa4ba5c\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_5759fd98f5e56940654ba474041\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_e45fca5d912c3a2fab512ac25dc\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_d0a95ef8a28188364c546eb65c1\``);
        await queryRunner.query(`ALTER TABLE \`user_coupons\` DROP FOREIGN KEY \`FK_8051e26a8b74e9b53696cb9625d\``);
        await queryRunner.query(`ALTER TABLE \`user_coupons\` DROP FOREIGN KEY \`FK_4765af200afa62c263bcc9a9541\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_1e05f5ad5e3def25490a5d27e99\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_24526171618809c2e8e9cc023f4\``);
        await queryRunner.query(`ALTER TABLE \`ratings\` DROP FOREIGN KEY \`FK_c9107ee7e48ef9fbe2c6fb060be\``);
        await queryRunner.query(`ALTER TABLE \`ratings\` DROP FOREIGN KEY \`FK_c823a6706ae86f0fe0ea9f3209b\``);
        await queryRunner.query(`ALTER TABLE \`movie_people\` DROP FOREIGN KEY \`FK_23ee3e8179ed848849ff2341f66\``);
        await queryRunner.query(`ALTER TABLE \`movie_people\` DROP FOREIGN KEY \`FK_993ab2a4c9943194cc878c8a459\``);
        await queryRunner.query(`DROP INDEX \`IDX_d404ddfee93042487b35afe152\` ON \`movie_genres\``);
        await queryRunner.query(`DROP INDEX \`IDX_ef372e7c7acf617e13a4fa4ba5\` ON \`movie_genres\``);
        await queryRunner.query(`DROP TABLE \`movie_genres\``);
        await queryRunner.query(`DROP INDEX \`IDX_e025109230e82925843f2a14c4\` ON \`coupons\``);
        await queryRunner.query(`DROP TABLE \`coupons\``);
        await queryRunner.query(`DROP TABLE \`subscriptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae18a0f6e0143f06474aa8cef1\` ON \`subscription_plans\``);
        await queryRunner.query(`DROP TABLE \`subscription_plans\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`user_coupons\``);
        await queryRunner.query(`DROP INDEX \`IDX_3c324ca49dabde7ffc0ef64675\` ON \`payments\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`ratings\``);
        await queryRunner.query(`DROP INDEX \`IDX_372b382f5c7b4213dc82a21fd3\` ON \`movies\``);
        await queryRunner.query(`DROP INDEX \`IDX_3aee245780e7dc26b82c62cdb6\` ON \`movies\``);
        await queryRunner.query(`DROP INDEX \`IDX_084fdfd0516fb0b2c6b10e33ff\` ON \`movies\``);
        await queryRunner.query(`DROP INDEX \`IDX_5aa0bbd146c0082d3fc5a0ad5d\` ON \`movies\``);
        await queryRunner.query(`DROP TABLE \`movies\``);
        await queryRunner.query(`DROP INDEX \`IDX_0dc8ef2378912db6ef30d61f42\` ON \`geners\``);
        await queryRunner.query(`DROP TABLE \`geners\``);
        await queryRunner.query(`DROP TABLE \`movie_people\``);
        await queryRunner.query(`DROP INDEX \`IDX_419f6907f97a4fc72335a2df96\` ON \`people\``);
        await queryRunner.query(`DROP TABLE \`people\``);
    }

}
