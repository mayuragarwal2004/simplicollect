type ColumnConfig = {
  [key: string]: {
    displayName: string;
    hidden: boolean;
  };
};

// Define columnConfig
export const columnConfig: ColumnConfig = {
  firstName: { displayName: 'First Name', hidden: false },
  lastName: { displayName: 'Last Name', hidden: false },
  email: { displayName: 'Email Address', hidden: false },
  mobileNumber: { displayName: 'Mobile Number', hidden: false },
  invitedBy: { displayName: 'Invited By', hidden: false },
  assignedMemberId: { displayName: 'Assigned Member ID', hidden: true }, // Hidden - DataBase Features

  companyName: { displayName: 'Company Name', hidden: false },
  classification: { displayName: 'Classification', hidden: false },

  paymentAcceptedMemberId: { displayName: 'Payment Accepted By', hidden: true }, // Hidden - DataBase Features
  paymentImageLink: { displayName: 'Payment Image', hidden: false },
  paymentAmount: { displayName: 'Payment Amount', hidden: false },
  paymentRecordedDate: { displayName: 'Payment Date', hidden: false },
  paymentType: { displayName: 'Payment Type', hidden: false },

  heardAboutBni: { displayName: 'How Heard About BNI', hidden: false },
  chapterVisitDate: { displayName: 'Visit Date', hidden: false },

  visitorId: { displayName: 'Visitor ID', hidden: true }, // Hidden - DataBase Features
  industry: { displayName: 'Industry', hidden: false },
  feedbackScore: { displayName: 'Feedback Score', hidden: true }, // Hidden - Feedback Disabled Feature
  feedbackComments: { displayName: 'Feedback Comments', hidden: true }, // Hidden - Feedback Disabled Feature
  nextStep: { displayName: 'Next Step', hidden: true }, // Hidden - DataBase Features
  arrivalTime: { displayName: 'Arrival Time', hidden: true }, // Hidden - Feedback Disabled Feature
  feelWelcome: { displayName: 'Felt Welcome', hidden: true }, // Hidden - Feedback Disabled Feature
  visitedBniBefore: { displayName: 'Visited BNI Before', hidden: true }, // Hidden - Feedback Disabled Feature
  referralGroup: { displayName: 'Referral Group', hidden: true }, // Hidden - Feedback Disabled Feature
  referralGroupExperience: {
    displayName: 'Referral Group Experience',
    hidden: true,
  }, // Hidden - Feedback Disabled Feature
  eoiFilled: { displayName: 'EOI Filled', hidden: true }, // Hidden - Feedback Disabled Feature
  visitorStatus: { displayName: 'Visitor Status', hidden: true }, // Hidden - Feedback Disabled Feature
  chapterId: { displayName: 'Chapter ID', hidden: true }, // Hidden - DataBase Features
  createdAt: { displayName: 'Created At', hidden: true }, // Hidden - DataBase Features
};

// Visitor interface with all fields, regardless of whether hidden or not
export type Visitor = {
  [K in keyof typeof columnConfig]: string | number | boolean | null;
};
