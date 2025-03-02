import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom'
import { ReportBTable } from './reportb-data-table/reportb-table';
import { ReportBColumns } from './reportb-data-table/reportb-column';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useData } from '../../../context/DataContext';

const ReportB = () => {
 const location = useLocation()
 const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chapterData } = useData();
  const searchParams = new URLSearchParams(location.search);
  const [totalRecord, setTotalRecord] = useState(null);
  const rows = searchParams.get('rows') || 5;
  const page = searchParams.get('page') || 0;

  const columnLabels = ReportBColumns.map(({ accessorKey, header }) => ({
    label: header().props.children,
    key: accessorKey,
  }));

  const [selectedColumns, setSelectedColumns] = useState(
    columnLabels.map(({ label }) => label),
  );

  useEffect(() => {
    console.log("helo");
    
    if (!chapterData) return;
    getReportData();
  }, [chapterData, rows, page, location.search]);

  const getReportData = () => {
    console.log("helo 2");

    axiosInstance
      .get('/api/report/member-transactions', {
        params: {
          chapterId: chapterData.chapterId,
          rows,
          page,
        },
      })
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

  const exportCSV = () => {
    const csvData = reports.map((report) => {
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

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Member Transactions Report', 20, 10);
    const tableColumn = columnLabels
      .filter(({ label }) => selectedColumns.includes(label))
      .map(({ label }) => label);
    const tableRows = reports.map((report) =>
      tableColumn.map((col) =>
        col === 'Member Name'
          ? `${report.firstName} ${report.lastName}`
          : report[col.toLowerCase().replace(/ /g, '')],
      ),
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('report.pdf');
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
        <Button onClick={exportCSV} className="bg-blue-500 text-white">
          Export as CSV
        </Button>
        <Button onClick={exportPDF} className="bg-red-500 text-white">
          Export as PDF
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No reports available.</p>
      ) : (
        <ReportBTable
          data={reports}
          columns={ReportBColumns}
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

export default ReportB;
