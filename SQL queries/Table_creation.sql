CREATE TABLE organisations (
  organisationId VARCHAR(255) PRIMARY KEY,
  organisationName VARCHAR(255) NOT NULL
)

CREATE TABLE chapters (
  chapterId VARCHAR(255) PRIMARY KEY,
  chapterName VARCHAR(255) NOT NULL,
  chapterSlug VARCHAR(255) UNIQUE NOT NULL,
  organisationId VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  meetingDay VARCHAR(255),
  meetingPeriodicity ENUM('weekly', 'fortnightly', 'monthly', 'bi-monthly', 'quaterly', '6-monthly', 'yearly') NOT NULL,
  meetingPaymentType SET('weekly', 'monthly', 'quarterly') NOT NULL, -- Allow multiple choices
  visitorPerMeetingFee DECIMAL(10, 2) NOT NULL,
  weeklyFee DECIMAL(10, 2), -- separate fee for weekly
  monthlyFee DECIMAL(10, 2), -- separate fee for monthly
  quarterlyFee DECIMAL(10, 2), -- separate fee for quarterly
  -- ask user if will number of week change the fee for the month? if yes, for 4 week ____ for 5 week ____
  -- discount for early payment
  -- grace period for payment
  -- penalty for late payment
  -- payable date (1st week of month, grace period another week, means penalty after 2nd week)
  FOREIGN KEY (organisationId) REFERENCES organisation(organisationId) ON DELETE CASCADE
);


CREATE TABLE memberChapterMapping (
  memberId VARCHAR(255) NOT NULL,
  chapterId VARCHAR(255) NOT NULL,
  roleId VARCHAR(255) NOT NULL,
  FOREIGN KEY (memberId) REFERENCES members(memberId) ON DELETE CASCADE,
  FOREIGN KEY (chapterId) REFERENCES chapters(chapterId) ON DELETE CASCADE,
  FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE CASCADE
);

CREATE TABLE members (
  memberId VARCHAR(255) PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  superAdmin BOOLEAN DEFAULT FALSE,
  role VARCHAR(255)
);


CREATE TABLE visitors (
  visitorId VARCHAR(255) NOT NULL PRIMARY KEY,
  invitedBy VARCHAR(255) NOT NULL,
  chapterVisitDate DATE NOT NULL,
  heardAboutBni VARCHAR(255),
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  companyName VARCHAR(255),
  classification VARCHAR(255),
  industry VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  mobileNumber VARCHAR(20) NOT NULL,
  chapterId VARCHAR(255) NOT NULL,
  
  -- Feedback Fields
  feedbackScore INT,
  feedbackComments TEXT,
  nextStep TEXT, -- Changed to TEXT without CHECK constraint
  arrivalTime TIME,
  feelWelcome BOOLEAN,
  visitedBniBefore BOOLEAN,
  referralGroup BOOLEAN,
  referralGroupExperience TEXT,
  
  -- Committee Fields
  eoiFilled BOOLEAN DEFAULT FALSE,
  visitorStatus ENUM('Approved', 'Preapproved', 'Declined') DEFAULT 'Preapproved',

  -- Payment and association information
  paymentAcceptedMemberId VARCHAR(255),
  assignedMemberId VARCHAR(255),
  paymentImageLink VARCHAR(255),
  paymentAmount DECIMAL(10, 2),
  paymentRecordedDate TIMESTAMP,
  paymentType ENUM('cash', 'online'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key constraints
  FOREIGN KEY (chapterId) REFERENCES chapters(chapterId) ON DELETE CASCADE,
  FOREIGN KEY (paymentAcceptedMemberId) REFERENCES members(memberId) ON DELETE CASCADE,
  FOREIGN KEY (assignedMemberId) REFERENCES members(memberId) ON DELETE CASCADE
);


CREATE TABLE visitorFollowUps (
  followUpId INT AUTO_INCREMENT PRIMARY KEY,
  visitorId VARCHAR(255) NOT NULL,
  followUpMemberId INT NOT NULL,
  followUpDate DATE NOT NULL,
  followUpTime TIME NOT NULL,
  followUpMode ENUM('call', 'message', 'email', 'inPerson') NOT NULL,
  followUpNotes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key constraint
  FOREIGN KEY (visitorId) REFERENCES visitors(visitorId) ON DELETE CASCADE
);



INSERT INTO `chapters` (`chapterId`, `chapterName`, `region`, `city`, `state`, `country`, `meetingDay`, `meetingPeriodicity`, `meetingPaymentType`, `visitorPerMeetingFee`, `weeklyFee`, `monthlyFee`, `quarterlyFee`, `chapterSlug`) VALUES
('1', 'Fortune', 'Pune East', 'Pune', 'Maharashtra', 'India', 'Friday', 'weekly', 'monthly', 500.00, NULL, NULL, NULL, 'fortune-pune-east');

INSERT INTO `members` (`memberId`, `firstName`, `lastName`, `phoneNumber`, `email`, `password`, `chapterId`, `role`) VALUES
('1', 'Rishikesh', 'Bagade', '1234567890', 'rishikesh.bagade@gmail.com', '$2a$10$MUcAtSgHW.0VxIa794PRhevN7Nhmqr3zARwEm/hCGH5y2JwETT4aa', '1', 'president');