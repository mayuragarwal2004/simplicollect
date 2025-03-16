import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import OrganisationSeletion from './OrganistaionSeletion';
import ChapterRules from './ChapterRules';

function ChapterBasicDetails() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    chapterName: '',
    chapterSlug: '',
    city: '',
    state: '',
    country: '',
  });

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
    setStep(2);
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleNext = () => {
    setStep(2);
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px]">
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold mb-4">
              Enter Chapter’s Basic Details
            </h3>
            <div className="space-y-4">
              <div className="text-left">
                <label
                  htmlFor="chapterName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Chapter Name
                </label>
                <input
                  type="text"
                  id="chapterName"
                  name="chapterName"
                  value={formData.chapterName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="chapterSlug"
                  className="block text-sm font-medium text-gray-700"
                >
                  Chapter Slug
                </label>
                <input
                  type="text"
                  id="chapterSlug"
                  name="chapterSlug"
                  value={formData.chapterSlug}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={handleBack}
                className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 hover:border-black text-black px-4 py-2 rounded-lg border-2"
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === 0) {
    return <OrganisationSeletion />;
  }

  if (step === 2) {
    return <ChapterRules />;
  }
}

export default ChapterBasicDetails;
