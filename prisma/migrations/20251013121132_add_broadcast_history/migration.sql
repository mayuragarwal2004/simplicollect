-- AlterTable
ALTER TABLE `otp_verifications` MODIFY `expires_at` TIMESTAMP(0) NOT NULL DEFAULT '2038-01-18 16:14:07';

-- CreateTable
CREATE TABLE `BroadcastHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chapterId` VARCHAR(255) NOT NULL,
    `termId` VARCHAR(255) NOT NULL,
    `packageId` VARCHAR(255) NOT NULL,
    `triggeredBy` VARCHAR(255) NOT NULL,
    `triggeredAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `totalMembersSent` INTEGER NOT NULL DEFAULT 0,
    `successCount` INTEGER NOT NULL DEFAULT 0,
    `failureCount` INTEGER NOT NULL DEFAULT 0,

    INDEX `BroadcastHistory_chapterId_idx`(`chapterId`),
    INDEX `BroadcastHistory_termId_idx`(`termId`),
    INDEX `BroadcastHistory_packageId_idx`(`packageId`),
    INDEX `BroadcastHistory_triggeredBy_idx`(`triggeredBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcastMemberHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `broadcastId` INTEGER NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `memberName` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(15) NOT NULL,
    `dueAmount` DECIMAL(10, 2) NOT NULL,
    `packageName` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `errorMessage` TEXT NULL,
    `sentAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `BroadcastMemberHistory_broadcastId_idx`(`broadcastId`),
    INDEX `BroadcastMemberHistory_memberId_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BroadcastHistory` ADD CONSTRAINT `BroadcastHistory_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BroadcastHistory` ADD CONSTRAINT `BroadcastHistory_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `term`(`termId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BroadcastHistory` ADD CONSTRAINT `BroadcastHistory_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `packages`(`packageId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BroadcastHistory` ADD CONSTRAINT `BroadcastHistory_triggeredBy_fkey` FOREIGN KEY (`triggeredBy`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BroadcastMemberHistory` ADD CONSTRAINT `BroadcastMemberHistory_broadcastId_fkey` FOREIGN KEY (`broadcastId`) REFERENCES `BroadcastHistory`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `BroadcastMemberHistory` ADD CONSTRAINT `BroadcastMemberHistory_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;
