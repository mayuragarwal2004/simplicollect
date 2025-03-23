import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function ChapterBasicDetails({ onNext, onCancel }) {
  const [formData, setFormData] = useState({
    chapterName: '',
    chapterSlug: '',
    region: '',
    city: '',
    state: '',
    country: '',
    meetingDay: '',
    meetingPeriodicity: '',
    meetingPaymentType: '',
    visitorPerMeetingFee: '',
    weeklyFee: '',
    monthlyFee: '',
    quarterlyFee: '',
    organisationId: '',
    testMode: '',
    platformFee: '',
    platformFeeType: '',
    platformFeeCase: '',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    onNext(formData);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enter Chapter’s Basic Details</DialogTitle>
          <DialogDescription>
            Please fill in the details for the new chapter.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="text-left">
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type={key.includes('Fee') || key === 'testMode' ? 'number' : 'text'}
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
            >
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChapterBasicDetails;
