/*
  Warnings:

  - You are about to alter the column `feelWelcome` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(10)`.
  - You are about to alter the column `visitedBniBefore` on the `visitors` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `otp_verifications` MODIFY `expires_at` TIMESTAMP(0) NOT NULL DEFAULT '2038-01-18 16:14:07';

-- AlterTable
ALTER TABLE `visitors` MODIFY `feelWelcome` VARCHAR(10) NULL,
    MODIFY `visitedBniBefore` VARCHAR(10) NULL;
