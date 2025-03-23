import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ChapterBasicDetails from './ChapterBasicDetails';

const OrganisationSelection = ({ onCancel }) => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(true); 

  const handleChange = (value) => {
    setSelectedOrg(value);
    setIsDialogOpen(false); 
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
          setIsAddModalOpen(false); 
        }}
        onCancel={() => setShowNext(false)} 
      />
    );
  }

  
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg text-center w-[600px]">
      <h3 className="text-2xl font-semibold mb-4">Choose an Organisation</h3>

     
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg border-2 w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            {selectedOrg ? `Selected: ${selectedOrg}` : 'Select an Organisation'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an Organisation</DialogTitle>
            <DialogDescription>
              Please choose an organisation from the list below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                selectedOrg === 'org1'
                  ? 'bg-gray-300 text-black'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
              onClick={() => handleChange('org1')} 
            >
              Organisation 1
            </Button>
            <Button
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                selectedOrg === 'org2'
                  ? 'bg-gray-300 text-black'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
              onClick={() => handleChange('org2')} 
            >
              Organisation 2
            </Button>
            <Button
              className={`w-full px-4 py-2 rounded-lg border-2 ${
                selectedOrg === 'org3'
                  ? 'bg-gray-300 text-black'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
              onClick={() => handleChange('org3')} 
            >
              Organisation 3
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between mt-6">
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg border-2"
          onClick={handleCancel} 
        >
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          className={`px-4 py-2 rounded-lg border-2 ${
            selectedOrg
              ? 'bg-gray-200 hover:bg-gray-300 text-black'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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