import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ChapterBasicDetails from './ChapterBasicDetails';

const OrganisationSelection = ({ onCancel }) => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (value) => {
    setSelectedOrg(value);
    setIsDropdownOpen(false);
  };

  const handleCancel = () => {
    setSelectedOrg('');
    onCancel();
  };

  const handleNext = () => {
    setShowNext(true);
  };

  if (showNext) {
    return (
      <ChapterBasicDetails
        onNext={(data) => {
          console.log('Chapter Data:', data);
          setShowNext(false);
        }}
        onCancel={() => setShowNext(false)}
      />
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px] relative">
      <h3 className="text-2xl font-semibold mb-4">Choose an Organisation</h3>

      <div className="relative z-20">
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg border-2 w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedOrg ? `Selected: ${selectedOrg}` : 'Select an Organisation'}
        </Button>
        {isDropdownOpen && (
          <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 border z-30 top-full left-0">
            {['org1', 'org2', 'org3'].map((org) => (
              <Button
                key={org}
                className={`w-full px-4 py-2 rounded-lg border-2 text-left ${
                  selectedOrg === org ? 'bg-gray-300 text-black' : 'bg-gray-200 hover:bg-gray-300 text-black'
                }`}
                onClick={() => handleChange(org)}
              >
                {org.replace('org', 'Organisation ')}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className={`flex justify-between mt-6 transition-opacity ${isDropdownOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg border-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          className={`px-4 py-2 rounded-lg border-2 ${
            selectedOrg ? 'bg-gray-200 hover:bg-gray-300 text-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedOrg}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrganisationSelection;