-- CreateTable
CREATE TABLE `cashreceivers` (
    `cashRecieverId` VARCHAR(255) NOT NULL,
    `cashRecieverName` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `enableDate` DATE NULL,
    `disableDate` DATE NULL,

    INDEX `chapterId`(`chapterId`),
    INDEX `memberId`(`memberId`),
    PRIMARY KEY (`cashRecieverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapter_log` (
    `logId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `logDate` DATE NOT NULL,
    `logDescription` TEXT NULL,

    INDEX `chapterId`(`chapterId`),
    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapters` (
    `chapterId` VARCHAR(255) NOT NULL,
    `chapterName` VARCHAR(255) NOT NULL,
    `chapterSlug` VARCHAR(255) NOT NULL,
    `region` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `state` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `meetingDay` VARCHAR(255) NULL,
    `meetingPeriodicity` ENUM('weekly', 'fortnightly', 'monthly', 'bi-monthly', 'quaterly', '6-monthly', 'yearly') NOT NULL,
    `meetingPaymentType` VARCHAR(191) NOT NULL,
    `visitorPerMeetingFee` DECIMAL(10, 2) NOT NULL,
    `weeklyFee` DECIMAL(10, 2) NULL,
    `monthlyFee` DECIMAL(10, 2) NULL,
    `quarterlyFee` DECIMAL(10, 2) NULL,
    `organisationId` VARCHAR(255) NOT NULL,
    `testMode` BOOLEAN NULL DEFAULT false,
    `platformFee` DECIMAL(10, 2) NULL,
    `platformFeeType` VARCHAR(255) NULL,
    `platformFeeCase` CHAR(255) NULL,

    UNIQUE INDEX `chapterSlug`(`chapterSlug`),
    INDEX `fk_organisations`(`organisationId`),
    PRIMARY KEY (`chapterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_queries` (
    `queryId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `subject` VARCHAR(500) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('pending', 'under_review', 'resolved', 'closed') NULL DEFAULT 'pending',
    `priority` ENUM('low', 'medium', 'high', 'urgent') NULL DEFAULT 'medium',
    `category` VARCHAR(100) NULL DEFAULT 'general',
    `submittedBy` VARCHAR(255) NULL,
    `assignedTo` VARCHAR(255) NULL,
    `adminNotes` TEXT NULL,
    `responseMessage` TEXT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `source` VARCHAR(50) NULL DEFAULT 'web',
    `isSpam` BOOLEAN NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `resolvedAt` TIMESTAMP(0) NULL,

    INDEX `idx_assigned_to`(`assignedTo`),
    INDEX `idx_contact_queries_category_status`(`category`, `status`),
    INDEX `idx_contact_queries_status_created`(`status`, `createdAt` DESC),
    INDEX `idx_created_at`(`createdAt`),
    INDEX `idx_email`(`email`),
    INDEX `idx_priority_status`(`priority`, `status`),
    INDEX `idx_status`(`status`),
    INDEX `idx_submitted_by`(`submittedBy`),
    PRIMARY KEY (`queryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_query_history` (
    `historyId` VARCHAR(255) NOT NULL,
    `queryId` VARCHAR(255) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `oldValue` TEXT NULL,
    `newValue` TEXT NULL,
    `performedBy` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_action`(`action`),
    INDEX `idx_performed_by`(`performedBy`),
    INDEX `idx_query_id`(`queryId`),
    PRIMARY KEY (`historyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fcm_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` VARCHAR(255) NOT NULL,
    `token` TEXT NOT NULL,
    `platform` VARCHAR(50) NULL DEFAULT 'web',
    `isActive` BOOLEAN NULL DEFAULT true,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_member_active`(`memberId`, `isActive`),
    INDEX `idx_member_id`(`memberId`),
    INDEX `idx_token_hash`(`token`(100)),
    UNIQUE INDEX `unique_member_token`(`memberId`, `token`(255)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `features_master` (
    `featureId` VARCHAR(255) NOT NULL,
    `featureName` VARCHAR(255) NOT NULL,
    `featureDescription` TEXT NULL,
    `featureType` VARCHAR(255) NULL,
    `featureParent` VARCHAR(255) NULL,
    `featureUrl` VARCHAR(255) NULL,
    `featureIcon` VARCHAR(255) NULL,
    `featureOrder` BIGINT NULL,
    `featureDisabled` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`featureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_receivers` (
    `receiverId` VARCHAR(255) NOT NULL,
    `receiverName` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `paymentType` VARCHAR(255) NULL,
    `receiverAmount` DECIMAL(10, 2) NULL,
    `receiverAmountType` TEXT NULL,
    `qrImageLink` VARCHAR(255) NULL,
    `enableDate` DATE NULL,
    `disableDate` DATE NULL,
    `receiverFeeOptional` BOOLEAN NULL DEFAULT false,
    `receiverFeeOptionalMessage` VARCHAR(500) NULL,

    INDEX `chapterId`(`chapterId`),
    INDEX `memberId`(`memberId`),
    PRIMARY KEY (`receiverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetings` (
    `meetingId` VARCHAR(255) NOT NULL,
    `termId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `meetingName` VARCHAR(255) NOT NULL,
    `meetingDate` DATE NOT NULL,
    `meetingTime` VARCHAR(255) NOT NULL,
    `meetingFeeMembers` BIGINT NULL,
    `meetingFeeVisitors` BIGINT NULL,
    `disabled` BOOLEAN NULL DEFAULT false,

    INDEX `chapterId`(`chapterId`),
    PRIMARY KEY (`meetingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_chapter_mapping` (
    `memberId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `roleIds` VARCHAR(255) NULL,
    `balance` BIGINT NOT NULL DEFAULT 0,
    `status` ENUM('joined', 'left') NOT NULL DEFAULT 'joined',
    `joinedDate` DATE NULL,
    `leaveDate` DATE NULL,

    INDEX `chapterId`(`chapterId`),
    INDEX `roleId`(`roleIds`),
    PRIMARY KEY (`memberId`, `chapterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `memberId` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `role` VARCHAR(255) NULL,
    `superAdmin` BOOLEAN NULL DEFAULT false,
    `test` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `phoneNumber`(`phoneNumber`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members_log` (
    `logId` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `logDate` DATE NOT NULL,
    `logDescription` TEXT NULL,

    INDEX `memberId`(`memberId`),
    PRIMARY KEY (`logId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members_meeting_mapping` (
    `memberId` VARCHAR(255) NOT NULL,
    `meetingId` VARCHAR(255) NOT NULL,
    `notToPay` BOOLEAN NULL DEFAULT false,
    `notToPayReason` TEXT NULL,
    `isPaid` BOOLEAN NULL DEFAULT false,
    `transactionId` VARCHAR(255) NULL,

    INDEX `meetingId`(`meetingId`),
    INDEX `memberId`(`memberId`),
    INDEX `transactionId`(`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_subscribers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `subscribedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isActive` BOOLEAN NULL DEFAULT true,
    `unsubscribedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_email`(`email`),
    INDEX `idx_is_active`(`isActive`),
    INDEX `idx_subscribed_at`(`subscribedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_campaigns` (
    `campaignId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `templateId` VARCHAR(255) NOT NULL,
    `targetType` ENUM('all', 'chapter', 'role', 'custom') NOT NULL,
    `targetChapterId` VARCHAR(255) NULL,
    `targetRole` VARCHAR(255) NULL,
    `customRecipients` JSON NULL,
    `status` ENUM('draft', 'scheduled', 'sending', 'completed', 'failed') NULL DEFAULT 'draft',
    `scheduledAt` DATETIME(0) NULL,
    `sentAt` DATETIME(0) NULL,
    `totalRecipients` INTEGER NULL DEFAULT 0,
    `successCount` INTEGER NULL DEFAULT 0,
    `failureCount` INTEGER NULL DEFAULT 0,
    `createdBy` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `createdBy`(`createdBy`),
    INDEX `templateId`(`templateId`),
    PRIMARY KEY (`campaignId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_templates` (
    `templateId` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('info', 'success', 'warning', 'error', 'payment', 'report', 'marketing') NULL DEFAULT 'info',
    `priority` ENUM('low', 'medium', 'high', 'urgent') NULL DEFAULT 'medium',
    `isPersistent` BOOLEAN NULL DEFAULT true,
    `createdBy` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `createdBy`(`createdBy`),
    PRIMARY KEY (`templateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `notificationId` VARCHAR(255) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('info', 'success', 'warning', 'error', 'payment', 'report', 'marketing') NULL DEFAULT 'info',
    `priority` ENUM('low', 'medium', 'high', 'urgent') NULL DEFAULT 'medium',
    `isPersistent` BOOLEAN NULL DEFAULT true,
    `isRead` BOOLEAN NULL DEFAULT false,
    `recipientId` VARCHAR(255) NOT NULL,
    `senderId` VARCHAR(255) NULL,
    `chapterId` VARCHAR(255) NULL,
    `relatedEntityType` VARCHAR(100) NULL,
    `relatedEntityId` VARCHAR(255) NULL,
    `scheduledAt` DATETIME(0) NULL,
    `sentAt` DATETIME(0) NULL,
    `readAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `chapter_idx`(`chapterId`),
    INDEX `created_idx`(`createdAt`),
    INDEX `recipient_idx`(`recipientId`),
    INDEX `senderId`(`senderId`),
    INDEX `type_idx`(`type`),
    PRIMARY KEY (`notificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organisations` (
    `organisationId` VARCHAR(255) NOT NULL,
    `organisationName` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`organisationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_verifications` (
    `otp_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` VARCHAR(255) NOT NULL,
    `otp_code` VARCHAR(6) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` TIMESTAMP(0) NOT NULL DEFAULT '2038-01-18 16:14:07',
    `verified` TINYINT NULL DEFAULT 0,

    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`otp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `packageId` VARCHAR(255) NOT NULL,
    `termId` VARCHAR(255) NOT NULL,
    `packageName` VARCHAR(255) NOT NULL,
    `packageParent` VARCHAR(255) NULL,
    `packageFeeType` VARCHAR(255) NULL,
    `packageFeeAmount` BIGINT NULL,
    `packagePayableStartDate` DATE NULL,
    `packagePayableEndDate` DATE NULL,
    `allowAfterEndDate` BOOLEAN NULL,
    `allowPenaltyPayableAfterEndDate` BOOLEAN NULL,
    `penaltyType` VARCHAR(255) NULL,
    `penaltyAmount` BIGINT NULL,
    `penaltyFrequency` VARCHAR(255) NULL,
    `discountType` VARCHAR(255) NULL,
    `discountAmount` BIGINT NULL,
    `discountFrequency` VARCHAR(255) NULL,
    `discountEndDate` DATE NULL,
    `allowPackagePurchaseIfFeesPaid` BOOLEAN NULL,
    `meetingIds` LONGTEXT NULL,
    `chapterId` VARCHAR(255) NULL,

    INDEX `chapterId`(`chapterId`),
    PRIMARY KEY (`packageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `push_subscriptions` (
    `subscriptionId` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `endpoint` TEXT NOT NULL,
    `p256dh` TEXT NOT NULL,
    `auth` TEXT NOT NULL,
    `userAgent` TEXT NULL,
    `isActive` BOOLEAN NULL DEFAULT true,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `member_idx`(`memberId`),
    PRIMARY KEY (`subscriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qrreceivers` (
    `qrCodeId` VARCHAR(255) NOT NULL,
    `qrCode` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `qrCodeName` VARCHAR(255) NULL,
    `qrImageLink` VARCHAR(255) NULL,
    `enableDate` DATE NULL,
    `disableDate` DATE NULL,

    INDEX `chapterId`(`chapterId`),
    INDEX `memberId`(`memberId`),
    PRIMARY KEY (`qrCodeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receiver_chapter_transactions` (
    `id` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `senderId` VARCHAR(255) NOT NULL,
    `senderName` VARCHAR(255) NOT NULL,
    `approvedById` VARCHAR(255) NULL,
    `approvedByName` VARCHAR(255) NULL,
    `payableAmount` DECIMAL(10, 2) NOT NULL,
    `transferredAmount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(255) NULL DEFAULT 'pending',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `approvedById`(`approvedById`),
    INDEX `chapterId`(`chapterId`),
    INDEX `senderId`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `roleId` VARCHAR(255) NOT NULL,
    `roleName` VARCHAR(255) NOT NULL,
    `removable` BOOLEAN NULL DEFAULT true,
    `roleDescription` TEXT NULL,
    `chapterId` VARCHAR(255) NULL,
    `rights` TEXT NULL,
    `default` BOOLEAN NULL DEFAULT false,

    INDEX `chapterId`(`chapterId`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `term` (
    `termId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `termName` VARCHAR(255) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `statusUpdateType` ENUM('manual', 'auto') NOT NULL,
    `status` ENUM('active', 'inactive', 'archived') NOT NULL DEFAULT 'inactive',
    `activeStartDate` DATETIME(0) NOT NULL,
    `activeEndDate` DATETIME(0) NOT NULL,

    PRIMARY KEY (`termId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `transactionId` VARCHAR(255) NOT NULL,
    `memberId` VARCHAR(255) NOT NULL,
    `chapterId` VARCHAR(255) NULL,
    `transactionDate` DATE NOT NULL,
    `transactionType` TEXT NULL,
    `originalPayableAmount` BIGINT NULL,
    `discountAmount` BIGINT NULL,
    `penaltyAmount` BIGINT NULL,
    `receiverFee` BIGINT NULL,
    `amountPaidToChapter` BIGINT NULL,
    `amountExpectedToChapter` BIGINT NULL,
    `platformFee` BIGINT NULL,
    `balanceAmount` BIGINT NULL,
    `payableAmount` BIGINT NULL,
    `paidAmount` BIGINT NULL,
    `userRemarks` TEXT NULL,
    `systemRemarks` TEXT NULL,
    `status` VARCHAR(255) NULL,
    `statusUpdateDate` DATE NULL,
    `paymentType` VARCHAR(255) NULL,
    `paymentDate` DATE NULL,
    `paymentImageLink` VARCHAR(255) NULL,
    `paymentReceivedById` VARCHAR(255) NULL,
    `paymentReceivedByName` VARCHAR(255) NULL,
    `packageId` VARCHAR(255) NULL,
    `approvedById` VARCHAR(255) NULL,
    `approvedByName` VARCHAR(255) NULL,
    `transferedToChapterTransactionId` VARCHAR(255) NULL,

    INDEX `approvedById`(`approvedById`),
    INDEX `memberId`(`memberId`),
    INDEX `packageId`(`packageId`),
    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitor_follow_ups` (
    `followUpId` INTEGER NOT NULL AUTO_INCREMENT,
    `visitorId` VARCHAR(255) NOT NULL,
    `followUpMemberId` INTEGER NOT NULL,
    `followUpDate` DATE NOT NULL,
    `followUpTime` TIME(0) NOT NULL,
    `followUpMode` ENUM('call', 'message', 'email', 'inPerson') NOT NULL,
    `followUpNotes` TEXT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `visitorId`(`visitorId`),
    PRIMARY KEY (`followUpId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitors` (
    `visitorId` VARCHAR(255) NOT NULL,
    `invitedBy` VARCHAR(255) NOT NULL,
    `chapterVisitDate` DATE NULL,
    `heardAboutBni` VARCHAR(255) NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `companyName` VARCHAR(255) NULL,
    `classification` VARCHAR(255) NULL,
    `industry` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `mobileNumber` VARCHAR(20) NOT NULL,
    `chapterId` VARCHAR(255) NOT NULL,
    `meetingId` VARCHAR(255) NULL,
    `feedbackScore` INTEGER NULL,
    `feedbackComments` TEXT NULL,
    `nextStep` TEXT NULL,
    `arrivalTime` TIME(0) NULL,
    `feelWelcome` BOOLEAN NULL,
    `visitedBniBefore` BOOLEAN NULL,
    `referralGroup` BOOLEAN NULL,
    `referralGroupExperience` TEXT NULL,
    `eoiFilled` BOOLEAN NULL DEFAULT false,
    `visitorStatus` ENUM('Approved', 'Preapproved', 'Declined') NULL DEFAULT 'Preapproved',
    `paymentAcceptedMemberId` VARCHAR(255) NULL,
    `assignedMemberId` VARCHAR(255) NULL,
    `paymentImageLink` VARCHAR(255) NULL,
    `paymentAmount` DECIMAL(10, 2) NULL,
    `paymentRecordedDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `paymentType` ENUM('cash', 'online') NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `assignedMemberId`(`assignedMemberId`),
    INDEX `chapterId`(`chapterId`),
    INDEX `fk_visitors_meetings`(`meetingId`),
    INDEX `paymentAcceptedMemberId`(`paymentAcceptedMemberId`),
    PRIMARY KEY (`visitorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cashreceivers` ADD CONSTRAINT `cashreceivers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cashreceivers` ADD CONSTRAINT `cashreceivers_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chapter_log` ADD CONSTRAINT `chapter_log_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `fk_organisations` FOREIGN KEY (`organisationId`) REFERENCES `organisations`(`organisationId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_queries` ADD CONSTRAINT `fk_contact_assigned_to` FOREIGN KEY (`assignedTo`) REFERENCES `members`(`memberId`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_queries` ADD CONSTRAINT `fk_contact_submitted_by` FOREIGN KEY (`submittedBy`) REFERENCES `members`(`memberId`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_query_history` ADD CONSTRAINT `fk_history_performed_by` FOREIGN KEY (`performedBy`) REFERENCES `members`(`memberId`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contact_query_history` ADD CONSTRAINT `fk_history_query_id` FOREIGN KEY (`queryId`) REFERENCES `contact_queries`(`queryId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fee_receivers` ADD CONSTRAINT `fee_receivers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fee_receivers` ADD CONSTRAINT `fee_receivers_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_chapter_mapping` ADD CONSTRAINT `member_chapter_mapping_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `member_chapter_mapping` ADD CONSTRAINT `member_chapter_mapping_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members_log` ADD CONSTRAINT `members_log_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members_meeting_mapping` ADD CONSTRAINT `members_meeting_mapping_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members_meeting_mapping` ADD CONSTRAINT `members_meeting_mapping_ibfk_2` FOREIGN KEY (`meetingId`) REFERENCES `meetings`(`meetingId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members_meeting_mapping` ADD CONSTRAINT `members_meeting_mapping_ibfk_3` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`transactionId`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification_campaigns` ADD CONSTRAINT `notification_campaigns_ibfk_1` FOREIGN KEY (`templateId`) REFERENCES `notification_templates`(`templateId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification_campaigns` ADD CONSTRAINT `notification_campaigns_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification_templates` ADD CONSTRAINT `notification_templates_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`recipientId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`senderId`) REFERENCES `members`(`memberId`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `otp_verifications` ADD CONSTRAINT `otp_verifications_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `push_subscriptions` ADD CONSTRAINT `push_subscriptions_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `qrreceivers` ADD CONSTRAINT `qrreceivers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members`(`memberId`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `qrreceivers` ADD CONSTRAINT `qrreceivers_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`chapterId`) ON DELETE CASCADE ON UPDATE NO ACTION;
