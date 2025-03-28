import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { axiosInstance } from "../../../../utils/config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

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
    accessorKey: "role",
    header: () => <div>Role</div>,
    cell: ({ row }) => <p className="text-sm">{row.original.role}</p>,
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
      const { chapterSlug } = useParams();
      const [leaveDate, setLeaveDate] = useState("");
      const [selectedRole, setSelectedRole] = useState("");
      const [balance, setBalance] = useState(row.original.balance);
      const [addToTransaction, setAddToTransaction] = useState(false);


      ////////////////////////////////////////////actions ///////////////////////////
      const handleChangeRole = () => {
        axiosInstance.put(`/api/admin/chapter-member-list/${chapterSlug}/members/${row.original.memberId}/role`, {
          role: "President, admin",
        })
        .then(() => toast.success("Role updated successfully"))
        .catch(() => toast.error("Failed to update role"));
      };

      const handleUpdateBalance = () => {
        axiosInstance.put(`/api/admin/chapter-member-list/${chapterSlug}/members/${row.original.memberId}/balance`, {
          balance,
          addToTransaction,
        })
        .then(() => toast.success("Balance updated successfully"))
        .catch(() => toast.error("Failed to update balance"));
      };

      const handleRemove = () => {
        axiosInstance.put(`/api/admin/chapter-member-list/${chapterSlug}/members/${row.original.memberId}/remove`, {
          leaveDate,
        })
        .then(() => toast.success("Member removed successfully"))
        .catch(() => toast.error("Failed to remove member"));
      };

      const handleDelete = () => {
        axiosInstance.delete(`/api/admin/chapter-member-list/${chapterSlug}/members/${row.original.memberId}`, {
        })
        .then(() => toast.success("Member deleted successfully"))
        .catch(() => toast.error("Failed to delete member"));
      };
     ///////////////////////////////////////////////actions ///////////////////////////


      return (
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">Change Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Set Role</DialogTitle>
              <DialogDescription>Select a new role for the user.</DialogDescription>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">Select Role</SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button onClick={handleChangeRole}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">Update Balance</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Edit Balance</DialogTitle>
              <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
              <div className="flex items-center gap-2">
                <Checkbox onCheckedChange={setAddToTransaction} />
                <span>Add to transaction</span>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateBalance}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="text-yellow-600 border-yellow-600">Remove</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Remove Member</DialogTitle>
              <DialogDescription>Enter leave date to remove this member.</DialogDescription>
              <Input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} />
              <DialogFooter>
                <Button onClick={handleRemove}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>Are you sure? This action is irreversible.</DialogDescription>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
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