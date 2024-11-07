CREATE TABLE chapters (
  chapterId VARCHAR(255) PRIMARY KEY,
  chapterName VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  meetingDay VARCHAR(255),
  meetingPaymentType ENUM('weekly', 'monthly', 'yearly') NOT NULL,
  perMeetingFee DECIMAL(10, 2) NOT NULL
);
INSERT INTO chapters (chapterId, chapterName, region, city, state, country, meetingDay, meetingPaymentType, perMeetingFee) VALUES ('1', 'Fortune', 'Pune East', 'Pune', 'Maharashtra', 'India', 'Friday', 'monthly', 500.00);
CREATE TABLE members (
  memberId VARCHAR(255) PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(20) UNIQUE NOT NULL,
  emailId VARCHAR(255) UNIQUE NOT NULL,
  chapterId VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  FOREIGN KEY (chapterId) REFERENCES chapters(chapterId)
);
INSERT INTO members (memberId, firstName, lastName, phoneNumber, emailId, chapterId, role) VALUES ('1', 'Rishikesh', 'Bagade', '9876543210', 'rishikesh.bagade@gmail.com', '1', 'President');

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
  emailId VARCHAR(255) UNIQUE NOT NULL,
  mobileNumber VARCHAR(20) UNIQUE NOT NULL,
  
  -- Feedback Fields
  feedbackScore INT,
  feedbackComments TEXT,
  nextStep VARCHAR(255) CHECK (nextStep IN ('apply', 'questions', 'notReady')),
  arrivalTime TIME,
  feelWelcome BOOLEAN,
  visitedBniBefore BOOLEAN,
  referralGroup BOOLEAN,
  referralGroupExperience TEXT,
  
  -- Committee Fields
  eoiFilled BOOLEAN DEFAULT FALSE,
  visitorStatus ENUM('Approved', 'Preapproved', 'Declined') DEFAULT 'Preapproved',

  -- Payment and association information
  chapterId VARCHAR(255) NOT NULL,
  paymentAcceptedMemberId VARCHAR(255),
  assignedMemberId VARCHAR(255),
  paymentImageLink VARCHAR(255),
  paymentAmount DECIMAL(10, 2),
  paymentRecordedDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (chapterId) REFERENCES chapters(chapterId),
  FOREIGN KEY (paymentAcceptedMemberId) REFERENCES members(memberId),
  FOREIGN KEY (assignedMemberId) REFERENCES members(memberId)
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
  FOREIGN KEY (visitorId) REFERENCES visitors(visitorId)
);
