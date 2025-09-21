/*
  Warnings:

  - You are about to alter the column `payableAmount` on the `receiver_chapter_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `BigInt`.
  - You are about to alter the column `transferredAmount` on the `receiver_chapter_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `chapterConfig` ADD COLUMN `isMeetingsEnabled` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `otp_verifications` MODIFY `expires_at` TIMESTAMP(0) NOT NULL DEFAULT '2038-01-18 16:14:07';

-- AlterTable
ALTER TABLE `receiver_chapter_transactions` MODIFY `payableAmount` BIGINT NULL,
    MODIFY `transferredAmount` BIGINT NULL;
