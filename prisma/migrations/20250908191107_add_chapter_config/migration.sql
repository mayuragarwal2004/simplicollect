-- AlterTable
ALTER TABLE `members` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `city` VARCHAR(255) NULL,
    ADD COLUMN `companyName` VARCHAR(255) NULL,
    ADD COLUMN `country` VARCHAR(255) NULL,
    ADD COLUMN `designation` VARCHAR(255) NULL,
    ADD COLUMN `gstNumber` VARCHAR(255) NULL,
    ADD COLUMN `profileImageLink` VARCHAR(255) NULL,
    ADD COLUMN `state` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `chapterConfig` (
    `id` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `sendTransactionUpdatesWAMsg` BOOLEAN NULL DEFAULT false,
    `sendTransactionUpdatesEmail` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `chapterId`(`chapterId`),
    INDEX `idx_chapter_id`(`chapterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
