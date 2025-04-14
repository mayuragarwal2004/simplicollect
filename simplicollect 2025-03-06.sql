-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 06, 2025 at 02:47 PM
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
-- Table structure for table `cashreceivers`
--

CREATE TABLE `cashreceivers` (
  `cashRecieverId` varchar(255) NOT NULL,
  `cashRecieverName` varchar(255) NOT NULL,
  `memberId` varchar(255) NOT NULL,
  `chapterId` varchar(255) NOT NULL,
  `enableDate` date DEFAULT NULL,
  `disableDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cashreceivers`
--

INSERT INTO `cashreceivers` (`cashRecieverId`, `cashRecieverName`, `memberId`, `chapterId`, `enableDate`, `disableDate`) VALUES
('61863305-98d6-45cc-a1c7-eb9659c4dfd0', 'Ruturaj Shinde', 'ergioheohjgbiehjgbdl', '1', '2025-01-01', '2025-04-30'),
('7f0c77d5-6e5c-4714-9878-d8104d255e99', 'Sejal Palrecha', 'esxrdtcfhvjbgjkjbghvfcvgjbl', '1', '2025-01-01', '2025-04-30');

-- --------------------------------------------------------

--
-- Table structure for table `chapterlog`
--

CREATE TABLE `chapterlog` (
  `logId` varchar(255) NOT NULL,
  `chapterId` varchar(255) NOT NULL,
  `logDate` date NOT NULL,
  `logDescription` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `chapterId` varchar(255) NOT NULL,
  `chapterName` varchar(255) NOT NULL,
  `chapterSlug` varchar(255) NOT NULL,
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
  `organisationId` varchar(255) NOT NULL,
  `testMode` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`chapterId`, `chapterName`, `chapterSlug`, `region`, `city`, `state`, `country`, `meetingDay`, `meetingPeriodicity`, `meetingPaymentType`, `visitorPerMeetingFee`, `weeklyFee`, `monthlyFee`, `quarterlyFee`, `organisationId`, `testMode`) VALUES
('1', 'Fortune', 'fortune-pune-east', 'Pune East', 'Pune', 'Maharashtra', 'India', 'Friday', 'weekly', 'monthly', 700.00, NULL, NULL, NULL, 'org1', 0),
('kdjvfbfdkbfvhbdj', 'PCMC', 'pcmc-abc-pune', 'ABC Pune', 'Pune', 'Maharashtra', 'India', NULL, 'weekly', 'weekly', 0.00, 0.00, 0.00, 0.00, 'org1', 0),
('ouhiuhuhuipiouytfchvjhlo', 'ABC', 'ABC-Central-Pune', 'Central-Pune', 'Pune', 'Maharashtra', 'India', 'Tuesday', 'weekly', 'monthly', 800.00, NULL, NULL, NULL, 'org1', 0);

-- --------------------------------------------------------

--
-- Table structure for table `featuresmaster`
--

CREATE TABLE `featuresmaster` (
  `featureId` varchar(255) NOT NULL,
  `featureName` varchar(255) NOT NULL,
  `featureDescription` text,
  `featureType` varchar(255) DEFAULT NULL,
  `featureParent` varchar(255) DEFAULT NULL,
  `featureUrl` varchar(255) DEFAULT NULL,
  `featureIcon` varchar(255) DEFAULT NULL,
  `featureOrder` bigint DEFAULT NULL,
  `featureDisabled` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `featuresmaster`
--

INSERT INTO `featuresmaster` (`featureId`, `featureName`, `featureDescription`, `featureType`, `featureParent`, `featureUrl`, `featureIcon`, `featureOrder`, `featureDisabled`) VALUES
('approve_global_fee', 'Approve Global Fee Requests', 'Approve anyones fee request', 'approve_my_fee', '', '', '', 0, 0),
('approve_my_fee', 'Approve Fee Requests', 'Approve My Fee Requests', 'menu', 'Fee Requests', '/member/fee_approval', 'Money', 3, 0),
('chapter_settings', 'Chapter Settings', 'Chapter Settings', 'menu', 'Settings', '/member/chapter-settings', 'Users', 1, 0),
('fee_reciver_edit', 'Fee Reciver Edit', 'Fee Reciver Edit', 'menu', 'Settings', '/member/fee-reciver-edit', 'HandCoins', 2, 0),
('member_fees', 'Member Fees', 'Member Fees', 'menu', 'Members', '/member/fee', 'Users', 1, 0),
('member_list', 'Member List', 'Member List', 'menu', 'Members', '/member/list', 'Users', 2, 0),
('perosnal_profile', 'Profile', 'Profile', 'menu', 'Profile', '/profile', 'Users', 3, 0),
('visitor_approval_list', 'Visitor Approval List', 'Visitor Approval List', 'menu', 'Visitors', '/visitor/list', 'Users', 1, 0),
('visitor_reports', 'Visitor Reports', 'Visitor Reports', 'menu', 'Visitors', '/visitor-reports', 'Users', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `meetingId` varchar(255) NOT NULL,
  `chapterId` varchar(255) NOT NULL,
  `meetingName` varchar(255) NOT NULL,
  `meetingDate` date NOT NULL,
  `meetingTime` varchar(255) NOT NULL,
  `meetingFeeMembers` bigint DEFAULT NULL,
  `meetingFeeVisitors` bigint DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`meetingId`, `chapterId`, `meetingName`, `meetingDate`, `meetingTime`, `meetingFeeMembers`, `meetingFeeVisitors`, `disabled`) VALUES
('svijnvi1', '1', 'Meeting 1', '2025-01-03', '10:00', 950, 1000, 0),
('svijnvi10', '1', 'Meeting 10', '2025-03-07', '10:00', 950, 1000, 0),
('svijnvi11', '1', 'Meeting 11', '2025-03-14', '10:00', 950, 1000, 0),
('svijnvi12', '1', 'Meeting 12', '2025-03-21', '10:00', 950, 1000, 0),
('svijnvi13', '1', 'Meeting 13', '2025-03-28', '10:00', 950, 1000, 0),
('svijnvi14', '1', 'Meeting 14', '2025-04-04', '10:00', 950, 1000, 0),
('svijnvi15', '1', 'Meeting 15', '2025-04-11', '10:00', 950, 1000, 0),
('svijnvi16', '1', 'Meeting 16', '2025-04-18', '10:00', 950, 1000, 0),
('svijnvi17', '1', 'Meeting 17', '2025-04-25', '10:00', 950, 1000, 0),
('svijnvi18', '1', 'Meeting 18', '2025-05-02', '10:00', 950, 1000, 0),
('svijnvi19', '1', 'Meeting 19', '2025-05-09', '10:00', 950, 1000, 0),
('svijnvi2', '1', 'Meeting 2', '2025-01-10', '10:00', 950, 1000, 0),
('svijnvi20', '1', 'Meeting 20', '2025-05-16', '10:00', 950, 1000, 0),
('svijnvi21', '1', 'Meeting 21', '2025-05-23', '10:00', 950, 1000, 0),
('svijnvi22', '1', 'Meeting 22', '2025-05-30', '10:00', 950, 1000, 0),
('svijnvi3', '1', 'Meeting 3', '2025-01-17', '10:00', 950, 1000, 0),
('svijnvi4', '1', 'Meeting 4', '2025-01-24', '10:00', 950, 1000, 0),
('svijnvi5', '1', 'Meeting 5', '2025-01-31', '10:00', 950, 1000, 0),
('svijnvi6', '1', 'Meeting 6', '2025-02-07', '10:00', 950, 1000, 0),
('svijnvi7', '1', 'Meeting 7', '2025-02-14', '10:00', 950, 1000, 0),
('svijnvi8', '1', 'Meeting 8', '2025-02-21', '10:00', 950, 1000, 0),
('svijnvi9', '1', 'Meeting 9', '2025-02-28', '10:00', 950, 1000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `memberchaptermapping`
--

CREATE TABLE `memberchaptermapping` (
  `memberId` varchar(255) NOT NULL,
  `chapterId` varchar(255) NOT NULL,
  `roleId` varchar(255) DEFAULT NULL,
  `due` bigint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `memberchaptermapping`
--

INSERT INTO `memberchaptermapping` (`memberId`, `chapterId`, `roleId`, `due`) VALUES
('00ab1826-2f42-45bf-93ba-48f7630643b3', '1', '6', 0),
('00f8530f-beef-46a8-8c7e-46cdb0fee931', '1', '6', 0),
('01e54255-6531-4784-9305-6aff8eb6aac2', '1', '6', 0),
('026b9428-ebcb-478e-9a86-3eebce58d100', '1', '6', 0),
('02b4b816-0d75-4fa5-b956-69494c699e51', '1', '6', 0),
('0523a517-07fa-4022-838f-8f404e29962c', '1', '6', 0),
('059b4163-157f-476e-b16c-d136cb855861', '1', '6', 0),
('06aa9742-cf32-4abf-8f9a-131c788323b7', '1', '6', 0),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', '1', '6', 0),
('0a249dc1-b121-4142-894c-acb6138971ca', '1', '6', 0),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', '1', '6', 0),
('0e9468c4-b81c-4003-8559-34356fa354b9', '1', '6', 0),
('1', '1', '1', 0),
('1602210b-32bf-4101-9f3d-07474a969729', '1', '6', 0),
('1692338e-d74a-49cf-adec-4db406a27d6f', '1', '6', 0),
('17070e27-c48b-41c8-9743-57e8b737b693', '1', '6', 0),
('1dde0c4f-b39e-437b-9489-455956a3831c', '1', '6', 0),
('1ff5ea10-3e23-486f-840b-49453f18fa09', '1', '6', 0),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', '1', '6', 0),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', '1', '6', 0),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', '1', '6', 0),
('334d6ff0-419e-448d-a931-69157b4181cc', '1', '6', 0),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', '1', '6', 0),
('3c137385-d802-499a-8ed1-ec5f85d7e0a7', 'ouhiuhuhuipiouytfchvjhlo', 'abc_central_1', 0),
('3ce2f6da-aa3e-45cf-863d-95edba591c09', '1', '6', 0),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', '1', '6', 0),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', '1', '6', 0),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', '1', '6', 0),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', '1', '6', 0),
('447a16ba-e611-488f-b021-cba4dd23b61f', '1', '6', 0),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', '1', '6', 0),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', '1', '6', 0),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', '1', '6', 0),
('52623b2a-0c4c-4310-a541-110283d5b1a0', '1', '6', 0),
('55793941-87a3-4308-aa60-5204d7f5bce0', '1', '6', 0),
('5de38232-608a-4c6f-b3e7-3a0d94f74e3d', '1', '6', 0),
('6206a853-19dc-4994-8c13-92d1b879189a', '1', '6', 0),
('6311bc70-2384-4fb9-a814-a38c1293979a', '1', '6', 0),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', '1', '6', 0),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', '1', '6', 0),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', '1', '6', 0),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', '1', '6', 0),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', '1', '6', 0),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', '1', '6', 0),
('6a337dfd-2c4f-4ea1-8691-76b7b6c84d22', '1', '6', 0),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', '1', '6', 0),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', '1', '6', 0),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', '1', '6', 0),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', '1', '6', 0),
('72deef6b-593e-4496-be5f-862c8880890d', '1', '6', 0),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', '1', '6', 0),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', '1', '6', 0),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', '1', '6', 0),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', '1', '6', 0),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', '1', '6', 0),
('81e182e0-86c1-4c59-9869-59e7d7358162', '1', '6', 0),
('820b077a-c55e-4560-9422-9360d9e805df', '1', '6', 0),
('83612c1c-e327-4e32-900c-868998118784', '1', '6', 0),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', '1', '6', 0),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', '1', '6', 0),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', '1', '6', 0),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', '1', '6', 0),
('8da4ea58-e93f-4308-ba6f-10915b4ab1bf', 'ouhiuhuhuipiouytfchvjhlo', 'abc_central_1', 0),
('9183592e-d2eb-442e-a365-88d0a3480e8f', '1', '6', 0),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', '1', '6', 0),
('9528a4de-1f54-4766-861c-72e419e00873', '1', '6', 0),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', '1', '6', 0),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', '1', '2', 0),
('95f622eb-ef7b-409e-9d27-687bb923da00', '1', '6', 0),
('9710f5b7-eaca-4506-bce6-1574806012a9', '1', '6', 0),
('987d78c5-580d-4418-8393-802e73f84cae', '1', '6', 0),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', '1', '6', 0),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', '1', '6', 0),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', '1', '6', 0),
('a188c27f-1ce0-4392-aa6a-dcab5392c346', '1', '6', 0),
('a2089c98-330c-4aff-84ca-ebcad9efb930', '1', '6', 0),
('a2912248-8efc-4d69-be33-8c79b3a27c53', '1', '6', 0),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', '1', '6', 0),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', '1', '6', 0),
('a56d576b-b1c1-4c3a-a536-55507759cd07', '1', '6', 0),
('a59979b0-bcbf-4f43-896d-a798113f22ff', '1', '6', 0),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', '1', '6', 0),
('a6b6e35f-774a-43bb-a399-3a2882094d40', '1', '6', 0),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', '1', '6', 0),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', '1', '6', 0),
('ad59a189-e748-455e-a2dd-29ac2f33f941', '1', '6', 0),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', '1', '6', 0),
('b1a44181-b358-4bdd-a1be-17b860089004', '1', '6', 0),
('b283a17c-d800-4039-afd0-aa7e08807bbf', '1', '6', 0),
('b4689a30-0f44-423a-926f-3f7dd5f22154', '1', '6', 0),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', '1', '6', 0),
('b7fc1185-3874-4183-af99-0e4824bd1021', '1', '6', 0),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', '1', '6', 0),
('c8da3084-16b0-4756-8aa7-ed818461be0d', '1', '6', 0),
('ca16fd50-713a-420d-8c1d-e2a964917d67', '1', '6', 0),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', '1', '6', 0),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', '1', '6', 0),
('d1915bae-b021-41ab-96f8-4f08733167b6', '1', '6', 0),
('d5418c26-2c36-4f50-b099-8d593565be82', '1', '6', 0),
('d5a002ef-9d33-40c5-b61f-1e081272e912', '1', '6', 0),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', '1', '6', 0),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', '1', '6', 0),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', '1', '6', 0),
('e5af84c8-9bdd-4553-b086-9340fb38678b', '1', '6', 0),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', '1', '6', 0),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', '1', '6', 0),
('ecb9ed73-8859-48e2-ab39-35721c66c336', '1', '6', 0),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', '1', '6', 0),
('ef63856f-bde1-4c09-a064-3d4b94942352', '1', '6', 0),
('efvelvhubrerikbjv', '1', '1', 0),
('efvelvhubrerikbjv', 'ouhiuhuhuipiouytfchvjhlo', 'abc_central_1', 0),
('ekgvrjennivrnnienbiv', 'kdjvfbfdkbfvhbdj', NULL, 0),
('eofuvheuihivehuuhbvhsh', 'kdjvfbfdkbfvhbdj', NULL, 0),
('ergioheohjgbiehjgbdl', '1', '2', 0),
('esxrdtcfhvjbgjkjbghvfcvgjbl', '1', '4', 0),
('ewrewavjkhsbjkvbersykuv', 'kdjvfbfdkbfvhbdj', NULL, 0),
('f06ed5c8-4fe1-4623-8608-ef8fdf85233f', '1', '6', 0),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', '1', '6', 0),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', '1', '6', 0),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', '1', '6', 0),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', '1', '6', 0),
('f531f39c-389f-4eb0-817f-7c856c247e3c', '1', '6', 0),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', '1', '6', 0),
('fa2b6733-382f-4997-b61a-a5647d99b58d', '1', '6', 0),
('fbe36553-e184-48b0-956a-d1e91eece826', '1', '6', 0),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', '1', '6', 0),
('wgfvekfugrvheuguik', '1', '7', 0),
('wolrgvfhurdihingrit', 'kdjvfbfdkbfvhbdj', NULL, 0),
('yrdfgvubisufdvnuidjn', 'ouhiuhuhuipiouytfchvjhlo', 'abc_central_1', 0);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `memberId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `superAdmin` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`memberId`, `firstName`, `lastName`, `phoneNumber`, `email`, `password`, `role`, `superAdmin`) VALUES
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'Mohan', 'Ranade', '9822025243', NULL, '$2b$12$1ABHNajyVJbqtZdyqbrrvOElysYT/CBMkf1fCeJ1H04p01f1OGb1a', NULL, 0),
('00f8530f-beef-46a8-8c7e-46cdb0fee931', 'Arjun', 'Sagar', '8888372249', NULL, '$2b$12$xUdP1eDsXphv6jXde4TKYuOmAjuUChrHRqRA8FHu5.mlzZYJ0Pdlu', NULL, 0),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'Shrikaysh', 'Kotwal', '9960613509', NULL, '$2b$12$zXO7Vq8Zsqlq1EkX6ZLJ6eiFkeEhd4Y7KEQefbiUd1XzEwSWOebea', NULL, 0),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'Sunil', 'Mahindrakar', '9422301248', NULL, '$2b$12$090L8f0eKInqUR49.By1hOJ0PnjlFDjD3jp6yCvE0wQvT7E1sZ9ru', NULL, 0),
('02b4b816-0d75-4fa5-b956-69494c699e51', 'Bhumik', 'Soni', '9049572221', NULL, '$2b$12$5Nsv0Kl9CArmy2UH.BMkS.6BJHMY.OaenE7yPBvXAvHSOyGS3H5lC', NULL, 0),
('0523a517-07fa-4022-838f-8f404e29962c', 'Shardul', 'Kulkarni', '9822019161', NULL, '$2b$12$p/WcTz.f6k0iFZ0SqZuHMuzwT.zBWR0aCIi0sNqoVZXeN1Fvy8Qyq', NULL, 0),
('059b4163-157f-476e-b16c-d136cb855861', 'Ulka', 'Saranjame', '9765749323', NULL, '$2b$12$kqeFDxWEaqO81pDyPUAiv.tGGjB3Yil/FG55124BnHUjF7PeKBbvW', NULL, 0),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'Shalak', 'Shah', '9850008020', NULL, '$2b$12$zNNPPzfvunGX/4CCJ/1.Pep91b56cio1rRigjDv7YnPHBgAurTEa2', NULL, 0),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'Suyash', 'Karamchandani', '9970800807', NULL, '$2b$12$Jq5WIwjDnB2gqPrOgIY11u4RFBHNGm1zjd/3jSJge6fjW0a3UkHVe', NULL, 0),
('0a249dc1-b121-4142-894c-acb6138971ca', 'Nilesh', 'Gothi', '9881123224', NULL, '$2b$12$2fLfCMffP6OfK7.Zft8gZONNmGWaEP9A.YCErl3JTBWRUsWyuIlxS', NULL, 0),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'Ranjan', 'Paradkar', '8087699949', NULL, '$2b$12$dEpkcFd5ockeihDWZevWHusGCo4s3wXBkT3VoOfJp5.Yn3dMQWpVO', NULL, 0),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'Pankajsingh', 'Pardeshi', '7066531266', NULL, '$2b$12$.7tpAmHa8eI98C/aupi6J.UdsQ7a1vq0Q7wmGRO9YBhNbcy/sFwsi', NULL, 0),
('1', 'Rishikesh', 'Bagade', '9011048231', 'rishikesh@4thaxisgroup.com', '$2a$10$z8F9M4n7hqrv1UOD80QSqOFeaVYTfpzvl/uHYhKgQWnXqKQmbWHiC', 'president', 0),
('1602210b-32bf-4101-9f3d-07474a969729', 'Jitendra', 'Sirsikar', '8446703444', NULL, '$2b$12$cE4pBwFfLroQPU11m0/7Hu5BzxXZUnDPXczhgEhMQyw4qSHQAB5Uq', NULL, 0),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'Reena', 'Madanal', '8600533379', NULL, '$2b$12$XyWPuXmKZa52s58J1JXPKujP4GsUXYJiUS1Lp25zZrfX.7id9uT7e', NULL, 0),
('17070e27-c48b-41c8-9743-57e8b737b693', 'Siddhath', 'Dr. Mehta', '8237723391', NULL, '$2b$12$Vwn3Hq/Mb9rGJJnFqPCLDuoa1u/QlMVJz9PIP6zMtWZYSeGMXiPmK', NULL, 0),
('1dde0c4f-b39e-437b-9489-455956a3831c', 'Sachin', 'Shete', '8482977711', NULL, '$2b$12$LxiODY6Dar/YGIH6YFkcCOlUzxRnrDvMJjXUa09hyLvqX.hzCkh2u', NULL, 0),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'Nikit', 'Oswal', '8055638666', NULL, '$2b$12$9/L.7H/2nJmP96zB2yK6KOwqM0LUJRBOLYGzcV2XoRPM.I/AsB2NC', NULL, 0),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'Sachin', 'Naikade', '7020542996', NULL, '$2b$12$xJ/7oDfoM4PREn3B6Dnr6O7.FzmRWtMvpsUDFx0lGRAmWp3J8tjxy', NULL, 0),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'Deepak', 'Jain', '9689159338', NULL, '$2b$12$iB9inZl3rYiTrf2wlYyA7uEmwuMlbWBv4NueOf44cZbrfLj9WW3em', NULL, 0),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'Arati', 'Joshi', '9022353559', NULL, '$2b$12$6Pimj9ZW8flamqvefUUBF.dFtzNG947mRpqYj6AK0TWq6IKFwMa5.', NULL, 0),
('334d6ff0-419e-448d-a931-69157b4181cc', 'Ashok', 'Shinde', '9960205843', NULL, '$2b$12$KrZgAEJ/nj/d2CaoleCh/eO9AeKGoeKZh8TrjSbzqc851.bjoVJjW', NULL, 0),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'Bapu', 'Mhaske', '9850608103', NULL, '$2b$12$hux41iyZhijfqQlL6//DYe2Dk/yJ0x5ol5e8GKfIeuM4v..zWsQLq', NULL, 0),
('3c137385-d802-499a-8ed1-ec5f85d7e0a7', 'Ashish', 'Agarwal', '8421300400', NULL, '$2b$12$1LtPk6m29hsaioo8zTFxXeu8s4cKvyL.HU1oBmKPP9xzJVyz7s.Y.', NULL, 0),
('3ce2f6da-aa3e-45cf-863d-95edba591c09', 'Vidyesh', 'Totares', '8956930400', NULL, '$2b$12$KX96vaXaVKGBfmS2SCRMx.noLXkBK53ig/qlfc0P8ogRguIMHZ7Fu', NULL, 0),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'Uday', 'Waghmare', '9284858506', NULL, '$2b$12$lr71.86QrzhTC5KfQ7b0euc.y2xibV9wra7OrCxauPeLPWZax0Fpi', NULL, 0),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'Ajinkya', 'Bedarkar', '8329721622', NULL, '$2b$12$99ZAN7KqPLj4ZZ0JXbUGJ.n4N7I7VgX1CpepbwVVPWsjneOl7IxCK', NULL, 0),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'Nilesh', 'Jadhav', '9850226699', NULL, '$2b$12$AiZcgu9i4jjyYHl8OX2jhu4vROeEMFrVkj2CurskPCo30Xf6y0LCy', NULL, 0),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'Yash', 'Adbe', '9623367518', NULL, '$2b$12$QxyplUGKnUv.xNrotfU6U.RXFiGAdlfQGQ3vDx3XZR4I4MsRek2YO', NULL, 0),
('447a16ba-e611-488f-b021-cba4dd23b61f', 'Aishwarya', 'Khade', '8007305218', NULL, '$2b$12$s6XgEoLJB7TfWH1Pp01ROeq9fOidDbsxw6aZsn9TIGeqjHUduLAYu', NULL, 0),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'Sangram', 'Patil', '9423035852', NULL, '$2b$12$cnWEzRmMdmSoeJHBzeYgc.gJGCOa5amU50urqvYRijyK8iQq2CyLK', NULL, 0),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'Sanket', 'Kothari', '8446652116', NULL, '$2b$12$dyfPImwSmXrJESzwFM3MJ.azJPeLX/ChLYJSuboDBhWTfPKDCgFIS', NULL, 0),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'Sujay', 'Bagmar', '7722088988', NULL, '$2b$12$por9EGxKkW9RcpHeKIVKqu2ssQaKrMOwpnMKsYDo1j1J3exsN5N.q', NULL, 0),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'Anil', 'Joshi', '9822011674', NULL, '$2b$12$qJmSPxqRxRBBPW7e8ACAWOWiVSNmLHhW1QL/FYc1oAM0Qi5v.vw9i', NULL, 0),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'Anurag', 'Dalal', '9822090930', NULL, '$2b$12$rjbXrZVvU1isU7vwFxOa1.HGTRz7fc5gEWQZaKY443PoG/NNKDKea', NULL, 0),
('5de38232-608a-4c6f-b3e7-3a0d94f74e3d', 'Darshana', 'Janbandhu', '9987880204', NULL, '$2b$12$jL7FSzKFIYmqy4SK1/aWWu.qc7OXMYlNtaraf/AaZY946UgafuB0W', NULL, 0),
('6206a853-19dc-4994-8c13-92d1b879189a', 'Dr.', 'Dilip Kulkarni', '9011696965', NULL, '$2b$12$mvHyGl2vEXs3s/UEDUHpuOvSzEtEhMw0NBXOEDiY6WW2VjDuHqc3S', NULL, 0),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'Mahesh', 'Gokhale', '9823144707', NULL, '$2b$12$F1WqkrU5F7gi5gVqw5RSiOftQ8JwpJJuUCCr/0oVhqFFn9Yp7MHKS', NULL, 0),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', 'Rohan', 'Malunjkar', '9595947733', NULL, '$2b$12$EJPmfFDj8qBReTl/Q7hVMudKKc95RwTKSbJpE1B21ceO/6VkTUP/i', NULL, 0),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'Bhalchandra', 'Kulkarni', '9881909761', NULL, '$2b$12$qMMzN5Ih2u772zFXbuWp9.L0YNkLRN2Kmu/qHE7c4ERmYFAcWgsGO', NULL, 0),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'Raghvendra', 'Patil', '9765409999', NULL, '$2b$12$XGr1.9hl8kbX1yC.gVTvG.n0dq/Rt9t5.FWZGx4WYM5eDOyQGLyUi', NULL, 0),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'Amit', 'Shitole', '9595367272', NULL, '$2b$12$cRzIVd4nYulAD1P2pRfz8.IDQCvU6bfJXnYP1/h79ouM/ZngkFqUe', NULL, 0),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'Milind', 'Lokare', '9225500544', NULL, '$2b$12$69LiumuGE8pkPtiXxhrpDu7yrcsKTFxFodQ22PuBi6PvDDlTnto8O', NULL, 0),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'Aashay', 'Kamble', '9975670379', NULL, '$2b$12$BHxUurv7l2yZ7w8Uoafwp.P1JrvRjiozzv8QiahZvxmIV73ZjWxWO', NULL, 0),
('6a337dfd-2c4f-4ea1-8691-76b7b6c84d22', 'Abhishek', 'Kalyana', '9011834840', NULL, '$2b$12$TCsjJay1c9xfz7oVkCKm4OoaANZi7WdWI7YLfjhYsAe.bAlh.uKCW', NULL, 0),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', 'Ritu', 'Dalal', '7887889079', NULL, '$2b$12$tFBvCqaWbRpf6VnI9QV1DOrab4h8SA9LyE4RIPz6OPlYBjAsW3WXa', NULL, 0),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'Manish', 'Muleva', '7798915353', NULL, '$2b$12$MyjQnbx3AYH1p6odXUpe1ePTv6vU5EZLIPn0whtfxWyIQdTJTt8Xi', NULL, 0),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'Satish', 'Nage', '9881423337', NULL, '$2b$12$e8Je22O8M/nyOd/qA5j9PeGzogxmIiWwNQpWADxKOysNdeVK/xGyq', NULL, 0),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'Amaresh', 'Musale', '9011059050', NULL, '$2b$12$WJTBBJY1GS7LWDucd9Z8je4lezEavM.1utwWPuel1xlkmuB0WEJxa', NULL, 0),
('72deef6b-593e-4496-be5f-862c8880890d', 'Anjali', 'Kulkarni', '9822658896', NULL, '$2b$12$yt2.HNgF/KfVAWGNJahATeGnhgL6.g0mtoPUk7VUfeoiYEVHjkAyq', NULL, 0),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'Dinesh', 'Khandelwal', '9414373475', NULL, '$2b$12$s0OVmxHTwDPG3Ci2vqq7y.aciTw/ZcT0S/i2Dy.JIUa3J.0uuyNZe', NULL, 0),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', 'Abhijit', 'Mhasawade', '9561090413', NULL, '$2b$12$idKChwY7MFgVerveOn8rouCPiFhNgj9VhI.bJx2LiRHNgRTFzaaDS', NULL, 0),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', 'Atharva', 'Ulangwar', '8551019161', NULL, '$2b$12$wBNAhCJnC/i35GQT.G2bzeRE9iPrC0Vc1/rmr56/ROPjy3Zp3xcDa', NULL, 0),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', 'Omkar', 'Jadhav', '9545892789', NULL, '$2b$12$OfCUwE5uIbFFC4tHRuAoj.0rGu8LlWSI3edYFfTrue0tI4miTyjzi', NULL, 0),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'Shubham', 'Patil', '7588580177', NULL, '$2b$12$W1kFBTtu.Vj2Q4uoI5mynOTig9Eb3p2qSS7HFfVbXHQPDBGJB5kvi', NULL, 0),
('81e182e0-86c1-4c59-9869-59e7d7358162', 'Ashok', 'Alurkar', '8055769965', NULL, '$2b$12$TxJo4x5R1617iuThKryihO4GLiYzjTCkpwepcOOzq9Gc7HVwr5ace', NULL, 0),
('820b077a-c55e-4560-9422-9360d9e805df', 'Aniket', 'Dandekar', '9823084532', NULL, '$2b$12$tIw1c1yIIG6R1cP8r01jBeaEQ/toenhjkkHkoAnG8oAKoeDxDWSOa', NULL, 0),
('83612c1c-e327-4e32-900c-868998118784', 'B', 'Rajkumar', '9822649809', NULL, '$2b$12$ybZnQltHQl8UuOROhdD.5.VdiS5x5yFQfVkw1aQ6iazP8c2fh/MAW', NULL, 0),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', 'Tanmay', 'Kunjir', '9405821147', NULL, '$2b$12$nTXZi3b2dwZ8A40N8hDPl.3P9O21z2Gfp.iLrjxajCPq6/7AXviBK', NULL, 0),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'Niranjan', 'Patil', '8888668811', NULL, '$2b$12$gW22e9.tBqiaojJbS1Z6j.jZNO2n8N2YFTjGB52vm5ZvvDpSA9GpO', NULL, 0),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'Deepak', 'Akhade', '7620518961', NULL, '$2b$12$HFaQH4FwJVh9aOUJbxnseeBFheO.kLRCh4CKwGgAocoagQCIwx/zW', NULL, 0),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'Bharat', 'Gurav', '9422505310', NULL, '$2b$12$OrHmBvlfBsxsaHti2t7zuez2PyvhyXyTHdVKZo.GRbBsoXzMtlXWK', NULL, 0),
('8da4ea58-e93f-4308-ba6f-10915b4ab1bf', 'Deepak', 'Bansal', '9209094001', NULL, '$2b$12$Rg2/jHLYZZZZP6dxOL/meenfzqGRE7Cj8p3qwqEUnFswRPcY1J9zW', NULL, 0),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'Manoj', 'Gore', '9823277002', NULL, '$2b$12$lVfff..Hnp9SwVIKwlwc4ubgqD6wsb1lTI7XMcTmO7X7WESHfuOky', NULL, 0),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'Ashish', 'Kulkarni', '7066743873', NULL, '$2b$12$E7/90kDN5yrJd4O7ZPJ7JOIppX/f8B4dsTzY4we4RMzTF68ySsGMO', NULL, 0),
('9528a4de-1f54-4766-861c-72e419e00873', 'Jayshree', 'Panjikar', '9822286288', NULL, '$2b$12$XAOgH3b8sufSpfnkmVKyWeZQneJnrxHN1o73U7wWd7yiqpQsSjsmS', NULL, 0),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'Ajay', 'Wagh', '9890286817', NULL, '$2b$12$wiaN3CwKqyYSsEFMxJzREeRnUWhQRGgiPRtgfYHRejkxTR3fM9hfi', NULL, 0),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'Hamid', 'Shaikh', '9075076075', NULL, '$2b$12$IwAq28fTmRxafic5Uvec/OspfhsuhFoTFtj/5L/k6DNpul/KldeLC', NULL, 0),
('95f622eb-ef7b-409e-9d27-687bb923da00', 'Sruti', 'Mitra', '9881712075', NULL, '$2b$12$h/6.OIEs1btmEf3v7C43BuYYVx4MRB3LRoqpM5wJmOfKNpV95qa6e', NULL, 0),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'Irfan', 'Ahmed', '9767388873', NULL, '$2b$12$a3Z9nYljMeQP9N4t3vsoQe2GNuRWH4NN8nN6j6n2n4w9rrQIMfxnG', NULL, 0),
('987d78c5-580d-4418-8393-802e73f84cae', 'Ritesh', 'Salecha', '9960140006', NULL, '$2b$12$xQYFif5z6KHa5tF0XiUM6ej0b0/lX7ec7hdGAL.CjzhWUlJBfwkRy', NULL, 0),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'Radhika', 'Kulkarni', '7709929534', NULL, '$2b$12$qJwmu29q0gB4Zy6hmtrE/uSyv6pTuZUc7fmgXJ/enjBhC1eUnxwRS', NULL, 0),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', 'Vinayak', 'Pimpalkar', '8329028132', NULL, '$2b$12$dHDqFsA5T.xb66nYi78cku6Ngf/utHKz.NBAStxD.bYe.EmbgKz8q', NULL, 0),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'Aditya', 'Chintal', '9970677645', NULL, '$2b$12$6RESx2VFlAgpF0gBnCaGDOPS6DkJ2y/j6ySYRWTC/WYYjVse01dP.', NULL, 0),
('a188c27f-1ce0-4392-aa6a-dcab5392c346', 'Kavitha', 'Mutha', '8055778989', NULL, '$2b$12$dVKkcya.0nUzxiJQkMDt1.RluWuG9iJWDEhSo42KnmJpnleqvlSLS', NULL, 0),
('a2089c98-330c-4aff-84ca-ebcad9efb930', 'Narendra', 'Bakale', '9822075743', NULL, '$2b$12$6brrAeRzBAFpyR/6JUFB..n5eccP1GCJTQkuDpVSEaUsrM7nxQjYi', NULL, 0),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'Suraj', 'Gaikwad', '9359962224', NULL, '$2b$12$J2vO.NHzrJoyCtFmNxUwOeZBEyEM/yyewvn6KdoDwjuQmnTHuQP/O', NULL, 0),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'Shashank', 'Ghadge', '9545862999', NULL, '$2b$12$X637xkKOa0F3hEYEu1J0mODN5tEfQv0VCGj8rsQouwFdqQs5v3KAG', NULL, 0),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'Dipti', 'Soni Deshmukh', '9004715464', NULL, '$2b$12$klzwempty2Eq/0XK0OhugOMjKhq6O.jn8T77bRQMQG/CaKCk5f3/y', NULL, 0),
('a56d576b-b1c1-4c3a-a536-55507759cd07', 'Bhushan', 'Joshi', '9422080726', NULL, '$2b$12$PBFm55Iv1V.ZDD2uIt1icOS2c3L7NQT7a5SVlvqCBraVyckC028EK', NULL, 0),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'Sagar', 'Nagul', '8928929991', NULL, '$2b$12$pphDXw7Tpe0dAOOXS7h59.y8kQQIko439c7h4eWhpZxtWi6joQpBy', NULL, 0),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'Minal', 'Risbud', '9850607550', NULL, '$2b$12$0OzsdusQ5omsr9O8HeHLbO67fmynqa4Of0.ucfLVovJIW463pl4TW', NULL, 0),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'Aanshumaa', 'Bora', '9881661133', NULL, '$2b$12$scGIHSJ8NB7UwcLpK6EU3O51sISNlGh7FZ/0k02mOLJjRntwTOaw.', NULL, 0),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'Kunal', 'Shah', '9860527537', NULL, '$2b$12$.8OAwGB./1BcUk5Hsd44GOc3Uq9HzID8Paf9V2jVVIBkbgiDwXLSS', NULL, 0),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', 'Karishma', 'Awari', '8668466961', NULL, '$2b$12$ORjXsmE1VSuWGhUFeV5dfuc8C7yBO3m5QAA7A9S7T/sVC4WCj0xX6', NULL, 0),
('ad59a189-e748-455e-a2dd-29ac2f33f941', 'Paraug', 'Padgilwaar', '9823085339', NULL, '$2b$12$q2nPQGEciAc1eAD3Ke78Peksxd6C4qsv3cisiBuReaxaW6CtA8DL2', NULL, 0),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'Puneet', 'Patel', '9822054007', NULL, '$2b$12$q0cpNMiEgC9qOvdQTpwp4uxKlvQZbm5uCcjZ7tghcflxhZITtsXHa', NULL, 0),
('b1a44181-b358-4bdd-a1be-17b860089004', 'Johnson', 'Koviri', '8385851111', NULL, '$2b$12$nsDtN.3b5NBSHfgZFFg6WeG3jv9G0XVUrkIJVGypjQ/KryRLu1Ykq', NULL, 0),
('b283a17c-d800-4039-afd0-aa7e08807bbf', 'Roopa', 'Jibkate', '9881197012', NULL, '$2b$12$GHANs0P6v9KxdU2yqYtfEuSKnpM8aRMiyXsdEa8j/S.7s0ZSWuiOi', NULL, 0),
('b4689a30-0f44-423a-926f-3f7dd5f22154', 'Anand', 'Hardikar', '9021708518', NULL, '$2b$12$atVtzGlRU8tE0NxnvnArmuJY8xxKSonVsAV.p.56szor6Qa0BQn5.', NULL, 0),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'Vijay', 'Kad', '9923406237', NULL, '$2b$12$m5vIF/XFJFphDaShHWerkengBhobrgG2cT5lsPh1vuTJknV5BPtc.', NULL, 0),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'Sameer', 'Shah', '9822283240', NULL, '$2b$12$qVuhMdRlfJ0p9AF0fcTi1ua0H6zT4QT60kgyiPBBgssv7o5YGkE3W', NULL, 0),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'Sandeep', 'Shinde', '8412020778', NULL, '$2b$12$nSvGnpDkzGsiXkav9S0PVOSvJ2siJyDJ4hfh7.vr1PhvY4s.BAevu', NULL, 0),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'Sagar', 'Shingade', '8799989346', NULL, '$2b$12$V7kzxKHpQWG6xkB2er5SqeU9.QJyeYPsiLzxrOphirvFmMSebVc9K', NULL, 0),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'Nilesh', 'Dulera', '7709111908', NULL, '$2b$12$qyBB4pA9MpfOMeh7Cz0.xu2mcb/wbVdKQW1Q9.L3vRsZ9o2ejn2UG', NULL, 0),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'Dinesh', 'Rajpurohit', '8888933334', NULL, '$2b$12$DABvgQlp5DXll9Ygt/OooeB8ulvttFbdhWaCk4/dbQk1RRSrbe80C', NULL, 0),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'Imran', 'Khan', '9503848789', NULL, '$2b$12$bK/eXUkgIeA8z0HQSLZl4OMxu2eKu5OMcoFFMHLaQlkEuPNmzQaUG', NULL, 0),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'Rajiv', 'Agharkar', '9822558503', NULL, '$2b$12$l3r29qzo7uZ8LLTkOH5AIeSi6sMDbvPdP14XB.mAZNde5Y.m8iVuu', NULL, 0),
('d5418c26-2c36-4f50-b099-8d593565be82', 'Vaishnavi', 'Bhavsar', '9021345194', NULL, '$2b$12$xUMmqE3l73J0vykYKecipuyDjkwzoJ9PCjj7d9YOYcCgLsTphXbzy', NULL, 0),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'Nilesh', 'Sali', '9518377159', NULL, '$2b$12$r9HBTIb7wvcQTQqVz7Wy.erc8hu5HGriMPgxqmTHPW2B9C6DgKCAa', NULL, 0),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'Vinit', 'Wagh', '9028864962', NULL, '$2b$12$UFNVEH86jsuDdGKV0Py5JOxCwSuSsPp7HVeZgW/4AfcnLni70s6zm', NULL, 0),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'Manoj', 'Bhairat', '9922024747', NULL, '$2b$12$mxjlCLaC137VOZ5VaaGN5Ox3o71UydPvF0XCT3X6yvYE8SIX72pLi', NULL, 0),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'Chirag', 'Mehta', '9920392777', NULL, '$2b$12$lD8gatMydVko9bXa3TaRQ.ofkpvDidacM1roPxcM0J292sLkFNJ8e', NULL, 0),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'Akil', 'Pandya', '9422000272', NULL, '$2b$12$M1AZ6l/Ne4k0pjfgmmuCM.PPB7WRV19eDWkcwir.YdcNHswq10ys.', NULL, 0),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'Anuj', 'Date', '9987451190', NULL, '$2b$12$8TEjrT4rObX2b05.NgALbewYdWTrmCZtAllgelB6C69od798i8cE.', NULL, 0),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', 'Yogeshwar', 'Durgude', '7028933096', NULL, '$2b$12$wpBZObiCmhi53478r6ucbOZ43qD/3BiuzJx3JJLSQmQOCqlvphjhW', NULL, 0),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'Shrikant', 'Ijankar', '9922720095', NULL, '$2b$12$PqbuTK.OkYivIazy0LL9MOHRTHfxJE9B1NG8PJz/QtKDG9p96ulke', NULL, 0),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'Gaurav', 'Katti', '7972060815', NULL, '$2b$12$dZtr8O.nQBxgTI0RThCG8O8eD4Wmf5cP/dh5V50DgsNnXEnvz1y..', NULL, 0),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'Ashwini', 'Daftardar', '9209182284', NULL, '$2b$12$sJ49lvhFLKbRfkamxInqfOuvMOA0MEIlowQcxqBRLbOo23Out.DrW', NULL, 0),
('efvelvhubrerikbjv', 'Manoj', 'Agarwal', '9975570005', 'manojragarwal@gmail.com', '$2a$10$h5V7k4/oqWwuO.UUmP2fCuuwFL0nzW8TPKCDkp2md/mO3k4DXdUBO', 'admin', 0),
('ekgvrjennivrnnienbiv', 'Khushboo', 'Kejriwal', '7030477594', 'adv.khushbookejriwal@gmail.com', '$2a$10$TUwfgNZnltivb0ciHEoLlu19UKrm47uKGBarPQFLnXoZRknvCuSDe', 'growth team', 0),
('eofuvheuihivehuuhbvhsh', 'Nilesh', 'Bagdiya', '9673995051', 'nileshbagdiya@gmail.com', '$2a$10$JvNrP7Z0tkq4vE3syEud3.nBIawrAJp.75TPLP9dkmtCzYvaepg7y', 'growth team', 0),
('ergioheohjgbiehjgbdl', 'Ruturaj', 'Shinde', '8796340324', 'ruturaj@smartivo.in', '$2a$10$An4upnPTTT0l3Hwz09JVjelcCaBYusUqbWeZYb9SbN88jp33C4Rju', 'vice president\r\n', 0),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal', 'Palrecha', '9673341700', 'ketanpalrecha@gmail.com', '$2a$10$a0uSLuJNcITRaWifC2O4duKB0jruz9ynnUQWS4ZdRMb.y7wVSBqTO', 'secretary treasurer', 0),
('ewrewavjkhsbjkvbersykuv', 'Deepak', 'Bansal', '9112034500', 'teamone.pune@gmail.com', '$2a$10$MHb1kXHXtO.tTjDneY6vs.NC.0uX7LZ.qqwkC5OODQaxs8qkV3hHC', 'admin', 0),
('f06ed5c8-4fe1-4623-8608-ef8fdf85233f', 'Prem', 'Singh Chauhan', '9850508478', NULL, '$2b$12$CgzgesBDGrC.DEWmXZ9r/.fFYMsmWTzO8B2GT57s0wp/XWc0OIUOa', NULL, 0),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'Mangesh', 'Shahapurkar', '9156222422', NULL, '$2b$12$TLe22lqA6TxyEkvTDXFRQ.jQ367QOgpCrVrXE3FvLYJd9kR1QxbK.', NULL, 0),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'Noor', 'Aasim Munshi', '9156044745', NULL, '$2b$12$jmHTruqA70G.gBCCTcLRc.jeXOe7tyJJYrB4f56HCfIfqrhqcwph6', NULL, 0),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'Vinit', 'Rathod', '9970222489', NULL, '$2b$12$7s1bLJUGhMx44b5SFLqgh.1hI5RPdsrh/JkMYsn27N7sLMPCeEpBe', NULL, 0),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', 'Aditya', 'Shendkar', '8080351565', NULL, '$2b$12$WzL5K5o2TD1Q8nnJvk1nS.90DkwYnE4bMvJbsv4h6foK4Rfnd4tYa', NULL, 0),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'Tushar', 'Kothari', '9028914033', NULL, '$2b$12$5EOrJqDszwrez9tDhyGnXuAeQ866r0uKgKusog1poBi2zCss4Pz3u', NULL, 0),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'Shirish', 'Prabhu', '9860093721', NULL, '$2b$12$6.ekEoKA7f8Q6Q07AIaGOeoL2lPetwlNCCHbl/0aGnrvS0z2FqABa', NULL, 0),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'Gauri', 'Karle', '9960693553', NULL, '$2b$12$pwvmNcLNfBgF7Phg8jJU1eIcEsqaohq1au2ItpWMSpFQtxl5FHj/m', NULL, 0),
('fbe36553-e184-48b0-956a-d1e91eece826', 'Rahul', 'Paygude', '9850977873', NULL, '$2b$12$CaDbWrAr4Hyg2zU3MPKMnezWb/qrlWUFspgrW/muxwh6FDdXzfB3q', NULL, 0),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'Krishna', 'Charholikar', '8237701880', NULL, '$2b$12$HhhsgDZfleAdjRwg8UZNounQzzdvq7kO/FEvnlqTwd8Z4bgoCrtqi', NULL, 0),
('wgfvekfugrvheuguik', 'Datta', 'Randive', '9881653030', 'dswatertech1@gmail.com', '$2a$10$mSfYOzC3gHo2Fpa6kleFaObTzaC7peNnfaA3UAeF5OMYzdNBkMrXa', 'visitor host', 0),
('wolrgvfhurdihingrit', 'Hemant', 'Agarwal', '9823156256', 'agarwalhemant21@gmail.com', '$2a$10$AQ8n0ESHMDoObSRqkLn23OOru3OlOX1yA97/XPqdkE5fHzF4yIbCK', 'admin', 0),
('yrdfgvubisufdvnuidjn', 'Vijay', 'Agrawal', '8999960000', 'agrawwalvijay@gmail.com', '$2a$10$OHzPU1gFkWw22dEl5HTjrueWHL4YEBojHCXsidpH4rB2VZFxrjsq2', '__', 0);

-- --------------------------------------------------------

--
-- Table structure for table `memberslog`
--

CREATE TABLE `memberslog` (
  `logId` varchar(255) NOT NULL,
  `memberId` varchar(255) NOT NULL,
  `logDate` date NOT NULL,
  `logDescription` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `membersmeetingmapping`
--

CREATE TABLE `membersmeetingmapping` (
  `memberId` varchar(255) NOT NULL,
  `meetingId` varchar(255) NOT NULL,
  `notToPay` tinyint(1) DEFAULT '0',
  `notToPayReason` text,
  `isPaid` tinyint(1) DEFAULT '0',
  `transactionId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `membersmeetingmapping`
--

INSERT INTO `membersmeetingmapping` (`memberId`, `meetingId`, `notToPay`, `notToPayReason`, `isPaid`, `transactionId`) VALUES
('5de38232-608a-4c6f-b3e7-3a0d94f74e3d', 'svijnvi6', 0, NULL, 1, '762ba917-f10e-418f-b31f-755222bf63d2'),
('5de38232-608a-4c6f-b3e7-3a0d94f74e3d', 'svijnvi7', 0, NULL, 1, '762ba917-f10e-418f-b31f-755222bf63d2'),
('5de38232-608a-4c6f-b3e7-3a0d94f74e3d', 'svijnvi8', 0, NULL, 1, '762ba917-f10e-418f-b31f-755222bf63d2'),
('5de38232-608a-4c6f-b3e7-3a0d94f74e3d', 'svijnvi9', 0, NULL, 1, '762ba917-f10e-418f-b31f-755222bf63d2'),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', 'svijnvi1', 0, NULL, 1, 'e99c20cc-99d9-4171-8254-8621d9722213'),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', 'svijnvi2', 0, NULL, 1, 'e99c20cc-99d9-4171-8254-8621d9722213'),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', 'svijnvi3', 0, NULL, 1, 'e99c20cc-99d9-4171-8254-8621d9722213'),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', 'svijnvi4', 0, NULL, 1, 'e99c20cc-99d9-4171-8254-8621d9722213'),
('79a84fbd-6fb7-47ca-bc81-64740ca8259c', 'svijnvi5', 0, NULL, 1, 'e99c20cc-99d9-4171-8254-8621d9722213'),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', 'svijnvi1', 0, NULL, 1, '549208b7-8d33-43d6-96fd-87d86b0e2918'),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', 'svijnvi2', 0, NULL, 1, '549208b7-8d33-43d6-96fd-87d86b0e2918'),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', 'svijnvi3', 0, NULL, 1, '549208b7-8d33-43d6-96fd-87d86b0e2918'),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', 'svijnvi4', 0, NULL, 1, '549208b7-8d33-43d6-96fd-87d86b0e2918'),
('f500dc91-80cc-481e-8006-f2fc7b60efe5', 'svijnvi5', 0, NULL, 1, '549208b7-8d33-43d6-96fd-87d86b0e2918'),
('447a16ba-e611-488f-b021-cba4dd23b61f', 'svijnvi1', 0, NULL, 1, '0494b5ad-eabf-430a-9494-3ea5bc3f02ee'),
('447a16ba-e611-488f-b021-cba4dd23b61f', 'svijnvi2', 0, NULL, 1, '0494b5ad-eabf-430a-9494-3ea5bc3f02ee'),
('447a16ba-e611-488f-b021-cba4dd23b61f', 'svijnvi3', 0, NULL, 1, '0494b5ad-eabf-430a-9494-3ea5bc3f02ee'),
('447a16ba-e611-488f-b021-cba4dd23b61f', 'svijnvi4', 0, NULL, 1, '0494b5ad-eabf-430a-9494-3ea5bc3f02ee'),
('447a16ba-e611-488f-b021-cba4dd23b61f', 'svijnvi5', 0, NULL, 1, '0494b5ad-eabf-430a-9494-3ea5bc3f02ee'),
('b4689a30-0f44-423a-926f-3f7dd5f22154', 'svijnvi1', 0, NULL, 1, '04fed248-56b9-4b07-9655-3f9e8003acf9'),
('b4689a30-0f44-423a-926f-3f7dd5f22154', 'svijnvi2', 0, NULL, 1, '04fed248-56b9-4b07-9655-3f9e8003acf9'),
('b4689a30-0f44-423a-926f-3f7dd5f22154', 'svijnvi3', 0, NULL, 1, '04fed248-56b9-4b07-9655-3f9e8003acf9'),
('b4689a30-0f44-423a-926f-3f7dd5f22154', 'svijnvi4', 0, NULL, 1, '04fed248-56b9-4b07-9655-3f9e8003acf9'),
('b4689a30-0f44-423a-926f-3f7dd5f22154', 'svijnvi5', 0, NULL, 1, '04fed248-56b9-4b07-9655-3f9e8003acf9'),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', 'svijnvi1', 0, NULL, 1, '0b5e738d-38c8-4d4b-96dd-d51dda1f18eb'),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', 'svijnvi2', 0, NULL, 1, '0b5e738d-38c8-4d4b-96dd-d51dda1f18eb'),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', 'svijnvi3', 0, NULL, 1, '0b5e738d-38c8-4d4b-96dd-d51dda1f18eb'),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', 'svijnvi4', 0, NULL, 1, '0b5e738d-38c8-4d4b-96dd-d51dda1f18eb'),
('7af8672d-50b7-4b98-9cf7-bae2102d7405', 'svijnvi5', 0, NULL, 1, '0b5e738d-38c8-4d4b-96dd-d51dda1f18eb'),
('02b4b816-0d75-4fa5-b956-69494c699e51', 'svijnvi1', 0, NULL, 1, 'cfd973d6-97d8-4c63-bf0c-867173c80395'),
('02b4b816-0d75-4fa5-b956-69494c699e51', 'svijnvi2', 0, NULL, 1, 'cfd973d6-97d8-4c63-bf0c-867173c80395'),
('02b4b816-0d75-4fa5-b956-69494c699e51', 'svijnvi3', 0, NULL, 1, 'cfd973d6-97d8-4c63-bf0c-867173c80395'),
('02b4b816-0d75-4fa5-b956-69494c699e51', 'svijnvi4', 0, NULL, 1, 'cfd973d6-97d8-4c63-bf0c-867173c80395'),
('02b4b816-0d75-4fa5-b956-69494c699e51', 'svijnvi5', 0, NULL, 1, 'cfd973d6-97d8-4c63-bf0c-867173c80395'),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', 'svijnvi1', 0, NULL, 1, 'a292af34-11b1-4dca-b854-c33c2755a3fe'),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', 'svijnvi2', 0, NULL, 1, 'a292af34-11b1-4dca-b854-c33c2755a3fe'),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', 'svijnvi3', 0, NULL, 1, 'a292af34-11b1-4dca-b854-c33c2755a3fe'),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', 'svijnvi4', 0, NULL, 1, 'a292af34-11b1-4dca-b854-c33c2755a3fe'),
('aa39ea0e-6c81-4433-be80-1761f8e8a9be', 'svijnvi5', 0, NULL, 1, 'a292af34-11b1-4dca-b854-c33c2755a3fe'),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', 'svijnvi1', 0, NULL, 1, 'daf0e6b8-895d-4e3d-8320-7203b9f8afca'),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', 'svijnvi2', 0, NULL, 1, 'daf0e6b8-895d-4e3d-8320-7203b9f8afca'),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', 'svijnvi3', 0, NULL, 1, 'daf0e6b8-895d-4e3d-8320-7203b9f8afca'),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', 'svijnvi4', 0, NULL, 1, 'daf0e6b8-895d-4e3d-8320-7203b9f8afca'),
('7d0d24e1-8bd6-4c44-af99-f135a95dc92e', 'svijnvi5', 0, NULL, 1, 'daf0e6b8-895d-4e3d-8320-7203b9f8afca'),
('ad59a189-e748-455e-a2dd-29ac2f33f941', 'svijnvi1', 0, NULL, 1, 'b853fcc0-1c34-483f-8295-faa038a7177f'),
('ad59a189-e748-455e-a2dd-29ac2f33f941', 'svijnvi2', 0, NULL, 1, 'b853fcc0-1c34-483f-8295-faa038a7177f'),
('ad59a189-e748-455e-a2dd-29ac2f33f941', 'svijnvi3', 0, NULL, 1, 'b853fcc0-1c34-483f-8295-faa038a7177f'),
('ad59a189-e748-455e-a2dd-29ac2f33f941', 'svijnvi4', 0, NULL, 1, 'b853fcc0-1c34-483f-8295-faa038a7177f'),
('ad59a189-e748-455e-a2dd-29ac2f33f941', 'svijnvi5', 0, NULL, 1, 'b853fcc0-1c34-483f-8295-faa038a7177f'),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', 'svijnvi1', 0, NULL, 1, '7dad9a40-7fd7-4f7e-9ffa-fe54e3ecf83f'),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', 'svijnvi2', 0, NULL, 1, '7dad9a40-7fd7-4f7e-9ffa-fe54e3ecf83f'),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', 'svijnvi3', 0, NULL, 1, '7dad9a40-7fd7-4f7e-9ffa-fe54e3ecf83f'),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', 'svijnvi4', 0, NULL, 1, '7dad9a40-7fd7-4f7e-9ffa-fe54e3ecf83f'),
('6c150d9d-64dd-4f5a-baee-89f85ef83b75', 'svijnvi5', 0, NULL, 1, '7dad9a40-7fd7-4f7e-9ffa-fe54e3ecf83f'),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', 'svijnvi1', 0, NULL, 1, 'a58d7eeb-1cbb-447c-9fe7-d42b5f479b6a'),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', 'svijnvi2', 0, NULL, 1, 'a58d7eeb-1cbb-447c-9fe7-d42b5f479b6a'),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', 'svijnvi3', 0, NULL, 1, 'a58d7eeb-1cbb-447c-9fe7-d42b5f479b6a'),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', 'svijnvi4', 0, NULL, 1, 'a58d7eeb-1cbb-447c-9fe7-d42b5f479b6a'),
('639f10fb-99eb-4675-88be-bf852d6e9ecf', 'svijnvi5', 0, NULL, 1, 'a58d7eeb-1cbb-447c-9fe7-d42b5f479b6a'),
('b283a17c-d800-4039-afd0-aa7e08807bbf', 'svijnvi1', 0, NULL, 1, '16f39415-bdd2-48aa-94fb-aa5c2b57f948'),
('b283a17c-d800-4039-afd0-aa7e08807bbf', 'svijnvi2', 0, NULL, 1, '16f39415-bdd2-48aa-94fb-aa5c2b57f948'),
('b283a17c-d800-4039-afd0-aa7e08807bbf', 'svijnvi3', 0, NULL, 1, '16f39415-bdd2-48aa-94fb-aa5c2b57f948'),
('b283a17c-d800-4039-afd0-aa7e08807bbf', 'svijnvi4', 0, NULL, 1, '16f39415-bdd2-48aa-94fb-aa5c2b57f948'),
('b283a17c-d800-4039-afd0-aa7e08807bbf', 'svijnvi5', 0, NULL, 1, '16f39415-bdd2-48aa-94fb-aa5c2b57f948'),
('1dde0c4f-b39e-437b-9489-455956a3831c', 'svijnvi1', 0, NULL, 1, '634149f2-0602-4ae7-a65e-344af8bf999b'),
('1dde0c4f-b39e-437b-9489-455956a3831c', 'svijnvi2', 0, NULL, 1, '634149f2-0602-4ae7-a65e-344af8bf999b'),
('1dde0c4f-b39e-437b-9489-455956a3831c', 'svijnvi3', 0, NULL, 1, '634149f2-0602-4ae7-a65e-344af8bf999b'),
('1dde0c4f-b39e-437b-9489-455956a3831c', 'svijnvi4', 0, NULL, 1, '634149f2-0602-4ae7-a65e-344af8bf999b'),
('1dde0c4f-b39e-437b-9489-455956a3831c', 'svijnvi5', 0, NULL, 1, '634149f2-0602-4ae7-a65e-344af8bf999b'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi1', 0, NULL, 1, 'c7d07557-e161-4068-a491-deaa99604993'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi2', 0, NULL, 1, 'c7d07557-e161-4068-a491-deaa99604993'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi3', 0, NULL, 1, 'c7d07557-e161-4068-a491-deaa99604993'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi4', 0, NULL, 1, 'c7d07557-e161-4068-a491-deaa99604993'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi5', 0, NULL, 1, 'c7d07557-e161-4068-a491-deaa99604993'),
('95f622eb-ef7b-409e-9d27-687bb923da00', 'svijnvi1', 0, NULL, 1, 'af727455-a4e7-4cad-a131-8009fcc2de9b'),
('95f622eb-ef7b-409e-9d27-687bb923da00', 'svijnvi2', 0, NULL, 1, 'af727455-a4e7-4cad-a131-8009fcc2de9b'),
('95f622eb-ef7b-409e-9d27-687bb923da00', 'svijnvi3', 0, NULL, 1, 'af727455-a4e7-4cad-a131-8009fcc2de9b'),
('95f622eb-ef7b-409e-9d27-687bb923da00', 'svijnvi4', 0, NULL, 1, 'af727455-a4e7-4cad-a131-8009fcc2de9b'),
('95f622eb-ef7b-409e-9d27-687bb923da00', 'svijnvi5', 0, NULL, 1, 'af727455-a4e7-4cad-a131-8009fcc2de9b'),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', 'svijnvi1', 0, NULL, 1, '3ac21b9a-bc87-42b9-8727-03e81d1b9e25'),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', 'svijnvi2', 0, NULL, 1, '3ac21b9a-bc87-42b9-8727-03e81d1b9e25'),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', 'svijnvi3', 0, NULL, 1, '3ac21b9a-bc87-42b9-8727-03e81d1b9e25'),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', 'svijnvi4', 0, NULL, 1, '3ac21b9a-bc87-42b9-8727-03e81d1b9e25'),
('85ccffd5-e98f-4ee8-8886-acf68bc29dfb', 'svijnvi5', 0, NULL, 1, '3ac21b9a-bc87-42b9-8727-03e81d1b9e25'),
('d5418c26-2c36-4f50-b099-8d593565be82', 'svijnvi1', 0, NULL, 1, '93d22aee-54b9-4ad2-80cb-c6c6cca156c1'),
('d5418c26-2c36-4f50-b099-8d593565be82', 'svijnvi2', 0, NULL, 1, '93d22aee-54b9-4ad2-80cb-c6c6cca156c1'),
('d5418c26-2c36-4f50-b099-8d593565be82', 'svijnvi3', 0, NULL, 1, '93d22aee-54b9-4ad2-80cb-c6c6cca156c1'),
('d5418c26-2c36-4f50-b099-8d593565be82', 'svijnvi4', 0, NULL, 1, '93d22aee-54b9-4ad2-80cb-c6c6cca156c1'),
('d5418c26-2c36-4f50-b099-8d593565be82', 'svijnvi5', 0, NULL, 1, '93d22aee-54b9-4ad2-80cb-c6c6cca156c1'),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', 'svijnvi1', 0, NULL, 1, '284f8204-ebc0-4efc-9617-82c7de437fe5'),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', 'svijnvi2', 0, NULL, 1, '284f8204-ebc0-4efc-9617-82c7de437fe5'),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', 'svijnvi3', 0, NULL, 1, '284f8204-ebc0-4efc-9617-82c7de437fe5'),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', 'svijnvi4', 0, NULL, 1, '284f8204-ebc0-4efc-9617-82c7de437fe5'),
('99616fdb-8896-4ba7-9e91-2209cf9230a4', 'svijnvi5', 0, NULL, 1, '284f8204-ebc0-4efc-9617-82c7de437fe5'),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', 'svijnvi1', 0, NULL, 1, '835214fc-4853-44fe-842a-cdc31e0d1b59'),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', 'svijnvi2', 0, NULL, 1, '835214fc-4853-44fe-842a-cdc31e0d1b59'),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', 'svijnvi3', 0, NULL, 1, '835214fc-4853-44fe-842a-cdc31e0d1b59'),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', 'svijnvi4', 0, NULL, 1, '835214fc-4853-44fe-842a-cdc31e0d1b59'),
('e88996a5-fc0f-45c7-bf08-dad3c955d753', 'svijnvi5', 0, NULL, 1, '835214fc-4853-44fe-842a-cdc31e0d1b59'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi1', 0, NULL, 1, '7ace3276-96c5-43b1-b150-1afd91ea40e6'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi2', 0, NULL, 1, '7ace3276-96c5-43b1-b150-1afd91ea40e6'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi3', 0, NULL, 1, '7ace3276-96c5-43b1-b150-1afd91ea40e6'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi4', 0, NULL, 1, '7ace3276-96c5-43b1-b150-1afd91ea40e6'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi5', 0, NULL, 1, '7ace3276-96c5-43b1-b150-1afd91ea40e6'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi6', 0, NULL, 1, '3f35d005-4ecc-43e6-95db-99774bdbfb74'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi7', 0, NULL, 1, '3f35d005-4ecc-43e6-95db-99774bdbfb74'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi8', 0, NULL, 1, '3f35d005-4ecc-43e6-95db-99774bdbfb74'),
('a6b6e35f-774a-43bb-a399-3a2882094d40', 'svijnvi9', 0, NULL, 1, '3f35d005-4ecc-43e6-95db-99774bdbfb74'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi1', 0, NULL, 1, '8443a850-5e4f-43af-b2c7-e0007bb07060'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi2', 0, NULL, 1, '8443a850-5e4f-43af-b2c7-e0007bb07060'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi3', 0, NULL, 1, '8443a850-5e4f-43af-b2c7-e0007bb07060'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi4', 0, NULL, 1, '8443a850-5e4f-43af-b2c7-e0007bb07060'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi5', 0, NULL, 1, '8443a850-5e4f-43af-b2c7-e0007bb07060'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi6', 0, NULL, 1, '2c0774d7-54e4-4b35-9ba2-4a5efede7b76'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi7', 0, NULL, 1, '2c0774d7-54e4-4b35-9ba2-4a5efede7b76'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi8', 0, NULL, 1, '2c0774d7-54e4-4b35-9ba2-4a5efede7b76'),
('69cc56f0-6d00-4790-a3ea-dfd78852b393', 'svijnvi9', 0, NULL, 1, '2c0774d7-54e4-4b35-9ba2-4a5efede7b76'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi1', 0, NULL, 1, 'e2901cc5-6bd0-4866-808d-176d11661501'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi2', 0, NULL, 1, 'e2901cc5-6bd0-4866-808d-176d11661501'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi3', 0, NULL, 1, 'e2901cc5-6bd0-4866-808d-176d11661501'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi4', 0, NULL, 1, 'e2901cc5-6bd0-4866-808d-176d11661501'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi5', 0, NULL, 1, 'e2901cc5-6bd0-4866-808d-176d11661501'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi6', 0, NULL, 1, '58abf790-4acb-448e-b62c-6ae0e1a0decd'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi7', 0, NULL, 1, '58abf790-4acb-448e-b62c-6ae0e1a0decd'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi8', 0, NULL, 1, '58abf790-4acb-448e-b62c-6ae0e1a0decd'),
('a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', 'svijnvi9', 0, NULL, 1, '58abf790-4acb-448e-b62c-6ae0e1a0decd'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi1', 0, NULL, 1, 'e60661ba-9b16-434a-927e-215fc5f5afc3'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi2', 0, NULL, 1, 'e60661ba-9b16-434a-927e-215fc5f5afc3'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi3', 0, NULL, 1, 'e60661ba-9b16-434a-927e-215fc5f5afc3'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi4', 0, NULL, 1, 'e60661ba-9b16-434a-927e-215fc5f5afc3'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi5', 0, NULL, 1, 'e60661ba-9b16-434a-927e-215fc5f5afc3'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi6', 0, NULL, 1, '63f3f3a7-1ae1-4bf1-a98f-bf621b3211f8'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi7', 0, NULL, 1, '63f3f3a7-1ae1-4bf1-a98f-bf621b3211f8'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi8', 0, NULL, 1, '63f3f3a7-1ae1-4bf1-a98f-bf621b3211f8'),
('95ac2312-9c52-422d-baa8-ce1a9dc61e3a', 'svijnvi9', 0, NULL, 1, '63f3f3a7-1ae1-4bf1-a98f-bf621b3211f8'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi1', 0, NULL, 1, 'd3e1cf1f-0b48-44e4-8516-a87db546ffd0'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi2', 0, NULL, 1, 'd3e1cf1f-0b48-44e4-8516-a87db546ffd0'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi3', 0, NULL, 1, 'd3e1cf1f-0b48-44e4-8516-a87db546ffd0'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi4', 0, NULL, 1, 'd3e1cf1f-0b48-44e4-8516-a87db546ffd0'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi5', 0, NULL, 1, 'd3e1cf1f-0b48-44e4-8516-a87db546ffd0'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi6', 0, NULL, 1, '499234ab-5db7-4038-9fdf-4cb2ddac7f46'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi7', 0, NULL, 1, '499234ab-5db7-4038-9fdf-4cb2ddac7f46'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi8', 0, NULL, 1, '499234ab-5db7-4038-9fdf-4cb2ddac7f46'),
('3e268ca7-7fcd-4c91-811c-6e8aec990ee6', 'svijnvi9', 0, NULL, 1, '499234ab-5db7-4038-9fdf-4cb2ddac7f46'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi1', 0, NULL, 1, '3ac39af0-3e1a-4d37-8ee5-7fd80889a296'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi2', 0, NULL, 1, '3ac39af0-3e1a-4d37-8ee5-7fd80889a296'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi3', 0, NULL, 1, '3ac39af0-3e1a-4d37-8ee5-7fd80889a296'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi4', 0, NULL, 1, '3ac39af0-3e1a-4d37-8ee5-7fd80889a296'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi5', 0, NULL, 1, '3ac39af0-3e1a-4d37-8ee5-7fd80889a296'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi6', 0, NULL, 1, '5e1ff916-3121-482f-88ba-394524d9b250'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi7', 0, NULL, 1, '5e1ff916-3121-482f-88ba-394524d9b250'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi8', 0, NULL, 1, '5e1ff916-3121-482f-88ba-394524d9b250'),
('e5af84c8-9bdd-4553-b086-9340fb38678b', 'svijnvi9', 0, NULL, 1, '5e1ff916-3121-482f-88ba-394524d9b250'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi1', 0, NULL, 1, 'ff21d111-636a-49bd-ab31-95a82c83a205'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi2', 0, NULL, 1, 'ff21d111-636a-49bd-ab31-95a82c83a205'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi3', 0, NULL, 1, 'ff21d111-636a-49bd-ab31-95a82c83a205'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi4', 0, NULL, 1, 'ff21d111-636a-49bd-ab31-95a82c83a205'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi5', 0, NULL, 1, 'ff21d111-636a-49bd-ab31-95a82c83a205'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi6', 0, NULL, 1, 'd6184da2-86da-495e-b923-971593ca1ff6'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi7', 0, NULL, 1, 'd6184da2-86da-495e-b923-971593ca1ff6'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi8', 0, NULL, 1, 'd6184da2-86da-495e-b923-971593ca1ff6'),
('72d9d323-b2fa-4f17-ba66-5b5408727f53', 'svijnvi9', 0, NULL, 1, 'd6184da2-86da-495e-b923-971593ca1ff6'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi1', 0, NULL, 1, '001b5e6f-a3ba-4ce8-a524-257d0492da6e'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi2', 0, NULL, 1, '001b5e6f-a3ba-4ce8-a524-257d0492da6e'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi3', 0, NULL, 1, '001b5e6f-a3ba-4ce8-a524-257d0492da6e'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi4', 0, NULL, 1, '001b5e6f-a3ba-4ce8-a524-257d0492da6e'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi5', 0, NULL, 1, '001b5e6f-a3ba-4ce8-a524-257d0492da6e'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi6', 0, NULL, 1, 'f30f5512-75a5-4fd1-822b-f57e757b2379'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi7', 0, NULL, 1, 'f30f5512-75a5-4fd1-822b-f57e757b2379'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi8', 0, NULL, 1, 'f30f5512-75a5-4fd1-822b-f57e757b2379'),
('66fe1812-2ba7-463f-9535-98c0b59c83a8', 'svijnvi9', 0, NULL, 1, 'f30f5512-75a5-4fd1-822b-f57e757b2379'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi1', 0, NULL, 1, '9639372e-93a9-492e-8110-38f7b29a0ea4'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi2', 0, NULL, 1, '9639372e-93a9-492e-8110-38f7b29a0ea4'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi3', 0, NULL, 1, '9639372e-93a9-492e-8110-38f7b29a0ea4'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi4', 0, NULL, 1, '9639372e-93a9-492e-8110-38f7b29a0ea4'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi5', 0, NULL, 1, '9639372e-93a9-492e-8110-38f7b29a0ea4'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi6', 0, NULL, 1, 'ca4ea55c-e0aa-476d-8076-36dbbee3f68b'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi7', 0, NULL, 1, 'ca4ea55c-e0aa-476d-8076-36dbbee3f68b'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi8', 0, NULL, 1, 'ca4ea55c-e0aa-476d-8076-36dbbee3f68b'),
('820b077a-c55e-4560-9422-9360d9e805df', 'svijnvi9', 0, NULL, 1, 'ca4ea55c-e0aa-476d-8076-36dbbee3f68b'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi1', 0, NULL, 1, 'bb8fce93-d2cf-417b-8a8b-e9003ae13baf'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi2', 0, NULL, 1, 'bb8fce93-d2cf-417b-8a8b-e9003ae13baf'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi3', 0, NULL, 1, 'bb8fce93-d2cf-417b-8a8b-e9003ae13baf'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi4', 0, NULL, 1, 'bb8fce93-d2cf-417b-8a8b-e9003ae13baf'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi5', 0, NULL, 1, 'bb8fce93-d2cf-417b-8a8b-e9003ae13baf'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi6', 0, NULL, 1, '9acb87d5-0bf8-4686-b20d-06a1333f55d9'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi7', 0, NULL, 1, '9acb87d5-0bf8-4686-b20d-06a1333f55d9'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi8', 0, NULL, 1, '9acb87d5-0bf8-4686-b20d-06a1333f55d9'),
('52623b2a-0c4c-4310-a541-110283d5b1a0', 'svijnvi9', 0, NULL, 1, '9acb87d5-0bf8-4686-b20d-06a1333f55d9'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi1', 0, NULL, 1, '87f8b161-f187-41d7-a3a7-0d606768e096'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi2', 0, NULL, 1, '87f8b161-f187-41d7-a3a7-0d606768e096'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi3', 0, NULL, 1, '87f8b161-f187-41d7-a3a7-0d606768e096'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi4', 0, NULL, 1, '87f8b161-f187-41d7-a3a7-0d606768e096'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi5', 0, NULL, 1, '87f8b161-f187-41d7-a3a7-0d606768e096'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi6', 0, NULL, 1, '14371543-7e41-465f-bd5f-9c229306a294'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi7', 0, NULL, 1, '14371543-7e41-465f-bd5f-9c229306a294'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi8', 0, NULL, 1, '14371543-7e41-465f-bd5f-9c229306a294'),
('72deef6b-593e-4496-be5f-862c8880890d', 'svijnvi9', 0, NULL, 1, '14371543-7e41-465f-bd5f-9c229306a294'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi1', 0, NULL, 1, '12291ca5-1aef-457f-8269-1c599b47dad6'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi2', 0, NULL, 1, '12291ca5-1aef-457f-8269-1c599b47dad6'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi3', 0, NULL, 1, '12291ca5-1aef-457f-8269-1c599b47dad6'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi4', 0, NULL, 1, '12291ca5-1aef-457f-8269-1c599b47dad6'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi5', 0, NULL, 1, '12291ca5-1aef-457f-8269-1c599b47dad6'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi6', 0, NULL, 1, '0bd24c32-bf5f-4842-8a2d-1fb10aed63ea'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi7', 0, NULL, 1, '0bd24c32-bf5f-4842-8a2d-1fb10aed63ea'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi8', 0, NULL, 1, '0bd24c32-bf5f-4842-8a2d-1fb10aed63ea'),
('e835e4f1-1aeb-4cf4-9884-6c214244487c', 'svijnvi9', 0, NULL, 1, '0bd24c32-bf5f-4842-8a2d-1fb10aed63ea'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi1', 0, NULL, 1, 'fac2e8cc-eb4a-48c9-8562-b7a6060b5afe'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi2', 0, NULL, 1, 'fac2e8cc-eb4a-48c9-8562-b7a6060b5afe'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi3', 0, NULL, 1, 'fac2e8cc-eb4a-48c9-8562-b7a6060b5afe'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi4', 0, NULL, 1, 'fac2e8cc-eb4a-48c9-8562-b7a6060b5afe'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi5', 0, NULL, 1, 'fac2e8cc-eb4a-48c9-8562-b7a6060b5afe'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi6', 0, NULL, 1, 'f9683768-296d-4261-be15-20b8f61e4a2b'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi7', 0, NULL, 1, 'f9683768-296d-4261-be15-20b8f61e4a2b'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi8', 0, NULL, 1, 'f9683768-296d-4261-be15-20b8f61e4a2b'),
('55793941-87a3-4308-aa60-5204d7f5bce0', 'svijnvi9', 0, NULL, 1, 'f9683768-296d-4261-be15-20b8f61e4a2b'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi1', 0, NULL, 1, '52432a2d-9a59-40d6-8fec-1f8b8034e69c'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi2', 0, NULL, 1, '52432a2d-9a59-40d6-8fec-1f8b8034e69c'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi3', 0, NULL, 1, '52432a2d-9a59-40d6-8fec-1f8b8034e69c'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi4', 0, NULL, 1, '52432a2d-9a59-40d6-8fec-1f8b8034e69c'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi5', 0, NULL, 1, '52432a2d-9a59-40d6-8fec-1f8b8034e69c'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi6', 0, NULL, 1, '3c90d546-5045-41c5-882f-990f2a95f825'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi7', 0, NULL, 1, '3c90d546-5045-41c5-882f-990f2a95f825'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi8', 0, NULL, 1, '3c90d546-5045-41c5-882f-990f2a95f825'),
('2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', 'svijnvi9', 0, NULL, 1, '3c90d546-5045-41c5-882f-990f2a95f825'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi1', 0, NULL, 1, 'a15b7225-0a35-4f73-a3b4-d1e044564b86'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi2', 0, NULL, 1, 'a15b7225-0a35-4f73-a3b4-d1e044564b86'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi3', 0, NULL, 1, 'a15b7225-0a35-4f73-a3b4-d1e044564b86'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi4', 0, NULL, 1, 'a15b7225-0a35-4f73-a3b4-d1e044564b86'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi5', 0, NULL, 1, 'a15b7225-0a35-4f73-a3b4-d1e044564b86'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi6', 0, NULL, 1, '381e8f93-33ac-4f0a-a042-927247e79ab6'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi7', 0, NULL, 1, '381e8f93-33ac-4f0a-a042-927247e79ab6'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi8', 0, NULL, 1, '381e8f93-33ac-4f0a-a042-927247e79ab6'),
('922b5e99-a0fe-4215-b2ea-54fea6ba9400', 'svijnvi9', 0, NULL, 1, '381e8f93-33ac-4f0a-a042-927247e79ab6'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi1', 0, NULL, 1, '912c12ca-5ce0-4747-b75a-366b465c3547'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi2', 0, NULL, 1, '912c12ca-5ce0-4747-b75a-366b465c3547'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi3', 0, NULL, 1, '912c12ca-5ce0-4747-b75a-366b465c3547'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi4', 0, NULL, 1, '912c12ca-5ce0-4747-b75a-366b465c3547'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi5', 0, NULL, 1, '912c12ca-5ce0-4747-b75a-366b465c3547'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi6', 0, NULL, 1, '08f71a79-81a6-42dd-b10f-af01b4580185'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi7', 0, NULL, 1, '08f71a79-81a6-42dd-b10f-af01b4580185'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi8', 0, NULL, 1, '08f71a79-81a6-42dd-b10f-af01b4580185'),
('334d6ff0-419e-448d-a931-69157b4181cc', 'svijnvi9', 0, NULL, 1, '08f71a79-81a6-42dd-b10f-af01b4580185'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi1', 0, NULL, 1, '42e46fc7-1d4f-4098-b4e1-03a8bc8e7fa5'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi2', 0, NULL, 1, '42e46fc7-1d4f-4098-b4e1-03a8bc8e7fa5'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi3', 0, NULL, 1, '42e46fc7-1d4f-4098-b4e1-03a8bc8e7fa5'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi4', 0, NULL, 1, '42e46fc7-1d4f-4098-b4e1-03a8bc8e7fa5'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi5', 0, NULL, 1, '42e46fc7-1d4f-4098-b4e1-03a8bc8e7fa5'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi6', 0, NULL, 1, '3a264c7a-1846-45fb-be0f-3253e75fd0b8'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi7', 0, NULL, 1, '3a264c7a-1846-45fb-be0f-3253e75fd0b8'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi8', 0, NULL, 1, '3a264c7a-1846-45fb-be0f-3253e75fd0b8'),
('ef63856f-bde1-4c09-a064-3d4b94942352', 'svijnvi9', 0, NULL, 1, '3a264c7a-1846-45fb-be0f-3253e75fd0b8'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi1', 0, NULL, 1, 'dc191171-6823-47d8-b349-5fa5aaddcd4e'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi2', 0, NULL, 1, 'dc191171-6823-47d8-b349-5fa5aaddcd4e'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi3', 0, NULL, 1, 'dc191171-6823-47d8-b349-5fa5aaddcd4e'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi4', 0, NULL, 1, 'dc191171-6823-47d8-b349-5fa5aaddcd4e'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi5', 0, NULL, 1, 'dc191171-6823-47d8-b349-5fa5aaddcd4e'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi6', 0, NULL, 1, 'dfcd55cf-22d3-407e-a1aa-7c0491782d98'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi7', 0, NULL, 1, 'dfcd55cf-22d3-407e-a1aa-7c0491782d98'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi8', 0, NULL, 1, 'dfcd55cf-22d3-407e-a1aa-7c0491782d98'),
('83612c1c-e327-4e32-900c-868998118784', 'svijnvi9', 0, NULL, 1, 'dfcd55cf-22d3-407e-a1aa-7c0491782d98'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi1', 0, NULL, 1, '617d2fb4-c77a-462b-ad6e-91b0092ce8b6'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi2', 0, NULL, 1, '617d2fb4-c77a-462b-ad6e-91b0092ce8b6'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi3', 0, NULL, 1, '617d2fb4-c77a-462b-ad6e-91b0092ce8b6'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi4', 0, NULL, 1, '617d2fb4-c77a-462b-ad6e-91b0092ce8b6'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi5', 0, NULL, 1, '617d2fb4-c77a-462b-ad6e-91b0092ce8b6'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi6', 0, NULL, 1, 'c2abb572-93a8-4365-aac2-77d33b12c7d2'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi7', 0, NULL, 1, 'c2abb572-93a8-4365-aac2-77d33b12c7d2'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi8', 0, NULL, 1, 'c2abb572-93a8-4365-aac2-77d33b12c7d2'),
('3aa05ed7-82e5-4c39-93f9-ecd22ad16730', 'svijnvi9', 0, NULL, 1, 'c2abb572-93a8-4365-aac2-77d33b12c7d2'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi1', 0, NULL, 1, 'b888ea59-f647-4558-82b2-fca8b6b70233'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi2', 0, NULL, 1, 'b888ea59-f647-4558-82b2-fca8b6b70233'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi3', 0, NULL, 1, 'b888ea59-f647-4558-82b2-fca8b6b70233'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi4', 0, NULL, 1, 'b888ea59-f647-4558-82b2-fca8b6b70233'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi5', 0, NULL, 1, 'b888ea59-f647-4558-82b2-fca8b6b70233'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi6', 0, NULL, 1, '33972678-ad73-4f73-9068-442ba055f45f'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi7', 0, NULL, 1, '33972678-ad73-4f73-9068-442ba055f45f'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi8', 0, NULL, 1, '33972678-ad73-4f73-9068-442ba055f45f'),
('648c3249-81f2-4d75-be85-bfc0d03e20dc', 'svijnvi9', 0, NULL, 1, '33972678-ad73-4f73-9068-442ba055f45f'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi1', 0, NULL, 1, '1d82cc9c-2ff3-49e1-8099-76da99e7a969'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi2', 0, NULL, 1, '1d82cc9c-2ff3-49e1-8099-76da99e7a969'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi3', 0, NULL, 1, '1d82cc9c-2ff3-49e1-8099-76da99e7a969'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi4', 0, NULL, 1, '1d82cc9c-2ff3-49e1-8099-76da99e7a969'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi5', 0, NULL, 1, '1d82cc9c-2ff3-49e1-8099-76da99e7a969'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi6', 0, NULL, 1, 'df71362c-7bd9-463b-b14a-003ac5c66c0a'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi7', 0, NULL, 1, 'df71362c-7bd9-463b-b14a-003ac5c66c0a'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi8', 0, NULL, 1, 'df71362c-7bd9-463b-b14a-003ac5c66c0a'),
('8b7c825d-a4fb-4477-b95c-58d95ceca869', 'svijnvi9', 0, NULL, 1, 'df71362c-7bd9-463b-b14a-003ac5c66c0a'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi1', 0, NULL, 1, 'a2c0423e-7fc5-492a-8e34-7810d78658a9'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi2', 0, NULL, 1, 'a2c0423e-7fc5-492a-8e34-7810d78658a9'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi3', 0, NULL, 1, 'a2c0423e-7fc5-492a-8e34-7810d78658a9'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi4', 0, NULL, 1, 'a2c0423e-7fc5-492a-8e34-7810d78658a9'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi5', 0, NULL, 1, 'a2c0423e-7fc5-492a-8e34-7810d78658a9'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi6', 0, NULL, 1, '9ae2a91f-04a3-4dec-a31d-2ab641d868af'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi7', 0, NULL, 1, '9ae2a91f-04a3-4dec-a31d-2ab641d868af'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi8', 0, NULL, 1, '9ae2a91f-04a3-4dec-a31d-2ab641d868af'),
('dfab2c83-8359-4907-a8bb-444fc9bc77e3', 'svijnvi9', 0, NULL, 1, '9ae2a91f-04a3-4dec-a31d-2ab641d868af'),
('wgfvekfugrvheuguik', 'svijnvi1', 0, NULL, 1, 'ed22c6e4-2613-4496-b1ae-68f1fcbc3590'),
('wgfvekfugrvheuguik', 'svijnvi2', 0, NULL, 1, 'ed22c6e4-2613-4496-b1ae-68f1fcbc3590'),
('wgfvekfugrvheuguik', 'svijnvi3', 0, NULL, 1, 'ed22c6e4-2613-4496-b1ae-68f1fcbc3590'),
('wgfvekfugrvheuguik', 'svijnvi4', 0, NULL, 1, 'ed22c6e4-2613-4496-b1ae-68f1fcbc3590'),
('wgfvekfugrvheuguik', 'svijnvi5', 0, NULL, 1, 'ed22c6e4-2613-4496-b1ae-68f1fcbc3590'),
('wgfvekfugrvheuguik', 'svijnvi6', 0, NULL, 1, 'aecd757b-cade-4cfc-9e89-94a3e7dceb54'),
('wgfvekfugrvheuguik', 'svijnvi7', 0, NULL, 1, 'aecd757b-cade-4cfc-9e89-94a3e7dceb54'),
('wgfvekfugrvheuguik', 'svijnvi8', 0, NULL, 1, 'aecd757b-cade-4cfc-9e89-94a3e7dceb54'),
('wgfvekfugrvheuguik', 'svijnvi9', 0, NULL, 1, 'aecd757b-cade-4cfc-9e89-94a3e7dceb54'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi1', 0, NULL, 1, 'a033a9d2-b323-4ad4-9ff4-7dbfe3f02d7f'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi2', 0, NULL, 1, 'a033a9d2-b323-4ad4-9ff4-7dbfe3f02d7f'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi3', 0, NULL, 1, 'a033a9d2-b323-4ad4-9ff4-7dbfe3f02d7f'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi4', 0, NULL, 1, 'a033a9d2-b323-4ad4-9ff4-7dbfe3f02d7f'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi5', 0, NULL, 1, 'a033a9d2-b323-4ad4-9ff4-7dbfe3f02d7f'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi6', 0, NULL, 1, 'bcd1024a-6b1e-4a57-850c-6ba70d91ed51'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi7', 0, NULL, 1, 'bcd1024a-6b1e-4a57-850c-6ba70d91ed51'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi8', 0, NULL, 1, 'bcd1024a-6b1e-4a57-850c-6ba70d91ed51'),
('21be8ef8-190f-4b0a-9876-5bc7838de33a', 'svijnvi9', 0, NULL, 1, 'bcd1024a-6b1e-4a57-850c-6ba70d91ed51'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi1', 0, NULL, 1, 'df82d7dc-06d6-4e91-8ecf-bb8525499283'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi2', 0, NULL, 1, 'df82d7dc-06d6-4e91-8ecf-bb8525499283'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi3', 0, NULL, 1, 'df82d7dc-06d6-4e91-8ecf-bb8525499283'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi4', 0, NULL, 1, 'df82d7dc-06d6-4e91-8ecf-bb8525499283'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi5', 0, NULL, 1, 'df82d7dc-06d6-4e91-8ecf-bb8525499283'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi6', 0, NULL, 1, '5f8b7db5-fee9-4ebc-8eda-4e8614f484ba'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi7', 0, NULL, 1, '5f8b7db5-fee9-4ebc-8eda-4e8614f484ba'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi8', 0, NULL, 1, '5f8b7db5-fee9-4ebc-8eda-4e8614f484ba'),
('8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', 'svijnvi9', 0, NULL, 1, '5f8b7db5-fee9-4ebc-8eda-4e8614f484ba'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi1', 0, NULL, 1, '1193b6c5-2100-462a-be01-77ee8ab6015e'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi2', 0, NULL, 1, '1193b6c5-2100-462a-be01-77ee8ab6015e'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi3', 0, NULL, 1, '1193b6c5-2100-462a-be01-77ee8ab6015e'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi4', 0, NULL, 1, '1193b6c5-2100-462a-be01-77ee8ab6015e'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi5', 0, NULL, 1, '1193b6c5-2100-462a-be01-77ee8ab6015e'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi6', 0, NULL, 1, '107bdf44-f6fd-4c2b-a64e-f8dd6988ccdc'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi7', 0, NULL, 1, '107bdf44-f6fd-4c2b-a64e-f8dd6988ccdc'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi8', 0, NULL, 1, '107bdf44-f6fd-4c2b-a64e-f8dd6988ccdc'),
('79866bd5-6fb2-4fc5-ba11-d2f7ae815644', 'svijnvi9', 0, NULL, 1, '107bdf44-f6fd-4c2b-a64e-f8dd6988ccdc'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi1', 0, NULL, 1, '81a73a1a-aa3d-417d-aff9-b07f0582490d'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi2', 0, NULL, 1, '81a73a1a-aa3d-417d-aff9-b07f0582490d'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi3', 0, NULL, 1, '81a73a1a-aa3d-417d-aff9-b07f0582490d'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi4', 0, NULL, 1, '81a73a1a-aa3d-417d-aff9-b07f0582490d'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi5', 0, NULL, 1, '81a73a1a-aa3d-417d-aff9-b07f0582490d'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi6', 0, NULL, 1, '65ebd1cc-08ed-4b70-bb05-951ceef4a677'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi7', 0, NULL, 1, '65ebd1cc-08ed-4b70-bb05-951ceef4a677'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi8', 0, NULL, 1, '65ebd1cc-08ed-4b70-bb05-951ceef4a677'),
('ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', 'svijnvi9', 0, NULL, 1, '65ebd1cc-08ed-4b70-bb05-951ceef4a677'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi1', 0, NULL, 1, 'f55c38a7-0f05-4d75-9455-f94c0ddcac9b'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi2', 0, NULL, 1, 'f55c38a7-0f05-4d75-9455-f94c0ddcac9b'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi3', 0, NULL, 1, 'f55c38a7-0f05-4d75-9455-f94c0ddcac9b'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi4', 0, NULL, 1, 'f55c38a7-0f05-4d75-9455-f94c0ddcac9b'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi5', 0, NULL, 1, 'f55c38a7-0f05-4d75-9455-f94c0ddcac9b'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi6', 0, NULL, 1, '1d3866ea-6d88-4db7-9350-05a1e6413fd2'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi7', 0, NULL, 1, '1d3866ea-6d88-4db7-9350-05a1e6413fd2'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi8', 0, NULL, 1, '1d3866ea-6d88-4db7-9350-05a1e6413fd2'),
('a45d1ff2-d0dd-4179-ab64-456b1231f86e', 'svijnvi9', 0, NULL, 1, '1d3866ea-6d88-4db7-9350-05a1e6413fd2'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi1', 0, NULL, 1, '6bf42469-154d-46b5-96f4-c3dd86424f62'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi2', 0, NULL, 1, '6bf42469-154d-46b5-96f4-c3dd86424f62'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi3', 0, NULL, 1, '6bf42469-154d-46b5-96f4-c3dd86424f62'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi4', 0, NULL, 1, '6bf42469-154d-46b5-96f4-c3dd86424f62'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi5', 0, NULL, 1, '6bf42469-154d-46b5-96f4-c3dd86424f62'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi6', 0, NULL, 1, '2df901b1-dd39-4f57-9499-6de876fb7205'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi7', 0, NULL, 1, '2df901b1-dd39-4f57-9499-6de876fb7205'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi8', 0, NULL, 1, '2df901b1-dd39-4f57-9499-6de876fb7205'),
('6206a853-19dc-4994-8c13-92d1b879189a', 'svijnvi9', 0, NULL, 1, '2df901b1-dd39-4f57-9499-6de876fb7205'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi1', 0, NULL, 1, '798c545d-11db-458c-a51a-b1faf36493ef'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi2', 0, NULL, 1, '798c545d-11db-458c-a51a-b1faf36493ef'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi3', 0, NULL, 1, '798c545d-11db-458c-a51a-b1faf36493ef'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi4', 0, NULL, 1, '798c545d-11db-458c-a51a-b1faf36493ef'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi5', 0, NULL, 1, '798c545d-11db-458c-a51a-b1faf36493ef'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi6', 0, NULL, 1, '03ccbbd2-779e-4b88-a1a7-58c8838e9b23'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi7', 0, NULL, 1, '03ccbbd2-779e-4b88-a1a7-58c8838e9b23'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi8', 0, NULL, 1, '03ccbbd2-779e-4b88-a1a7-58c8838e9b23'),
('ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', 'svijnvi9', 0, NULL, 1, '03ccbbd2-779e-4b88-a1a7-58c8838e9b23'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi1', 0, NULL, 1, '8828ca66-b883-4d7b-b2cb-fc6e15ddb2d8'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi2', 0, NULL, 1, '8828ca66-b883-4d7b-b2cb-fc6e15ddb2d8'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi3', 0, NULL, 1, '8828ca66-b883-4d7b-b2cb-fc6e15ddb2d8'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi4', 0, NULL, 1, '8828ca66-b883-4d7b-b2cb-fc6e15ddb2d8'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi5', 0, NULL, 1, '8828ca66-b883-4d7b-b2cb-fc6e15ddb2d8'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi6', 0, NULL, 1, '3ff7a1d5-d3d3-488d-9839-908220d16396'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi7', 0, NULL, 1, '3ff7a1d5-d3d3-488d-9839-908220d16396'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi8', 0, NULL, 1, '3ff7a1d5-d3d3-488d-9839-908220d16396'),
('fa2b6733-382f-4997-b61a-a5647d99b58d', 'svijnvi9', 0, NULL, 1, '3ff7a1d5-d3d3-488d-9839-908220d16396'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi1', 0, NULL, 1, 'b5448eb5-dd5b-437a-bb5a-a6382629989b'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi2', 0, NULL, 1, 'b5448eb5-dd5b-437a-bb5a-a6382629989b'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi3', 0, NULL, 1, 'b5448eb5-dd5b-437a-bb5a-a6382629989b'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi4', 0, NULL, 1, 'b5448eb5-dd5b-437a-bb5a-a6382629989b'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi5', 0, NULL, 1, 'b5448eb5-dd5b-437a-bb5a-a6382629989b'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi6', 0, NULL, 1, '78ffac41-ddbf-4519-9c0a-d801f9972913'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi7', 0, NULL, 1, '78ffac41-ddbf-4519-9c0a-d801f9972913'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi8', 0, NULL, 1, '78ffac41-ddbf-4519-9c0a-d801f9972913'),
('95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'svijnvi9', 0, NULL, 1, '78ffac41-ddbf-4519-9c0a-d801f9972913'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi1', 0, NULL, 1, '9c7ad9e8-7263-42d7-8ef1-bfedc420b699'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi2', 0, NULL, 1, '9c7ad9e8-7263-42d7-8ef1-bfedc420b699'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi3', 0, NULL, 1, '9c7ad9e8-7263-42d7-8ef1-bfedc420b699'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi4', 0, NULL, 1, '9c7ad9e8-7263-42d7-8ef1-bfedc420b699'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi5', 0, NULL, 1, '9c7ad9e8-7263-42d7-8ef1-bfedc420b699'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi6', 0, NULL, 1, '4fbf2dfb-4912-4d80-953c-15a1b810667c'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi7', 0, NULL, 1, '4fbf2dfb-4912-4d80-953c-15a1b810667c'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi8', 0, NULL, 1, '4fbf2dfb-4912-4d80-953c-15a1b810667c'),
('cb8bc6b0-5a84-4f23-b929-b08303939ce3', 'svijnvi9', 0, NULL, 1, '4fbf2dfb-4912-4d80-953c-15a1b810667c'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi1', 0, NULL, 1, 'c2811bf0-dfd0-46b3-8480-7478395cff42'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi2', 0, NULL, 1, 'c2811bf0-dfd0-46b3-8480-7478395cff42'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi3', 0, NULL, 1, 'c2811bf0-dfd0-46b3-8480-7478395cff42'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi4', 0, NULL, 1, 'c2811bf0-dfd0-46b3-8480-7478395cff42'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi5', 0, NULL, 1, 'c2811bf0-dfd0-46b3-8480-7478395cff42'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi6', 0, NULL, 1, '69527f07-49d3-4aa0-9716-cb9ed0ae3aec'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi7', 0, NULL, 1, '69527f07-49d3-4aa0-9716-cb9ed0ae3aec'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi8', 0, NULL, 1, '69527f07-49d3-4aa0-9716-cb9ed0ae3aec'),
('9710f5b7-eaca-4506-bce6-1574806012a9', 'svijnvi9', 0, NULL, 1, '69527f07-49d3-4aa0-9716-cb9ed0ae3aec'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi1', 0, NULL, 1, 'a8bcf23c-b52c-4e13-85cb-2160f4fbbfb6'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi2', 0, NULL, 1, 'a8bcf23c-b52c-4e13-85cb-2160f4fbbfb6'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi3', 0, NULL, 1, 'a8bcf23c-b52c-4e13-85cb-2160f4fbbfb6'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi4', 0, NULL, 1, 'a8bcf23c-b52c-4e13-85cb-2160f4fbbfb6'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi5', 0, NULL, 1, 'a8bcf23c-b52c-4e13-85cb-2160f4fbbfb6'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi6', 0, NULL, 1, 'ba031dc8-4371-4b96-b8c7-181d6c260950'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi7', 0, NULL, 1, 'ba031dc8-4371-4b96-b8c7-181d6c260950'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi8', 0, NULL, 1, 'ba031dc8-4371-4b96-b8c7-181d6c260950'),
('9528a4de-1f54-4766-861c-72e419e00873', 'svijnvi9', 0, NULL, 1, 'ba031dc8-4371-4b96-b8c7-181d6c260950'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi1', 0, NULL, 1, 'fee977bc-16cb-4bbf-ad96-91245257888d'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi2', 0, NULL, 1, 'fee977bc-16cb-4bbf-ad96-91245257888d'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi3', 0, NULL, 1, 'fee977bc-16cb-4bbf-ad96-91245257888d'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi4', 0, NULL, 1, 'fee977bc-16cb-4bbf-ad96-91245257888d'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi5', 0, NULL, 1, 'fee977bc-16cb-4bbf-ad96-91245257888d'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi6', 0, NULL, 1, '01510ead-8760-4a4d-8480-3cf2b8695dd8'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi7', 0, NULL, 1, '01510ead-8760-4a4d-8480-3cf2b8695dd8'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi8', 0, NULL, 1, '01510ead-8760-4a4d-8480-3cf2b8695dd8'),
('1602210b-32bf-4101-9f3d-07474a969729', 'svijnvi9', 0, NULL, 1, '01510ead-8760-4a4d-8480-3cf2b8695dd8'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi1', 0, NULL, 1, 'c3bc42cd-931f-4328-ad52-23cfc93cb8eb'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi2', 0, NULL, 1, 'c3bc42cd-931f-4328-ad52-23cfc93cb8eb'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi3', 0, NULL, 1, 'c3bc42cd-931f-4328-ad52-23cfc93cb8eb'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi4', 0, NULL, 1, 'c3bc42cd-931f-4328-ad52-23cfc93cb8eb'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi5', 0, NULL, 1, 'c3bc42cd-931f-4328-ad52-23cfc93cb8eb'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi6', 0, NULL, 1, '419cadbc-1f7f-487a-96bf-8e3b42e4111c'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi7', 0, NULL, 1, '419cadbc-1f7f-487a-96bf-8e3b42e4111c'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi8', 0, NULL, 1, '419cadbc-1f7f-487a-96bf-8e3b42e4111c'),
('b1a44181-b358-4bdd-a1be-17b860089004', 'svijnvi9', 0, NULL, 1, '419cadbc-1f7f-487a-96bf-8e3b42e4111c'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi1', 0, NULL, 1, 'cdec4aaa-7f51-4242-84a8-d561a3dbc6c3'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi2', 0, NULL, 1, 'cdec4aaa-7f51-4242-84a8-d561a3dbc6c3'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi3', 0, NULL, 1, 'cdec4aaa-7f51-4242-84a8-d561a3dbc6c3'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi4', 0, NULL, 1, 'cdec4aaa-7f51-4242-84a8-d561a3dbc6c3'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi5', 0, NULL, 1, 'cdec4aaa-7f51-4242-84a8-d561a3dbc6c3'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi6', 0, NULL, 1, '6da03698-be33-487e-b473-58153c93304c'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi7', 0, NULL, 1, '6da03698-be33-487e-b473-58153c93304c'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi8', 0, NULL, 1, '6da03698-be33-487e-b473-58153c93304c'),
('ff7e52bd-08f9-4c9e-b779-9cfea50b2987', 'svijnvi9', 0, NULL, 1, '6da03698-be33-487e-b473-58153c93304c'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi1', 0, NULL, 1, 'd8edcc3f-2363-481f-a2d4-b96a75af993e'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi2', 0, NULL, 1, 'd8edcc3f-2363-481f-a2d4-b96a75af993e'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi3', 0, NULL, 1, 'd8edcc3f-2363-481f-a2d4-b96a75af993e'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi4', 0, NULL, 1, 'd8edcc3f-2363-481f-a2d4-b96a75af993e'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi5', 0, NULL, 1, 'd8edcc3f-2363-481f-a2d4-b96a75af993e'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi6', 0, NULL, 1, '7980f098-9c88-41e5-a0cd-ac95ba002b56'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi7', 0, NULL, 1, '7980f098-9c88-41e5-a0cd-ac95ba002b56'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi8', 0, NULL, 1, '7980f098-9c88-41e5-a0cd-ac95ba002b56'),
('a7e4b985-b062-4d4b-8608-e8fd5176d846', 'svijnvi9', 0, NULL, 1, '7980f098-9c88-41e5-a0cd-ac95ba002b56'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi1', 0, NULL, 1, '900a3c2a-d251-479b-a697-5f2f25592fe7'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi2', 0, NULL, 1, '900a3c2a-d251-479b-a697-5f2f25592fe7'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi3', 0, NULL, 1, '900a3c2a-d251-479b-a697-5f2f25592fe7'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi4', 0, NULL, 1, '900a3c2a-d251-479b-a697-5f2f25592fe7'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi5', 0, NULL, 1, '900a3c2a-d251-479b-a697-5f2f25592fe7'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi6', 0, NULL, 1, '30e4472a-551f-43d1-b602-9f149eb124d3'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi7', 0, NULL, 1, '30e4472a-551f-43d1-b602-9f149eb124d3'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi8', 0, NULL, 1, '30e4472a-551f-43d1-b602-9f149eb124d3'),
('6311bc70-2384-4fb9-a814-a38c1293979a', 'svijnvi9', 0, NULL, 1, '30e4472a-551f-43d1-b602-9f149eb124d3'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi1', 0, NULL, 1, '3162cd94-b0fd-4f3b-8631-4e6e378cbbc9'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi2', 0, NULL, 1, '3162cd94-b0fd-4f3b-8631-4e6e378cbbc9'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi3', 0, NULL, 1, '3162cd94-b0fd-4f3b-8631-4e6e378cbbc9'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi4', 0, NULL, 1, '3162cd94-b0fd-4f3b-8631-4e6e378cbbc9'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi5', 0, NULL, 1, '3162cd94-b0fd-4f3b-8631-4e6e378cbbc9'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi6', 0, NULL, 1, '5bf87602-5e7d-45d7-bc96-512ec53a9f3e'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi7', 0, NULL, 1, '5bf87602-5e7d-45d7-bc96-512ec53a9f3e'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi8', 0, NULL, 1, '5bf87602-5e7d-45d7-bc96-512ec53a9f3e'),
('f157b68b-a18a-491a-a85d-b2f1ce176efd', 'svijnvi9', 0, NULL, 1, '5bf87602-5e7d-45d7-bc96-512ec53a9f3e'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi1', 0, NULL, 1, '5a852c56-3983-4498-8e84-aacf7da85328'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi2', 0, NULL, 1, '5a852c56-3983-4498-8e84-aacf7da85328'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi3', 0, NULL, 1, '5a852c56-3983-4498-8e84-aacf7da85328'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi4', 0, NULL, 1, '5a852c56-3983-4498-8e84-aacf7da85328'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi5', 0, NULL, 1, '5a852c56-3983-4498-8e84-aacf7da85328'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi6', 0, NULL, 1, '46904a6c-4d77-4de6-87ff-fff541482f36'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi7', 0, NULL, 1, '46904a6c-4d77-4de6-87ff-fff541482f36'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi8', 0, NULL, 1, '46904a6c-4d77-4de6-87ff-fff541482f36'),
('6cbf90eb-007c-4cf8-9414-3708af12bbd8', 'svijnvi9', 0, NULL, 1, '46904a6c-4d77-4de6-87ff-fff541482f36'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi1', 0, NULL, 1, '1644ca86-e335-4c91-a2f1-173dc96d11bd'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi2', 0, NULL, 1, '1644ca86-e335-4c91-a2f1-173dc96d11bd'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi3', 0, NULL, 1, '1644ca86-e335-4c91-a2f1-173dc96d11bd'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi4', 0, NULL, 1, '1644ca86-e335-4c91-a2f1-173dc96d11bd');
INSERT INTO `membersmeetingmapping` (`memberId`, `meetingId`, `notToPay`, `notToPayReason`, `isPaid`, `transactionId`) VALUES
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi5', 0, NULL, 1, '1644ca86-e335-4c91-a2f1-173dc96d11bd'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi6', 0, NULL, 1, 'c8bbc027-8202-47cf-9ca8-3de6f56ca591'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi7', 0, NULL, 1, 'c8bbc027-8202-47cf-9ca8-3de6f56ca591'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi8', 0, NULL, 1, 'c8bbc027-8202-47cf-9ca8-3de6f56ca591'),
('9183592e-d2eb-442e-a365-88d0a3480e8f', 'svijnvi9', 0, NULL, 1, 'c8bbc027-8202-47cf-9ca8-3de6f56ca591'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi1', 0, NULL, 1, '0edc64b4-762c-4479-82f7-8d631082f91e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi2', 0, NULL, 1, '0edc64b4-762c-4479-82f7-8d631082f91e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi3', 0, NULL, 1, '0edc64b4-762c-4479-82f7-8d631082f91e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi4', 0, NULL, 1, '0edc64b4-762c-4479-82f7-8d631082f91e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi5', 0, NULL, 1, '0edc64b4-762c-4479-82f7-8d631082f91e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi6', 0, NULL, 1, '631168f4-cb4e-49fc-883a-115fdfefa94e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi7', 0, NULL, 1, '631168f4-cb4e-49fc-883a-115fdfefa94e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi8', 0, NULL, 1, '631168f4-cb4e-49fc-883a-115fdfefa94e'),
('dcb08d7b-be78-46b9-8cda-4ef4d798067f', 'svijnvi9', 0, NULL, 1, '631168f4-cb4e-49fc-883a-115fdfefa94e'),
('efvelvhubrerikbjv', 'svijnvi1', 0, NULL, 1, 'e87cb7eb-c99c-4347-829f-a8d44ea9f975'),
('efvelvhubrerikbjv', 'svijnvi2', 0, NULL, 1, 'e87cb7eb-c99c-4347-829f-a8d44ea9f975'),
('efvelvhubrerikbjv', 'svijnvi3', 0, NULL, 1, 'e87cb7eb-c99c-4347-829f-a8d44ea9f975'),
('efvelvhubrerikbjv', 'svijnvi4', 0, NULL, 1, 'e87cb7eb-c99c-4347-829f-a8d44ea9f975'),
('efvelvhubrerikbjv', 'svijnvi5', 0, NULL, 1, 'e87cb7eb-c99c-4347-829f-a8d44ea9f975'),
('efvelvhubrerikbjv', 'svijnvi6', 0, NULL, 1, '558f5720-d231-485c-8111-1b450415a88f'),
('efvelvhubrerikbjv', 'svijnvi7', 0, NULL, 1, '558f5720-d231-485c-8111-1b450415a88f'),
('efvelvhubrerikbjv', 'svijnvi8', 0, NULL, 1, '558f5720-d231-485c-8111-1b450415a88f'),
('efvelvhubrerikbjv', 'svijnvi9', 0, NULL, 1, '558f5720-d231-485c-8111-1b450415a88f'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi1', 0, NULL, 1, '0c207c6b-8105-4a69-a9a8-2ead7f9e2eaf'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi2', 0, NULL, 1, '0c207c6b-8105-4a69-a9a8-2ead7f9e2eaf'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi3', 0, NULL, 1, '0c207c6b-8105-4a69-a9a8-2ead7f9e2eaf'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi4', 0, NULL, 1, '0c207c6b-8105-4a69-a9a8-2ead7f9e2eaf'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi5', 0, NULL, 1, '0c207c6b-8105-4a69-a9a8-2ead7f9e2eaf'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi6', 0, NULL, 1, 'cc8abebd-d6da-4293-86e3-5c9f6cd5e644'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi7', 0, NULL, 1, 'cc8abebd-d6da-4293-86e3-5c9f6cd5e644'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi8', 0, NULL, 1, 'cc8abebd-d6da-4293-86e3-5c9f6cd5e644'),
('6803dde4-3ff8-4f90-89e5-1355f80f8be9', 'svijnvi9', 0, NULL, 1, 'cc8abebd-d6da-4293-86e3-5c9f6cd5e644'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi1', 0, NULL, 1, '3f1ae3a8-9af2-43b4-847b-6156a538619d'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi2', 0, NULL, 1, '3f1ae3a8-9af2-43b4-847b-6156a538619d'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi3', 0, NULL, 1, '3f1ae3a8-9af2-43b4-847b-6156a538619d'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi4', 0, NULL, 1, '3f1ae3a8-9af2-43b4-847b-6156a538619d'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi5', 0, NULL, 1, '3f1ae3a8-9af2-43b4-847b-6156a538619d'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi6', 0, NULL, 1, 'b9dfb0fe-7921-4b8b-996c-ad1cebcbcd4b'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi7', 0, NULL, 1, 'b9dfb0fe-7921-4b8b-996c-ad1cebcbcd4b'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi8', 0, NULL, 1, 'b9dfb0fe-7921-4b8b-996c-ad1cebcbcd4b'),
('a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', 'svijnvi9', 0, NULL, 1, 'b9dfb0fe-7921-4b8b-996c-ad1cebcbcd4b'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi1', 0, NULL, 1, '9b664d0a-bc8d-45da-b629-344f21fd9bf7'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi2', 0, NULL, 1, '9b664d0a-bc8d-45da-b629-344f21fd9bf7'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi3', 0, NULL, 1, '9b664d0a-bc8d-45da-b629-344f21fd9bf7'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi4', 0, NULL, 1, '9b664d0a-bc8d-45da-b629-344f21fd9bf7'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi5', 0, NULL, 1, '9b664d0a-bc8d-45da-b629-344f21fd9bf7'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi6', 0, NULL, 1, 'aed229d8-185c-42c6-b7bd-f1ac20d7a30e'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi7', 0, NULL, 1, 'aed229d8-185c-42c6-b7bd-f1ac20d7a30e'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi8', 0, NULL, 1, 'aed229d8-185c-42c6-b7bd-f1ac20d7a30e'),
('00ab1826-2f42-45bf-93ba-48f7630643b3', 'svijnvi9', 0, NULL, 1, 'aed229d8-185c-42c6-b7bd-f1ac20d7a30e'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi1', 0, NULL, 1, '357addf5-df7a-4063-be64-245619738af7'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi2', 0, NULL, 1, '357addf5-df7a-4063-be64-245619738af7'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi3', 0, NULL, 1, '357addf5-df7a-4063-be64-245619738af7'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi4', 0, NULL, 1, '357addf5-df7a-4063-be64-245619738af7'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi5', 0, NULL, 1, '357addf5-df7a-4063-be64-245619738af7'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi6', 0, NULL, 1, '9be8a6e6-fc28-4c01-9a89-26c92a5fe6df'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi7', 0, NULL, 1, '9be8a6e6-fc28-4c01-9a89-26c92a5fe6df'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi8', 0, NULL, 1, '9be8a6e6-fc28-4c01-9a89-26c92a5fe6df'),
('1ff5ea10-3e23-486f-840b-49453f18fa09', 'svijnvi9', 0, NULL, 1, '9be8a6e6-fc28-4c01-9a89-26c92a5fe6df'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi1', 0, NULL, 1, '8f045e1e-3cd0-446f-b621-a95be02e99ff'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi2', 0, NULL, 1, '8f045e1e-3cd0-446f-b621-a95be02e99ff'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi3', 0, NULL, 1, '8f045e1e-3cd0-446f-b621-a95be02e99ff'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi4', 0, NULL, 1, '8f045e1e-3cd0-446f-b621-a95be02e99ff'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi5', 0, NULL, 1, '8f045e1e-3cd0-446f-b621-a95be02e99ff'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi6', 0, NULL, 1, '2a5ea609-ff05-4eec-a93c-3b6a3ca0535e'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi7', 0, NULL, 1, '2a5ea609-ff05-4eec-a93c-3b6a3ca0535e'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi8', 0, NULL, 1, '2a5ea609-ff05-4eec-a93c-3b6a3ca0535e'),
('0a249dc1-b121-4142-894c-acb6138971ca', 'svijnvi9', 0, NULL, 1, '2a5ea609-ff05-4eec-a93c-3b6a3ca0535e'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi1', 0, NULL, 1, '6f845d2b-419a-4b4d-9960-ca4ee8956856'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi2', 0, NULL, 1, '6f845d2b-419a-4b4d-9960-ca4ee8956856'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi3', 0, NULL, 1, '6f845d2b-419a-4b4d-9960-ca4ee8956856'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi4', 0, NULL, 1, '6f845d2b-419a-4b4d-9960-ca4ee8956856'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi5', 0, NULL, 1, '6f845d2b-419a-4b4d-9960-ca4ee8956856'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi6', 0, NULL, 1, '51639bac-e8af-4dd9-a5a2-4e120a681b6a'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi7', 0, NULL, 1, '51639bac-e8af-4dd9-a5a2-4e120a681b6a'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi8', 0, NULL, 1, '51639bac-e8af-4dd9-a5a2-4e120a681b6a'),
('3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', 'svijnvi9', 0, NULL, 1, '51639bac-e8af-4dd9-a5a2-4e120a681b6a'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi1', 0, NULL, 1, '9bd74391-e922-4274-a496-450043c554cb'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi2', 0, NULL, 1, '9bd74391-e922-4274-a496-450043c554cb'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi3', 0, NULL, 1, '9bd74391-e922-4274-a496-450043c554cb'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi4', 0, NULL, 1, '9bd74391-e922-4274-a496-450043c554cb'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi5', 0, NULL, 1, '9bd74391-e922-4274-a496-450043c554cb'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi6', 0, NULL, 1, 'a18f919a-cdac-4044-ae2f-465153b13a91'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi7', 0, NULL, 1, 'a18f919a-cdac-4044-ae2f-465153b13a91'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi8', 0, NULL, 1, 'a18f919a-cdac-4044-ae2f-465153b13a91'),
('ca16fd50-713a-420d-8c1d-e2a964917d67', 'svijnvi9', 0, NULL, 1, 'a18f919a-cdac-4044-ae2f-465153b13a91'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi1', 0, NULL, 1, 'e8ae5875-f3df-449f-8d74-b5b5885913c3'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi2', 0, NULL, 1, 'e8ae5875-f3df-449f-8d74-b5b5885913c3'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi3', 0, NULL, 1, 'e8ae5875-f3df-449f-8d74-b5b5885913c3'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi4', 0, NULL, 1, 'e8ae5875-f3df-449f-8d74-b5b5885913c3'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi5', 0, NULL, 1, 'e8ae5875-f3df-449f-8d74-b5b5885913c3'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi6', 0, NULL, 1, '341bc2b8-7b0b-4bd5-aabd-4585500ffa7a'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi7', 0, NULL, 1, '341bc2b8-7b0b-4bd5-aabd-4585500ffa7a'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi8', 0, NULL, 1, '341bc2b8-7b0b-4bd5-aabd-4585500ffa7a'),
('d5a002ef-9d33-40c5-b61f-1e081272e912', 'svijnvi9', 0, NULL, 1, '341bc2b8-7b0b-4bd5-aabd-4585500ffa7a'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi1', 0, NULL, 1, 'ae7e5dae-222d-4c7e-98ab-1d8079070b94'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi2', 0, NULL, 1, 'ae7e5dae-222d-4c7e-98ab-1d8079070b94'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi3', 0, NULL, 1, 'ae7e5dae-222d-4c7e-98ab-1d8079070b94'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi4', 0, NULL, 1, 'ae7e5dae-222d-4c7e-98ab-1d8079070b94'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi5', 0, NULL, 1, 'ae7e5dae-222d-4c7e-98ab-1d8079070b94'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi6', 0, NULL, 1, '8e2b0f4b-b1d1-47a1-aeeb-5af847ca7d20'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi7', 0, NULL, 1, '8e2b0f4b-b1d1-47a1-aeeb-5af847ca7d20'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi8', 0, NULL, 1, '8e2b0f4b-b1d1-47a1-aeeb-5af847ca7d20'),
('85ef7ea8-66aa-499d-b013-a9cbf0a813e8', 'svijnvi9', 0, NULL, 1, '8e2b0f4b-b1d1-47a1-aeeb-5af847ca7d20'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi1', 0, NULL, 1, 'a6dad1e3-c033-4fc8-9f3f-4f9f80bd15c9'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi2', 0, NULL, 1, 'a6dad1e3-c033-4fc8-9f3f-4f9f80bd15c9'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi3', 0, NULL, 1, 'a6dad1e3-c033-4fc8-9f3f-4f9f80bd15c9'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi4', 0, NULL, 1, 'a6dad1e3-c033-4fc8-9f3f-4f9f80bd15c9'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi5', 0, NULL, 1, 'a6dad1e3-c033-4fc8-9f3f-4f9f80bd15c9'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi6', 0, NULL, 1, 'ba0eef33-a31d-40af-8da2-56cc7174b75d'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi7', 0, NULL, 1, 'ba0eef33-a31d-40af-8da2-56cc7174b75d'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi8', 0, NULL, 1, 'ba0eef33-a31d-40af-8da2-56cc7174b75d'),
('f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', 'svijnvi9', 0, NULL, 1, 'ba0eef33-a31d-40af-8da2-56cc7174b75d'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi1', 0, NULL, 1, '0c6afff4-b94c-4fe0-8c75-9c91085d64e7'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi2', 0, NULL, 1, '0c6afff4-b94c-4fe0-8c75-9c91085d64e7'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi3', 0, NULL, 1, '0c6afff4-b94c-4fe0-8c75-9c91085d64e7'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi4', 0, NULL, 1, '0c6afff4-b94c-4fe0-8c75-9c91085d64e7'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi5', 0, NULL, 1, '0c6afff4-b94c-4fe0-8c75-9c91085d64e7'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi6', 0, NULL, 1, '351b0ac9-842b-4b4b-b4a6-8b63a6867dce'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi7', 0, NULL, 1, '351b0ac9-842b-4b4b-b4a6-8b63a6867dce'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi8', 0, NULL, 1, '351b0ac9-842b-4b4b-b4a6-8b63a6867dce'),
('0e9468c4-b81c-4003-8559-34356fa354b9', 'svijnvi9', 0, NULL, 1, '351b0ac9-842b-4b4b-b4a6-8b63a6867dce'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi1', 0, NULL, 1, 'c41c5340-3ec3-4541-a32f-9f43fa635e33'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi2', 0, NULL, 1, 'c41c5340-3ec3-4541-a32f-9f43fa635e33'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi3', 0, NULL, 1, 'c41c5340-3ec3-4541-a32f-9f43fa635e33'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi4', 0, NULL, 1, 'c41c5340-3ec3-4541-a32f-9f43fa635e33'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi5', 0, NULL, 1, 'c41c5340-3ec3-4541-a32f-9f43fa635e33'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi6', 0, NULL, 1, '7906862a-2fb8-4e6f-9bbd-e35e1e00cf91'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi7', 0, NULL, 1, '7906862a-2fb8-4e6f-9bbd-e35e1e00cf91'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi8', 0, NULL, 1, '7906862a-2fb8-4e6f-9bbd-e35e1e00cf91'),
('aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', 'svijnvi9', 0, NULL, 1, '7906862a-2fb8-4e6f-9bbd-e35e1e00cf91'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi1', 0, NULL, 1, '9af53df3-12c4-4ac1-bb1c-72780a9504e5'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi2', 0, NULL, 1, '9af53df3-12c4-4ac1-bb1c-72780a9504e5'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi3', 0, NULL, 1, '9af53df3-12c4-4ac1-bb1c-72780a9504e5'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi4', 0, NULL, 1, '9af53df3-12c4-4ac1-bb1c-72780a9504e5'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi5', 0, NULL, 1, '9af53df3-12c4-4ac1-bb1c-72780a9504e5'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi6', 0, NULL, 1, '723c692f-1575-4a31-b94c-bccfd777270b'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi7', 0, NULL, 1, '723c692f-1575-4a31-b94c-bccfd777270b'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi8', 0, NULL, 1, '723c692f-1575-4a31-b94c-bccfd777270b'),
('98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', 'svijnvi9', 0, NULL, 1, '723c692f-1575-4a31-b94c-bccfd777270b'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi1', 0, NULL, 1, '19b911cc-7518-4629-a2df-bd362f2d88b4'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi2', 0, NULL, 1, '19b911cc-7518-4629-a2df-bd362f2d88b4'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi3', 0, NULL, 1, '19b911cc-7518-4629-a2df-bd362f2d88b4'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi4', 0, NULL, 1, '19b911cc-7518-4629-a2df-bd362f2d88b4'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi5', 0, NULL, 1, '19b911cc-7518-4629-a2df-bd362f2d88b4'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi6', 0, NULL, 1, '22fc0631-64d8-4a3b-9de0-3577bbffbe2b'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi7', 0, NULL, 1, '22fc0631-64d8-4a3b-9de0-3577bbffbe2b'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi8', 0, NULL, 1, '22fc0631-64d8-4a3b-9de0-3577bbffbe2b'),
('661b4895-9b7a-4dcd-87ea-67d867bb08c1', 'svijnvi9', 0, NULL, 1, '22fc0631-64d8-4a3b-9de0-3577bbffbe2b'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi1', 0, NULL, 1, 'f5213ee0-b915-4250-aacd-6267187eca23'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi2', 0, NULL, 1, 'f5213ee0-b915-4250-aacd-6267187eca23'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi3', 0, NULL, 1, 'f5213ee0-b915-4250-aacd-6267187eca23'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi4', 0, NULL, 1, 'f5213ee0-b915-4250-aacd-6267187eca23'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi5', 0, NULL, 1, 'f5213ee0-b915-4250-aacd-6267187eca23'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi6', 0, NULL, 1, '7df2bf0c-9866-4d58-aa02-25bb089ad6d9'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi7', 0, NULL, 1, '7df2bf0c-9866-4d58-aa02-25bb089ad6d9'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi8', 0, NULL, 1, '7df2bf0c-9866-4d58-aa02-25bb089ad6d9'),
('fbe36553-e184-48b0-956a-d1e91eece826', 'svijnvi9', 0, NULL, 1, '7df2bf0c-9866-4d58-aa02-25bb089ad6d9'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi1', 0, NULL, 1, '9da0f61a-155e-4535-8d16-c30e5af53540'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi2', 0, NULL, 1, '9da0f61a-155e-4535-8d16-c30e5af53540'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi3', 0, NULL, 1, '9da0f61a-155e-4535-8d16-c30e5af53540'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi4', 0, NULL, 1, '9da0f61a-155e-4535-8d16-c30e5af53540'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi5', 0, NULL, 1, '9da0f61a-155e-4535-8d16-c30e5af53540'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi6', 0, NULL, 1, 'a5cc1548-cd9a-422b-bf12-51da74d595e7'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi7', 0, NULL, 1, 'a5cc1548-cd9a-422b-bf12-51da74d595e7'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi8', 0, NULL, 1, 'a5cc1548-cd9a-422b-bf12-51da74d595e7'),
('d1915bae-b021-41ab-96f8-4f08733167b6', 'svijnvi9', 0, NULL, 1, 'a5cc1548-cd9a-422b-bf12-51da74d595e7'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi1', 0, NULL, 1, '6fe7ba30-cac9-4e48-9a4f-78bd23694a4d'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi2', 0, NULL, 1, '6fe7ba30-cac9-4e48-9a4f-78bd23694a4d'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi3', 0, NULL, 1, '6fe7ba30-cac9-4e48-9a4f-78bd23694a4d'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi4', 0, NULL, 1, '6fe7ba30-cac9-4e48-9a4f-78bd23694a4d'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi5', 0, NULL, 1, '6fe7ba30-cac9-4e48-9a4f-78bd23694a4d'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi6', 0, NULL, 1, 'f4266d14-df83-468d-85e9-1a1defd3b7a5'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi7', 0, NULL, 1, 'f4266d14-df83-468d-85e9-1a1defd3b7a5'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi8', 0, NULL, 1, 'f4266d14-df83-468d-85e9-1a1defd3b7a5'),
('0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', 'svijnvi9', 0, NULL, 1, 'f4266d14-df83-468d-85e9-1a1defd3b7a5'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi1', 0, NULL, 1, '33757321-4968-432d-aedf-213b681bfdd3'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi2', 0, NULL, 1, '33757321-4968-432d-aedf-213b681bfdd3'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi3', 0, NULL, 1, '33757321-4968-432d-aedf-213b681bfdd3'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi4', 0, NULL, 1, '33757321-4968-432d-aedf-213b681bfdd3'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi5', 0, NULL, 1, '33757321-4968-432d-aedf-213b681bfdd3'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi6', 0, NULL, 1, 'b2bdfbdd-fb15-42d9-b4dc-1856e0b1383f'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi7', 0, NULL, 1, 'b2bdfbdd-fb15-42d9-b4dc-1856e0b1383f'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi8', 0, NULL, 1, 'b2bdfbdd-fb15-42d9-b4dc-1856e0b1383f'),
('1692338e-d74a-49cf-adec-4db406a27d6f', 'svijnvi9', 0, NULL, 1, 'b2bdfbdd-fb15-42d9-b4dc-1856e0b1383f'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi1', 0, NULL, 1, '5bf8b92f-c591-4244-b5c6-99797dee7a2e'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi2', 0, NULL, 1, '5bf8b92f-c591-4244-b5c6-99797dee7a2e'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi3', 0, NULL, 1, '5bf8b92f-c591-4244-b5c6-99797dee7a2e'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi4', 0, NULL, 1, '5bf8b92f-c591-4244-b5c6-99797dee7a2e'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi5', 0, NULL, 1, '5bf8b92f-c591-4244-b5c6-99797dee7a2e'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi6', 0, NULL, 1, 'c434b653-47f2-42cc-910f-46632e9759c4'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi7', 0, NULL, 1, 'c434b653-47f2-42cc-910f-46632e9759c4'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi8', 0, NULL, 1, 'c434b653-47f2-42cc-910f-46632e9759c4'),
('987d78c5-580d-4418-8393-802e73f84cae', 'svijnvi9', 0, NULL, 1, 'c434b653-47f2-42cc-910f-46632e9759c4'),
('ergioheohjgbiehjgbdl', 'svijnvi1', 0, NULL, 1, 'e9d4ae02-dcfd-4bb8-baf2-8bfe6d12f62b'),
('ergioheohjgbiehjgbdl', 'svijnvi2', 0, NULL, 1, 'e9d4ae02-dcfd-4bb8-baf2-8bfe6d12f62b'),
('ergioheohjgbiehjgbdl', 'svijnvi3', 0, NULL, 1, 'e9d4ae02-dcfd-4bb8-baf2-8bfe6d12f62b'),
('ergioheohjgbiehjgbdl', 'svijnvi4', 0, NULL, 1, 'e9d4ae02-dcfd-4bb8-baf2-8bfe6d12f62b'),
('ergioheohjgbiehjgbdl', 'svijnvi5', 0, NULL, 1, 'e9d4ae02-dcfd-4bb8-baf2-8bfe6d12f62b'),
('ergioheohjgbiehjgbdl', 'svijnvi6', 0, NULL, 1, 'a5e27414-f0ac-4041-a9a2-7b5bef409f9f'),
('ergioheohjgbiehjgbdl', 'svijnvi7', 0, NULL, 1, 'a5e27414-f0ac-4041-a9a2-7b5bef409f9f'),
('ergioheohjgbiehjgbdl', 'svijnvi8', 0, NULL, 1, 'a5e27414-f0ac-4041-a9a2-7b5bef409f9f'),
('ergioheohjgbiehjgbdl', 'svijnvi9', 0, NULL, 1, 'a5e27414-f0ac-4041-a9a2-7b5bef409f9f'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi1', 0, NULL, 1, '0a5d3d4e-ee90-4bb1-8734-9d7b6dbadc61'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi2', 0, NULL, 1, '0a5d3d4e-ee90-4bb1-8734-9d7b6dbadc61'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi3', 0, NULL, 1, '0a5d3d4e-ee90-4bb1-8734-9d7b6dbadc61'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi4', 0, NULL, 1, '0a5d3d4e-ee90-4bb1-8734-9d7b6dbadc61'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi5', 0, NULL, 1, '0a5d3d4e-ee90-4bb1-8734-9d7b6dbadc61'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi6', 0, NULL, 1, 'ffbceb81-e61c-4278-b629-123537f94ef1'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi7', 0, NULL, 1, 'ffbceb81-e61c-4278-b629-123537f94ef1'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi8', 0, NULL, 1, 'ffbceb81-e61c-4278-b629-123537f94ef1'),
('20f63507-5d55-49e5-a0d4-31398c0c3df5', 'svijnvi9', 0, NULL, 1, 'ffbceb81-e61c-4278-b629-123537f94ef1'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi1', 0, NULL, 1, 'd18a04ad-240a-4e7e-946b-bccbf25898b1'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi2', 0, NULL, 1, 'd18a04ad-240a-4e7e-946b-bccbf25898b1'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi3', 0, NULL, 1, 'd18a04ad-240a-4e7e-946b-bccbf25898b1'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi4', 0, NULL, 1, 'd18a04ad-240a-4e7e-946b-bccbf25898b1'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi5', 0, NULL, 1, 'd18a04ad-240a-4e7e-946b-bccbf25898b1'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi6', 0, NULL, 1, 'fdcac840-aa73-4c9a-a77a-7060664d8e3f'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi7', 0, NULL, 1, 'fdcac840-aa73-4c9a-a77a-7060664d8e3f'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi8', 0, NULL, 1, 'fdcac840-aa73-4c9a-a77a-7060664d8e3f'),
('a59979b0-bcbf-4f43-896d-a798113f22ff', 'svijnvi9', 0, NULL, 1, 'fdcac840-aa73-4c9a-a77a-7060664d8e3f'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi1', 0, NULL, 1, 'baf9c8bc-aad1-4291-8bac-e6cc0dc7dd13'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi2', 0, NULL, 1, 'baf9c8bc-aad1-4291-8bac-e6cc0dc7dd13'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi3', 0, NULL, 1, 'baf9c8bc-aad1-4291-8bac-e6cc0dc7dd13'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi4', 0, NULL, 1, 'baf9c8bc-aad1-4291-8bac-e6cc0dc7dd13'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi5', 0, NULL, 1, 'baf9c8bc-aad1-4291-8bac-e6cc0dc7dd13'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi6', 0, NULL, 1, 'e7e53a7b-ae28-4ed6-b621-534bc6f3466f'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi7', 0, NULL, 1, 'e7e53a7b-ae28-4ed6-b621-534bc6f3466f'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi8', 0, NULL, 1, 'e7e53a7b-ae28-4ed6-b621-534bc6f3466f'),
('c8da3084-16b0-4756-8aa7-ed818461be0d', 'svijnvi9', 0, NULL, 1, 'e7e53a7b-ae28-4ed6-b621-534bc6f3466f'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi1', 0, NULL, 1, 'b2d86f4c-4058-4278-9586-bac748b3a012'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi2', 0, NULL, 1, 'b2d86f4c-4058-4278-9586-bac748b3a012'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi3', 0, NULL, 1, 'b2d86f4c-4058-4278-9586-bac748b3a012'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi4', 0, NULL, 1, 'b2d86f4c-4058-4278-9586-bac748b3a012'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi5', 0, NULL, 1, 'b2d86f4c-4058-4278-9586-bac748b3a012'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi6', 0, NULL, 1, '5a65bff4-1050-4c91-ad04-4df4314b8495'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi7', 0, NULL, 1, '5a65bff4-1050-4c91-ad04-4df4314b8495'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi8', 0, NULL, 1, '5a65bff4-1050-4c91-ad04-4df4314b8495'),
('b7fc1185-3874-4183-af99-0e4824bd1021', 'svijnvi9', 0, NULL, 1, '5a65bff4-1050-4c91-ad04-4df4314b8495'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi1', 0, NULL, 1, 'd9564387-f83f-4dfb-b73f-bd2ec7790173'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi2', 0, NULL, 1, 'd9564387-f83f-4dfb-b73f-bd2ec7790173'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi3', 0, NULL, 1, 'd9564387-f83f-4dfb-b73f-bd2ec7790173'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi4', 0, NULL, 1, 'd9564387-f83f-4dfb-b73f-bd2ec7790173'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi5', 0, NULL, 1, 'd9564387-f83f-4dfb-b73f-bd2ec7790173'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi6', 0, NULL, 1, '528b3d7d-5fee-4f3a-9a72-4aed319d5970'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi7', 0, NULL, 1, '528b3d7d-5fee-4f3a-9a72-4aed319d5970'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi8', 0, NULL, 1, '528b3d7d-5fee-4f3a-9a72-4aed319d5970'),
('c5afbebd-86d2-4389-a23b-4e61b2120ebe', 'svijnvi9', 0, NULL, 1, '528b3d7d-5fee-4f3a-9a72-4aed319d5970'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi1', 0, NULL, 1, 'f4185a0e-663d-4e7e-801d-99cc68ad4af5'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi2', 0, NULL, 1, 'f4185a0e-663d-4e7e-801d-99cc68ad4af5'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi3', 0, NULL, 1, 'f4185a0e-663d-4e7e-801d-99cc68ad4af5'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi4', 0, NULL, 1, 'f4185a0e-663d-4e7e-801d-99cc68ad4af5'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi5', 0, NULL, 1, 'f4185a0e-663d-4e7e-801d-99cc68ad4af5'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi6', 0, NULL, 1, 'f430d935-5af2-414f-baa8-0328d7574496'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi7', 0, NULL, 1, 'f430d935-5af2-414f-baa8-0328d7574496'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi8', 0, NULL, 1, 'f430d935-5af2-414f-baa8-0328d7574496'),
('457594ba-8bea-4f3f-89bc-7a0ddd188e6b', 'svijnvi9', 0, NULL, 1, 'f430d935-5af2-414f-baa8-0328d7574496'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi1', 0, NULL, 1, '29f3dd95-5a02-4781-ae00-fe887b861cb5'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi2', 0, NULL, 1, '29f3dd95-5a02-4781-ae00-fe887b861cb5'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi3', 0, NULL, 1, '29f3dd95-5a02-4781-ae00-fe887b861cb5'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi4', 0, NULL, 1, '29f3dd95-5a02-4781-ae00-fe887b861cb5'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi5', 0, NULL, 1, '29f3dd95-5a02-4781-ae00-fe887b861cb5'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi6', 0, NULL, 1, 'c704274d-0866-49de-a7c0-797e16881ab7'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi7', 0, NULL, 1, 'c704274d-0866-49de-a7c0-797e16881ab7'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi8', 0, NULL, 1, 'c704274d-0866-49de-a7c0-797e16881ab7'),
('70685edf-d0d7-4dfe-be7c-66c4644e6cdf', 'svijnvi9', 0, NULL, 1, 'c704274d-0866-49de-a7c0-797e16881ab7'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi1', 0, NULL, 1, '78288504-43ea-48cd-beee-f9f29dc290e6'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi2', 0, NULL, 1, '78288504-43ea-48cd-beee-f9f29dc290e6'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi3', 0, NULL, 1, '78288504-43ea-48cd-beee-f9f29dc290e6'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi4', 0, NULL, 1, '78288504-43ea-48cd-beee-f9f29dc290e6'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi5', 0, NULL, 1, '78288504-43ea-48cd-beee-f9f29dc290e6'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi6', 0, NULL, 1, '2fa2917c-2a4c-44aa-bc6d-eaa06b8bc8d7'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi7', 0, NULL, 1, '2fa2917c-2a4c-44aa-bc6d-eaa06b8bc8d7'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi8', 0, NULL, 1, '2fa2917c-2a4c-44aa-bc6d-eaa06b8bc8d7'),
('esxrdtcfhvjbgjkjbghvfcvgjbl', 'svijnvi9', 0, NULL, 1, '2fa2917c-2a4c-44aa-bc6d-eaa06b8bc8d7'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi1', 0, NULL, 1, 'ed4b0202-d6c7-4a5a-972b-69951e72616c'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi2', 0, NULL, 1, 'ed4b0202-d6c7-4a5a-972b-69951e72616c'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi3', 0, NULL, 1, 'ed4b0202-d6c7-4a5a-972b-69951e72616c'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi4', 0, NULL, 1, 'ed4b0202-d6c7-4a5a-972b-69951e72616c'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi5', 0, NULL, 1, 'ed4b0202-d6c7-4a5a-972b-69951e72616c'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi6', 0, NULL, 1, 'eeaee1e7-6a8d-4927-892f-30d2c42beb67'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi7', 0, NULL, 1, 'eeaee1e7-6a8d-4927-892f-30d2c42beb67'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi8', 0, NULL, 1, 'eeaee1e7-6a8d-4927-892f-30d2c42beb67'),
('06aa9742-cf32-4abf-8f9a-131c788323b7', 'svijnvi9', 0, NULL, 1, 'eeaee1e7-6a8d-4927-892f-30d2c42beb67'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi1', 0, NULL, 1, '6868ed68-bb8a-4280-964d-934b7593ef72'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi2', 0, NULL, 1, '6868ed68-bb8a-4280-964d-934b7593ef72'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi3', 0, NULL, 1, '6868ed68-bb8a-4280-964d-934b7593ef72'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi4', 0, NULL, 1, '6868ed68-bb8a-4280-964d-934b7593ef72'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi5', 0, NULL, 1, '6868ed68-bb8a-4280-964d-934b7593ef72'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi6', 0, NULL, 1, '91b79d3a-c425-4147-9bf0-1b370b582776'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi7', 0, NULL, 1, '91b79d3a-c425-4147-9bf0-1b370b582776'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi8', 0, NULL, 1, '91b79d3a-c425-4147-9bf0-1b370b582776'),
('0523a517-07fa-4022-838f-8f404e29962c', 'svijnvi9', 0, NULL, 1, '91b79d3a-c425-4147-9bf0-1b370b582776'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi1', 0, NULL, 1, 'a501312f-7a76-42be-9522-0fd5315722c5'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi2', 0, NULL, 1, 'a501312f-7a76-42be-9522-0fd5315722c5'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi3', 0, NULL, 1, 'a501312f-7a76-42be-9522-0fd5315722c5'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi4', 0, NULL, 1, 'a501312f-7a76-42be-9522-0fd5315722c5'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi5', 0, NULL, 1, 'a501312f-7a76-42be-9522-0fd5315722c5'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi6', 0, NULL, 1, 'f91d6e2d-8a47-4ffa-bfae-d8682afbe8f6'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi7', 0, NULL, 1, 'f91d6e2d-8a47-4ffa-bfae-d8682afbe8f6'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi8', 0, NULL, 1, 'f91d6e2d-8a47-4ffa-bfae-d8682afbe8f6'),
('a40b052d-f0ab-479f-8090-3c7ba5c584ee', 'svijnvi9', 0, NULL, 1, 'f91d6e2d-8a47-4ffa-bfae-d8682afbe8f6'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi1', 0, NULL, 1, '6d5bc1f2-a40f-41dc-8db3-d8175ae21ff0'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi2', 0, NULL, 1, '6d5bc1f2-a40f-41dc-8db3-d8175ae21ff0'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi3', 0, NULL, 1, '6d5bc1f2-a40f-41dc-8db3-d8175ae21ff0'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi4', 0, NULL, 1, '6d5bc1f2-a40f-41dc-8db3-d8175ae21ff0'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi5', 0, NULL, 1, '6d5bc1f2-a40f-41dc-8db3-d8175ae21ff0'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi6', 0, NULL, 1, '52ba7cf9-8d20-462d-a66d-7cfb2d5c72fb'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi7', 0, NULL, 1, '52ba7cf9-8d20-462d-a66d-7cfb2d5c72fb'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi8', 0, NULL, 1, '52ba7cf9-8d20-462d-a66d-7cfb2d5c72fb'),
('f99909ea-6dd4-416c-b136-0b90b2250cfe', 'svijnvi9', 0, NULL, 1, '52ba7cf9-8d20-462d-a66d-7cfb2d5c72fb'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi1', 0, NULL, 1, 'd2c92929-8c52-4daf-a7bf-85e1001916a8'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi2', 0, NULL, 1, 'd2c92929-8c52-4daf-a7bf-85e1001916a8'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi3', 0, NULL, 1, 'd2c92929-8c52-4daf-a7bf-85e1001916a8'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi4', 0, NULL, 1, 'd2c92929-8c52-4daf-a7bf-85e1001916a8'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi5', 0, NULL, 1, 'd2c92929-8c52-4daf-a7bf-85e1001916a8'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi6', 0, NULL, 1, '2a47f080-cb9f-4f3f-bb09-fbc9e4d1e45d'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi7', 0, NULL, 1, '2a47f080-cb9f-4f3f-bb09-fbc9e4d1e45d'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi8', 0, NULL, 1, '2a47f080-cb9f-4f3f-bb09-fbc9e4d1e45d'),
('ecb9ed73-8859-48e2-ab39-35721c66c336', 'svijnvi9', 0, NULL, 1, '2a47f080-cb9f-4f3f-bb09-fbc9e4d1e45d'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi1', 0, NULL, 1, '28b782da-f2d8-4887-9e7e-2960e30ab4c1'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi2', 0, NULL, 1, '28b782da-f2d8-4887-9e7e-2960e30ab4c1'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi3', 0, NULL, 1, '28b782da-f2d8-4887-9e7e-2960e30ab4c1'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi4', 0, NULL, 1, '28b782da-f2d8-4887-9e7e-2960e30ab4c1'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi5', 0, NULL, 1, '28b782da-f2d8-4887-9e7e-2960e30ab4c1'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi6', 0, NULL, 1, 'afc9e271-2ece-4650-8588-e9ebea70cb1e'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi7', 0, NULL, 1, 'afc9e271-2ece-4650-8588-e9ebea70cb1e'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi8', 0, NULL, 1, 'afc9e271-2ece-4650-8588-e9ebea70cb1e'),
('01e54255-6531-4784-9305-6aff8eb6aac2', 'svijnvi9', 0, NULL, 1, 'afc9e271-2ece-4650-8588-e9ebea70cb1e'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi1', 0, NULL, 1, '3efb4533-d50a-4e57-8ce3-b9b645f5878d'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi2', 0, NULL, 1, '3efb4533-d50a-4e57-8ce3-b9b645f5878d'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi3', 0, NULL, 1, '3efb4533-d50a-4e57-8ce3-b9b645f5878d'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi4', 0, NULL, 1, '3efb4533-d50a-4e57-8ce3-b9b645f5878d'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi5', 0, NULL, 1, '3efb4533-d50a-4e57-8ce3-b9b645f5878d'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi6', 0, NULL, 1, 'c70d98b2-b490-4eb7-a273-0a81917f2e32'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi7', 0, NULL, 1, 'c70d98b2-b490-4eb7-a273-0a81917f2e32'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi8', 0, NULL, 1, 'c70d98b2-b490-4eb7-a273-0a81917f2e32'),
('803c0a05-becf-4b3e-b3d3-3a45820e8a89', 'svijnvi9', 0, NULL, 1, 'c70d98b2-b490-4eb7-a273-0a81917f2e32'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi1', 0, NULL, 1, 'c2309655-dbdf-442b-9ab2-6514ecea7bdb'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi2', 0, NULL, 1, 'c2309655-dbdf-442b-9ab2-6514ecea7bdb'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi3', 0, NULL, 1, 'c2309655-dbdf-442b-9ab2-6514ecea7bdb'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi4', 0, NULL, 1, 'c2309655-dbdf-442b-9ab2-6514ecea7bdb'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi5', 0, NULL, 1, 'c2309655-dbdf-442b-9ab2-6514ecea7bdb'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi6', 0, NULL, 1, '66c83cf1-1c18-43fe-954d-fe7c6f05c711'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi7', 0, NULL, 1, '66c83cf1-1c18-43fe-954d-fe7c6f05c711'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi8', 0, NULL, 1, '66c83cf1-1c18-43fe-954d-fe7c6f05c711'),
('17070e27-c48b-41c8-9743-57e8b737b693', 'svijnvi9', 0, NULL, 1, '66c83cf1-1c18-43fe-954d-fe7c6f05c711'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi1', 0, NULL, 1, '29b26887-cd7d-4a76-a20b-303e51735498'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi2', 0, NULL, 1, '29b26887-cd7d-4a76-a20b-303e51735498'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi3', 0, NULL, 1, '29b26887-cd7d-4a76-a20b-303e51735498'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi4', 0, NULL, 1, '29b26887-cd7d-4a76-a20b-303e51735498'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi5', 0, NULL, 1, '29b26887-cd7d-4a76-a20b-303e51735498'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi6', 0, NULL, 1, '93cd9879-3c1d-45ff-af79-30581baab91f'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi7', 0, NULL, 1, '93cd9879-3c1d-45ff-af79-30581baab91f'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi8', 0, NULL, 1, '93cd9879-3c1d-45ff-af79-30581baab91f'),
('4dbd5cc6-a639-496e-a06c-04d891cb6974', 'svijnvi9', 0, NULL, 1, '93cd9879-3c1d-45ff-af79-30581baab91f'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi1', 0, NULL, 1, '2ac657af-0468-4d63-860d-a4e2b6afb591'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi2', 0, NULL, 1, '2ac657af-0468-4d63-860d-a4e2b6afb591'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi3', 0, NULL, 1, '2ac657af-0468-4d63-860d-a4e2b6afb591'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi4', 0, NULL, 1, '2ac657af-0468-4d63-860d-a4e2b6afb591'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi5', 0, NULL, 1, '2ac657af-0468-4d63-860d-a4e2b6afb591'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi6', 0, NULL, 1, 'f5934fb7-005b-4427-969f-a097a47b185a'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi7', 0, NULL, 1, 'f5934fb7-005b-4427-969f-a097a47b185a'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi8', 0, NULL, 1, 'f5934fb7-005b-4427-969f-a097a47b185a'),
('026b9428-ebcb-478e-9a86-3eebce58d100', 'svijnvi9', 0, NULL, 1, 'f5934fb7-005b-4427-969f-a097a47b185a'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi1', 0, NULL, 1, '4da980e0-39b7-492f-b01b-bd27e8d5b6f8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi2', 0, NULL, 1, '4da980e0-39b7-492f-b01b-bd27e8d5b6f8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi3', 0, NULL, 1, '4da980e0-39b7-492f-b01b-bd27e8d5b6f8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi4', 0, NULL, 1, '4da980e0-39b7-492f-b01b-bd27e8d5b6f8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi5', 0, NULL, 1, '4da980e0-39b7-492f-b01b-bd27e8d5b6f8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi6', 0, NULL, 1, '2e45eac2-590e-41e3-8eac-370fde6555c8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi7', 0, NULL, 1, '2e45eac2-590e-41e3-8eac-370fde6555c8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi8', 0, NULL, 1, '2e45eac2-590e-41e3-8eac-370fde6555c8'),
('a2912248-8efc-4d69-be33-8c79b3a27c53', 'svijnvi9', 0, NULL, 1, '2e45eac2-590e-41e3-8eac-370fde6555c8'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi1', 0, NULL, 1, '7c4c5348-a4d6-41a0-8889-8caab659728e'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi2', 0, NULL, 1, '7c4c5348-a4d6-41a0-8889-8caab659728e'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi3', 0, NULL, 1, '7c4c5348-a4d6-41a0-8889-8caab659728e'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi4', 0, NULL, 1, '7c4c5348-a4d6-41a0-8889-8caab659728e'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi5', 0, NULL, 1, '7c4c5348-a4d6-41a0-8889-8caab659728e'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi6', 0, NULL, 1, '62670c21-96ee-493b-92c4-f7239c9295d1'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi7', 0, NULL, 1, '62670c21-96ee-493b-92c4-f7239c9295d1'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi8', 0, NULL, 1, '62670c21-96ee-493b-92c4-f7239c9295d1'),
('0975ffa1-6593-4ac6-b24b-19e56ba3aa85', 'svijnvi9', 0, NULL, 1, '62670c21-96ee-493b-92c4-f7239c9295d1'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi1', 0, NULL, 1, '1765cb95-5c1b-420a-9673-f20e48d848aa'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi2', 0, NULL, 1, '1765cb95-5c1b-420a-9673-f20e48d848aa'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi3', 0, NULL, 1, '1765cb95-5c1b-420a-9673-f20e48d848aa'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi4', 0, NULL, 1, '1765cb95-5c1b-420a-9673-f20e48d848aa'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi5', 0, NULL, 1, '1765cb95-5c1b-420a-9673-f20e48d848aa'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi6', 0, NULL, 1, '84101eac-841b-4918-b39b-9451d3ae14d4'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi7', 0, NULL, 1, '84101eac-841b-4918-b39b-9451d3ae14d4'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi8', 0, NULL, 1, '84101eac-841b-4918-b39b-9451d3ae14d4'),
('f531f39c-389f-4eb0-817f-7c856c247e3c', 'svijnvi9', 0, NULL, 1, '84101eac-841b-4918-b39b-9451d3ae14d4'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi1', 0, NULL, 1, '76b79e2d-c112-4bec-a43f-1cd2b764b3e5'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi2', 0, NULL, 1, '76b79e2d-c112-4bec-a43f-1cd2b764b3e5'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi3', 0, NULL, 1, '76b79e2d-c112-4bec-a43f-1cd2b764b3e5'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi4', 0, NULL, 1, '76b79e2d-c112-4bec-a43f-1cd2b764b3e5'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi5', 0, NULL, 1, '76b79e2d-c112-4bec-a43f-1cd2b764b3e5'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi6', 0, NULL, 1, '1d4bd028-8bc5-42da-a40b-6a25bddd047b'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi7', 0, NULL, 1, '1d4bd028-8bc5-42da-a40b-6a25bddd047b'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi8', 0, NULL, 1, '1d4bd028-8bc5-42da-a40b-6a25bddd047b'),
('3d6a69fb-abbb-4cc8-89ae-a60d298573d2', 'svijnvi9', 0, NULL, 1, '1d4bd028-8bc5-42da-a40b-6a25bddd047b'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi1', 0, NULL, 1, '53818b7c-f703-4cdc-93b9-91fc2729410b'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi2', 0, NULL, 1, '53818b7c-f703-4cdc-93b9-91fc2729410b'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi3', 0, NULL, 1, '53818b7c-f703-4cdc-93b9-91fc2729410b'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi4', 0, NULL, 1, '53818b7c-f703-4cdc-93b9-91fc2729410b'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi5', 0, NULL, 1, '53818b7c-f703-4cdc-93b9-91fc2729410b'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi6', 0, NULL, 1, '89db3014-e93e-4c24-9173-a836bb329e87'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi7', 0, NULL, 1, '89db3014-e93e-4c24-9173-a836bb329e87'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi8', 0, NULL, 1, '89db3014-e93e-4c24-9173-a836bb329e87'),
('059b4163-157f-476e-b16c-d136cb855861', 'svijnvi9', 0, NULL, 1, '89db3014-e93e-4c24-9173-a836bb329e87'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi1', 0, NULL, 1, '28446254-9e7a-4c05-91bd-46d4c8127575'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi2', 0, NULL, 1, '28446254-9e7a-4c05-91bd-46d4c8127575'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi3', 0, NULL, 1, '28446254-9e7a-4c05-91bd-46d4c8127575'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi4', 0, NULL, 1, '28446254-9e7a-4c05-91bd-46d4c8127575'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi5', 0, NULL, 1, '28446254-9e7a-4c05-91bd-46d4c8127575'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi6', 0, NULL, 1, '942ec033-02ea-469a-9cb0-b01d77bd1637'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi7', 0, NULL, 1, '942ec033-02ea-469a-9cb0-b01d77bd1637'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi8', 0, NULL, 1, '942ec033-02ea-469a-9cb0-b01d77bd1637'),
('b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', 'svijnvi9', 0, NULL, 1, '942ec033-02ea-469a-9cb0-b01d77bd1637'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi1', 0, NULL, 1, '0d5bdc85-b051-43d8-9785-e83df74b7aca'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi2', 0, NULL, 1, '0d5bdc85-b051-43d8-9785-e83df74b7aca'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi3', 0, NULL, 1, '0d5bdc85-b051-43d8-9785-e83df74b7aca'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi4', 0, NULL, 1, '0d5bdc85-b051-43d8-9785-e83df74b7aca'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi5', 0, NULL, 1, '0d5bdc85-b051-43d8-9785-e83df74b7aca'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi6', 0, NULL, 1, '7c5a2968-5ac8-4bcf-9f51-ba4c535b42ce'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi7', 0, NULL, 1, '7c5a2968-5ac8-4bcf-9f51-ba4c535b42ce'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi8', 0, NULL, 1, '7c5a2968-5ac8-4bcf-9f51-ba4c535b42ce'),
('dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', 'svijnvi9', 0, NULL, 1, '7c5a2968-5ac8-4bcf-9f51-ba4c535b42ce'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi1', 0, NULL, 1, 'f6de81b3-0eb3-4e5b-8a0b-4ea0a4884932'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi2', 0, NULL, 1, 'f6de81b3-0eb3-4e5b-8a0b-4ea0a4884932'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi3', 0, NULL, 1, 'f6de81b3-0eb3-4e5b-8a0b-4ea0a4884932'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi4', 0, NULL, 1, 'f6de81b3-0eb3-4e5b-8a0b-4ea0a4884932'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi5', 0, NULL, 1, 'f6de81b3-0eb3-4e5b-8a0b-4ea0a4884932'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi6', 0, NULL, 1, 'bf517f2d-1138-4d4e-8ede-9fe94205c29f'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi7', 0, NULL, 1, 'bf517f2d-1138-4d4e-8ede-9fe94205c29f'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi8', 0, NULL, 1, 'bf517f2d-1138-4d4e-8ede-9fe94205c29f'),
('f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', 'svijnvi9', 0, NULL, 1, 'bf517f2d-1138-4d4e-8ede-9fe94205c29f'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi1', 0, NULL, 1, '74ba5231-6c30-4197-9034-8d0aa38cc7fa'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi2', 0, NULL, 1, '74ba5231-6c30-4197-9034-8d0aa38cc7fa'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi3', 0, NULL, 1, '74ba5231-6c30-4197-9034-8d0aa38cc7fa'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi4', 0, NULL, 1, '74ba5231-6c30-4197-9034-8d0aa38cc7fa'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi5', 0, NULL, 1, '74ba5231-6c30-4197-9034-8d0aa38cc7fa'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi6', 0, NULL, 1, '2bfcd173-fbf1-4285-9e97-02fd3ba5c120'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi7', 0, NULL, 1, '2bfcd173-fbf1-4285-9e97-02fd3ba5c120'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi8', 0, NULL, 1, '2bfcd173-fbf1-4285-9e97-02fd3ba5c120'),
('3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', 'svijnvi9', 0, NULL, 1, '2bfcd173-fbf1-4285-9e97-02fd3ba5c120'),
('1', 'svijnvi6', 0, NULL, 1, '7f998417-030f-4f3e-ba2e-b7faafcef80f'),
('1', 'svijnvi7', 0, NULL, 1, '7f998417-030f-4f3e-ba2e-b7faafcef80f'),
('1', 'svijnvi8', 0, NULL, 1, '7f998417-030f-4f3e-ba2e-b7faafcef80f'),
('1', 'svijnvi9', 0, NULL, 1, '7f998417-030f-4f3e-ba2e-b7faafcef80f'),
('1', 'svijnvi1', 0, NULL, 1, 'd0f489d7-fc1a-4c49-b2bf-110be608b527'),
('1', 'svijnvi2', 0, NULL, 1, 'd0f489d7-fc1a-4c49-b2bf-110be608b527'),
('1', 'svijnvi3', 0, NULL, 1, 'd0f489d7-fc1a-4c49-b2bf-110be608b527'),
('1', 'svijnvi4', 0, NULL, 1, 'd0f489d7-fc1a-4c49-b2bf-110be608b527'),
('1', 'svijnvi5', 0, NULL, 1, 'd0f489d7-fc1a-4c49-b2bf-110be608b527'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi6', 0, NULL, 1, '35f6d595-8159-4c1b-a33a-f03a095b0fee'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi7', 0, NULL, 1, '35f6d595-8159-4c1b-a33a-f03a095b0fee'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi8', 0, NULL, 1, '35f6d595-8159-4c1b-a33a-f03a095b0fee'),
('4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', 'svijnvi9', 0, NULL, 1, '35f6d595-8159-4c1b-a33a-f03a095b0fee'),
('00f8530f-beef-46a8-8c7e-46cdb0fee931', 'svijnvi6', 0, NULL, 0, 'b23753fe-58d9-4a83-8bdf-4ce53c8a99a8'),
('00f8530f-beef-46a8-8c7e-46cdb0fee931', 'svijnvi7', 0, NULL, 0, 'b23753fe-58d9-4a83-8bdf-4ce53c8a99a8'),
('00f8530f-beef-46a8-8c7e-46cdb0fee931', 'svijnvi8', 0, NULL, 0, 'b23753fe-58d9-4a83-8bdf-4ce53c8a99a8'),
('00f8530f-beef-46a8-8c7e-46cdb0fee931', 'svijnvi9', 0, NULL, 0, 'b23753fe-58d9-4a83-8bdf-4ce53c8a99a8');

-- --------------------------------------------------------

--
-- Table structure for table `organisations`
--

CREATE TABLE `organisations` (
  `organisationId` varchar(255) NOT NULL,
  `organisationName` varchar(255) NOT NULL,
  `defaultRoles` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `organisations`
--

INSERT INTO `organisations` (`organisationId`, `organisationName`, `defaultRoles`) VALUES
('org1', 'BNI', '[{\"rights\": \"member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,fee_reciver_edit,approve_my_fee,approve_global_fee\", \"roleName\": \"President\", \"removeable\": false, \"roleDescription\": \"The President is the head of the organization\"}, {\"rights\": \"member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,fee_reciver_edit,approve_my_fee,approve_global_fee\", \"roleName\": \"Vice-President\", \"removeable\": false, \"roleDescription\": \"The Vice-President is the head of the organization\"}, {\"rights\": \"member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,approve_my_fee\", \"roleName\": \"Host Team\", \"removeable\": true, \"roleDescription\": \"The Host Team manages the visitors\"}, {\"rights\": \"member_fees,member_list,perosnal_profile,fee_reciver_edit,approve_my_fee,approve_global_fee\", \"roleName\": \"Finance Team\", \"removeable\": true, \"roleDescription\": \"The Finance Team manages the finances\"}, {\"rights\": \"member_fees,member_list,perosnal_profile\", \"roleName\": \"Member\", \"removeable\": false, \"roleDescription\": \"The Member is a regular member of the organization\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `otp_id` int NOT NULL,
  `member_id` varchar(255) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL DEFAULT '2038-01-18 16:14:07',
  `verified` tinyint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `otp_verifications`
--

INSERT INTO `otp_verifications` (`otp_id`, `member_id`, `otp_code`, `created_at`, `expires_at`, `verified`) VALUES
(1, '1', '359061', '2025-02-26 07:48:59', '2025-02-26 07:58:59', 0),
(2, '1', '874235', '2025-02-26 07:49:08', '2025-02-26 07:59:08', 0),
(3, '1', '911317', '2025-02-26 07:55:50', '2025-02-26 08:05:50', 0);

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `packageId` varchar(255) NOT NULL,
  `packageName` varchar(255) NOT NULL,
  `packageParent` varchar(255) DEFAULT NULL,
  `packageFeeType` varchar(255) DEFAULT NULL,
  `packageFeeAmount` bigint DEFAULT NULL,
  `packagePayableStartDate` date DEFAULT NULL,
  `packagePayableEndDate` date DEFAULT NULL,
  `allowAfterEndDate` tinyint(1) DEFAULT NULL,
  `allowPenaltyPayableAfterEndDate` tinyint(1) DEFAULT NULL,
  `penaltyType` varchar(255) DEFAULT NULL,
  `penaltyAmount` bigint DEFAULT NULL,
  `penaltyFrequency` varchar(255) DEFAULT NULL,
  `discountType` varchar(255) DEFAULT NULL,
  `discountAmount` bigint DEFAULT NULL,
  `discountFrequency` varchar(255) DEFAULT NULL,
  `discountEndDate` date DEFAULT NULL,
  `allowPackagePurchaseIfFeesPaid` tinyint(1) DEFAULT NULL,
  `meetingIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `chapterId` varchar(255) DEFAULT NULL
) ;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`packageId`, `packageName`, `packageParent`, `packageFeeType`, `packageFeeAmount`, `packagePayableStartDate`, `packagePayableEndDate`, `allowAfterEndDate`, `allowPenaltyPayableAfterEndDate`, `penaltyType`, `penaltyAmount`, `penaltyFrequency`, `discountType`, `discountAmount`, `discountFrequency`, `discountEndDate`, `allowPackagePurchaseIfFeesPaid`, `meetingIds`, `chapterId`) VALUES
('1', 'January', 'Monthly', 'Monthly', 4750, '2025-01-01', '2025-01-11', 1, 1, 'lumpsum', 1000, 'Per', NULL, 0, NULL, '2025-01-10', 1, '[\"svijnvi1\", \"svijnvi2\", \"svijnvi3\", \"svijnvi4\", \"svijnvi5\"]', '1'),
('2', 'February', 'Monthly', 'lumpsum', 3800, '2025-02-01', '2025-02-15', 1, 1, 'lumpsum', 1000, 'Twice', NULL, 0, NULL, '2025-02-14', 1, '[\"svijnvi6\", \"svijnvi7\", \"svijnvi8\", \"svijnvi9\"]', '1'),
('3', 'March', 'Monthly', 'Meetingly', 3800, '2025-03-01', '2025-03-15', 1, 1, 'lumpsum', 1000, 'Thrice', NULL, 0, NULL, '2025-03-14', 1, '[\"svijnvi10\", \"svijnvi11\", \"svijnvi12\", \"svijnvi13\"]', '1'),
('4', 'January-March', 'Quarterly', 'Daily', 11500, '2025-01-01', '2025-01-25', 0, 0, 'Daily', 100, 'Per', 'Daily', 100, 'Per', '2025-01-31', 1, '[\"svijnvi1\", \"svijnvi2\", \"svijnvi3\", \"svijnvi4\", \"svijnvi5\", \"svijnvi6\", \"svijnvi7\", \"svijnvi8\", \"svijnvi9\", \"svijnvi10\", \"svijnvi11\", \"svijnvi12\", \"svijnvi13\", \"svijnvi14\", \"svijnvi15\", \"svijnvi16\", \"svijnvi17\", \"svijnvi18\", \"svijnvi19\", \"svijnvi20\", \"svijnvi21\", \"svijnvi22\"]', '1');

-- --------------------------------------------------------

--
-- Table structure for table `qrreceivers`
--

CREATE TABLE `qrreceivers` (
  `qrCodeId` varchar(255) NOT NULL,
  `qrCode` varchar(255) NOT NULL,
  `memberId` varchar(255) NOT NULL,
  `chapterId` varchar(255) NOT NULL,
  `qrCodeName` varchar(255) DEFAULT NULL,
  `qrImageLink` varchar(255) DEFAULT NULL,
  `enableDate` date DEFAULT NULL,
  `disableDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qrreceivers`
--

INSERT INTO `qrreceivers` (`qrCodeId`, `qrCode`, `memberId`, `chapterId`, `qrCodeName`, `qrImageLink`, `enableDate`, `disableDate`) VALUES
('97d1a26e-08f8-4f0b-a5d2-0a83175fe20b', '', '95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', '1', 'Hamid Shaikh', 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/memberQRCodes/b1594a80-4bf1-4d05-9c10-29e84d783e6e.jpg', '2025-01-01', '2025-04-30');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` varchar(255) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  `removeable` tinyint(1) DEFAULT '1',
  `roleDescription` text,
  `chapterId` varchar(255) DEFAULT NULL,
  `rights` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `roleName`, `removeable`, `roleDescription`, `chapterId`, `rights`) VALUES
('1', 'President', 0, 'President', '1', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,fee_reciver_edit,approve_my_fee,approve_global_fee'),
('2', 'Vice President', 0, 'Vice President', '1', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,approve_my_fee'),
('3', 'Secretary', 0, 'Secretary', '1', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,approve_my_fee'),
('4', 'Treasurer', 0, 'Treasurer', '1', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,approve_my_fee'),
('5', 'Member', 0, 'Member', '1', 'member_fees,perosnal_profile'),
('6', 'Visitor', 0, 'Visitor', '1', 'member_fees,perosnal_profile'),
('7', 'Visitor Host Team', 1, 'Visitor Host Team', '1', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports'),
('abc_central_1', 'President', 0, 'President', 'ouhiuhuhuipiouytfchvjhlo', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports'),
('abc_central_2', 'Vice President', 0, 'Vice President', 'ouhiuhuhuipiouytfchvjhlo', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports'),
('abc_central_3', 'Secretary', 0, 'Secretary', 'ouhiuhuhuipiouytfchvjhlo', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports'),
('abc_central_4', 'Treasurer', 0, 'Treasurer', 'ouhiuhuhuipiouytfchvjhlo', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports'),
('abc_central_5', 'Member', 0, 'Member', 'ouhiuhuhuipiouytfchvjhlo', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports'),
('abc_central_6', 'Visitor', 0, 'Visitor', 'ouhiuhuhuipiouytfchvjhlo', 'member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports');

-- --------------------------------------------------------

--
-- Table structure for table `term`
--

CREATE TABLE `term` (
  `termId` varchar(255) NOT NULL,
  `termName` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transactionId` varchar(255) NOT NULL,
  `memberId` varchar(255) NOT NULL,
  `transactionDate` date NOT NULL,
  `payableAmount` bigint DEFAULT NULL,
  `paidAmount` bigint DEFAULT NULL,
  `dueAmount` bigint DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `statusUpdateDate` date DEFAULT NULL,
  `paymentType` varchar(255) DEFAULT NULL,
  `paymentDate` date DEFAULT NULL,
  `paymentImageLink` varchar(255) DEFAULT NULL,
  `paymentReceivedById` varchar(255) DEFAULT NULL,
  `paymentReceivedByName` varchar(255) DEFAULT NULL,
  `packageId` varchar(255) DEFAULT NULL,
  `approvedById` varchar(255) DEFAULT NULL,
  `approvedByName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transactionId`, `memberId`, `transactionDate`, `payableAmount`, `paidAmount`, `dueAmount`, `status`, `statusUpdateDate`, `paymentType`, `paymentDate`, `paymentImageLink`, `paymentReceivedById`, `paymentReceivedByName`, `packageId`, `approvedById`, `approvedByName`) VALUES
('001b5e6f-a3ba-4ce8-a524-257d0492da6e', '66fe1812-2ba7-463f-9535-98c0b59c83a8', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('01510ead-8760-4a4d-8480-3cf2b8695dd8', '1602210b-32bf-4101-9f3d-07474a969729', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('03ccbbd2-779e-4b88-a1a7-58c8838e9b23', 'ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0494b5ad-eabf-430a-9494-3ea5bc3f02ee', '447a16ba-e611-488f-b021-cba4dd23b61f', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('04fed248-56b9-4b07-9655-3f9e8003acf9', 'b4689a30-0f44-423a-926f-3f7dd5f22154', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('08f71a79-81a6-42dd-b10f-af01b4580185', '334d6ff0-419e-448d-a931-69157b4181cc', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0a5d3d4e-ee90-4bb1-8734-9d7b6dbadc61', '20f63507-5d55-49e5-a0d4-31398c0c3df5', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0b5e738d-38c8-4d4b-96dd-d51dda1f18eb', '7af8672d-50b7-4b98-9cf7-bae2102d7405', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0bd24c32-bf5f-4842-8a2d-1fb10aed63ea', 'e835e4f1-1aeb-4cf4-9884-6c214244487c', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0c207c6b-8105-4a69-a9a8-2ead7f9e2eaf', '6803dde4-3ff8-4f90-89e5-1355f80f8be9', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0c6afff4-b94c-4fe0-8c75-9c91085d64e7', '0e9468c4-b81c-4003-8559-34356fa354b9', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0d5bdc85-b051-43d8-9785-e83df74b7aca', 'dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('0edc64b4-762c-4479-82f7-8d631082f91e', 'dcb08d7b-be78-46b9-8cda-4ef4d798067f', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('107bdf44-f6fd-4c2b-a64e-f8dd6988ccdc', '79866bd5-6fb2-4fc5-ba11-d2f7ae815644', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('1193b6c5-2100-462a-be01-77ee8ab6015e', '79866bd5-6fb2-4fc5-ba11-d2f7ae815644', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('12291ca5-1aef-457f-8269-1c599b47dad6', 'e835e4f1-1aeb-4cf4-9884-6c214244487c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('14371543-7e41-465f-bd5f-9c229306a294', '72deef6b-593e-4496-be5f-862c8880890d', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('1644ca86-e335-4c91-a2f1-173dc96d11bd', '9183592e-d2eb-442e-a365-88d0a3480e8f', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('16f39415-bdd2-48aa-94fb-aa5c2b57f948', 'b283a17c-d800-4039-afd0-aa7e08807bbf', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('1765cb95-5c1b-420a-9673-f20e48d848aa', 'f531f39c-389f-4eb0-817f-7c856c247e3c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('19b911cc-7518-4629-a2df-bd362f2d88b4', '661b4895-9b7a-4dcd-87ea-67d867bb08c1', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('1d3866ea-6d88-4db7-9350-05a1e6413fd2', 'a45d1ff2-d0dd-4179-ab64-456b1231f86e', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('1d4bd028-8bc5-42da-a40b-6a25bddd047b', '3d6a69fb-abbb-4cc8-89ae-a60d298573d2', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('1d82cc9c-2ff3-49e1-8099-76da99e7a969', '8b7c825d-a4fb-4477-b95c-58d95ceca869', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('22fc0631-64d8-4a3b-9de0-3577bbffbe2b', '661b4895-9b7a-4dcd-87ea-67d867bb08c1', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('28446254-9e7a-4c05-91bd-46d4c8127575', 'b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('284f8204-ebc0-4efc-9617-82c7de437fe5', '99616fdb-8896-4ba7-9e91-2209cf9230a4', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('28b782da-f2d8-4887-9e7e-2960e30ab4c1', '01e54255-6531-4784-9305-6aff8eb6aac2', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('29b26887-cd7d-4a76-a20b-303e51735498', '4dbd5cc6-a639-496e-a06c-04d891cb6974', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('29f3dd95-5a02-4781-ae00-fe887b861cb5', '70685edf-d0d7-4dfe-be7c-66c4644e6cdf', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2a47f080-cb9f-4f3f-bb09-fbc9e4d1e45d', 'ecb9ed73-8859-48e2-ab39-35721c66c336', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2a5ea609-ff05-4eec-a93c-3b6a3ca0535e', '0a249dc1-b121-4142-894c-acb6138971ca', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2ac657af-0468-4d63-860d-a4e2b6afb591', '026b9428-ebcb-478e-9a86-3eebce58d100', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2bfcd173-fbf1-4285-9e97-02fd3ba5c120', '3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2c0774d7-54e4-4b35-9ba2-4a5efede7b76', '69cc56f0-6d00-4790-a3ea-dfd78852b393', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2df901b1-dd39-4f57-9499-6de876fb7205', '6206a853-19dc-4994-8c13-92d1b879189a', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2e45eac2-590e-41e3-8eac-370fde6555c8', 'a2912248-8efc-4d69-be33-8c79b3a27c53', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('2fa2917c-2a4c-44aa-bc6d-eaa06b8bc8d7', 'esxrdtcfhvjbgjkjbghvfcvgjbl', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('30e4472a-551f-43d1-b602-9f149eb124d3', '6311bc70-2384-4fb9-a814-a38c1293979a', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3162cd94-b0fd-4f3b-8631-4e6e378cbbc9', 'f157b68b-a18a-491a-a85d-b2f1ce176efd', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('33757321-4968-432d-aedf-213b681bfdd3', '1692338e-d74a-49cf-adec-4db406a27d6f', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('33972678-ad73-4f73-9068-442ba055f45f', '648c3249-81f2-4d75-be85-bfc0d03e20dc', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('341bc2b8-7b0b-4bd5-aabd-4585500ffa7a', 'd5a002ef-9d33-40c5-b61f-1e081272e912', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('351b0ac9-842b-4b4b-b4a6-8b63a6867dce', '0e9468c4-b81c-4003-8559-34356fa354b9', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('357addf5-df7a-4063-be64-245619738af7', '1ff5ea10-3e23-486f-840b-49453f18fa09', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('35f6d595-8159-4c1b-a33a-f03a095b0fee', '4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', '2025-02-27', 4800, 4800, 0, 'approved', '2025-02-27', 'cash', '2025-02-27', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('381e8f93-33ac-4f0a-a042-927247e79ab6', '922b5e99-a0fe-4215-b2ea-54fea6ba9400', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3a264c7a-1846-45fb-be0f-3253e75fd0b8', 'ef63856f-bde1-4c09-a064-3d4b94942352', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3ac21b9a-bc87-42b9-8727-03e81d1b9e25', '85ccffd5-e98f-4ee8-8886-acf68bc29dfb', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3ac39af0-3e1a-4d37-8ee5-7fd80889a296', 'e5af84c8-9bdd-4553-b086-9340fb38678b', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3c90d546-5045-41c5-882f-990f2a95f825', '2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3efb4533-d50a-4e57-8ce3-b9b645f5878d', '803c0a05-becf-4b3e-b3d3-3a45820e8a89', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3f1ae3a8-9af2-43b4-847b-6156a538619d', 'a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3f35d005-4ecc-43e6-95db-99774bdbfb74', 'a6b6e35f-774a-43bb-a399-3a2882094d40', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('3ff7a1d5-d3d3-488d-9839-908220d16396', 'fa2b6733-382f-4997-b61a-a5647d99b58d', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('419cadbc-1f7f-487a-96bf-8e3b42e4111c', 'b1a44181-b358-4bdd-a1be-17b860089004', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('42e46fc7-1d4f-4098-b4e1-03a8bc8e7fa5', 'ef63856f-bde1-4c09-a064-3d4b94942352', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('46904a6c-4d77-4de6-87ff-fff541482f36', '6cbf90eb-007c-4cf8-9414-3708af12bbd8', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('499234ab-5db7-4038-9fdf-4cb2ddac7f46', '3e268ca7-7fcd-4c91-811c-6e8aec990ee6', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('4da980e0-39b7-492f-b01b-bd27e8d5b6f8', 'a2912248-8efc-4d69-be33-8c79b3a27c53', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('4fbf2dfb-4912-4d80-953c-15a1b810667c', 'cb8bc6b0-5a84-4f23-b929-b08303939ce3', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('51639bac-e8af-4dd9-a5a2-4e120a681b6a', '3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('52432a2d-9a59-40d6-8fec-1f8b8034e69c', '2f797ae3-0a36-4e5c-b9e9-ba70e3d45bf9', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('528b3d7d-5fee-4f3a-9a72-4aed319d5970', 'c5afbebd-86d2-4389-a23b-4e61b2120ebe', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('52ba7cf9-8d20-462d-a66d-7cfb2d5c72fb', 'f99909ea-6dd4-416c-b136-0b90b2250cfe', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('53818b7c-f703-4cdc-93b9-91fc2729410b', '059b4163-157f-476e-b16c-d136cb855861', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('549208b7-8d33-43d6-96fd-87d86b0e2918', 'f500dc91-80cc-481e-8006-f2fc7b60efe5', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('558f5720-d231-485c-8111-1b450415a88f', 'efvelvhubrerikbjv', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('58abf790-4acb-448e-b62c-6ae0e1a0decd', 'a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('5a65bff4-1050-4c91-ad04-4df4314b8495', 'b7fc1185-3874-4183-af99-0e4824bd1021', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('5a852c56-3983-4498-8e84-aacf7da85328', '6cbf90eb-007c-4cf8-9414-3708af12bbd8', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('5bf87602-5e7d-45d7-bc96-512ec53a9f3e', 'f157b68b-a18a-491a-a85d-b2f1ce176efd', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('5bf8b92f-c591-4244-b5c6-99797dee7a2e', '987d78c5-580d-4418-8393-802e73f84cae', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('5e1ff916-3121-482f-88ba-394524d9b250', 'e5af84c8-9bdd-4553-b086-9340fb38678b', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('5f8b7db5-fee9-4ebc-8eda-4e8614f484ba', '8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('617d2fb4-c77a-462b-ad6e-91b0092ce8b6', '3aa05ed7-82e5-4c39-93f9-ecd22ad16730', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('62670c21-96ee-493b-92c4-f7239c9295d1', '0975ffa1-6593-4ac6-b24b-19e56ba3aa85', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('631168f4-cb4e-49fc-883a-115fdfefa94e', 'dcb08d7b-be78-46b9-8cda-4ef4d798067f', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('634149f2-0602-4ae7-a65e-344af8bf999b', '1dde0c4f-b39e-437b-9489-455956a3831c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('63f3f3a7-1ae1-4bf1-a98f-bf621b3211f8', '95ac2312-9c52-422d-baa8-ce1a9dc61e3a', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('65ebd1cc-08ed-4b70-bb05-951ceef4a677', 'ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('66c83cf1-1c18-43fe-954d-fe7c6f05c711', '17070e27-c48b-41c8-9743-57e8b737b693', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('6868ed68-bb8a-4280-964d-934b7593ef72', '0523a517-07fa-4022-838f-8f404e29962c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('69527f07-49d3-4aa0-9716-cb9ed0ae3aec', '9710f5b7-eaca-4506-bce6-1574806012a9', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('6bf42469-154d-46b5-96f4-c3dd86424f62', '6206a853-19dc-4994-8c13-92d1b879189a', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('6d5bc1f2-a40f-41dc-8db3-d8175ae21ff0', 'f99909ea-6dd4-416c-b136-0b90b2250cfe', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('6da03698-be33-487e-b473-58153c93304c', 'ff7e52bd-08f9-4c9e-b779-9cfea50b2987', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('6f845d2b-419a-4b4d-9960-ca4ee8956856', '3e2974e6-820a-4fc8-bcb1-c62b36fc2b8c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('6fe7ba30-cac9-4e48-9a4f-78bd23694a4d', '0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('723c692f-1575-4a31-b94c-bccfd777270b', '98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('74ba5231-6c30-4197-9034-8d0aa38cc7fa', '3f67fbd0-2d61-4b60-aa3b-e74e328fc8ed', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('762ba917-f10e-418f-b31f-755222bf63d2', '5de38232-608a-4c6f-b3e7-3a0d94f74e3d', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('76b79e2d-c112-4bec-a43f-1cd2b764b3e5', '3d6a69fb-abbb-4cc8-89ae-a60d298573d2', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('78288504-43ea-48cd-beee-f9f29dc290e6', 'esxrdtcfhvjbgjkjbghvfcvgjbl', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('78ffac41-ddbf-4519-9c0a-d801f9972913', '95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7906862a-2fb8-4e6f-9bbd-e35e1e00cf91', 'aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7980f098-9c88-41e5-a0cd-ac95ba002b56', 'a7e4b985-b062-4d4b-8608-e8fd5176d846', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('798c545d-11db-458c-a51a-b1faf36493ef', 'ecf7bab4-b2c0-4bb1-84a2-a15ebadcbee7', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7ace3276-96c5-43b1-b150-1afd91ea40e6', 'a6b6e35f-774a-43bb-a399-3a2882094d40', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7c4c5348-a4d6-41a0-8889-8caab659728e', '0975ffa1-6593-4ac6-b24b-19e56ba3aa85', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7c5a2968-5ac8-4bcf-9f51-ba4c535b42ce', 'dae4c41a-c2b6-436e-a62f-d0d6cb29bc8c', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7dad9a40-7fd7-4f7e-9ffa-fe54e3ecf83f', '6c150d9d-64dd-4f5a-baee-89f85ef83b75', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7df2bf0c-9866-4d58-aa02-25bb089ad6d9', 'fbe36553-e184-48b0-956a-d1e91eece826', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('7f998417-030f-4f3e-ba2e-b7faafcef80f', '1', '2025-02-21', 5050, 5050, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'ergioheohjgbiehjgbdl', 'Ruturaj Shinde', '2', 'ergioheohjgbiehjgbdl', 'Ruturaj Shinde'),
('81a73a1a-aa3d-417d-aff9-b07f0582490d', 'ca4be3c8-3af4-46c2-9bf9-f085ea8729f3', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('835214fc-4853-44fe-842a-cdc31e0d1b59', 'e88996a5-fc0f-45c7-bf08-dad3c955d753', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('84101eac-841b-4918-b39b-9451d3ae14d4', 'f531f39c-389f-4eb0-817f-7c856c247e3c', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('8443a850-5e4f-43af-b2c7-e0007bb07060', '69cc56f0-6d00-4790-a3ea-dfd78852b393', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('87f8b161-f187-41d7-a3a7-0d606768e096', '72deef6b-593e-4496-be5f-862c8880890d', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('8828ca66-b883-4d7b-b2cb-fc6e15ddb2d8', 'fa2b6733-382f-4997-b61a-a5647d99b58d', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('89db3014-e93e-4c24-9173-a836bb329e87', '059b4163-157f-476e-b16c-d136cb855861', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('8e2b0f4b-b1d1-47a1-aeeb-5af847ca7d20', '85ef7ea8-66aa-499d-b013-a9cbf0a813e8', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('8f045e1e-3cd0-446f-b621-a95be02e99ff', '0a249dc1-b121-4142-894c-acb6138971ca', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('900a3c2a-d251-479b-a697-5f2f25592fe7', '6311bc70-2384-4fb9-a814-a38c1293979a', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('912c12ca-5ce0-4747-b75a-366b465c3547', '334d6ff0-419e-448d-a931-69157b4181cc', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('91b79d3a-c425-4147-9bf0-1b370b582776', '0523a517-07fa-4022-838f-8f404e29962c', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('93cd9879-3c1d-45ff-af79-30581baab91f', '4dbd5cc6-a639-496e-a06c-04d891cb6974', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('93d22aee-54b9-4ad2-80cb-c6c6cca156c1', 'd5418c26-2c36-4f50-b099-8d593565be82', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('942ec033-02ea-469a-9cb0-b01d77bd1637', 'b51a8aeb-30d8-43c2-9df9-91e2d21df3aa', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9639372e-93a9-492e-8110-38f7b29a0ea4', '820b077a-c55e-4560-9422-9360d9e805df', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9acb87d5-0bf8-4686-b20d-06a1333f55d9', '52623b2a-0c4c-4310-a541-110283d5b1a0', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9ae2a91f-04a3-4dec-a31d-2ab641d868af', 'dfab2c83-8359-4907-a8bb-444fc9bc77e3', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9af53df3-12c4-4ac1-bb1c-72780a9504e5', '98d7fd20-2ecb-4717-8ed4-99d7e9b724a9', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9b664d0a-bc8d-45da-b629-344f21fd9bf7', '00ab1826-2f42-45bf-93ba-48f7630643b3', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9bd74391-e922-4274-a496-450043c554cb', 'ca16fd50-713a-420d-8c1d-e2a964917d67', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9be8a6e6-fc28-4c01-9a89-26c92a5fe6df', '1ff5ea10-3e23-486f-840b-49453f18fa09', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9c7ad9e8-7263-42d7-8ef1-bfedc420b699', 'cb8bc6b0-5a84-4f23-b929-b08303939ce3', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('9da0f61a-155e-4535-8d16-c30e5af53540', 'd1915bae-b021-41ab-96f8-4f08733167b6', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a033a9d2-b323-4ad4-9ff4-7dbfe3f02d7f', '21be8ef8-190f-4b0a-9876-5bc7838de33a', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a15b7225-0a35-4f73-a3b4-d1e044564b86', '922b5e99-a0fe-4215-b2ea-54fea6ba9400', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a18f919a-cdac-4044-ae2f-465153b13a91', 'ca16fd50-713a-420d-8c1d-e2a964917d67', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a292af34-11b1-4dca-b854-c33c2755a3fe', 'aa39ea0e-6c81-4433-be80-1761f8e8a9be', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a2c0423e-7fc5-492a-8e34-7810d78658a9', 'dfab2c83-8359-4907-a8bb-444fc9bc77e3', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a501312f-7a76-42be-9522-0fd5315722c5', 'a40b052d-f0ab-479f-8090-3c7ba5c584ee', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a58d7eeb-1cbb-447c-9fe7-d42b5f479b6a', '639f10fb-99eb-4675-88be-bf852d6e9ecf', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a5cc1548-cd9a-422b-bf12-51da74d595e7', 'd1915bae-b021-41ab-96f8-4f08733167b6', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a5e27414-f0ac-4041-a9a2-7b5bef409f9f', 'ergioheohjgbiehjgbdl', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a6dad1e3-c033-4fc8-9f3f-4f9f80bd15c9', 'f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('a8bcf23c-b52c-4e13-85cb-2160f4fbbfb6', '9528a4de-1f54-4766-861c-72e419e00873', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ae7e5dae-222d-4c7e-98ab-1d8079070b94', '85ef7ea8-66aa-499d-b013-a9cbf0a813e8', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('aecd757b-cade-4cfc-9e89-94a3e7dceb54', 'wgfvekfugrvheuguik', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('aed229d8-185c-42c6-b7bd-f1ac20d7a30e', '00ab1826-2f42-45bf-93ba-48f7630643b3', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('af727455-a4e7-4cad-a131-8009fcc2de9b', '95f622eb-ef7b-409e-9d27-687bb923da00', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('afc9e271-2ece-4650-8588-e9ebea70cb1e', '01e54255-6531-4784-9305-6aff8eb6aac2', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('b23753fe-58d9-4a83-8bdf-4ce53c8a99a8', '00f8530f-beef-46a8-8c7e-46cdb0fee931', '2025-03-02', 4800, 4800, 0, 'pending', '2025-03-02', 'cash', '2025-03-02', '', 'ergioheohjgbiehjgbdl', 'Ruturaj Shinde', '2', NULL, NULL),
('b2bdfbdd-fb15-42d9-b4dc-1856e0b1383f', '1692338e-d74a-49cf-adec-4db406a27d6f', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('b2d86f4c-4058-4278-9586-bac748b3a012', 'b7fc1185-3874-4183-af99-0e4824bd1021', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('b5448eb5-dd5b-437a-bb5a-a6382629989b', '95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('b853fcc0-1c34-483f-8295-faa038a7177f', 'ad59a189-e748-455e-a2dd-29ac2f33f941', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('b888ea59-f647-4558-82b2-fca8b6b70233', '648c3249-81f2-4d75-be85-bfc0d03e20dc', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('b9dfb0fe-7921-4b8b-996c-ad1cebcbcd4b', 'a62e7dc6-b262-4cfc-83ac-bb6e64b3f105', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ba031dc8-4371-4b96-b8c7-181d6c260950', '9528a4de-1f54-4766-861c-72e419e00873', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ba0eef33-a31d-40af-8da2-56cc7174b75d', 'f27931a6-9f0b-4ca6-aca1-6615f19d1bf1', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('baf9c8bc-aad1-4291-8bac-e6cc0dc7dd13', 'c8da3084-16b0-4756-8aa7-ed818461be0d', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('bb8fce93-d2cf-417b-8a8b-e9003ae13baf', '52623b2a-0c4c-4310-a541-110283d5b1a0', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('bcd1024a-6b1e-4a57-850c-6ba70d91ed51', '21be8ef8-190f-4b0a-9876-5bc7838de33a', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('bf517f2d-1138-4d4e-8ede-9fe94205c29f', 'f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c2309655-dbdf-442b-9ab2-6514ecea7bdb', '17070e27-c48b-41c8-9743-57e8b737b693', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c2811bf0-dfd0-46b3-8480-7478395cff42', '9710f5b7-eaca-4506-bce6-1574806012a9', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c2abb572-93a8-4365-aac2-77d33b12c7d2', '3aa05ed7-82e5-4c39-93f9-ecd22ad16730', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c3bc42cd-931f-4328-ad52-23cfc93cb8eb', 'b1a44181-b358-4bdd-a1be-17b860089004', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c41c5340-3ec3-4541-a32f-9f43fa635e33', 'aeb8c11c-7f65-4fa9-a0b8-765aaa2d885c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c434b653-47f2-42cc-910f-46632e9759c4', '987d78c5-580d-4418-8393-802e73f84cae', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c704274d-0866-49de-a7c0-797e16881ab7', '70685edf-d0d7-4dfe-be7c-66c4644e6cdf', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c70d98b2-b490-4eb7-a273-0a81917f2e32', '803c0a05-becf-4b3e-b3d3-3a45820e8a89', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c7d07557-e161-4068-a491-deaa99604993', '4d7c064e-4491-4e6b-bd8e-5cb43daa8b4c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('c8bbc027-8202-47cf-9ca8-3de6f56ca591', '9183592e-d2eb-442e-a365-88d0a3480e8f', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ca4ea55c-e0aa-476d-8076-36dbbee3f68b', '820b077a-c55e-4560-9422-9360d9e805df', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('cc8abebd-d6da-4293-86e3-5c9f6cd5e644', '6803dde4-3ff8-4f90-89e5-1355f80f8be9', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('cdec4aaa-7f51-4242-84a8-d561a3dbc6c3', 'ff7e52bd-08f9-4c9e-b779-9cfea50b2987', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('cfd973d6-97d8-4c63-bf0c-867173c80395', '02b4b816-0d75-4fa5-b956-69494c699e51', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('d0f489d7-fc1a-4c49-b2bf-110be608b527', '1', '2025-02-21', 5750, 5750, 0, 'approved', '2025-02-21', 'online', '2025-02-21', '', '', '', '1', '95bcaea6-a8cf-416b-bbeb-cd30a4b91ddb', 'Hamid Shaikh'),
('d18a04ad-240a-4e7e-946b-bccbf25898b1', 'a59979b0-bcbf-4f43-896d-a798113f22ff', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('d2c92929-8c52-4daf-a7bf-85e1001916a8', 'ecb9ed73-8859-48e2-ab39-35721c66c336', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('d3e1cf1f-0b48-44e4-8516-a87db546ffd0', '3e268ca7-7fcd-4c91-811c-6e8aec990ee6', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('d6184da2-86da-495e-b923-971593ca1ff6', '72d9d323-b2fa-4f17-ba66-5b5408727f53', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('d8edcc3f-2363-481f-a2d4-b96a75af993e', 'a7e4b985-b062-4d4b-8608-e8fd5176d846', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('d9564387-f83f-4dfb-b73f-bd2ec7790173', 'c5afbebd-86d2-4389-a23b-4e61b2120ebe', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('daf0e6b8-895d-4e3d-8320-7203b9f8afca', '7d0d24e1-8bd6-4c44-af99-f135a95dc92e', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('dc191171-6823-47d8-b349-5fa5aaddcd4e', '83612c1c-e327-4e32-900c-868998118784', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('df71362c-7bd9-463b-b14a-003ac5c66c0a', '8b7c825d-a4fb-4477-b95c-58d95ceca869', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('df82d7dc-06d6-4e91-8ecf-bb8525499283', '8668a70e-61b4-45f8-a3b8-5de0e8e26c1e', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('dfcd55cf-22d3-407e-a1aa-7c0491782d98', '83612c1c-e327-4e32-900c-868998118784', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('e2901cc5-6bd0-4866-808d-176d11661501', 'a05f27de-b5e8-45e0-b2d4-a9d6a20f2ca2', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('e60661ba-9b16-434a-927e-215fc5f5afc3', '95ac2312-9c52-422d-baa8-ce1a9dc61e3a', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('e7e53a7b-ae28-4ed6-b621-534bc6f3466f', 'c8da3084-16b0-4756-8aa7-ed818461be0d', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('e87cb7eb-c99c-4347-829f-a8d44ea9f975', 'efvelvhubrerikbjv', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('e8ae5875-f3df-449f-8d74-b5b5885913c3', 'd5a002ef-9d33-40c5-b61f-1e081272e912', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('e99c20cc-99d9-4171-8254-8621d9722213', '79a84fbd-6fb7-47ca-bc81-64740ca8259c', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha');
INSERT INTO `transactions` (`transactionId`, `memberId`, `transactionDate`, `payableAmount`, `paidAmount`, `dueAmount`, `status`, `statusUpdateDate`, `paymentType`, `paymentDate`, `paymentImageLink`, `paymentReceivedById`, `paymentReceivedByName`, `packageId`, `approvedById`, `approvedByName`) VALUES
('e9d4ae02-dcfd-4bb8-baf2-8bfe6d12f62b', 'ergioheohjgbiehjgbdl', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ed22c6e4-2613-4496-b1ae-68f1fcbc3590', 'wgfvekfugrvheuguik', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ed4b0202-d6c7-4a5a-972b-69951e72616c', '06aa9742-cf32-4abf-8f9a-131c788323b7', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('eeaee1e7-6a8d-4927-892f-30d2c42beb67', '06aa9742-cf32-4abf-8f9a-131c788323b7', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f30f5512-75a5-4fd1-822b-f57e757b2379', '66fe1812-2ba7-463f-9535-98c0b59c83a8', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f4185a0e-663d-4e7e-801d-99cc68ad4af5', '457594ba-8bea-4f3f-89bc-7a0ddd188e6b', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f4266d14-df83-468d-85e9-1a1defd3b7a5', '0bb50781-fa7b-49f2-9ab0-98d0c9e6652d', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f430d935-5af2-414f-baa8-0328d7574496', '457594ba-8bea-4f3f-89bc-7a0ddd188e6b', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f5213ee0-b915-4250-aacd-6267187eca23', 'fbe36553-e184-48b0-956a-d1e91eece826', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f55c38a7-0f05-4d75-9455-f94c0ddcac9b', 'a45d1ff2-d0dd-4179-ab64-456b1231f86e', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f5934fb7-005b-4427-969f-a097a47b185a', '026b9428-ebcb-478e-9a86-3eebce58d100', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f6de81b3-0eb3-4e5b-8a0b-4ea0a4884932', 'f34e6b1b-bd3e-4e04-93fd-67f57dd7ac3e', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f91d6e2d-8a47-4ffa-bfae-d8682afbe8f6', 'a40b052d-f0ab-479f-8090-3c7ba5c584ee', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('f9683768-296d-4261-be15-20b8f61e4a2b', '55793941-87a3-4308-aa60-5204d7f5bce0', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('fac2e8cc-eb4a-48c9-8562-b7a6060b5afe', '55793941-87a3-4308-aa60-5204d7f5bce0', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('fdcac840-aa73-4c9a-a77a-7060664d8e3f', 'a59979b0-bcbf-4f43-896d-a798113f22ff', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('fee977bc-16cb-4bbf-ad96-91245257888d', '1602210b-32bf-4101-9f3d-07474a969729', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ff21d111-636a-49bd-ab31-95a82c83a205', '72d9d323-b2fa-4f17-ba66-5b5408727f53', '2025-02-21', 4750, 4750, 0, 'approved', '2025-02-21', 'cash', '2025-03-01', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '1', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha'),
('ffbceb81-e61c-4278-b629-123537f94ef1', '20f63507-5d55-49e5-a0d4-31398c0c3df5', '2025-02-21', 3800, 3800, 0, 'approved', '2025-02-21', 'cash', '2025-02-21', '', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha', '2', 'esxrdtcfhvjbgjkjbghvfcvgjbl', 'Sejal Palrecha');

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
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `chapterId` varchar(255) NOT NULL,
  `feedbackScore` int DEFAULT NULL,
  `feedbackComments` text,
  `nextStep` text,
  `arrivalTime` time DEFAULT NULL,
  `feelWelcome` tinyint(1) DEFAULT NULL,
  `visitedBniBefore` tinyint(1) DEFAULT NULL,
  `referralGroup` tinyint(1) DEFAULT NULL,
  `referralGroupExperience` text,
  `eoiFilled` tinyint(1) DEFAULT '0',
  `visitorStatus` enum('Approved','Preapproved','Declined') DEFAULT 'Preapproved',
  `paymentAcceptedMemberId` varchar(255) DEFAULT NULL,
  `assignedMemberId` varchar(255) DEFAULT NULL,
  `paymentImageLink` varchar(255) DEFAULT NULL,
  `paymentAmount` decimal(10,2) DEFAULT NULL,
  `paymentRecordedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `paymentType` enum('cash','online') DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`visitorId`, `invitedBy`, `chapterVisitDate`, `heardAboutBni`, `firstName`, `lastName`, `companyName`, `classification`, `industry`, `email`, `mobileNumber`, `chapterId`, `feedbackScore`, `feedbackComments`, `nextStep`, `arrivalTime`, `feelWelcome`, `visitedBniBefore`, `referralGroup`, `referralGroupExperience`, `eoiFilled`, `visitorStatus`, `paymentAcceptedMemberId`, `assignedMemberId`, `paymentImageLink`, `paymentAmount`, `paymentRecordedDate`, `paymentType`, `createdAt`) VALUES
('065da8e0-da1f-427d-bade-1a40054b32bd', 'Kailas satpute ', '2025-01-31', NULL, 'Kailas ', 'Satpute', 'Nuova cold pressed oil', 'Ower', NULL, 'kailassatpute92@gmail.com', '7350071696', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 05:22:02', 'online', '2025-01-31 02:21:33'),
('06c86a1c-4175-4db0-846a-0fe824fef7ad', 'Aishwarya Khade', '2025-02-14', NULL, 'Sandeep', 'Dravid', 'SEICCO Overseas education and Immigration ', 'Overseas Education ', NULL, 'sandravid@gmail.com', '9881192163', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-02-14 02:18:15', NULL, '2025-02-14 02:18:15'),
('086d6e42-7885-444b-9d1d-730a677de266', 'Shardul Kulkarni ', '2025-02-14', NULL, 'Yeshwant', 'Kulkarni ', 'Fine Spavy Associate ', 'Manufacturing ', NULL, 'yvkulk@yahoo.com', '9422406532', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 01:58:53', 'online', '2025-02-14 01:49:12'),
('09cd0a33-5fab-4830-ab57-d737bb6c24dc', 'Astrology guru', '2024-12-27', NULL, 'Tri gindra', 'Trishala', 'New ppc stationery and printing hub', 'Stationery parker pen', NULL, 'newppc345@gmail.com', '7083016144', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-27 01:46:54', 'cash', '2024-12-27 01:46:26'),
('0af1e391-0fa2-466a-b682-2012d006b3d3', 'Roopa', '2025-01-10', NULL, 'Prantik', 'Panigrahi', 'Live inspirred', 'Author and life coach', NULL, 'vipranenterprises@gmail.com', '9890195963', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-10 02:20:59', 'online', '2025-01-10 02:05:53'),
('0bdfc124-d1e9-4788-af1b-1797a628f7c5', 'Ajaywagh', '2025-01-17', NULL, 'Jayjeet', 'Deshmukh', 'MIT SDE', 'Education ', NULL, 'jayjeet.deshmukh@mitsde.com', '9028988375', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-17 01:54:55', 'online', '2025-01-17 01:46:23'),
('0da53d5f-c18c-4f76-9642-4bb499fd9609', 'Gaurav karle', '2024-12-13', NULL, 'Sahil', 'Pathan', 'Sradvn Production ', 'Digital marketing ', NULL, 'sahilpathan0204@gmail.com', '9599229040', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 04:19:00', 'online', '2024-12-13 03:20:05'),
('11a6a17c-aef8-4e55-9bec-3f1b902f9ec2', 'Milind Lokare', '2025-01-17', NULL, 'Sameer', 'Bhosale', 'Relligio', 'Digital Marketing', NULL, 'sameerbhosale.bni@gmail.com', '9820601604', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-17 01:59:26', 'online', '2025-01-17 01:57:30'),
('16da9aaa-f10a-4f54-bbab-5a624548ae01', 'jitendra sir', '2024-12-19', NULL, 'sumeet ', 'yadav', 'prb sports gallery ', 'sports equipment ', NULL, 'sumeetyadav396@gmail.com', '8080229427', '1', NULL, NULL, NULL, '06:46:00', NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-19 20:23:59', 'online', '2024-12-20 01:53:41'),
('16db391d-19a1-4c23-b8e1-29ab94aa03d8', 'Manoj', '2024-12-04', NULL, 'Mayur', 'Agarwal', 'Mayur', 'SD', NULL, 'mayur.m.agarwal@gmail.com', '9921318237', 'kdjvfbfdkbfvhbdj', NULL, 'nothing', NULL, '20:45:00', 0, 0, NULL, 'abc', 0, 'Preapproved', 'efvelvhubrerikbjv', NULL, NULL, 0.00, '2024-12-05 13:12:27', 'cash', '2024-12-05 18:41:31'),
('17ffb361-7010-454b-a6bf-0c85a8217fa6', 'Aa', '2024-12-16', NULL, 'Aa', 'Aa', 'Xnnxb', 'Nndj', NULL, 'nzn', '9975570005', 'kdjvfbfdkbfvhbdj', 10, NULL, 'Yes, I like it - I just have some questions that need answering', NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-17 22:46:52', NULL, '2024-12-18 09:46:52'),
('1b3480a8-b4a5-4f54-868d-62a5bd0e3d4b', 'Aashay', '2025-01-24', NULL, 'Praniket ', 'Balwadkar ', 'PSB Group ', 'Real estate ', NULL, 'praniketbalwadkar10@gmail.com', '9096267844', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-24 02:07:20', 'online', '2025-01-24 02:04:59'),
('1bc4dff3-b233-4434-ac77-d2cd6b55001a', 'Jitendra ', '2024-12-20', NULL, 'Sunder ', 'Yadav', 'Prbsportsgallery@gmail.com Pvt Ltd', 'Sports equipment', NULL, 'sumeetyadav396@gmail.com', '7972569372', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 02:11:40', 'online', '2024-12-20 02:11:12'),
('1e1d5dd8-9dd0-4d46-a4ac-34290f151798', 'Nileshbhiya bagdiya ', '2024-12-10', NULL, 'Ganesh ', 'Agrawal ', 'Fashion house ', 'Foot wear ', NULL, 'Agrawalganesh64@gmail.com', '7744017744', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-10 12:31:29', NULL, '2024-12-10 12:31:29'),
('1fba62f3-1d65-4024-baec-4cbaba8a1137', 'Khushboo ', '2024-12-05', NULL, 'Anil', 'Agrawal', 'Red Leaf Realty and Investment ', 'Real Estate Consultant ', NULL, 'anilagrawal399@gmail.com', '9011030800', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:51:42', NULL, '2024-12-05 10:51:42'),
('214bceb0-a068-49f6-9dfc-24a404ae0517', 'Rishikesh', '2024-11-28', NULL, 'Prateek', 'Tiwari', 'IDFC BANK', 'Banking ', NULL, 'prateek.tiwari@idfcfirstbank.com', '8055291814', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/071a29d4-90d4-4952-82e2-e03d08cca8f3.jpg', 700.00, '2024-11-28 15:58:12', 'online', '2024-11-28 15:49:13'),
('2386e082-6990-4fed-bdc5-5879a0c37d51', 'Sameer Shah', '2024-12-13', NULL, 'Dhruv', 'Parmar', 'N.S.Jain and Co.Pvt.Ltd', 'Lights and electrical supply', NULL, 'dhrruvparmar@gmail.com', '9518903672', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:05:36', 'online', '2024-12-13 02:03:57'),
('26b086ae-c5d3-4d16-9c7a-faee63f5f387', 'Adv Ajay Wagh', '2025-01-24', NULL, 'Swanand', 'Kulkarni ', 'Meera World', 'Tour operator ', NULL, 'pune.meeraworld@hotmail.com', '9421200797', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-24 02:07:15', 'cash', '2025-01-24 02:06:29'),
('274234c6-b558-41df-9a04-665d31423402', 'Satish Nage', '2024-11-29', NULL, 'Anand', 'Oza', 'Shree Sai Enterprises ', 'Real estate consultant ', NULL, 'shreesaienterprisespune99@gmail.com', '8149188999', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'wgfvekfugrvheuguik', NULL, 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/68d83305-291b-454c-8aa3-4d294128add0.jpg', 700.00, '2024-11-29 01:47:00', 'cash', '2024-11-29 01:44:19'),
('27e89a50-eff4-4948-bacc-ac158d264879', 'Deepak bansal ', '2024-12-10', NULL, 'Vijay', 'Agrawwal ', 'Asset Creatorz', 'Real Estate Advisory ', NULL, 'vijay@vijayagrawal.in', '8999960000', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-10 12:04:06', NULL, '2024-12-10 12:04:06'),
('2956d835-e20c-4555-80cc-f93d28f6a805', 'ADV KHUSHBOO AGARWAL ', '2024-12-05', NULL, 'VIPUL ', 'AGARWAL', 'SHIVSHAKTI INTERIOR ', 'INTERIOR TRUNKEY CONTRACTOR ', NULL, 'vipula4388@gmail.com', '7559200930', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:58:57', NULL, '2024-12-05 10:58:57'),
('2e861b7b-5297-4bd2-aa08-6cf3caa7b30e', 'Nilesh', '2024-12-10', NULL, 'NILESH', 'BAGDIYA', 'Ramraksha associates ', 'Loan', NULL, 'nileshbagdiya@gmail.com', '9503573555', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-10 12:02:58', NULL, '2024-12-10 12:02:58'),
('346ace5f-7939-4d6c-8522-82f35364d5f3', 'Sejal Palrecha', '2024-12-13', NULL, 'Chinmay', 'Shah', 'Super Infinity Education', 'Education sector', NULL, 'CHIRAG.CHINMAY@GMAIL.COM', '7875611247', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-13 03:52:26', NULL, '2024-12-13 03:52:26'),
('359eb3e5-f1a6-4cfd-9087-bd3a89af6eb6', 'Gaurav Katti', '2024-12-12', NULL, 'Ajaykumar', 'Singh', 'Navdeep Electricals', 'Electrical Contractor', NULL, 'ajayksingh2211@gmail.com', '9423002829', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-12 16:34:46', 'online', '2024-12-12 15:49:08'),
('375ace54-49ac-4298-9ba7-26e6b433c5f5', 'Jitendra shirsikar', '2024-12-20', NULL, 'Vinayak ', 'Pimpalkar', 'Tejwin foods', 'Mfg frozen food', NULL, 'vinayakpimpalkar82@gmail.com', '8329028132', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 02:14:42', 'online', '2024-12-20 02:14:07'),
('3890723e-6a94-4b70-a0c6-ce15b8f7f8fc', 'Bhumik soni', '2024-12-13', NULL, 'Falak', 'Sheth', 'Maiora Diamonds', 'Lab diamonds jewellery manufacturer ', NULL, 'falak@maioradiamonds.in', '6351758044', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:04:03', 'cash', '2024-12-13 02:00:32'),
('3ad8533a-9bb3-48fb-beb4-bf0947b54e1d', 'Gauri Karle ', '2024-12-27', NULL, 'Siddhi ', 'Salwaru ', 'None ', 'Student ', NULL, 'salwarusiddhi@gmail.com.', '9325583197', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-27 02:15:27', 'cash', '2024-12-27 01:59:03'),
('3bab0e77-e9a3-40fc-b0a4-b411dc9b06e4', 'Ashwini Daftardar', '2024-11-29', NULL, 'Dhanashri', 'OAK', 'Cocobliss ', 'MBA', NULL, 'cocoblisscoo@gmail.com', '9168413061', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'wgfvekfugrvheuguik', NULL, NULL, 700.00, '2024-11-29 01:48:19', 'online', '2024-11-29 01:46:49'),
('3c3f00ba-d0f7-4cd7-9ae6-ab0cf0d7a45d', 'Nilesh', '2024-12-06', NULL, 'Aatish', 'Palrecha', 'Navitas Solar', 'Student', NULL, 'aatishpalrecha72@gmail.com', '7588945728', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/c94a46b9-d5ae-409f-b383-2fead3bb9dd5.jpg', 700.00, '2024-12-06 02:24:10', 'online', '2024-12-06 02:22:06'),
('3d4123d4-092a-4c62-8a42-d39786ee03f7', 'Nilesh Dulera', '2025-01-17', NULL, 'Milind', 'Shaharkar', 'Guruji ', 'Pujari ', NULL, 'milindpujari @gmail@.com', '9850071967', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-17 03:55:55', NULL, '2025-01-17 03:55:55'),
('3e1fda0a-3772-413f-b4b0-ea4db6294f3c', 'Gauri Karle ', '2024-12-12', NULL, 'Dr P', 'Shalaka', 'Astro Karma', 'Astrologer', NULL, 'astrokarma18@gmail.com', '9321411969', '1', 10, 'No', 'I like it - I\'m just not able to make the commitments at the moment', '01:30:00', NULL, 0, NULL, 'No car', 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 07:53:21', 'online', '2024-12-13 03:16:40'),
('44225acd-591c-4446-a6da-fa6491a440a1', 'ABC Group', '2024-12-05', NULL, 'Aditya', 'Kansal', 'Nanhe Creations', 'Owner', NULL, 'avyaantradingcompany@gmail.com', '7869078410', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 12:23:33', NULL, '2024-12-05 12:23:33'),
('55203ebc-f6fc-4634-af66-1152c60d1036', 'Ajay wagh', '2024-12-20', NULL, 'Sameer', 'Dhadge', 'Sagar flowers', 'Florist', NULL, 'ajaywagh@gmail.com', '9850007904', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-20 04:38:58', NULL, '2024-12-20 04:38:58'),
('57310e2e-6da2-4793-bc05-1ba0708d3e50', 'Shalak Shah', '2025-01-31', NULL, 'Nupur', 'Trivedi ', 'Samsun Tours', 'Travel consultant ', NULL, 'puneinfo@flamingotravels.co.in', '9924077702', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 02:03:38', 'online', '2025-01-31 02:00:37'),
('5733b812-f811-4760-a0a3-10df98a6df92', 'Prabhu sir', '2024-12-13', NULL, 'Anand ', 'Barake', 'Sneha Electrical Corporation and Co ', 'Electrical and Fire Fighting Contractor ', NULL, 'snehaelectrical2007@gmail.com', '9326733715', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:05:52', 'online', '2024-12-13 02:02:51'),
('5797c08e-c4b4-48bb-9d8a-b0d51bec6bab', 'Mr. Amit Agarwal ', '2024-12-05', NULL, 'Deepak ', 'Agarwal ', 'Surya Enterprizez ', 'Water treatment and garden play equipments ', NULL, 'suryaenterprizez.india@gmail.com', '9860504520', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:52:22', NULL, '2024-12-05 10:52:22'),
('582675ee-3cc3-4a21-be05-9748da629521', 'NILESH SALI', '2025-01-03', NULL, 'Priyanka', '06/11/1994', 'PRAMOD C. ORPE CONSULTANTS PVT. LTD.', 'IMPORT EXPORT CONSULTANT', NULL, 'pramodorpe@gmail.com', '8888851648', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-03 02:08:46', NULL, '2025-01-03 02:08:46'),
('5925656e-c733-41e6-a9e9-caf8d43fa7e4', 'Shrikaysh Kotwal', '2024-12-13', NULL, 'Pranesh ', 'Karbhari', 'Rudra Fitness', 'Fitness Trainer', NULL, 'pranesh.karbhari6@gmail.com', '8788937962', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:09:14', 'online', '2024-12-13 02:08:12'),
('59b000eb-9bfc-426b-a92a-fb2c30743f1e', '', '2025-01-03', NULL, 'Dipak', 'Jawale', 'Dipak Jawale and Assiciates', 'Construction Project Management', NULL, 'dipakjawale@yahoo.com', '9890137626', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-03 01:35:37', NULL, '2025-01-03 01:35:37'),
('59e669ca-be72-4cfc-8554-794d6ecf22ce', 'Rushikesh Bagade', '2025-01-10', NULL, 'Ketan', 'Atre', 'transcendental ', 'Cyber Security ', NULL, 'ketan.atre@gmail.com', '8830255328', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-10 02:20:00', NULL, '2025-01-10 02:20:00'),
('5a7770c9-5264-4efb-8104-e58cdeb3589b', 'Gaurav Katti', '2024-12-12', NULL, 'Rajgopal', 'Katti', 'Radha Enterprises', 'Industrial Supplies', NULL, 'rajskatti@yahoo.com', '9823031340', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-12 14:20:04', 'online', '2024-12-12 12:44:25'),
('5f332635-a6ed-4e79-b098-d731e2b4106e', 'Nikhil sultanpure', '2025-01-31', NULL, 'Nikhil ', 'Sultanpure', 'Nuova cold pressed Oil', 'Owner', NULL, 'nikhilsultanpure096@gmail.com', '9730436503', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 05:22:04', 'online', '2025-01-31 02:19:49'),
('60b69401-0f0f-4b5e-8379-165fe5c7b849', 'Rajkumar bub', '2025-01-10', NULL, 'Chanchal', 'Rathi', 'None', 'MBA Student', NULL, 'chanchalrathi03@gmail.com', '9850367690', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-10 02:21:15', 'online', '2025-01-10 02:19:22'),
('621dc5e7-b7d6-446b-bf09-012ff51b9859', 'Anjali Kulkarni ', '2025-01-24', NULL, 'Amit Kumar ', 'Trivedi', 'PRYDAN CONSULTANCY SERVICES PRIVATE LIMITED', 'HR Recruitment and Staffing ', NULL, 'amit@prydan.com', '9066774439', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-24 01:51:52', 'cash', '2025-01-24 01:44:51'),
('63cb8106-6890-4fde-818e-a239319c5e8e', 'Sachin Naikade', '2025-01-17', NULL, 'Pritam', 'Bala', 'Integs Cloud ', 'Sales Director ', NULL, 'pritam31@gmail.com', '8553760722', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-17 01:59:23', 'online', '2025-01-17 01:57:59'),
('64c535b5-d03d-4a9d-8d37-c002ec003204', 'Datta Kawachale', '2025-02-14', NULL, 'Sanket', 'Gangurde', 'Ascent Software Solutions', 'Software solutions ', NULL, 'sanket@ascentindia.dev', '9850532468', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 01:59:48', 'online', '2025-02-14 01:59:19'),
('6808063d-0e00-4fc4-9890-a3c2f75ae257', 'Pankaj pardeshi', '2024-12-13', NULL, 'Hrushikesh ', 'Kaule', 'Verax Infotech', 'Founder ', NULL, 'hrushikesh.kaule@gmail.com', '9665574315', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:05:46', 'online', '2024-12-13 02:02:09'),
('68a60c57-5c11-4827-bbfb-cc211b00e8e0', 'Radhika kulkarni ', '2024-12-13', NULL, 'Kartik ', 'Bandagar', 'Fresher ', 'CIVIL Engineer ', NULL, 'kartikbandagar2514@gmail.com', '9021345224', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:53:10', 'online', '2024-12-13 01:52:44'),
('6b5e4170-d0cd-47e2-b0a1-d44f5b706568', 'Vijay Kad', '2025-01-10', NULL, 'Saee', 'Kad', 'Ideal Resources Products Pvt.Ltd', 'Electronic equipments manufacturing ', NULL, 'saee.profiles@gmail.com', '9168589944', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-10 02:22:57', 'cash', '2025-01-10 02:21:23'),
('6bb9586d-4e76-42e0-9aac-f66f2bbd9a4b', 'Anuj date ', '2025-01-31', NULL, 'Chaitanya ', 'Sathe ', 'Moringa miracle ', 'Chef and ceo ', NULL, 'chaitanyasathe1104@gmail.com', '9890429806', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 02:10:48', 'online', '2025-01-31 02:09:26'),
('6c597600-7fa7-48ab-b607-0a7604f4b5d7', 'Hamid Shaikh ', '2025-01-10', NULL, 'Vikram ', 'Chavan', 'THS Group of Hotels and Resorts ', 'Corporate Sales Director ', NULL, 'info@thsgroup.in', '9096155596', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-10 02:18:51', NULL, '2025-01-10 02:18:51'),
('6c9b9f56-aaac-4043-a4c7-09b9cffa7617', 'Bhumik soni', '2024-12-13', NULL, 'Falak', 'Sheth', 'Maiora diamond ', 'Manufacturer', NULL, 'falak@maioradiamonds.in', '9673341700', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 02:00:46', 'online', '2024-12-13 14:09:06'),
('6d7d677c-9205-4dec-963c-3c9b137ac3f5', 'Gaurav Kati', '2024-12-12', NULL, 'Shilpa', 'Suresh', 'The Career Eye', 'Recruitment ', NULL, 'shilpas@thecareereye.com', '9764445990', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-12 16:34:42', 'online', '2024-12-12 12:48:38'),
('6fd6fd28-7fd0-495f-9638-fe721e8816da', 'Prem singh ', '2024-12-13', NULL, 'Gulab', 'Suthar', 'Gms enterprises ', 'Civil contractors ', NULL, 'gulabsutar11@gmail.com', '8302816192', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:14:27', 'online', '2024-12-13 02:11:55'),
('71c1caf0-2f57-4359-b9a7-36342f4e9338', 'Nilesh Sali', '2024-12-12', NULL, 'Rahul', 'Shinde', 'System Care', 'Network Tower Installation ', NULL, 'systemcare43@gmail.com', '9881001959', '1', 10, 'Meeting was amazing ', 'I like it - I\'m just not able to make the commitments at the moment', '01:50:00', NULL, 0, NULL, 'No', 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-12 20:12:47', 'online', '2024-12-13 01:42:13'),
('72a184f5-0251-4124-a96a-b0369cc58b9d', 'Ranjan Paradkar', '2024-12-13', NULL, 'Parag', 'Gore', 'Business Icon ', 'PR Services ', NULL, 'hsmspl.works@gmail.com', '9890040013', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:45:13', 'online', '2024-12-13 01:44:19'),
('731d2c9c-a58b-432b-ad97-282b1ecbd67c', 'Ashok Alurkar ', '2024-12-06', NULL, 'Pradyumna ', 'Sathe', 'IT Software ', 'IT software ', NULL, 'xxx', '9420167517', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/9212d9e4-6ac8-4374-900b-46cafd6a916f.jpg', 700.00, '2024-12-06 02:15:03', 'online', '2024-12-06 01:43:38'),
('74eee523-ffac-4f9e-aa53-a51255d123a8', 'Ashish Kulkarni', '2024-12-20', NULL, 'Parth', 'Kulkarni', 'eClinicalWorks LLC', 'QA lead', NULL, 'parthkulk@gmail.com', '7066743873', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 02:02:09', 'online', '2024-12-20 02:01:08'),
('758e295e-ff2a-47d0-a08d-74e9ce050d94', 'Nilesh Dulera', '2024-12-12', NULL, 'Rina', 'Mistry', 'Eylux Eyecare ', 'Optician ', NULL, 'rinamistry2411@gmail.com', '9168527861', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:11:53', 'online', '2024-12-12 16:44:40'),
('7854a0e9-7b6c-467d-ab8e-8621d662522c', 'Bhushan joshi ', '2024-12-06', NULL, 'Tanmay ', 'Pisal', '16/9films', 'Film production ', NULL, 'tanmaypisal37@gmail.com', '8329432628', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-06 02:07:10', 'online', '2024-12-06 01:52:54'),
('79a2cef5-76f5-4239-8ba4-3488d7fbf360', 'dfgds', '2024-12-10', NULL, 'fghfdg', 'weq', 'ghfgd', 'dsa', NULL, 'fsdg@gd.gh', '9975570005', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-10 06:45:38', NULL, '2024-12-10 06:45:38'),
('7b748f5a-831e-41fb-8d58-3794143104d3', 'Shashank Ghatge', '2024-12-13', NULL, 'Vimal', 'Patmar', 'Mahaveer super speciality eye hospital ', 'Eye Surgeon ', NULL, 'dr_vimalparmar@yahoo.co.in', '9665237377', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:40:07', 'cash', '2024-12-13 01:39:38'),
('7cc20b6a-0741-4c38-8fb0-cc9cf6ae8642', 'Prabhu Sir Suchi Enterprises ', '2024-12-13', NULL, 'Samarth', 'Barake', 'Phoenix Industries ', 'Fabrication ', NULL, 'phoenixindustriesenquiry@gmail.com', '8180892808', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:01:35', 'online', '2024-12-13 02:00:17'),
('7dc78f29-b95e-47ce-9c4b-096657192eed', 'Hamid Shaikh ', '2025-01-10', NULL, 'Prachi', 'Chavan', 'THS Group of Hotels and Resorts ', 'Corporate Sales Director ', NULL, 'info@thsgroup.in', '9769336594', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-10 02:22:08', NULL, '2025-01-10 02:22:08'),
('833a0ead-015e-45c9-84cb-fd4271835dff', 'Prathamesh  Agarwal ', '2024-12-10', NULL, 'Vishal ', 'Agarwal ', 'Omsai traders ', 'Hardware ', NULL, 'prathamshoe@gmail.com', '9970825007', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-10 13:11:13', NULL, '2024-12-10 13:11:13'),
('84cb5ff4-d1ea-44ff-bfd6-1753a5864949', 'Jitendra Sirsikar', '2025-01-17', NULL, 'Vikrant ', 'Shinde', 'Imperial Motors', 'Premium Car sales', NULL, 'vikrantvshinde1@gmail.com', '7304119999', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-17 01:55:18', 'online', '2025-01-17 01:54:38'),
('89ef7c18-5e64-4459-9dc1-5b1116c293fe', 'Manoj', '2025-02-17', NULL, 'Mayur ', 'agarwal', 'My company', 'SD', NULL, 'mayur.m.agarwal@gmail.com', '9921318237', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-02-18 03:07:50', NULL, '2025-02-18 08:37:50'),
('8c52c3d7-edba-472d-9dd5-9e4c260497e2', 'Anuj date', '2025-01-31', NULL, 'Gauri ', 'Sathe', 'Moringa miracle ', 'Moringa cookies ', NULL, 'gauri.dadhi@gmail.com', '8975872997', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 02:10:50', 'online', '2025-01-31 02:10:23'),
('91edf9d1-2172-4f22-a5cf-3655b96a9414', 'Hamid Sheikh', '2025-01-10', NULL, 'Utkarsh', 'Kolhe', 'THS group of hotels and resorts', 'Inbound head', NULL, 'info@thsgroup.in', '7058474157', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-10 02:21:29', 'online', '2025-01-10 02:20:44'),
('9240d126-6ce9-49b3-86e4-82bc8bb2cb82', 'Mr Nilesh dulera', '2025-01-17', NULL, 'Rakesh ', 'Kumar', 'Essilor india pvt ltd ', 'Regional sales manager ', NULL, 'rakeshpsm85@gmail.com', '9764564044', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-17 07:13:13', NULL, '2025-01-17 07:13:13'),
('93b804de-b6c6-48e8-ae59-9b05beeb026d', 'Gaurav Katti', '2024-12-12', NULL, 'Aashish', 'Zaveei', 'Financial store', 'Stock brokers and Mutual fund Distributors', NULL, 'aashishzaveri@gmail.com', '7875390004', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-12 14:20:08', 'online', '2024-12-12 13:56:49'),
('958b02a1-d679-4a7a-8853-4ab248acb4a6', 'ABHAY RAJENDRA CHINCHKAR', '2024-12-13', NULL, 'ABHAY', 'CHINCHKAR', 'Shree balaji traders', 'Building material supplier', NULL, 'chinchkarabhay@gmail.com', '9922360202', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:04:13', 'online', '2024-12-13 02:00:19'),
('97b99ec3-fe67-4e8b-9238-7f4b86187d5f', 'Anil agarwal', '2024-12-05', NULL, 'Anuuj', 'GUPTA', 'Progressive urban ', 'Real estate', NULL, 'anujgupta@puipro.com', '9711111889', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:53:06', NULL, '2024-12-05 10:53:06'),
('98a835cd-ecd3-4a89-b7cb-f9d1ccebc51d', 'Prabhu sir', '2024-12-13', NULL, 'Aniruddha ', 'Barake', 'Sneha Electrical Corporation and Co ', 'Electrical and Fire Fighting Contractor ', NULL, 'snehaelectrical2007@gmail.com', '9527899285', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:01:32', 'online', '2024-12-13 02:01:03'),
('9c1f86f8-853e-4e0c-8523-d1e799853ed5', 'Nilesh sali', '2024-12-13', NULL, 'Swapnil ', 'Jalindre ', 'Junnarkar Goods Transport ', 'Logistics ', NULL, 'swapniljalindre@gmail.com', '9960604251', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:14:13', 'online', '2024-12-13 02:10:06'),
('9d6fd631-6ab3-4d27-91ba-7afbc73800dc', 'Sruti Mitra', '2025-01-31', NULL, 'Urmila', 'Menon', 'Creative Wellness Project', 'Teacher, artist, writer', NULL, 'urmila.menon21@gmail.com', '9890728265', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 05:22:08', 'online', '2025-01-31 01:51:13'),
('9fd4d6e6-5268-47bc-8f4a-33fd3bc0f4fa', 'Rushikesh bagade', '2025-01-10', NULL, 'Prajakta', 'Giri', 'Transcendental technologies ', 'HR', NULL, 'prajakta.giri002@gmail.com', '9595158106', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-10 02:20:48', NULL, '2025-01-10 02:20:48'),
('9ff6623f-f83e-494a-98c0-f035fb939fed', 'Vinit wagh', '2025-02-14', NULL, 'Krutika', 'Wagh', 'Content creator', 'MA in sanskrit and content writer', NULL, 'krutikawagh10@gmail.com', '9370232059', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 01:58:51', 'online', '2025-02-14 01:45:02'),
('a140f9a6-2469-4566-a191-394d3545b9d5', 'Dr.Sitharth Mehta', '2024-12-13', NULL, 'Dr. Pratiksha', 'Dahiphale', 'Mehta\'s laser dental care maharshi nagar pune', 'Dentist', NULL, 'dahiphalepratiksha1@gmail.com', '9834607526', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:45:49', 'cash', '2024-12-13 01:45:12'),
('a1a18171-1b25-4f46-a532-0348dd4ae750', 'Jitendra  shirsagar', '2024-12-20', NULL, 'Aditya', 'Shendkar', 'Prb sport\'s gallery pvt Ltd ', 'Sport\'s equipment ', NULL, 'adityashendkar9@gmail.com', '8080351565', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 02:04:16', 'online', '2024-12-20 02:03:54'),
('a26c7150-4e3a-466f-a482-a17faf4303b8', 'Khusbu ', '2024-12-05', NULL, 'Silpa', 'Poddar ', 'House wife ', 'MBA ', NULL, 'silpapoddar13@gmail.com', '7977608236', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:57:28', NULL, '2024-12-05 10:57:28'),
('a5b09433-5fd7-48e9-9c3c-2de2a72c592f', '', '2024-11-29', NULL, 'Varma', 'Nallapuraju ', 'TIAA', 'IT', NULL, 'varma1131987@gmail.com', '9021222929', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'wgfvekfugrvheuguik', NULL, 'https://devsimplicollect.s3.ap-south-1.amazonaws.com/43e603ae-45c0-45f2-8969-a83d1d1bb744.jpg', 700.00, '2024-11-29 01:47:37', 'cash', '2024-11-29 01:45:24'),
('a7a589ab-c6f1-4375-86b5-fc6f9cc3fe61', 'Mr. Khandelwal', '2024-12-12', NULL, 'Prashant', 'Mulay', 'Prism Elastics', 'CEO', NULL, 'prismelastics@outlook.com', '9960879758', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:24:01', 'online', '2024-12-12 18:00:00'),
('a944a870-ac8c-4fb1-93ee-53d7421eae49', 'NILESH SALI', '2025-01-03', NULL, 'KUMUD', 'ORPE', 'Pram9d. C. Orpe Consultants Pvt. Ltd.', 'Import Export Consultant', NULL, 'pramodorpe@gmail.com', '9850703955', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-03 02:11:31', NULL, '2025-01-03 02:11:31'),
('abde2ae8-13d8-4657-8aad-fe0dc42f2622', 'Sameer Shah', '2024-12-13', NULL, 'Archita', 'Rane', 'Fine Things', 'Architect', NULL, 'architarane.ar@gmail.com', '7588229694', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:36:13', 'online', '2024-12-13 01:35:31'),
('ad50a406-3698-4628-91e4-c5bff98781bc', 'Shrikant Itjankar ', '2025-01-24', NULL, 'Vishal ', 'Goswami', 'Chronoanalytics Solution LLP', 'Data analytics ', NULL, 'connect@chronoanalyticssolution.in', '9850947358', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-24 02:22:48', 'online', '2025-01-24 02:20:55'),
('af792a83-f1f5-4ccc-b509-93c4f9cb80ff', 'Anuj Date', '2024-12-27', NULL, 'Rasika', 'Agarwal', 'Mask Magic', 'Business of Jelly Masks', NULL, 'raseekaagarvwal9@gmail.com', '9168786622', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-27 02:15:31', 'cash', '2024-12-27 02:02:00'),
('b0ff34de-6df8-4884-9d8a-50c5f8c50ac4', 'Roopa jibkare', '2024-12-13', NULL, 'Archana', 'Singh', 'Beyoutifulbyarchie ', 'Makeover artist', NULL, 'beyoutifulbyarchie@gmail.com', '9891224595', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:23:47', 'online', '2024-12-13 02:23:38'),
('b116ad64-dec4-4a05-95ee-a32eb27f0241', 'Sameer Shah', '2024-12-13', NULL, 'Yogesh ', 'Mogal', 'Neo enterprises', 'Architectural and Engineering services', NULL, 'YOGESHMOGAL@GMAIL.COM', '9890582243', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:01:54', 'cash', '2024-12-13 01:56:33'),
('b1c3bc9e-caba-46f2-bbde-9e062e9e8440', 'Sagar nagil', '2025-02-07', NULL, 'Amit', 'Patil', 'Tally Solutions', 'Software', NULL, 'sagar.aksninfotech@gmail.com', '9850604686', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-02-07 02:04:22', NULL, '2025-02-07 02:04:22'),
('b3429a13-5be7-4614-8643-38ca47b9a9a2', 'Dipti Soni Deshmukh ', '2024-12-13', NULL, 'Komal', 'Tompe', 'RJ Fine art studio ', 'Fine Artist', NULL, 'komalst07@gmail.com', '9552468740', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:38:19', 'online', '2024-12-13 01:36:58'),
('b6a4242f-179d-4f93-8eec-3b19fab49faa', 'Ajay wagh sir', '2024-12-27', NULL, 'Rohit', 'Gaikwad ', 'Arnalogistik ', 'Agriculture Products Export Company ', NULL, 'contactarnatrade03@gmail.com', '7972617774', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-27 01:46:49', 'cash', '2024-12-27 01:40:24'),
('b81a06d2-411e-4227-b195-486660e1456a', 'Ajay Wagh', '2025-01-17', NULL, 'William', 'Murmu', 'MIT SDE', 'Manager', NULL, 'william.murmu@mitsde.com', '8983447826', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-17 01:55:23', 'online', '2025-01-17 01:48:47'),
('b8671897-f17e-4997-9693-897e89872b8d', 'Atharva ulangwar', '2024-12-13', NULL, 'Shubham', 'Shinde', 'Shreehans private limited ', 'Construction coating ', NULL, 'shubhamshindemh39@gmail.com', '8329701544', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:44:36', 'online', '2024-12-13 01:43:37'),
('b96bb15b-7617-487f-981a-9e8ed6b53041', 'Anuj date', '2024-12-27', NULL, 'Darryl ', 'Gomes', 'Mask Magic ', 'Jelly mask / Alginate chemicals ', NULL, 'darrylgomes1975@gmail.com', '9168785522', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'esxrdtcfhvjbgjkjbghvfcvgjbl', NULL, NULL, 700.00, '2024-12-27 12:33:11', 'online', '2024-12-27 04:22:16'),
('b980bff6-981f-44dc-89c3-e9a5516a0331', 'Shrikant Itjankar', '2024-12-20', NULL, 'Vishal ', 'Goswami ', 'TEIM', 'Future Skills training ', NULL, 'connect@teim.in', '9850047358', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 01:53:37', 'online', '2024-12-20 01:50:48'),
('bfd934c4-e47f-4271-9274-8660878e8a7c', 'Shrikaysh Kotwal ', '2024-12-13', NULL, 'Rajadurai', 'Johnson', 'Max Springs', 'Spring manufacturer ', NULL, 'rajadurai.johnson@gmail.com', '9960602107', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:08:55', 'online', '2024-12-13 02:08:13'),
('c39f45a0-e74d-48cc-819a-29f709c5cd1c', 'Rajan Pardarkar', '2025-02-14', NULL, 'Premangi', 'Khagram', 'Oceanus exports pvt ltd', 'Processed food', NULL, 'team@oceanusexports.com', '7048225893', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 02:08:59', 'online', '2025-02-14 02:05:09'),
('c3bbd600-883b-435e-bcf6-d172754b7702', 'Mr Ajay Wagh', '2025-02-14', NULL, 'Amruta', 'Pawar', 'Spotzot india ltd pvt', 'Manual testing', NULL, 'Amrutapawar2222@gmail.com', '9970059535', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 02:08:56', 'online', '2025-02-14 02:08:30'),
('c57643d9-fcb9-4afe-86e4-1ea7cc902933', 'Anand Agarwal ', '2024-12-05', NULL, 'Sandeep ', 'Gupta ', 'Kailash foot wear ', 'FOOTWEAR AND APPARELS ', NULL, 'gsandeep.gupta@gmail.com', '9890072600', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 11:56:08', NULL, '2024-12-05 11:56:08'),
('ca46b952-5455-4bda-b6fd-59d53cd2c0ab', 'Ashish Kulkarni', '2024-12-13', NULL, 'Madhura', 'Bhave', 'NA', 'IT professional', NULL, 'madhurabhave19@gmail.com', '7420026559', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:22:36', 'online', '2024-12-13 02:21:19'),
('cabcc2e2-bbb3-4a7c-90ef-9977bdfbf988', 'Sangram Patil Sir', '2024-11-29', NULL, 'Anant', 'Khedkar', 'Anadi Ananta PMC', 'Redevelopment PMC', NULL, 'askdrive1@gmail.com', '9075508555', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-11-29 02:36:38', NULL, '2024-11-29 02:36:38'),
('ce109f3e-174f-41bb-b40a-66eadcf465e1', 'Ranjan paradkar ', '2024-12-13', NULL, 'Sominath', 'Tanpure', 'Rajmudra Auto ', 'Used car dealer ', NULL, 'sominathtanpure@gmail.com', '9960121005', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:29:27', 'online', '2024-12-13 01:28:33'),
('d2308a32-bf71-4699-8bb5-4bfd52008a53', 'Mr. Satish Nage ', '2024-12-27', NULL, 'Abhishek', 'Kokade', 'Srushti developers', 'Architecture', NULL, 'abhikokade7621@gmail.com', '8459413168', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-27 01:46:34', 'cash', '2024-12-27 01:44:36'),
('d63c48c5-5bd7-4b11-b221-adf58f498882', 'Nilesh', '2024-12-05', NULL, 'Anand', 'Agrawal', 'Garg Software', 'Software Engg.', NULL, 'akagrawal26@gmail.com', '8087494275', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 12:18:09', NULL, '2024-12-05 12:18:09'),
('d651c648-cf6b-427d-8840-0be63af1c259', 'Dr Karishma Awari', '2024-12-06', NULL, 'Vikram', 'Jain', 'Smart Mobile Shop', 'Mobile Phone', NULL, 'smartmobile1804@gmail.com', '9604603265', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:24:12', 'online', '2024-12-06 02:05:28'),
('dc33c808-c50f-4acc-93f9-ec2bc68cd4f2', 'Sachin Bansal', '2024-12-05', NULL, 'Sachin', 'Bansal', 'AGH AND ASSOCIATES', 'CA', NULL, 'sachinrbansal@yahoo.com', '9422008734', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:57:34', NULL, '2024-12-05 10:57:34'),
('dfdbbbf4-c238-4a74-929e-24299263b4bb', 'Rishikesh Bagade', '2025-01-10', NULL, 'Leena', 'Satpute ', 'Cantonment Sports Club', 'Vice president ', NULL, 'leena.atre@gmail.com', '9860009985', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2025-01-10 02:16:38', NULL, '2025-01-10 02:16:38'),
('e19a1960-591c-4d74-889a-736707f9a4be', 'Soham Kale', '2024-12-27', NULL, 'Soham', 'Kale', 'Shhayura Enterprises ', 'Electrical contractor ', NULL, 'sohamkale1197@gmail.com', '9960849794', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-27 02:15:34', 'online', '2024-12-27 02:07:34'),
('e5d7759b-de54-432f-b552-e244c7277959', 'Mr. Khandelwal', '2024-12-12', NULL, 'Sudhir', 'Pawar', 'Prism Elastics', 'Director', NULL, 'prismelastics@outlook.com', '8265052330', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:24:05', 'online', '2024-12-12 18:02:34'),
('e5f6ff2d-2496-4ca2-a97e-3ed5229d6e9a', '', '2025-01-24', NULL, 'Dattatray ', 'Kawcale', 'DGK', 'Business and Life Coach', NULL, 'dattakawchale@gmail.com', '9595006812', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-24 02:07:05', 'online', '2025-01-24 01:54:41'),
('e77cc0ba-c624-4379-92c5-3145e692399f', 'Rushikesh Bagade', '2024-11-29', NULL, 'Ashok', 'Gawali', 'IDFC First Bank', 'Banker', NULL, 'ashok.gawali@idfcfirstbank.com', '9765030311', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-11-29 04:20:02', NULL, '2024-11-29 04:20:02'),
('eb8c89bd-47ae-4c8b-aa30-573c3e9bb6a0', 'Reena Madanal', '2024-12-13', NULL, 'Gopalkrishna', 'Prabhu', 'Anuj Enterprises', 'Director', NULL, 'anujenterprises@hotmail.com', '9422028552', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:25:23', 'online', '2024-12-13 01:23:57'),
('ef3bbb59-d6a4-4b84-afdf-4e2f00771812', 'Shashank Ghadge ', '2025-02-14', NULL, 'Gajanan ', 'Jagtap', 'Rachana Elevators ', 'Elevators ', NULL, 'gajananjagtap1@gmail.com', '9422088306', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 02:03:25', 'online', '2025-02-14 02:01:52'),
('f0a3a06e-e223-4b7b-bdea-b85b7edad984', 'Ajay Wagh', '2025-01-31', NULL, 'Swapnil ', 'Maske', 'Swapnapurti Enterprises ', 'Dealer of Steel and Cement ', NULL, 'swapnilmaske09@gmail.com', '8407946755', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-01-31 02:03:52', 'online', '2025-01-31 01:44:22'),
('f161aab7-8f9d-4ec4-9692-971b0853f1b0', 'Bharat Gurav', '2024-12-13', NULL, 'Sunil', 'Gosavi', 'The Indian Tea Qulture ', 'Food and beverage ', NULL, 'teaqulture@gmail.com', '9822449696', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:57:28', 'cash', '2024-12-13 01:57:10'),
('f2b839f3-a3e6-43a8-b78d-81f6d74f5671', 'Gurav', '2024-12-13', NULL, 'Shrinivas', 'Peddi', 'Tailor', 'Tailor ', NULL, 'bharatgurav@yahoo.com', '9665798135', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 02:23:42', 'cash', '2024-12-13 02:23:31'),
('f44074c7-1c2f-462a-a2c6-f09af6dfca53', 'Nikhil ', '2024-12-13', NULL, 'Nikhil', 'Shivatare', 'Finethings', 'Architect', NULL, 'nikhilshivatare273@gmail.com', '8262963224', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:37:09', 'online', '2024-12-13 01:36:43'),
('f4c3ef87-020f-48bc-bc3f-4abf059e88ab', 'Anjali Kulkarni', '2024-12-13', NULL, 'Sulekha ', 'Chaudhary ', 'Quantum Advisors', 'Head HR', NULL, 'sulekha@qasl.com', '9822419280', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:46:08', 'online', '2024-12-13 01:43:33'),
('f5876c77-5e41-4ed7-b774-d3190ea8a94c', 'Adv. Ajay wagh ', '2024-12-20', NULL, 'Vinit ', 'Wagh', 'Constromotive Engineers', 'Civil contractor', NULL, 'waghvinit1@gmail.com', '9028804962', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-20 01:46:01', 'online', '2024-12-20 01:38:27'),
('f6f4b721-9b53-4ba0-9850-a4f8313b2fb5', 'Nilesh', '2024-12-05', NULL, 'Garima', 'Devidan', 'Saadgi Marketing ', 'Digital marketing company ', NULL, 'garima.agrawal4@gmail.com', '7756838579', 'kdjvfbfdkbfvhbdj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-05 10:54:21', NULL, '2024-12-05 10:54:21'),
('f99a3e62-0bd5-4020-b2bb-750847ee6778', 'Mohanish ', '2024-12-10', NULL, 'Moh', 'Aga', 'Lif ', 'Ph', NULL, 'lifecarepharma03@gmail.com', '9730477892', 'ouhiuhuhuipiouytfchvjhlo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', NULL, NULL, NULL, NULL, '2024-12-10 12:03:24', NULL, '2024-12-10 12:03:24'),
('fb9783ec-41ce-4ce4-a68b-7f0a66a66893', 'Ruturaj Shinde', '2024-12-13', NULL, 'Vishal ', 'Chepuri', 'RollnDrive ', 'Manufacturer ', NULL, 'vishal@rollndrive.com', '9637899174', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:20:34', 'online', '2024-12-13 01:16:45'),
('fbcf95e9-5c53-48d2-a836-99958267ae9f', 'Hamid Shaikh', '2024-12-13', NULL, 'Arbaz ', 'Baig', 'THS', 'Hospitality ', NULL, 'info@thsgroup\'', '8983469422', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2024-12-13 01:42:01', 'online', '2024-12-13 01:38:36'),
('fc945263-e6b6-48f6-a6e4-0201cf494e3a', 'Shardul Kulkarni ', '2025-02-14', NULL, 'Yogini ', 'Kulkarni ', 'Dhanvantari ', 'Naturopathy ', NULL, 'yvkulk@yahoo.com', '9422726738', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Preapproved', 'ergioheohjgbiehjgbdl', NULL, NULL, 700.00, '2025-02-14 01:58:47', 'online', '2025-02-14 01:52:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cashreceivers`
--
ALTER TABLE `cashreceivers`
  ADD PRIMARY KEY (`cashRecieverId`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `chapterlog`
--
ALTER TABLE `chapterlog`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`chapterId`),
  ADD UNIQUE KEY `chapterSlug` (`chapterSlug`),
  ADD KEY `fk_organisations` (`organisationId`);

--
-- Indexes for table `featuresmaster`
--
ALTER TABLE `featuresmaster`
  ADD PRIMARY KEY (`featureId`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`meetingId`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `memberchaptermapping`
--
ALTER TABLE `memberchaptermapping`
  ADD PRIMARY KEY (`memberId`,`chapterId`),
  ADD KEY `chapterId` (`chapterId`),
  ADD KEY `roleId` (`roleId`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `phoneNumber` (`phoneNumber`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `memberslog`
--
ALTER TABLE `memberslog`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `membersmeetingmapping`
--
ALTER TABLE `membersmeetingmapping`
  ADD KEY `memberId` (`memberId`),
  ADD KEY `meetingId` (`meetingId`),
  ADD KEY `transactionId` (`transactionId`);

--
-- Indexes for table `organisations`
--
ALTER TABLE `organisations`
  ADD PRIMARY KEY (`organisationId`);

--
-- Indexes for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`otp_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`packageId`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `qrreceivers`
--
ALTER TABLE `qrreceivers`
  ADD PRIMARY KEY (`qrCodeId`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`),
  ADD KEY `chapterId` (`chapterId`);

--
-- Indexes for table `term`
--
ALTER TABLE `term`
  ADD PRIMARY KEY (`termId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transactionId`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `packageId` (`packageId`),
  ADD KEY `approvedById` (`approvedById`);

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
  ADD KEY `chapterId` (`chapterId`),
  ADD KEY `paymentAcceptedMemberId` (`paymentAcceptedMemberId`),
  ADD KEY `assignedMemberId` (`assignedMemberId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `otp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `visitorfollowups`
--
ALTER TABLE `visitorfollowups`
  MODIFY `followUpId` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cashreceivers`
--
ALTER TABLE `cashreceivers`
  ADD CONSTRAINT `cashreceivers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE,
  ADD CONSTRAINT `cashreceivers_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `chapterlog`
--
ALTER TABLE `chapterlog`
  ADD CONSTRAINT `chapterlog_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `fk_organisations` FOREIGN KEY (`organisationId`) REFERENCES `organisations` (`organisationId`) ON DELETE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `memberchaptermapping`
--
ALTER TABLE `memberchaptermapping`
  ADD CONSTRAINT `memberChapterMapping_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE,
  ADD CONSTRAINT `memberChapterMapping_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE,
  ADD CONSTRAINT `memberChapterMapping_ibfk_3` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`) ON DELETE SET NULL;

--
-- Constraints for table `memberslog`
--
ALTER TABLE `memberslog`
  ADD CONSTRAINT `memberslog_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE;

--
-- Constraints for table `membersmeetingmapping`
--
ALTER TABLE `membersmeetingmapping`
  ADD CONSTRAINT `membersmeetingmapping_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE,
  ADD CONSTRAINT `membersmeetingmapping_ibfk_2` FOREIGN KEY (`meetingId`) REFERENCES `meetings` (`meetingId`) ON DELETE CASCADE,
  ADD CONSTRAINT `membersmeetingmapping_ibfk_3` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`transactionId`) ON DELETE SET NULL;

--
-- Constraints for table `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD CONSTRAINT `otp_verifications_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`memberId`) ON DELETE CASCADE;

--
-- Constraints for table `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `packages_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `qrreceivers`
--
ALTER TABLE `qrreceivers`
  ADD CONSTRAINT `qrreceivers_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE,
  ADD CONSTRAINT `qrreceivers_ibfk_2` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`chapterId`) REFERENCES `chapters` (`chapterId`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`memberId`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `packages` (`packageId`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`approvedById`) REFERENCES `members` (`memberId`) ON DELETE SET NULL;

--
-- Constraints for table `visitorfollowups`
--
ALTER TABLE `visitorfollowups`
  ADD CONSTRAINT `visitorFollowUps_ibfk_1` FOREIGN KEY (`visitorId`) REFERENCES `visitors` (`visitorId`) ON DELETE CASCADE;

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
