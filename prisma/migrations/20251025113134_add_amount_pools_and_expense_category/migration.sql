-- AlterTable
ALTER TABLE `chapters` ADD COLUMN `amountPools` JSON NULL;

-- AlterTable
ALTER TABLE `expense` ADD COLUMN `category` VARCHAR(50) NOT NULL DEFAULT 'OTHER';
