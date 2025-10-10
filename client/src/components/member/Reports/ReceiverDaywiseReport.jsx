import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDownload } from '../../../utils/downloadManager';

const ReceiverDaywiseReport = () => {
  const { chapterData } = useData();
  const { downloadFromResponse } = useDownload();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchJsonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/receiver-daywise-json-report`,
        {
          params: { date: formattedDate },
        },
      );
      setJsonData(response.data);
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/receiver-daywise-report`,
        {
          params: { date: formattedDate },
          responseType: 'blob',
        },
      );

      const filename = `ReceiverDaywiseReport-${formattedDate}.xlsx`;
      
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

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchJsonData();
    }
  }, [selectedDate, chapterData]);

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, 'PPP')
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date || new Date());
                setOpen(false);
              }}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleExportData}
          disabled={exportLoading || jsonData?.data.transactions.length === 0}
        >
          {exportLoading ? 'Exporting...' : 'Export Data'}
        </Button>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}

      {jsonData && (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">
            Transaction Report for {jsonData?.data.date}
          </h1>

          {jsonData?.data.transactions.length === 0 && (
            <div className="text-center text-lg font-semibold text-gray-500">
              No transactions found for the selected date.
            </div>
          )}

          {jsonData?.data.transactions.map((group, groupIndex) => (
            <Card
              key={`${group.receiverName}-${group.paymentType}-${groupIndex}`}
            >
              <CardHeader>
                <CardTitle>
                  {group.receiverName} ({group.paymentType})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr No</TableHead>
                      <TableHead>Receiver Name</TableHead>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Receiver Fee</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Penalty Amount</TableHead>
                      <TableHead>Discount Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.data.map((transaction, index) => (
                      <TableRow key={transaction.memberid}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{group.receiverName}</TableCell>
                        <TableCell>{transaction.membername}</TableCell>
                        <TableCell>{transaction.paymentType}</TableCell>
                        <TableCell>{transaction.paidAmount}</TableCell>
                        <TableCell>{transaction.receiverFee}</TableCell>
                        <TableCell>{transaction.platformFee}</TableCell>
                        <TableCell>{transaction.penaltyAmount}</TableCell>
                        <TableCell>{transaction.discountAmount}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={3}>Total:</TableCell>
                      <TableCell>{group.paymentType}</TableCell>
                      <TableCell>{group.totals.amountPaid}</TableCell>
                      <TableCell>{group.totals.receiverFee}</TableCell>
                      <TableCell>{group.totals.platformFee}</TableCell>
                      <TableCell>{group.totals.penaltyAmount}</TableCell>
                      <TableCell>{group.totals.discountAmount}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}

          {jsonData?.data.transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Grand Totals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Receiver Fee</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Penalty Amount</TableHead>
                      <TableHead>Discount Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cash</TableCell>
                      <TableCell>
                        {jsonData?.data.totals.cash.amountPaid}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.cash.receiverFee}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.cash.platformFee}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.cash.penaltyAmount}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.cash.discountAmount}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Online</TableCell>
                      <TableCell>
                        {jsonData?.data.totals.online.amountPaid}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.online.receiverFee}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.online.platformFee}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.online.penaltyAmount}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.online.discountAmount}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Grand Total</TableCell>
                      <TableCell>
                        {jsonData?.data.totals.grand.amountPaid}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.grand.receiverFee}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.grand.platformFee}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.grand.penaltyAmount}
                      </TableCell>
                      <TableCell>
                        {jsonData?.data.totals.grand.discountAmount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiverDaywiseReport;
