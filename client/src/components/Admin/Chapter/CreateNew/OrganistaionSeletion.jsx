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

// Simulated API call to fetch organizations
const fetchOrganisations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'org1', name: 'Organisation One' },
        { id: 'org2', name: 'Organisation Two' },
        { id: 'org3', name: 'Organisation Three' },
      ]);
    }, 500);
  });
};

const OrganisationSelection = ({ onCancel }) => {
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [open, setOpen] = useState(false);

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
      .post('/api/admin/add-chapter', {
        organisationId: selectedOrg.id,
        ...data,
      })
      .then((response) => {
        console.log('Chapter Added:', response.data);
        if (response.data.success) {
          toast.success('Chapter added successfully');
          if (onCancel) onCancel();
        } else {
          toast.error('Failed to add chapter');
        }
      })
      .catch((err) => {
        toast.error('Failed to add chapter');
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
    <Dialog open={true} onOpenChange={setShowNext}>
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
              {selectedOrg ? selectedOrg.name : 'Select an Organisation'}
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
                  <CommandItem key={org.id} onSelect={() => handleSelect(org)}>
                    {org.name}
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
