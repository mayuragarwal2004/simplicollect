-- AlterTable
ALTER TABLE `member_chapter_mapping` ADD COLUMN `clusterId` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `clusters` (
    `clusterId` VARCHAR(255) NOT NULL,
    `clusterName` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    INDEX `clusters_chapterId_idx`(`chapterId`),
    UNIQUE INDEX `clusters_chapterId_clusterName_key`(`chapterId`, `clusterName`),
    PRIMARY KEY (`clusterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cluster_package_mapping` (
    `clusterId` VARCHAR(255) NOT NULL,
    `packageId` VARCHAR(255) NOT NULL,
    `addedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `removedAt` DATETIME(0) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    INDEX `cluster_package_mapping_packageId_idx`(`packageId`),
    PRIMARY KEY (`clusterId`, `packageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `member_chapter_mapping_clusterId_idx` ON `member_chapter_mapping`(`clusterId`);

-- AddForeignKey
ALTER TABLE `member_chapter_mapping` ADD CONSTRAINT `member_chapter_mapping_clusterId_fkey` FOREIGN KEY (`clusterId`) REFERENCES `clusters`(`clusterId`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clusters` ADD CONSTRAINT `clusters_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cluster_package_mapping` ADD CONSTRAINT `cluster_package_mapping_clusterId_fkey` FOREIGN KEY (`clusterId`) REFERENCES `clusters`(`clusterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cluster_package_mapping` ADD CONSTRAINT `cluster_package_mapping_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `packages`(`packageId`) ON DELETE CASCADE ON UPDATE NO ACTION;
