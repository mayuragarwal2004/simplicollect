import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SelectMembersModal from './SelectMembersModal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { PaymentDueBroadcastColumns } from './columns';
import { axiosInstance } from '@/utils/config';

const PaymentDueBroadcast = () => {
  const location = useLocation();
  const { chapterData } = useData();
  const [memberData, setMemberData] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for filters and dynamic columns
  const [termOptions, setTermOptions] = useState([]);
  const [packageParentOptions, setPackageParentOptions] = useState([]);
  const [packageOptions, setPackageOptions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedPackageParent, setSelectedPackageParent] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [tableColumns, setTableColumns] = useState([]);

  // Base columns for member info
  const baseColumns = [
    {
      accessorKey: "fullName", // Virtual column for search
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        return `${member.firstName} ${member.lastName}`;
      }
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => row.original.phoneNumber || 'N/A'
    }
  ];

  // Fetch term and package parent options
  useEffect(() => {
    if (!chapterData?.chapterId) return;

    const fetchTerms = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/term/chapter/${chapterData.chapterId}`
        );
        setTermOptions(data);
      } catch (error) {
        console.error('Error fetching terms:', error);
        toast.error('Failed to fetch terms');
      }
    };

    fetchTerms();
  }, [chapterData]);

  console.log({selectedMembers});
  

  // Fetch package parents when chapter or selectedTerm changes
  useEffect(() => {
    if (!chapterData?.chapterId || !selectedTerm) return;

    const fetchPackageParents = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/packages/parents/${chapterData.chapterId}?termId=${selectedTerm}`
        );
        setPackageParentOptions(data);
        setSelectedPackageParent(''); // Reset package parent when term changes
        setSelectedPackage(''); // Reset package when term changes
      } catch (error) {
        console.error('Error fetching package parents:', error);
        toast.error('Failed to fetch package parents');
      }
    };

    fetchPackageParents();
  }, [chapterData, selectedTerm]);

  // Fetch packages when package parent changes
  useEffect(() => {
    if (!chapterData?.chapterId || !selectedTerm || !selectedPackageParent) return;

    const fetchPackages = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/packages/${chapterData.chapterId}?termId=${selectedTerm}&packageParent=${selectedPackageParent}`
        );
        console.log({data});
        
        setPackageOptions(data.data);
        setSelectedPackage(''); // Reset package when parent changes
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to fetch packages');
      }
    };

    fetchPackages();
  }, [chapterData, selectedTerm, selectedPackageParent]);

  // Fetch member data
    const getMemberData = async () => {
    if (!chapterData?.chapterId || !selectedTerm || !selectedPackageParent || !selectedPackage) {
      console.log('Missing required data:', { 
        chapterId: chapterData?.chapterId, 
        termId: selectedTerm, 
        packageParent: selectedPackageParent,
        packageId: selectedPackage
      });
      return;
    }

    try {
      const params = {
        termId: selectedTerm,
        packageParent: selectedPackageParent,
        packageId: selectedPackage
      };
      
      console.log('Fetching member data with params:', params);
      const { data: response } = await axiosInstance.get(
        `/api/broadcast/${chapterData.chapterId}/dues-broadcast`,
        { params }
      );
      
      console.log('Response:', response);
      // The response is already the data we need, no need to check success property
      // Filter data to only include selected package and members with due amount
      const filteredData = response.data
        .map(member => {
          const selectedPackageData = (member.packageData || []).find(
            pkg => pkg.packageId === selectedPackage
          );
          if (!selectedPackageData) return null;
          
          const dueAmount = selectedPackageData.calculatedResult?.totalAmount || 0;
          const hasDueAmount = dueAmount > 0 || selectedPackageData.calculatedResult?.message === 'Package has overlapping payments';
          
          return {
            ...member,
            id: member.memberId, // Add id field for DataTable selection
            packageData: [selectedPackageData],
            dueAmount,
            hasDueAmount,
            fullName: `${member.firstName} ${member.lastName}`.toLowerCase() // Add fullName field for search
          };
        })
        .filter(member => member !== null && member.hasDueAmount);

      setMemberData(filteredData);
      
      // Add single column for the selected package
      const newColumns = [{
        accessorKey: 'dueAmount',
        header: () => (
          <div className="flex items-center gap-2">
            <span>Due Amount</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows payment status or due amount</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        cell: ({ row }) => {
          const pkgData = row.original.packageData[0];
          return (
            <div className="flex flex-col gap-1">
              {pkgData?.calculatedResult?.message === 'Package has overlapping payments' ? (
                <span className="text-green-500">✔️</span>
              ) : pkgData?.calculatedResult?.totalAmount ? (
                <span className="font-medium">₹{pkgData.calculatedResult.totalAmount}</span>
              ) : (
                <span className="text-muted-foreground">
                  {pkgData?.calculatedResult?.message || 'N/A'}
                </span>
              )}
            </div>
          );
        }
      }];

      setTableColumns([...baseColumns, ...newColumns]);
    } catch (error) {
      console.error('Failed to fetch member data:', {
        error: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
        stack: error.stack
      });
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch member data');
    }
  };

  useEffect(() => {
    getMemberData();
  }, [chapterData, selectedTerm, selectedPackageParent, selectedPackage]);

  const handleSubmit = async () => {
    if (!memberData || memberData.length === 0) {
      toast.error("No members found with due payments");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSendNotifications = async (selectedMemberData) => {
    if (!selectedMemberData.length) {
      toast.error("Please select at least one member");
      return;
    }

    const membersToNotify = selectedMemberData.map(member => ({
      memberId: member.memberId,
      firstName: member.firstName,
      lastName: member.lastName,
      phoneNumber: member.phoneNumber,
      dueAmount: member.dueAmount,
      packageName: member.packageData[0]?.packageName
    }));

    setIsSubmitting(true);
    try {
      const { data: result } = await axiosInstance.post(
        `/api/broadcast/${chapterData.chapterId}/send-dues-notification`,
        {
          members: membersToNotify,
          termId: selectedTerm,
          packageId: selectedPackage,
        }
      );

      toast.success(result.message || 'Notifications sent successfully');
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast.error(error.response?.data?.message || 'Failed to send notifications');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Payment Due Notification Broadcast</h1>
      </div>

      <Alert variant="info" className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Broadcast Information</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Select members from the list below to send payment due reminders via WhatsApp.
            </li>
            <li>
              Members must have a valid phone number to receive notifications.
            </li>
            <li>
              You can filter members by term and package parent to narrow down the list.
            </li>
            <li>
              Use the checkboxes to select/deselect members for notification.
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 flex-wrap">
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Term</SelectLabel>
              {termOptions.map((term) => (
                <SelectItem key={term.termId} value={term.termId}>
                  {term.termName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedPackageParent}
          onValueChange={setSelectedPackageParent}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Package Parent" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Package Parent</SelectLabel>
              {packageParentOptions.map((parent) => (
                <SelectItem key={parent} value={parent}>
                  {parent}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedPackage}
          onValueChange={setSelectedPackage}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Package" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Package</SelectLabel>
              {packageOptions.map((pkg) => (
                <SelectItem key={pkg.packageId} value={pkg.packageId}>
                  {pkg.packageName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSubmit}
          disabled={!selectedTerm || !selectedPackage || !selectedPackageParent || isSubmitting || memberData.length === 0}
          className="ml-auto"
        >
          {isSubmitting ? 'Sending...' : 'Send Notifications'}
        </Button>
      </div>

      {tableColumns.length > 0 && (
        <div className="rounded-md border">
          <DataTable
            data={memberData}
            columns={tableColumns}
            searchInputField="fullName"
            searchFunction={(row, searchTerm) => {
              const searchTermLower = searchTerm.toLowerCase();
              return row.fullName.includes(searchTermLower);
            }}
          />
        </div>
      )}

      <SelectMembersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={memberData}
        onConfirm={handleSendNotifications}
      />
    </div>
  );
};

export default PaymentDueBroadcast;