import React from 'react';
import { Button } from '@/components/ui/button';
import { useDownload } from '../../../utils/downloadManager';

const DownloadTestComponent = () => {
  const { downloadFile, downloadCSV, downloadPDF, downloadExcel } = useDownload();

  const testCSVDownload = async () => {
    const csvData = 'Name,Email,Phone\nJohn Doe,john@example.com,123-456-7890\nJane Smith,jane@example.com,987-654-3210';
    const blob = new Blob([csvData], { type: 'text/csv' });
    await downloadCSV(blob, 'test-data.csv');
  };

  const testPDFDownload = async () => {
    // Create a simple PDF using jsPDF (if available)
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.text('Test PDF Document', 20, 20);
      doc.text('This is a test PDF generated for download testing.', 20, 40);
      
      const pdfBlob = doc.output('blob');
      await downloadPDF(pdfBlob, 'test-document.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const testExcelDownload = async () => {
    // Create a simple Excel-like content
    const excelData = 'Name\tEmail\tPhone\nJohn Doe\tjohn@example.com\t123-456-7890\nJane Smith\tjane@example.com\t987-654-3210';
    const blob = new Blob([excelData], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    await downloadExcel(blob, 'test-spreadsheet.xlsx');
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Download Manager Test</h3>
      <div className="space-x-2">
        <Button onClick={testCSVDownload} variant="outline">
          Test CSV Download
        </Button>
        <Button onClick={testPDFDownload} variant="outline">
          Test PDF Download
        </Button>
        <Button onClick={testExcelDownload} variant="outline">
          Test Excel Download
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        Click the buttons above to test downloads in both web and native environments.
        In native apps, you'll be prompted to save or share the file.
      </p>
    </div>
  );
};

export default DownloadTestComponent;