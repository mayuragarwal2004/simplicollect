import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useData } from '@/context/DataContext';
import { axiosInstance } from '@/utils/config';
import { MemberLedgerReportTable } from '../Reports/memberLedgerDataTable/MemberLedgerReportTable';
import { MemberLedgerReportcolumn } from '../Reports/memberLedgerDataTable/MemberLedgerReportcolumn';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useDownload } from '@/utils/downloadManager';
import { format } from 'date-fns';
import { DownloadSuccessDialog } from '@/components/ui/download-dialog';

const MyLedgerComponent = () => {
  const { chapterData } = useData();
  const { downloadFromResponse, downloadDialogState, closeDownloadDialog } = useDownload();
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chapterData || !chapterData?.chapterId) return; // Ensure chapterData is available before fetching
    axiosInstance
      .get(`/api/report/${chapterData?.chapterId}/member-ledger-json`) // Replace with your actual API endpoint
      .then((response) => {
        setLedgerData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load ledger data');
        setLoading(false);
      });
  }, [chapterData?.chapterId, axiosInstance]);

  const handleExportData = async () => {
    try {
      const fileName = `My Ledger - ${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
      
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/member-ledger`,
        {
          responseType: 'blob'
        },
      );

      await downloadFromResponse(response, fileName, {
        showSuccessToast: true,
        allowShare: true,
      });

    } catch (error) {
      console.error('[MyLedger] Export failed:', JSON.stringify({
        error: error.message,
        stack: error.stack,
        chapterId: chapterData?.chapterId
      }));
    }
  };

  const handleShare = async () => {
    if (downloadDialogState.shareCallback) {
      await downloadDialogState.shareCallback();
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
      <DownloadSuccessDialog
        isOpen={downloadDialogState.isOpen}
        onClose={closeDownloadDialog}
        filename={downloadDialogState.filename || downloadDialogState.fileName}
        onShare={handleShare}
      />
    </div>
  );
};


export default MyLedgerComponent;
