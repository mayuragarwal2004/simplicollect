import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AllMembersReportsTable } from './allMembersReports-data-table/allMembersReports-table';
import { AllMembersReportsColumns } from './allMembersReports-data-table/allMembersReports-column';
import { useLocation } from 'react-router-dom';

const AllMembersReports = () => {
  const location = useLocation();
  const [memberPackageSummary, setMemberPackageSummary] = useState([]);
  const { chapterData } = useData();
  const [totalRecord, setTotalRecord] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  const [columns, setColumns] = useState([]);

  // Extracting query parameters
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;

  const columnLabels = AllMembersReportsColumns.map(
    ({ accessorKey, header }) => ({
      label: header().props.children,
      key: accessorKey,
    }),
  );

  const [selectedColumns, setSelectedColumns] = useState(
    columnLabels.map(({ label }) => label),
  );

  const getMemeberPackageSummary = () => {
    // get member package summary
    axiosInstance
      .get(
        `/api/report/${chapterData.chapterId}/package-summary?rows=${rows}&page=${page}`,
        {
          params: {
            chapterId: chapterData.chapterId,
            rows,
            page,
          },
        },
      )
      .then((res) => {
        setMemberPackageSummary(res.data.data);
        // make more columns
        const newColumns = [];
        const packageData = res.data.data[0].packageData;
        console.log({ packageData });

        for (let i = 0; i < packageData.length; i++) {
          newColumns.push({
            accessorKey: `packageData_${i}`,
            header: () => <div className>{packageData[i].packageName}</div>,
            cell: ({ row }) => {
              return (
                row.original.packageData[i].status ||
                row.original.packageData[i].calculatedResult.totalAmount ||
                'N/A'
              );
            },
            enableSorting: false,
            enableHiding: false,
          });
        }
        setColumns([...AllMembersReportsColumns, ...newColumns]);
        setTotalRecord(res.data.totalRecords);
      })
      .catch((err) => {
        throw new Error(err);
        console.log(err);
      });
  };
  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column],
    );
  };

  useEffect(() => {
    getMemeberPackageSummary();
  }, [chapterData, rows, page, location.search]);

  console.log({ memberPackageSummary });

  return (
    <div>
      <h1>Report A</h1>
      {columns && (
        <AllMembersReportsTable
          data={memberPackageSummary}
          columns={columns} // Pass refetch function for actions
          searchInputField="firstName" // Searchable field
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

export default AllMembersReports;
