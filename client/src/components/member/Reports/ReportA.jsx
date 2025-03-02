import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { ReportATable } from './reporta-data-table/reporta-table';
import { ReportAColumns } from './reporta-data-table/reporta-column';

const ReportA = () => {
  const [memberPackageSummary, setMemberPackageSummary] = useState([]);
  const { chapterData } = useData();
  const [totalRecord, setTotalRecord] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const [columns, setColumns] = useState([]);

  // Extracting query parameters
  const rows = searchParams.get('rows') || 5;
  const page = searchParams.get('page') || 0;

  const getMemeberPackageSummary = () => {
    // get member package summary
    axiosInstance
      .get(
        `/api/report/${chapterData.chapterId}/package-summary?rows=${rows}&page=${page}`,
      )
      .then((res) => {
        setMemberPackageSummary(res.data);
        // make more columns
        const newColumns = [];
        const packageData = res.data[0].packageData;
        console.log({ packageData });

        for (let i = 0; i < packageData.length; i++) {
          newColumns.push({
            accessorKey: `packageData_${i}`,
            header: () => <div className>{packageData[i].packageName}</div>,
            cell: ({ row }) => {
              return (
                row.original.packageData[i].status ||row.original.packageData[i].calculatedResult.totalAmount ||
                'N/A'
              );
            },
            enableSorting: false,
            enableHiding: false,
          });
        }
        setColumns([...ReportAColumns, ...newColumns]);
      })
      .catch((err) => {
        throw new Error(err);
        console.log(err);
      });
  };

  useEffect(() => {
    getMemeberPackageSummary();
  }, []);

  console.log({ memberPackageSummary });

  return (
    <div>
      <h1>Report A</h1>
      {columns && (
        <ReportATable
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

export default ReportA;
