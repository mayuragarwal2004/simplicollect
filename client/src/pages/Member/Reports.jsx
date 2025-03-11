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
import ReportA from '../../components/member/Reports/ReportA';
import ReportB from '../../components/member/Reports/ReportB';
import ReportC from '../../components/member/Reports/ReportC';

const reportComponents = {
    report_a: () => <ReportA />,
    report_b: () => <ReportB />,
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
                <SelectItem value="report_a">Report A</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Chapter Report</SelectLabel>
                <SelectItem value="report_b">Report B</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Package Report</SelectLabel>
                <SelectItem value="report_c">Report C</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {reportComponents[reportType] && reportComponents[reportType]()}
      </div>
    </>
  );
};

export default Reports;
