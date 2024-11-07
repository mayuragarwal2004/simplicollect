import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface TimePickerProps {
  label?: string;
  placeholder?: string;
  timeFormat?: '12' | '24'; // 12 for 12-hour format, 24 for 24-hour format
  onTimeChange?: (selectedTime: string) => void;
  initialValue?: string;
  parentClassName?: string;
}

const MUI_TimePicker: React.FC<TimePickerProps> = ({
  label = 'Time Picker',
  placeholder = 'Select time',
  timeFormat = '24',
  onTimeChange,
  initialValue = '',
  parentClassName = '',
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(initialValue ? new Date(`1970-01-01T${initialValue}:00`) : null);

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
    if (time && onTimeChange) {
      const formattedTime = format(time, timeFormat === '24' ? 'HH:mm' : 'hh:mm a');
      onTimeChange(formattedTime);
    }
  };

  return (
    <div className={`${parentClassName}`}>
      {label && (
        <label className="mb-3 mt-5 block text-black dark:text-white">
          {label}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label={placeholder}
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </LocalizationProvider>
    </div>
  );
};

export default MUI_TimePicker;
