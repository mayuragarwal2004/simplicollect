export interface Chapter {
  chapterId: string;
  chapterName: string;
  chapterSlug: string;
  region?: string;
  city?: string;
  state?: string;
  country?: string;
  meetingDay?: string;
  meetingPeriodicity:
    | 'weekly'
    | 'fortnightly'
    | 'monthly'
    | 'bi-monthly'
    | 'quaterly'
    | '6-monthly'
    | 'yearly';
  meetingPaymentType: Array<'weekly' | 'monthly' | 'quarterly'>;
  visitorPerMeetingFee: number;
  weeklyFee?: number;
  monthlyFee?: number;
  quarterlyFee?: number;
  organisationId?: string;
  organisationName?: string;
  testMode?: boolean;
  balance?: number;
  roleNames?: string[];
}
