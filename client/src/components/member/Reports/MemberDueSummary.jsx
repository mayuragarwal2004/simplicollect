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
import { MemberDueSummaryTable } from './memberDueSummary-data-table/memberDueSummary-table';
import { MemberDueSummaryColumns } from './memberDueSummary-data-table/memberDueSummary-column';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

const MemberDueSummary = () => {
  const location = useLocation();
  const [memberPackageSummary, setMemberPackageSummary] = useState([]);
  const { chapterData } = useData();
  const [totalRecord, setTotalRecord] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  const [columns, setColumns] = useState([]);
  const [termOptions, setTermOptions] = useState([]);
  const [packageParentOptions, setPackageParentOptions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedPackageParent, setSelectedPackageParent] = useState('');

  // Extracting query parameters
  const rows = searchParams.get('rows') || 10;
  const page = searchParams.get('page') || 0;

  const columnLabels = MemberDueSummaryColumns.map(
    ({ accessorKey, header }) => ({
      label: header().props.children,
      key: accessorKey,
    }),
  );

  const [selectedColumns, setSelectedColumns] = useState(
    columnLabels.map(({ label }) => label),
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">{status}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">{status}</Badge>;
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">Pending Approval</Badge>
        );
      default:
        return <Badge className="bg-gray-500 text-white">N/A</Badge>;
    }
  };

  const getMemeberPackageSummary = () => {
    if (!chapterData?.chapterId) return;
    if (!selectedTerm || !selectedPackageParent) return;
    axiosInstance
      .get(
        `/api/report/${chapterData.chapterId}/package-summary?rows=${rows}&page=${page}`,
        {
          params: {
            chapterId: chapterData.chapterId,
            rows,
            page,
            ...(selectedTerm && { termId: selectedTerm }),
          },
        },
      )
      .then((res) => {
        // Filter out packageData whose packageParent doesn't match selectedPackageParent
        const filteredData = (res.data.data || []).map((member) => ({
          ...member,
          packageData: (member.packageData || []).filter(
            (pkg) => pkg.packageParent === selectedPackageParent,
          ),
        }));
        setMemberPackageSummary(filteredData);
        const packageData = filteredData[0]?.packageData || [];
        const newColumns = [];
        for (let i = 0; i < packageData.length; i++) {
          newColumns.push({
            accessorKey: `packageData_${i}`,
            header: () => (
              <div className="flex items-center gap-2">
                <span>{packageData[i].packageName}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Package: {packageData[i].packageName}</p>
                      <p>Status indicates approval state</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ),
            cell: ({ row }) => {
              const pkgData = row.original.packageData[i];
              return (
                <div className="flex flex-col gap-1">
                  {pkgData?.status ? (
                    getStatusBadge(pkgData.status)
                  ) : pkgData?.calculatedResult?.totalAmount ? (
                    <span className="font-medium">
                      ₹{pkgData.calculatedResult.totalAmount}
                    </span>
                  ) : pkgData?.calculatedResult?.message ===
                    'Package has overlapping payments' ? (
                    <span className="text-green-500">✔️</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {pkgData?.calculatedResult?.message || 'N/A'}
                    </span>
                  )}
                </div>
              );
            },
            enableSorting: false,
            enableHiding: false,
          });
        }
        setColumns([...MemberDueSummaryColumns, ...newColumns]);
        setTotalRecord(res.data.totalRecords);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column],
    );
  };

  // Fetch term and package parent options
  useEffect(() => {
    if (!chapterData?.chapterId) return;
    // Fetch terms
    axiosInstance
      .get(`/api/term/chapter/${chapterData.chapterId}`)
      .then((res) => setTermOptions(res.data))
      .catch(() => setTermOptions([]));
  }, [chapterData]);

  // Fetch package parents when chapter or selectedTerm changes
  useEffect(() => {
    if (!chapterData?.chapterId || !selectedTerm) {
      setPackageParentOptions([]);
      setSelectedPackageParent('');
      return;
    }
    axiosInstance
      .get(
        `/api/packages/parents/${chapterData.chapterId}?termId=${selectedTerm}`,
      )
      .then((res) => setPackageParentOptions(res.data))
      .catch(() => setPackageParentOptions([]));
  }, [chapterData, selectedTerm]);

  useEffect(() => {
    getMemeberPackageSummary();
  }, [
    chapterData,
    rows,
    page,
    location.search,
    selectedTerm,
    selectedPackageParent,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Member Due Summary Report</h1>
      </div>

      <Alert variant="info" className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Report Information</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1">
            <li>
              This report shows member package statuses. Approved packages are
              marked in green, rejected in red, and pending approvals in yellow.
            </li>
            <li>
              The package data includes the package name, status, and total
              amount if applicable.
            </li>
            <li>
              The amount shows the total for each package if available if the
              respective user chooses to pay for the package.
            </li>
            <li>
              N/A indicates no data available for that package as the user need
              not pay for the package.
            </li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="flex gap-4">
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Term</SelectLabel>
              {termOptions.map((term) => (
                <SelectItem
                  key={term.termId || term.id}
                  value={term.termId || term.id}
                >
                  {term.termName || term.name || term.termId}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={selectedPackageParent}
          onValueChange={setSelectedPackageParent}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Package Parent" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Package Parent</SelectLabel>
              {packageParentOptions.map((parent) => (
                <SelectItem key={parent} value={parent}>
                  {parent}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={async () => {
            if (!chapterData?.chapterId || !selectedTerm) return;
            try {
              const response = await axiosInstance.get(
                `/api/report/${chapterData.chapterId}/all-members-excel?termId=${selectedTerm}`,
                { responseType: 'blob' },
              );
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'all-members-report.xlsx');
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error('Failed to download Excel file:', error);
            }
          }}
          disabled={!selectedTerm}
        >
          Export to Excel
        </button>
      </div>

      {columns && (
        <div className="rounded-md border">
          <MemberDueSummaryTable
            data={memberPackageSummary}
            columns={columns}
            searchInputField="firstName"
            totalRecord={totalRecord}
            pagination={{
              pageSize: rows,
              pageIndex: page,
            }}
            state={{ pagination: { pageSize: rows, pageIndex: page } }}
          />
        </div>
      )}
    </div>
  );
};

export default MemberDueSummary;
