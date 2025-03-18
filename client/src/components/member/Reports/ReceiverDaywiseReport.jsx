import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar'; // shadcn calendar
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

const ReceiverDaywiseReport = () => {
  const { chapterData } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleExportData = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd'); // format to pass in API
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/receiver-daywise-report`,
        {
          params: { date: formattedDate },
          responseType: 'blob',
        },
      );

      if (response.status !== 200) {
        toast.error('Error exporting data');
        return;
      }

      toast.success('Data exported successfully');

      // Download blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ReceiverDaywiseReport-${formattedDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Error exporting data');
      console.error('Error exporting data:', error);
    }
  };

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
              {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setOpen(false);
              }}
              disabled={(date) => date > new Date()} // Disable future dates
            />
          </PopoverContent>
        </Popover>

        <Button onClick={handleExportData}>Export Data</Button>
      </div>
    </div>
  );
};

export default ReceiverDaywiseReport;
