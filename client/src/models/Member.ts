export interface Member {
  [x: string]: ReactNode;
  memberId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  chapterId?: string;
  role?: string;
}
