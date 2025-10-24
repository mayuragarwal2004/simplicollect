-- AlterTable
ALTER TABLE `member_chapter_mapping` ADD COLUMN `metaData` JSON NULL;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `invoiceURL` TEXT NULL;
