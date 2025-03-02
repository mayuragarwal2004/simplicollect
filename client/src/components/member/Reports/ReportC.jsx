import React, { useEffect, useState } from "react";
import { axiosInstance } from '../../../utils/config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; 

const MemberSummaryReport = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/report/member-Total")
      .then((response) => {
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching report:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Member Financial Summary</h2>
      <Table className="border rounded-lg shadow-md">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Member Name</TableHead>
            <TableHead>Amount Total (₹)</TableHead>
            <TableHead>Total Dues (₹)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.length > 0 ? (
            reportData.map((row) => (
              <TableRow key={row.memberId} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.memberName}</TableCell>
                <TableCell className="text-green-600 font-semibold">{row.amountTotal}</TableCell>
                <TableCell className="text-red-600 font-semibold">{row.totalDues}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="3" className="text-center text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberSummaryReport;
