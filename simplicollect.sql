-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 20, 2024 at 06:17 AM
-- Server version: 8.0.36
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simplicollect`
--

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `chapterId` varchar(255) NOT NULL,
  `chapterName` varchar(255) NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `meetingDay` varchar(255) DEFAULT NULL,
  `meetingPeriodicity` enum('weekly','fortnightly','monthly','bi-monthly','quaterly','6-monthly','yearly') NOT NULL,
  `meetingPaymentType` set('weekly','monthly','quarterly') NOT NULL,
  `visitorPerMeetingFee` decimal(10,2) NOT NULL,
  `weeklyFee` decimal(10,2) DEFAULT NULL,
  `monthlyFee` decimal(10,2) DEFAULT NULL,
  `quarterlyFee` decimal(10,2) DEFAULT NULL,
  `chapterSlug` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`chapterId`, `chapterName`, `region`, `city`, `state`, `country`, `meetingDay`, `meetingPeriodicity`, `meetingPaymentType`, `visitorPerMeetingFee`, `weeklyFee`, `monthlyFee`, `quarterlyFee`, `chapterSlug`) VALUES
('1', 'Fortune', 'Pune East', 'Pune', 'Maharashtra', 'India', 'Friday', 'weekly', 'monthly', 500.00, NULL, NULL, NULL, 'fortune-pune-east');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `memberId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `chapterId` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`memberId`, `firstName`, `lastName`, `phoneNumber`, `email`, `password`, `chapterId`, `role`) VALUES
('1', 'Rishikesh', 'Bagade', '1234567890', 'rishikesh.bagade@gmail.com', '$2a$10$MUcAtSgHW.0VxIa794PRhevN7Nhmqr3zARwEm/hCGH5y2JwETT4aa', '1', 'president');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` varchar(255) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  `roleDescription` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `visitorfollowups`
--

CREATE TABLE `visitorfollowups` (
  `followUpId` int NOT NULL,
  `visitorId` varchar(255) NOT NULL,
  `followUpMemberId` int NOT NULL,
  `followUpDate` date NOT NULL,
  `followUpTime` time NOT NULL,
  `followUpMode` enum('call','message','email','inPerson') NOT NULL,
  `followUpNotes` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `visitorId` varchar(255) NOT NULL,
  `invitedBy` varchar(255) NOT NULL,
  `chapterVisitDate` date NOT NULL,
  `heardAboutBni` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `classification` varchar(255) DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `mobileNumber` varchar(20) NOT NULL,
  `feedbackScore` int DEFAULT NULL,
  `feedbackComments` text,
  `nextStep` varchar(255) DEFAULT NULL,
  `arrivalTime` time DEFAULT NULL,
  `feelWelcome` tinyint(1) DEFAULT NULL,
  `visitedBniBefore` tinyint(1) DEFAULT NULL,
  `referralGroup` tinyint(1) DEFAULT NULL,
  `referralGroupExperience` text,
  `eoiFilled` tinyint(1) DEFAULT '0',
  `visitorStatus` enum('Approved','Preapproved','Declined') DEFAULT 'Preapproved',
  `chapterId` varchar(255) NOT NULL,
  `paymentAcceptedMemberId` varchar(255) DEFAULT NULL,
  `assignedMemberId` varchar(255) DEFAULT NULL,
  `paymentImageLink` varchar(255) DEFAULT NULL,
  `paymentAmount` decimal(10,2) DEFAULT NULL,
  `paymentRecordedDate` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`visitorId`, `invitedBy`, `chapterVisitDate`, `heardAboutBni`, `firstName`, `lastName`, `companyName`, `classification`, `industry`, `email`, `mobileNumber`, `feedbackScore`, `feedbackComments`, `nextStep`, `arrivalTime`, `feelWelcome`, `visitedBniBefore`, `referralGroup`, `referralGroupExperience`, `eoiFilled`, `visitorStatus`, `chapterId`, `paymentAcceptedMemberId`, `assignedMemberId`, `paymentImageLink`, `paymentAmount`, `paymentRecordedDate`, `createdAt`) VALUES
('30615248-7eb7-4db7-91a0-5135af844a3b', 'Mayur', '2024-11-15', 'Business Associate', 'Manoj', 'Agarwal', 'ST', 'Architect', 'IT', 'manoj@gmail.com', '9975570005', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', '1', '1', '1', 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/9121cd24-71b1-44ec-b241-4c686e428240.jpg', NULL, '2024-11-19 22:12:29', '2024-11-14 07:36:14'),
('baca9a65-52b5-4f12-99de-a07902e3dbbb', 'Mayur', '2024-11-21', 'Business Associate', 'Kirti', 'Agarwal', 'Simplium', 'SD', 'IT', 'kirti@gmail.com', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', '1', '1', NULL, NULL, NULL, '2024-11-19 22:42:53', '2024-11-19 22:41:44'),
('e6dd18e3-0e0e-404b-96a0-6209c4b076d3', 'Manoj', '2024-11-04', 'Social Media', 'Mayur', 'Agarwal', 'my comp', 'SD', 'IT', 'mayur@gmail.com', '9921318237', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', '1', '1', '1', NULL, 0.00, '2024-11-19 22:16:29', '2024-11-14 07:16:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`chapterId`),
  ADD UNIQUE KEY `chapterSlug` (`chapterSlug`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `phoneNumber` (`phoneNumber`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `visitorfollowups`
--
ALTER TABLE `visitorfollowups`
  ADD PRIMARY KEY (`followUpId`),
  ADD KEY `visitorId` (`visitorId`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`visitorId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `mobileNumber` (`mobileNumber`),
  ADD KEY `chapterId` (`chapterId`),
  ADD KEY `paymentAcceptedMemberId` (`paymentAcceptedMemberId`),
  ADD KEY `assignedMemberId` (`assignedMemberId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `visitorfollowups`
--
ALTER TABLE `visitorfollowups`
  MODIFY `followUpId` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `visitorfollowups`
--
ALTER TABLE `visitorfollowups`
  ADD CONSTRAINT `visitorfollowups_ibfk_1` FOREIGN KEY (`visitorId`) REFERENCES `visitors` (`visitorId`) ON DELETE CASCADE;

--
-- Constraints for table `visitors`
--
ALTER TABLE `visitors`
  ADD CONSTRAINT `visitors_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE,
  ADD CONSTRAINT `visitors_ibfk_2` FOREIGN KEY (`paymentAcceptedMemberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE,
  ADD CONSTRAINT `visitors_ibfk_3` FOREIGN KEY (`assignedMemberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
