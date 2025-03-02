import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportB = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([
    "Member Name",
    "Amount Paid",
    "Due",
    "Package Name",
    "Payment Type",
    "Collected By",
    "Approved By",
    "Date",
    "Approval Status",
  ]);

  useEffect(() => {
    axiosInstance
      .get("/api/report/member-transactions")
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  const allColumns = [
    { label: "Member Name", key: "name" },
    { label: "Amount Paid", key: "paidAmount" },
    { label: "Due", key: "dueAmount" },
    { label: "Package Name", key: "packageName" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Collected By", key: "paymentReceivedByName" },
    { label: "Approved By", key: "approvedByName" },
    { label: "Date", key: "transactionDate" },
    { label: "Approval Status", key: "approvalStatus" },
  ];

  // Handle column selection for export
  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  // Export as CSV
  const exportCSV = () => {
    const csvData = reports.map((report) => {
      let row = {};
      allColumns.forEach(({ label, key }) => {
        if (selectedColumns.includes(label)) {
          row[label] = key === "name" ? `${report.firstName} ${report.lastName}` : report[key];
        }
      });
      return row;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as PDF
    const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Member Transactions Report", 20, 10);
    const tableColumn = allColumns.filter(({ label }) => selectedColumns.includes(label)).map(({ label }) => label);
    const tableRows = reports.map((report) =>
      tableColumn.map((col) =>
        col === "Member Name" ? `${report.firstName} ${report.lastName}` : report[col.toLowerCase().replace(/ /g, "")]
      )
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("report.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Member Transactions Report</h2>

      {/* Column Selection */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Select Columns to Export</h3>
        <div className="flex flex-wrap gap-4">
          {allColumns.map(({ label }) => (
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

      {/* Export Buttons */}
      <div className="flex gap-4 mb-4">
        <Button onClick={exportCSV} className="bg-blue-500 text-white">
          Export as CSV
        </Button>
        <Button onClick={exportPDF} className="bg-red-500 text-white">
          Export as PDF
        </Button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No reports available.</p>
      ) : (
        <Table className="border rounded-lg shadow-md">
          <TableHeader>
            <TableRow className="bg-gray-100">
              {allColumns
                .filter(({ label }) => selectedColumns.includes(label))
                .map(({ label }) => (
                  <TableHead key={label}>{label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.transactionId} className="hover:bg-gray-50">
                {allColumns
                  .filter(({ label }) => selectedColumns.includes(label))
                  .map(({ label, key }) => (
                    <TableCell key={key}>
                      {label === "Member Name"
                        ? `${report.firstName} ${report.lastName}`
                        : key === "transactionDate"
                          ? new Date(report[key]).toLocaleDateString()
                          : report[key]}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ReportB;
