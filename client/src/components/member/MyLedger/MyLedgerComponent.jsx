import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useData } from '@/context/DataContext';
import { axiosInstance } from '@/utils/config';
import { MemberLedgerReportTable } from '../Reports/memberLedgerDataTable/MemberLedgerReportTable';
import { MemberLedgerReportcolumn } from '../Reports/memberLedgerDataTable/MemberLedgerReportcolumn';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const MyLedgerComponent = () => {
  const { chapterData } = useData();
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/report/${chapterData.chapterId}/member-ledger-json`) // Replace with your actual API endpoint
      .then((response) => {
        setLedgerData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load ledger data');
        setLoading(false);
      });
  }, []);

  const handleExportData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/member-ledger`,
        {
          responseType: 'blob',
        },
      );

      if (response.status !== 200) {
        toast.error('Error exporting data');
        return;
      }

      toast.success('Data exported successfully');

      // Download blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${""} - ${new Date().toLocaleString()} - Member Ledger.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Error exporting data');
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleExportData}>Export Data</Button>
      {loading ? (
        <Skeleton className="h-10 w-full mb-4" />
      ) : (
        <MemberLedgerReportTable
          data={ledgerData}
          columns={MemberLedgerReportcolumn}
          searchInputField="firstName"
          totalRecord={0}
          pagination={{
            pageSize: 10,
            pageIndex: 0,
          }}
          state={{ pagination: { pageSize: 10, pageIndex: 0 } }}
        />
      )}
    </div>
  );
};

export default MyLedgerComponent;
