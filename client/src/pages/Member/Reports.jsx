import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';
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
import ReceiverDaywiseReport  from '../../components/member/Reports/ReceiverDaywiseReport';
import ReportC from '../../components/member/Reports/ReportC';
import MemberLedgerReport from '../../components/member/Reports/MemberLedgerReport';

const reportComponents = {
    member_due_summary: () => <MemberDueSummary />,
    member_ledger: () => <MemberLedger />,
    all_transactions: () => <AllTransactions />,
    receiver_daywise_report: () => <ReceiverDaywiseReport />,
    report_c: () => <ReportC />,
};

const Reports = () => {
  const [reportType, setReportType] = React.useState('');



  return (
    <>
      <Breadcrumb pageName="Reports" />
      <div className="rounded-sm border border-stroke bg-white p-5 shadow-md dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium dark:text-white">
            View Your Chapter's Reports
          </h2>
          {/* <IconButton aria-label="refresh" onClick={fetchPendingFees}>
                    <RefreshIcon className="dark:text-white" />
                </IconButton> */}
        </div>
        <div>
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value)}
            className="w-full"
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a report type you want to view" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Member Wise Report</SelectLabel>
                <SelectItem value="member_due_summary">Member Due Summary Report</SelectItem>
                <SelectItem value="member_ledger">Member Ledger</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Chapter Report</SelectLabel>
                <SelectItem value="all_transactions">All Transactions</SelectItem>
                <SelectItem value="receiver_daywise_report">Receiver Daily Report</SelectItem>
              </SelectGroup>
              {/* <SelectGroup>
                <SelectLabel>Package Report</SelectLabel>
                <SelectItem value="report_c">Report C</SelectItem>
              </SelectGroup> */}
            </SelectContent>
          </Select>
        </div>

        {reportComponents[reportType] && reportComponents[reportType]()}
      </div>
    </>
  );
};

export default Reports;
