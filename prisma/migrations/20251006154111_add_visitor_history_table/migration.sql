-- AlterTable
ALTER TABLE `otp_verifications` MODIFY `expires_at` TIMESTAMP(0) NOT NULL DEFAULT '2038-01-18 16:14:07';

-- CreateTable
CREATE TABLE `visitorHistory` (
    `historyId` VARCHAR(255) NOT NULL,
    `visitorId` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NULL,
    `type` VARCHAR(50) NOT NULL,
    `to` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `content` TEXT NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL,

    INDEX `visitorId`(`visitorId`),
    INDEX `memberId`(`memberId`),
    PRIMARY KEY (`historyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `visitorHistory` ADD CONSTRAINT `visitorHistory_visitorId_fkey` FOREIGN KEY (`visitorId`) REFERENCES `visitors`(`visitorId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `visitorHistory` ADD CONSTRAINT `visitorHistory_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE SET NULL ON UPDATE NO ACTION;
