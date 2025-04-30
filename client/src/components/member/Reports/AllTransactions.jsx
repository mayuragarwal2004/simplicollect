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
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const columnLabels = AllTransactionsColumns.map(
    ({ accessorKey, header }) => ({
      label: header().props.children,
      key: accessorKey,
    }),
  );

  const [selectedColumns, setSelectedColumns] = useState(
    columnLabels.map(({ label }) => label),
  );

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
        `/api/report/${chapterData.chapterId}/member-transactions?rows=${rows}&page=${page}  `,
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

  // const exportCSV = () => {
  //   const csvData = reports.map((report) => {
  //     let row = {};
  //     columnLabels.forEach(({ label, key }) => {
  //       if (selectedColumns.includes(label)) {
  //         row[label] =
  //           key === 'name'
  //             ? `${report.firstName} ${report.lastName}`
  //             : report[key];
  //       }
  //     });
  //     return row;
  //   });

  //   const csv = Papa.unparse(csvData);
  //   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', 'report.csv');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const exportExcel = async () => {
    try {
      const excelData = reports.map((report) => {
        let row = {};
        columnLabels.forEach(({ label, key }) => {
          if (selectedColumns.includes(label)) {
            row[label] =
              key === 'name'
                ? `${report.firstName} ${report.lastName}`
                : report[key];
          }
        });
        return row;
      });

      await axiosInstance.post('/api/export/excel', {
        data: excelData,
        columns: selectedColumns,
      });

      toast.success('Excel data sent to backend successfully.');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel. Please try again later.');
    }
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text('Member Transactions Report', 20, 10);
  //   const tableColumn = columnLabels
  //     .filter(({ label }) => selectedColumns.includes(label))
  //     .map(({ label }) => label);
  //   const tableRows = reports.map((report) =>
  //     tableColumn.map((col) =>
  //       col === 'Member Name'
  //         ? `${report.firstName} ${report.lastName}`
  //         : report[col.toLowerCase().replace(/ /g, '')],
  //     ),
  //   );

  //   doc.autoTable({
  //     head: [tableColumn],
  //     body: tableRows,
  //   });

  //   doc.save('report.pdf');
  // };

  const handlePDFExport = () => {
    setOpenDialog(false);

    const selectedKeys = columnLabels
      .filter(({ label }) => selectedColumns.includes(label))
      .map(({ key }) => key);

    const payload = {
      fromDate,
      toDate,
      selectedColumns: selectedKeys,
      chapterId: chapterData.chapterId,
    };

    axiosInstance
      .post(`/api/report/export-pdf`, payload)
      .then((res) => {
        console.log('Export request sent successfully:', res.data);
        toast.success('PDF export request sent successfully!');
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || 'Failed to export PDF');
      });
  };

  return (
    <div className="p-6">
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
                <Input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
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
