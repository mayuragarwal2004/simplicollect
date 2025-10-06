import React, { useState, useEffect } from 'react';

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
  const [selectedTime, setSelectedTime] = useState<string>(initialValue);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setSelectedTime(time);
    
    if (onTimeChange) {
      if (timeFormat === '12') {
        // Convert 24-hour format to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        onTimeChange(`${displayHour}:${minutes} ${ampm}`);
      } else {
        onTimeChange(time);
      }
    }
  };

  return (
    <div className={`mb-4.5 ${parentClassName}`}>
      {label && (
        <label className="mb-2.5 mt-5 block text-black dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
          placeholder={placeholder}
          className="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
        />
      </div>
    </div>
  );
};

export default MUI_TimePicker;
