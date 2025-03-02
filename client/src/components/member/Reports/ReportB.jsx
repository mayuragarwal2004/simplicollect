import React, { useEffect ,useState} from 'react';
import { axiosInstance } from '../../../utils/config';

const ReportB = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get member package summary
    axiosInstance
      .get(`/api/report/allMemberReports`)
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log("Error");
        setLoading(false);
      });
  }
    , []);
  return (
    <div>
      <h2>Member Transactions Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Amount Paid</th>
              <th>Due</th>
              <th>Package Name</th>
              <th>Payment Type</th>
              <th>Collected By</th>
              <th>Approved By</th>
              <th>Date</th>
              <th>Approval Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.transactionId}>
                <td>{report.firstName} {report.lastName}</td>
                <td>{report.paidAmount}</td>
                <td>{report.dueAmount}</td>
                <td>{report.packageName}</td>
                <td>{report.paymentType}</td>
                <td>{report.paymentReceivedByName}</td>
                <td>{report.approvedByName}</td>
                <td>{new Date(report.transactionDate).toLocaleDateString()}</td>
                <td>{report.approvalStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportB;
