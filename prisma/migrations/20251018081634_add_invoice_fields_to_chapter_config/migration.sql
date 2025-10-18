-- AlterTable
ALTER TABLE `chapterconfig` ADD COLUMN `invoiceCount` INTEGER NULL DEFAULT 0,
    ADD COLUMN `invoiceHTMLTemplate` TEXT NULL,
    ADD COLUMN `invoicePrefix` TEXT NULL,
    ADD COLUMN `metaData` JSON NULL;
