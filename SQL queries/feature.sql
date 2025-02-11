CREATE TABLE simplicollect.featuresMaster (
  featureId VARCHAR(255) PRIMARY KEY,
  featureName VARCHAR(255) NOT NULL,
  featureDescription TEXT,
  featureType VARCHAR(255),
  featureParent VARCHAR(255),
  featureUrl VARCHAR(255),
  featureIcon VARCHAR(255),
  featureOrder BIGINT,
  featureDisabled BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO simplicollect.featuresMaster (featureId, featureName, featureDescription, featureType, featureParent, featureUrl, featureIcon, featureOrder, featureDisabled) 
VALUES 
('member_fees', 'Member Fees', 'Member Fees', 'menu', "Members", '/member/fee', 'Users', 1, 0), 
('member_list', 'Member List', 'Member List', 'menu', "Members", '/member/list', 'Users', 2, 0), 
('perosnal_profile', 'Profile', 'Profile', 'menu', "Members", '/profile', 'Users', 3, 0), 
('visitor_approval_list', 'Visitor Approval List', 'Visitor Approval List', 'menu', "Visitors", '/visitor/list', 'Users', 1, 0), 
('visitor_reports', 'Visitor Reports', 'Visitor Reports', 'menu', "Visitors", '/visitor-reports', 'Users', 2, 0), 
('chapter_settings', 'Chapter Settings', 'Chapter Settings', 'menu', "Settings", '/chapter-settings', 'Users', 1, 0);


CREATE TABLE simplicollect.roles (
  roleId VARCHAR(255) PRIMARY KEY,
  roleName VARCHAR(255) NOT NULL,
  removeable BOOLEAN DEFAULT TRUE,
  roleDescription TEXT,
  chapterId VARCHAR(255),
  rights JSON,
  FOREIGN KEY (chapterId) REFERENCES chapters(chapterId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO simplicollect.roles (roleId, roleName, removeable, roleDescription, chapterId) VALUES 
('1', 'President', 0, 'President', '1', "member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,chapter_settings"), 
('2', 'Vice President', 0, 'Vice President', '1', "member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,chapter_settings"),
('3', 'Secretary', 0, 'Secretary', '1', "member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,chapter_settings"), 
('4', 'Treasurer', 0, 'Treasurer', '1', "member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,chapter_settings"), 
('5', 'Member', 0, 'Member', '1', "member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,chapter_settings"), 
('6', 'Visitor', 0, 'Visitor', '1', "member_fees,member_list,perosnal_profile,visitor_approval_list,visitor_reports,chapter_settings"),;



-- Create rights table
CREATE TABLE simplicollect.rights (
  rightId VARCHAR(255) PRIMARY KEY,
  roleId VARCHAR(255),
  featureId VARCHAR(255),
  rightName VARCHAR(255),
  rightDescription TEXT,
  rightDisabled BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE CASCADE,
  FOREIGN KEY (featureId) REFERENCES featuresMaster(featureId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
