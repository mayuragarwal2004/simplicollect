import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ChapterBasicDetails from './ChapterBasicDetails';

const OrganisationSelection = ({ onCancel }) => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showNextComponent, setShowNextComponent] = useState(false);

  const handleChange = (value) => {
    setSelectedOrg(value);
  };

  const handleCancel = () => {
    setSelectedOrg('');
    onCancel(); // Call the onCancel prop to close the modal
  };

  const onNext = () => {
    if (selectedOrg) {
      setShowNextComponent(true);
    }
  };

  if (showNextComponent) {
    return <ChapterBasicDetails />;
  }

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px]">
        <h3 className="text-2xl font-semibold mb-4">Choose an Organisation</h3>
        <Select value={selectedOrg} onValueChange={handleChange}>
          <SelectTrigger className="w-full border border-gray-300 rounded-lg shadow-md bg-white text-gray-700 cursor-pointer hover:border-blue-800 my-5">
            <SelectValue placeholder="Select an Organisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="org1">Organisation 1</SelectItem>
            <SelectItem value="org2">Organisation 2</SelectItem>
            <SelectItem value="org3">Organisation 3</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-between mt-6">
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg border-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={onNext}
            className={`px-4 py-2 rounded-lg border-2 ${selectedOrg ? 'bg-gray-200 hover:bg-gray-300 text-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            disabled={!selectedOrg}
          >
            Next
          </Button>
        </div>
      </div>
    // </div>
  );
};

export default OrganisationSelection;