import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const MemberColumn = [
  {
    accessorKey: "name",
    header: () => <div>Name</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div>Phone Number</div>,
    cell: ({ row }) => <p className="text-sm">{row.original.phoneNumber}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: () => <div>Email</div>,
    cell: ({ row }) => <p className="text-sm">{row.original.email}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "balanceAmount",
    header: () => <div>Balance Amount</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium text-green-600">₹{row.original.balance}</p>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const [leaveDate, setLeaveDate] = useState("");
      const [selectedRole, setSelectedRole] = useState("");
      const [balance, setBalance] = useState(row.original.balance);
      const [addToTransaction, setAddToTransaction] = useState(false);

      return (
        <div className="flex flex-wrap gap-2">
          {/* Role Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">Change Role</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black dark:bg-[#1A222C] dark:text-white border border-gray-300 dark:border-gray-700">
              <DialogTitle>Set Role</DialogTitle>
              <DialogDescription>Select a new role for the user.</DialogDescription>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">Select Role</SelectTrigger>
                <SelectContent className="bg-white text-black dark:bg-[#1A222C] dark:text-white border border-gray-300 dark:border-gray-700">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button onClick={() => row.original.onChangeRole(row.original, selectedRole)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Balance Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">Update Balance</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black dark:bg-[#1A222C] dark:text-white border border-gray-300 dark:border-gray-700">
              <DialogTitle>Edit Balance</DialogTitle>
              <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="text-black bg-white " />
              <div className="flex items-center gap-2 ">
                <Checkbox onCheckedChange={setAddToTransaction} />
                <span>Add to transaction</span>
              </div>
              <DialogFooter>
                <Button onClick={() => row.original.onUpdateBalance(row.original, balance, addToTransaction)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Remove Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="text-yellow-600 border-yellow-600">Remove</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black dark:bg-[#1A222C] dark:text-white border border-gray-300 dark:border-gray-700">
              <DialogTitle>Remove Member</DialogTitle>
              <DialogDescription>Enter leave date to remove this member.</DialogDescription>
              <Input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} className="text-black bg-white" />
              <DialogFooter>
                <Button onClick={() => row.original.onRemove(row.original.memberId, leaveDate)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">Delete</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black dark:bg-[#1A222C] dark:text-white border border-gray-300 dark:border-gray-700">
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>Are you sure? This action is irreversible.</DialogDescription>
              <DialogFooter>
                <Button variant="destructive" onClick={() => row.original.onDelete(row.original.memberId)}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];