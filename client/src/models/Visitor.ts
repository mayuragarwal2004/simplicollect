export interface Visitor {
  visitorId: string;
  invitedBy: string;
  chapterVisitDate: string; // ISO string format for Date
  heardAboutBni: string;
  firstName: string;
  lastName: string;
  companyName: string;
  classification: string;
  industry: string;
  email: string;
  mobileNumber: string;
  feedbackScore: number | null;
  feedbackComments: string | null;
  nextStep: string | null;
  arrivalTime: string | null; // Could be a Date string or a specific time string
  feelWelcome: boolean | null;
  visitedBniBefore: boolean | null;
  referralGroup: string | null;
  referralGroupExperience: string | null;
  eoiFilled: number;
  visitorStatus: string;
  chapterId: string;
  paymentAcceptedMemberId: string | null;
  assignedMemberId: string | null;
  paymentImageLink: string | null;
  paymentAmount: number | null;
  paymentRecordedDate: string | null; // ISO string format for Date
  createdAt: string; // ISO string format for Date
}