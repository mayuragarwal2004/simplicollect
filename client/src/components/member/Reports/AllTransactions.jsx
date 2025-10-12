import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom';
import { AllTransactionsTable } from './allTransactions-data-table/allTransactions-table';
import { AllTransactionsColumns } from './allTransactions-data-table/allTransactions-column';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useData } from '../../../context/DataContext';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useDownload } from '../../../utils/downloadManager';
import { DownloadSuccessDialog } from '@/components/ui/download-dialog';

const AllTransactions = () => {
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chapterData } = useData();
  const searchParams = new URLSearchParams(location.search);
  const [totalRecord, setTotalRecord] = useState(null);
  const rows = searchParams.get('rows') || 5;
  const page = searchParams.get('page') || 1;
  const [openDialog, setOpenDialog] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const columnLabels = AllTransactionsColumns.map(
    ({ accessorKey, header }) => ({
      label: header().props.children,
      key: accessorKey,
    }),
  );

  const [selectedColumns, setSelectedColumns] = useState(
    columnLabels.map(({ label }) => label),
  );

  const {
    downloadFromResponse,
    downloadDialogState,
    closeDownloadDialog,
  } = useDownload();

  useEffect(() => {
    console.log('helo');

    if (!chapterData) return;
    getReportData();
  }, [chapterData, rows, page, location.search]);

  const getReportData = () => {
    if (!chapterData.chapterId) return;
    console.log('helo 2');

    axiosInstance
      .get(
        `/api/report/${chapterData.chapterId}/member-transactions-report?rows=${rows}&page=${page}  `,
        {
          params: {
            chapterId: chapterData.chapterId,
            rows,
            page,
          },
        },
      )
      .then((res) => {
        setReports(res.data.data);
        setTotalRecord(res.data.totalRecords);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  };

  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column],
    );
  };

  const exportExcel = async () => {
    const selectedKeys = columnLabels
      .filter(({ label }) => selectedColumns.includes(label))
      .map(({ key }) => key);

    try {
      const response = await axiosInstance.post(
        `/api/report/${chapterData.chapterId}/member-transactions-report/export`,
        {
          startDate: fromDate,
          endDate: toDate,
          type: 'excel',
          selectedColumns: selectedKeys,
          chapterId: chapterData.chapterId,
        },
        {
          responseType: 'blob', // Important for file download
        },
      );

      downloadFromResponse(response, `Member Transactions Report ${format(new Date(fromDate), 'dd-MM-yyyy')} - ${format(new Date(toDate), 'dd-MM-yyyy')}.xlsx`);
      toast.success('Excel file downloaded successfully.');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel. Please try again later.');
    }
  };

  const handlePDFExport = async () => {
    setOpenDialog(false);

    const selectedKeys = columnLabels
      .filter(({ label }) => selectedColumns.includes(label))
      .map(({ key }) => key);

    const payload = {
      startDate: fromDate,
      endDate: toDate,
      type: 'pdf',
      selectedColumns: selectedKeys,
      chapterId: chapterData.chapterId,
    };

    try {
      const response = await axiosInstance.post(
        `/api/report/${chapterData.chapterId}/member-transactions-report/export`,
        payload,
        {
          responseType: 'blob', // Receive binary data
        },
      );

      downloadFromResponse(response, `Member Transactions Report ${format(new Date(fromDate), 'dd-MM-yyyy')} - ${format(new Date(toDate), 'dd-MM-yyyy')}.pdf`);
      toast.success('PDF file downloaded successfully.');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      toast.error(err.response?.data?.error || 'Failed to export PDF');
    }
  };

  const handleShare = async () => {
    if (downloadDialogState.shareCallback) {
      await downloadDialogState.shareCallback();
    }
  };

  return (
    <div className="p-6">
      <DownloadSuccessDialog
        isOpen={downloadDialogState.isOpen}
        onClose={closeDownloadDialog}
        filename={downloadDialogState.filename}
        onShare={handleShare}
      />
      <h2 className="text-2xl font-semibold mb-4">
        Member Transactions Report
      </h2>

      <div className="mb-4 p-4 border rounded-md bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Select Columns to Export</h3>
        <div className="flex flex-wrap gap-4">
          {columnLabels.map(({ label }) => (
            <div key={label} className="flex items-center gap-2">
              <Checkbox
                checked={selectedColumns.includes(label)}
                onCheckedChange={() => toggleColumn(label)}
              />
              <label className="text-sm">{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white">Export</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Options</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div>
                <Label htmlFor="fromDate">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !fromDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate
                        ? format(new Date(fromDate), 'PPP')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="toDate">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !toDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(new Date(toDate), 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter className="flex justify-between gap-2">
              <Button
                onClick={handlePDFExport}
                className="bg-red-500 text-white"
                disabled={!fromDate || !toDate}
              >
                Export PDF
              </Button>

              <Button
                onClick={() => {
                  setOpenDialog(false);
                  exportExcel();
                }}
                className="bg-green-700 text-white"
                disabled={!fromDate || !toDate}
              >
                Export Excel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No reports available.</p>
      ) : (
        <AllTransactionsTable
          data={reports}
          columns={AllTransactionsColumns}
          searchInputField="firstName"
          totalRecord={totalRecord}
          pagination={{
            pageSize: rows,
            pageIndex: page,
          }}
          state={{ pagination: { pageSize: rows, pageIndex: page } }}
        />
      )}
    </div>
  );
};

export default AllTransactions;
