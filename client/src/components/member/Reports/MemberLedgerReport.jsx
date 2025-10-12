import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useLocation } from 'react-router-dom'
import { MemberLedgerReportTable } from './memberLedgerDataTable/MemberLedgerReportTable';
import { MemberLedgerReportcolumn } from './memberLedgerDataTable/MemberLedgerReportcolumn';
import { Checkbox } from '@/components/ui/checkbox';
import { MemberLedgerReportpagination } from './memberLedgerDataTable/MemberLedgerReportpagination';
import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useData } from '../../../context/DataContext';
import { useDownload } from '../../../utils/downloadManager';
import { DownloadSuccessDialog } from '@/components/ui/download-dialog';

const MemberLedgerReport = () => {
    const location = useLocation();
    const { 
        downloadCSV, 
        downloadPDF, 
        downloadFromResponse, 
        downloadDialogState, 
        closeDownloadDialog 
    } = useDownload();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { chapterData } = useData();
    const searchParams = new URLSearchParams(location.search);
    const [totalRecord, setTotalRecord] = useState(null);
    const rows = searchParams.get('rows') || 5;
    const page = searchParams.get('page') || 1;

    const columnLabels = MemberLedgerReportcolumn.map(({ accessorKey, header }) => ({
        label: header().props.children,
        key: accessorKey,
    }));

    const [selectedColumns, setSelectedColumns] = useState(
        columnLabels.map(({ label }) => label),
    );

    useEffect(() => {
        if (!chapterData) return;
        getReportData();
    }, [chapterData, rows, page, location.search]);

    const getReportData = () => {
        if (!chapterData.chapterId) return;

        axiosInstance
            .get(`/api/report/${chapterData.chapterId}/member-transactions?rows=${rows}&page=${page}  `, {
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

    const exportCSV = async () => {
        const csvData = reports.map(row => {
            const newRow = {};
            columnLabels.forEach(({ label, key }) => {
                if (selectedColumns.includes(label)) {
                    newRow[label] = row[key];
                }
            });
            return row;
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        await downloadCSV(blob, 'MemberLedgerReport.csv', {
            showSuccessToast: true,
            allowShare: true,
        });
    };

    const exportPDF = async () => {
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

        // Convert PDF to blob and use download manager
        const pdfBlob = doc.output('blob');
        await downloadPDF(pdfBlob, 'MemberLedgerReport.pdf', {
            showSuccessToast: true,
            allowShare: true,
        });
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
                Member Ledger Report
            </h2>

            {/* <div className="mb-4 p-4 border rounded-md bg-gray-100">
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
            </div> */}

            {/* <div className="flex gap-4 mb-4">
                <Button onClick={exportCSV} className="bg-blue-500 text-white">
                    Export as CSV
                </Button>
                <Button onClick={exportPDF} className="bg-red-500 text-white">
                    Export as PDF
                </Button>
            </div> */}

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : reports.length === 0 ? (
                <p className="text-gray-600">No reports available.</p>
            ) : (
                <MemberLedgerReportTable
                    data={reports}
                    columns={MemberLedgerReportcolumn}
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

export default MemberLedgerReport;