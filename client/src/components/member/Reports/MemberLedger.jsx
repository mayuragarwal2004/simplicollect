import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '../../../utils/config';
import { useData } from '../../../context/DataContext';
import { toast } from 'react-toastify';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const ReceiverDaywiseReport = () => {
  const { chapterData } = useData();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get(`/api/member/all`, {
          params: { chapterId: chapterData?.chapterId },
        });
        setMembers(response.data);
      } catch (error) {
        toast.error('Error fetching members');
      }
    };

    if (chapterData?.chapterId) {
      fetchMembers();
    }
  }, [chapterData]);

  const handleExportData = async () => {
    if (!selectedMember) {
      toast.error('Please select a member');
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/member-ledger`,
        {
          params: { memberId: selectedMember.value },
          responseType: 'blob',
        },
      );

      if (response.status !== 200) {
        toast.error('Error exporting data');
        return;
      }

      toast.success('Data exported successfully');

      // Download blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedMember.label} - ${new Date().toLocaleString()} - Member Ledger.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Error exporting data');
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedMember ? selectedMember.label : 'Select member...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search member..." className="h-9" />
              <CommandList>
                <CommandEmpty>No member found.</CommandEmpty>
                <CommandGroup>
                  {members.map((member) => (
                    <CommandItem
                      key={member.memberId}
                      value={member.memberId.toString()}
                      onSelect={() => {
                        setSelectedMember({
                          value: member.memberId,
                          label: `${member.firstName} ${member.lastName}`,
                        });
                        setOpen(false);
                      }}
                    >
                      {member.firstName} {member.lastName}
                      <Check
                        className={cn(
                          'ml-auto',
                          selectedMember?.value === member.memberId
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button onClick={handleExportData}>Export Data</Button>
      </div>
    </div>
  );
};

export default ReceiverDaywiseReport;
