'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import ChapterBasicDetails from './ChapterBasicDetails';
import { cn } from '@/lib/utils'; // Ensure you have this utility for conditional classNames
import { axiosInstance } from '../../../../utils/config';
import { toast } from 'react-toastify';

// API call to fetch organizations
const fetchOrganisations = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/organisations/all');
    return response.data; // Assuming the API returns an array of organizations
  } catch (error) {
    console.error('Error fetching organisations:', error);
    toast.error('Failed to fetch organisations');
    return []; // Return an empty array on error
  }
};

const OrganisationSelection = ({ onCancel }) => {
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [open, setOpen] = useState(false);

  const isClosed = () => {
    if (onCancel) {
      onCancel();
    }
  };

  useEffect(() => {
    const loadOrganisations = async () => {
      const data = await fetchOrganisations();
      setOrganisations(data);
    };
    loadOrganisations();
  }, []);

  const handleSelect = (org) => {
    setSelectedOrg(org);
    setOpen(false);
  };

  const handleAddChapter = (data) => {
    console.log('Chapter Data:', data);
    axiosInstance
      .post('/api/admin/chapters', {
        organisationId: selectedOrg.organisationId,
        ...data,
      })
      .then((response) => {
        console.log('Chapter Added:', response.data);
        if (response.data.success) {
          toast.success('Chapter added successfully');
          if (onCancel) onCancel();
        } else {
          if (response.data.error) {
            toast.error(response.data.error);
          } else {
            toast.error('Failed to add chapter');
          }
        }
      })
      .catch((err) => {
        console.error('Error adding chapter:', err);
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('An unexpected error occurred');
        }
      });
  };

  if (showNext) {
    return (
      <ChapterBasicDetails
        onNext={(data) => {
          handleAddChapter(data);
        }}
        onCancel={() => setShowNext(false)}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={isClosed}>
      <DialogContent className="max-w-md">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Choose an Organisation
        </h3>

        {/* Combobox for selecting organization */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-left border"
            >
              {selectedOrg
                ? selectedOrg.organisationName
                : 'Select an Organisation'}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0"
            collisionPadding={10}
            align="start"
          >
            <Command>
              <CommandInput placeholder="Search organisation..." />
              <CommandList>
                <CommandEmpty>No organisations found.</CommandEmpty>
                {organisations.map((org) => (
                  <CommandItem
                    key={org.organisationId}
                    onSelect={() => handleSelect(org)}
                  >
                    {org.organisationName}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setShowNext(true)}
            className={cn(
              'border-gray-300',
              selectedOrg ? '' : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            )}
            disabled={!selectedOrg}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrganisationSelection;
