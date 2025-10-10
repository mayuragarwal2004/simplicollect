import React, { useEffect, useState } from 'react';
import { useData } from '../../../context/DataContext';
import { axiosInstance } from '../../../utils/config';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn button
import { toast } from 'react-toastify';
import { useDownload } from '../../../utils/downloadManager';

const periodOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: '3monthly', label: '3 Monthly' },
];

const MemberPaymentSummaryReport = () => {
  const { chapterData } = useData();
  const { downloadFromResponse } = useDownload();
  const [termOptions, setTermOptions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [customDateRange, setCustomDateRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Fetch terms
  useEffect(() => {
    if (!chapterData?.chapterId) return;
    axiosInstance
      .get(`/api/term/chapter/${chapterData.chapterId}`)
      .then((res) => setTermOptions(res.data))
      .catch(() => setTermOptions([]));
  }, [chapterData]);

  // Fetch report
  useEffect(() => {
    if (!chapterData?.chapterId || (!selectedTerm && !customDateRange)) return;
    setLoading(true);
    const params = {
      period: selectedPeriod,
      ...(selectedTerm && !customDateRange ? { termId: selectedTerm } : {}),
      ...(customDateRange
        ? {
            startDate: customStartDate,
            endDate: customEndDate,
          }
        : {}),
    };

    axiosInstance
      .get(
        `/api/report/${chapterData.chapterId}/member-payment-summary-report`,
        {
          params,
        },
      )
      .then((res) => setReport(res.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [
    chapterData,
    selectedTerm,
    selectedPeriod,
    customDateRange,
    customStartDate,
    customEndDate,
  ]);

  // Filter members by search term
  const filteredIndices = report?.members
    .map((member, idx) => ({ ...member, idx }))
    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const params = {
        period: selectedPeriod,
        ...(selectedTerm && !customDateRange ? { termId: selectedTerm } : {}),
        ...(customDateRange
          ? {
              startDate: customStartDate,
              endDate: customEndDate,
            }
          : {}),
      };

      const response = await axiosInstance.get(
        `/api/report/${chapterData.chapterId}/member-payment-summary-report/export`,
        { params, responseType: 'blob' },
      );

      const filename = 'Member_Payment_Summary_Report.xlsx';
      
      await downloadFromResponse(response, filename, {
        showSuccessToast: true,
        allowShare: true,
      });

    } catch (error) {
      console.error('Error exporting data:', error);
      // Error toast is handled by downloadManager
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        Member Payment Summary Report
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <Select
          value={selectedTerm}
          onValueChange={setSelectedTerm}
          disabled={customDateRange}
        >
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

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Period</SelectLabel>
              {periodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Label htmlFor="customRange">Custom Date?</Label>
          <Switch
            id="customRange"
            checked={customDateRange}
            onCheckedChange={setCustomDateRange}
          />
        </div>

        {customDateRange && (
          <>
            <Input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
            />
          </>
        )}
        {report && report.periodLabels && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2 inline" />{' '}
                  Exporting...
                </>
              ) : (
                'Export to Excel'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search member..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md"
      />

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-muted-foreground">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
          Loading report...
        </div>
      ) : report && report.periodLabels ? (
        <Card className="overflow-auto p-4">
          <h2 className="text-lg font-semibold mb-4">
            Total Transactions ({report.period})
          </h2>
          <div className="overflow-y-auto rounded-md border">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  {report.periodLabels.map((label, idx) => (
                    <TableHead key={idx} className="text-right">
                      {label.includes('-') ? (
                        label
                      ) : (
                        <div className="flex flex-col items-end">
                          <span>{label}</span>
                          <span className="text-xs text-gray-400">
                            {/* Assuming you add dateRange in service */}
                            {report.periodDates?.[idx] &&
                              `(${format(new Date(report.periodDates[idx].start), 'd MMM')} - ${format(new Date(report.periodDates[idx].end), 'd MMM')})`}
                          </span>
                        </div>
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="text-right font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredIndices ?? []).map(({ memberId, name, idx }) => (
                  <TableRow key={memberId}>
                    <TableCell className="font-medium">{name}</TableCell>
                    {report.matrix[idx].map((amt, colIdx) => (
                      <TableCell key={colIdx} className="text-right">
                        ₹{amt}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-bold">
                      ₹{report.totals[idx]}
                    </TableCell>
                  </TableRow>
                ))}
                {!searchTerm && (
                  <TableRow className="bg-muted/40 font-semibold">
                    <TableCell>Grand Total</TableCell>
                    {report.periodLabels.map((_, colIdx) => {
                      const total = report.matrix.reduce(
                        (sum, row) => sum + (row[colIdx] || 0),
                        0,
                      );
                      return (
                        <TableCell key={colIdx} className="text-right">
                          ₹{total}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right text-primary">
                      ₹{report.grandTotal}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No data to display. Please select a term or date range and period.
        </div>
      )}
    </div>
  );
};

export default MemberPaymentSummaryReport;
