import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import MemberDueSummary from '../../components/member/Reports/MemberDueSummary';
import MemberLedger from '../../components/member/Reports/MemberLedger';
import AllTransactions from '../../components/member/Reports/AllTransactions';
import ReceiverDaywiseReport from '../../components/member/Reports/ReceiverDaywiseReport';
import ReportC from '../../components/member/Reports/ReportC';
import MemberLedgerReport from '../../components/member/Reports/MemberLedgerReport';
import MemberPaymentSummaryReport from '../../components/member/Reports/MemberPaymentSummaryReport';

const reportComponents = [
  {
    label: 'Member Wise Report',
    reports: [
      {
        value: 'member_due_summary',
        label: 'Member Due Summary Report',
        component: MemberDueSummary,
      },
      {
        value: 'member_ledger',
        label: 'Member Ledger',
        component: MemberLedger,
      },
      {
        value: 'member_payment_summary_report',
        label: 'Member Payment Summary Report',
        component: MemberPaymentSummaryReport,
      },
    ],
  },
  {
    label: 'Chapter Report',
    reports: [
      {
        value: 'all_transactions',
        label: 'All Transactions',
        component: AllTransactions,
      },
      {
        value: 'receiver_daywise_report',
        label: 'Receiver Daily Report',
        component: ReceiverDaywiseReport,
      },
    ],
  },
  // Uncomment if needed
  // {
  //   label: 'Package Report',
  //   reports: [
  //     { value: 'report_c', label: 'Report C', component: ReportC },
  //   ],
  // },
];

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get report type from URL query parameter or default to empty
  const reportType = searchParams.get('type') || '';

  // Function to update report type
  const handleReportTypeChange = (value) => {
    setSearchParams({ type: value });
  };

  // Flatten all reports for lookup
  const allReports = reportComponents.flatMap((group) => group.reports);
  const selectedReport = allReports.find((r) => r.value === reportType);

  return (
    <>
      <Breadcrumbs items={[
        { name: 'Reports' }
      ]} />
      <div className="rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            View Your Chapter's Reports
          </h2>
        </div>
        <div>
          <Select
            value={reportType}
            onValueChange={handleReportTypeChange}
            className="w-full"
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a report type you want to view" />
            </SelectTrigger>
            <SelectContent>
              {reportComponents.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.reports.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedReport && <selectedReport.component />}
      </div>
    </>
  );
};

export default Reports;
