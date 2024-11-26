import React, { useState } from 'react';
import exportConfig from '../../../utils/exportConfig.json';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../../context/AuthContext';
import { columnConfig, Visitor } from '../../../models/Visitor';
import FilterTags from '../../../components/FilterTags';

type ExportVisitorDataProps = {
  data: Visitor[];
};

const ExportVisitorData: React.FC<ExportVisitorDataProps> = ({ data }) => {
  //   const { user } = useAuth();
  const { user } = { user: { role: 'admin' } };
  const userRole = user?.role || 'guest'; // Default role is 'guest'

  // Extract visible columns from configuration
  const allVisibleColumns = Object.keys(columnConfig).filter(
    (col) => !columnConfig[col].hidden,
  );

  console.log({ allVisibleColumns });
  

  // Default columns based on role
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]
  );

  // Handle active filter updates
  const setActiveFilters = (filters: string[]) => {
    setSelectedColumns(filters);
  };

  // Export as CSV
  const exportToCSV = () => {
    const filteredData = data.map((row) =>
      selectedColumns.reduce(
        (acc, key) => ({
          ...acc,
          [columnConfig[key].displayName]: row[key as keyof Visitor],
        }),
        {},
      ),
    );
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
    XLSX.writeFile(workbook, 'visitor_data.csv');
  };

  // Export as Excel
  const exportToExcel = () => {
    const filteredData = data.map((row) =>
      selectedColumns.reduce(
        (acc, key) => ({
          ...acc,
          [columnConfig[key].displayName]: row[key as keyof Visitor],
        }),
        {},
      ),
    );
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
    XLSX.writeFile(workbook, 'visitor_data.xlsx');
  };

  // Export as PDF
  const exportToPDF = () => {
    const filteredData = data.map((row) =>
      selectedColumns.map((key) => row[key as keyof Visitor]),
    );
    const doc = new jsPDF();
    autoTable(doc, {
      head: [selectedColumns.map((key) => columnConfig[key].displayName)],
      body: filteredData,
    });
    doc.save('visitor_data.pdf');
  };

  console.log({ selectedColumns });

  return (
    <div className="bg-white text-black p-5 m-5 rounded w-3/4 dark:bg-boxdark">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Export Visitor Data</h2>

      {/* Column Selection using FilterTags */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 dark:text-white">Select Columns:</h3>
        <FilterTags
          filters={allVisibleColumns.map(
            (col) => columnConfig[col]?.displayName,
          )}
          activeFilters={selectedColumns}
          setActiveFilters={setActiveFilters}
        />
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export to CSV
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default ExportVisitorData;
