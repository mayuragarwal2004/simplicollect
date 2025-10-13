import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const MemberList = ({ members, onToggle, icon: Icon }) => (
  <div className="space-y-2">
    {members.map((member) => (
      <div
        key={member.memberId}
        className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer"
        onClick={() => onToggle(member)}
      >
        <div className="flex flex-col min-w-0 flex-1 mr-2">
          <span className="font-medium text-sm md:text-base truncate">
            {`${member.firstName} ${member.lastName}`}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">
            ₹{member.dueAmount}
          </span>
        </div>
        <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-primary hover:text-primary/80" />
      </div>
    ))}
  </div>
);

const SelectMembersModal = ({
  isOpen,
  onClose,
  members,
  onConfirm,
}) => {
  // Initialize state with useEffect to properly handle member updates
  const [includedMembers, setIncludedMembers] = useState([]);
  const [excludedMembers, setExcludedMembers] = useState([]);

  // Update included members when the modal opens or members change
  useEffect(() => {
    if (isOpen && members) {
      setIncludedMembers(members);
      setExcludedMembers([]);
    }
  }, [isOpen, members]);

  const handleToggleMember = (member, fromExcluded = false) => {
    if (fromExcluded) {
      setExcludedMembers(excludedMembers.filter(m => m.memberId !== member.memberId));
      setIncludedMembers([...includedMembers, member]);
    } else {
      setIncludedMembers(includedMembers.filter(m => m.memberId !== member.memberId));
      setExcludedMembers([...excludedMembers, member]);
    }
  };

  const handleMoveAll = (toExcluded) => {
    if (toExcluded) {
      setExcludedMembers([...excludedMembers, ...includedMembers]);
      setIncludedMembers([]);
    } else {
      setIncludedMembers([...includedMembers, ...excludedMembers]);
      setExcludedMembers([]);
    }
  };

  const handleConfirm = () => {
    onConfirm(includedMembers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 md:p-6 rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg md:text-xl">Select Members for Notification</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Included Members Section */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <h3 className="font-semibold text-sm md:text-base">Members to Notify ({includedMembers.length})</h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-sm"
                onClick={() => handleMoveAll(true)}
                disabled={includedMembers.length === 0}
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Remove All
              </Button>
            </div>
            <ScrollArea className="h-[200px] md:h-[300px] border rounded-lg p-2 md:p-4">
              <MemberList
                members={includedMembers}
                onToggle={(member) => handleToggleMember(member, false)}
                icon={Minus}
              />
            </ScrollArea>
          </div>

          {/* Excluded Members Section */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <h3 className="font-semibold text-sm md:text-base">Excluded Members ({excludedMembers.length})</h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-sm"
                onClick={() => handleMoveAll(false)}
                disabled={excludedMembers.length === 0}
              >
                <ChevronUp className="h-4 w-4 mr-2" />
                Add All
              </Button>
            </div>
            <ScrollArea className="h-[200px] md:h-[300px] border rounded-lg p-2 md:p-4">
              <MemberList
                members={excludedMembers}
                onToggle={(member) => handleToggleMember(member, true)}
                icon={Plus}
              />
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="w-full sm:w-auto">
            Confirm Selection ({includedMembers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectMembersModal;