import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function ChapterBasicDetails({ onNext, onCancel }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapterName: '',
    chapterSlug: '',
    meetingPeriodicity: '',
    meetingPaymentType: '',
    visitorPerMeetingFee: '',
    region: '',
    city: '',
    state: '',
    country: '',
    meetingDay: '',
    weeklyFee: '',
    monthlyFee: '',
    quarterlyFee: '',
    testMode: '',
    platformFee: '',
    platformFeeType: '',
    platformFeeCase: '',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [hoverDropdown, setHoverDropdown] = useState(null);

  const periodicityOptions = [
    'weekly',
    'fortnightly',
    'monthly',
    'bi-monthly',
    'quarterly',
    '6-monthly',
    'yearly',
  ];
  const paymentTypeOptions = ['weekly', 'monthly', 'quarterly'];

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

    setTimeout(() => {
      navigate('/admin/chapters');
    }, 100);
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
              <div key={key} className="text-left relative">
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
                >
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                {key === 'meetingPeriodicity' ||
                key === 'meetingPaymentType' ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setHoverDropdown(key)}
                    onMouseLeave={() => setHoverDropdown(null)}
                  >
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={formData[key]}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 bg-white cursor-pointer"
                      required
                    />
                    {hoverDropdown === key && (
                      <div className="absolute left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                        {(key === 'meetingPeriodicity'
                          ? periodicityOptions
                          : paymentTypeOptions
                        ).map((option) => (
                          <div
                            key={option}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              setFormData((prevData) => ({
                                ...prevData,
                                [key]: option,
                              }))
                            }
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={
                      key.includes('Fee') || key === 'testMode'
                        ? 'number'
                        : 'text'
                    }
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                    required={[
                      'chapterName',
                      'chapterSlug',
                      'meetingPeriodicity',
                      'meetingPaymentType',
                      'visitorPerMeetingFee',
                    ].includes(key)}
                  />
                )}
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
