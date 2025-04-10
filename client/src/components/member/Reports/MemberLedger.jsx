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
import { Skeleton } from '@/components/ui/skeleton';
import { MemberLedgerReportTable } from './memberLedgerDataTable/MemberLedgerReportTable';
import { MemberLedgerReportcolumn } from './memberLedgerDataTable/MemberLedgerReportcolumn';

const ReceiverDaywiseReport = () => {
  const { chapterData } = useData();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]); // Filtered list
  const [selectedMember, setSelectedMember] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(`/api/member/all`, {
        params: { chapterId: chapterData?.chapterId },
      });
      setMembers(response.data);
      setFilteredMembers(response.data); // Initialize filtered list
    } catch (error) {
      toast.error('Error fetching members');
    }
  };

  useEffect(() => {
    if (chapterData?.chapterId) {
      fetchMembers();
    }
  }, [chapterData]);

  useEffect(() => {
    if (selectedMember) {
      fetchLedgerData();
    }
  }, [selectedMember]);

  // Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredMembers(members);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(lowerCaseQuery) ||
        member.lastName.toLowerCase().includes(lowerCaseQuery) ||
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(lowerCaseQuery) ||
        member.email.toLowerCase().includes(lowerCaseQuery) ||
        member.phoneNumber.includes(query), // Allow phone search without lowercasing
    );

    setFilteredMembers(filtered);
  };

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

  const fetchLedgerData = async () => {
    if (!selectedMember) return;
    setLoading(true);
    setLedgerData([]); // Reset ledger data before fetching new data
    try {
      const response = await axiosInstance.get(
        `/api/report/${chapterData?.chapterId}/member-ledger-json`,
        {
          params: { memberId: selectedMember.value },
        },
      );
      setLedgerData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching ledger data');
      setLoading(false);
    }
  };

  if (!chapterData || !chapterData?.chapterId) return null; // Ensure chapterData is available
  

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[250px] justify-between"
            >
              {selectedMember ? selectedMember.label : 'Select member...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput
                placeholder="Search member..."
                className="h-9"
                value={searchQuery}
                onValueChange={handleSearch}
              />
              <CommandList>
                <CommandEmpty>No member found.</CommandEmpty>
                <CommandGroup>
                  {filteredMembers.map((member) => (
                    <CommandItem
                      key={member.memberId}
                      label={`${member.firstName} ${member.lastName}`}
                      value={member.memberId.toString()}
                      onSelect={() => {
                        setSelectedMember({
                          value: member.memberId,
                          label: `${member.firstName} ${member.lastName}`,
                        });
                        setOpen(false);
                      }}
                    >
                      {`${member.firstName} ${member.lastName}`}
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
      {loading ? (
        <Skeleton className="h-10 w-full mb-4" />
      ) : selectedMember ? (
        <MemberLedgerReportTable
          data={ledgerData}
          columns={MemberLedgerReportcolumn}
          searchInputField="firstName"
          totalRecord={0}
          pagination={{
            pageSize: 10,
            pageIndex: 0,
          }}
          state={{ pagination: { pageSize: 10, pageIndex: 0 } }}
        />
      ) : null}
    </div>
  );
};

export default ReceiverDaywiseReport;
