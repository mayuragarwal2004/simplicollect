-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `vendorName` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `notes` VARCHAR(191) NULL,
    `fileUploadURL` VARCHAR(191) NULL,
    `reimburseCompleted` BOOLEAN NOT NULL DEFAULT false,
    `reimbursedDate` DATETIME(3) NULL,
    `logs` JSON NULL,
    `chapterId` VARCHAR(191) NOT NULL,
    `meetingId` VARCHAR(191) NULL,
    `expenseByMemberId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Expense_chapterId_idx`(`chapterId`),
    INDEX `Expense_meetingId_idx`(`meetingId`),
    INDEX `Expense_expenseByMemberId_idx`(`expenseByMemberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `meetings`(`meetingId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_expenseByMemberId_fkey` FOREIGN KEY (`expenseByMemberId`) REFERENCES `members`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `members`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `members`(`memberId`) ON DELETE SET NULL ON UPDATE CASCADE;
