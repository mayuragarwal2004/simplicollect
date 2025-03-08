import React from 'react';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';

const MeetingDayChapterReport = () => {
  const { chapterData } = useData();

  const handleExportData = async () => {
    try {
      const response = await axiosInstance.get(`/api/report/${chapterData.chapterId}/meeting-day-chapter-report`, {
        responseType: 'arraybuffer', // Important for binary data
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'meeting_day_chapter_report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleExportData}>Export Data</Button>
    </div>
  );
};

export default MeetingDayChapterReport;
