import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { axiosInstance } from '../../../utils/config';
import { toast } from "react-toastify";

type Expense = {
  id: string;
  eventName: string;
  vendorName: string | null;
  amount: number;
  notes: string | null;
  fileUploadURL: string | null;
  reimburseCompleted: boolean;
  reimbursedDate: string | null;
  chapterId: string;
  meetingId: string | null;
  expenseByMemberId: string;
  createdAt: string;
  updatedAt: string;
  expenseBy: {
    firstName: string;
    lastName: string;
  };
};

const ExpenseTracker: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const { user } = useAuth();
  // TODO: Replace with actual role check from user object
  const isTreasurer = useMemo(() => user?.roles?.includes("Treasurer") || true, [user]);

  const [newEventName, setNewEventName] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const fetchExpenses = async () => {
    if (!isAuthenticated) return;
    try {
      const endpoint = isTreasurer ? `/api/expense/chapter/${user.chapterId}` : `/api/expense/member/${user.memberId}`;
      const response = await axiosInstance.get(endpoint);
      if (response.data && response.data.length > 0) {
        setExpenses(response.data);
      } else {
        // Show dummy data if no expenses are found
        toast.info("No expenses found. Displaying dummy data.");
        setExpenses([
          {
            id: "1",
            eventName: "Chapter Meeting Lunch",
            vendorName: "Local Catering",
            amount: 5000,
            notes: "Lunch for 50 members",
            fileUploadURL: null,
            reimburseCompleted: true,
            reimbursedDate: "2025-10-15T10:00:00.000Z",
            chapterId: user.chapterId,
            meetingId: "some-meeting-id",
            expenseByMemberId: "some-member-id",
            createdAt: "2025-10-10T14:30:00.000Z",
            updatedAt: "2025-10-15T10:00:00.000Z",
            expenseBy: { firstName: "John", lastName: "Doe" },
          },
          {
            id: "2",
            eventName: "Venue Rental",
            vendorName: "Community Hall",
            amount: 15000,
            notes: "Rent for October meetings",
            fileUploadURL: null,
            reimburseCompleted: false,
            reimbursedDate: null,
            chapterId: user.chapterId,
            meetingId: "some-meeting-id-2",
            expenseByMemberId: "another-member-id",
            createdAt: "2025-10-05T11:00:00.000Z",
            updatedAt: "2025-10-05T11:00:00.000Z",
            expenseBy: { firstName: "Jane", lastName: "Smith" },
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast.error("Failed to load expenses. Displaying dummy data.");
       // Show dummy data on error as well
       setExpenses([
        {
          id: "1",
          eventName: "Chapter Meeting Lunch",
          vendorName: "Local Catering",
          amount: 5000,
          notes: "Lunch for 50 members",
          fileUploadURL: null,
          reimburseCompleted: true,
          reimbursedDate: "2025-10-15T10:00:00.000Z",
          chapterId: user.chapterId,
          meetingId: "some-meeting-id",
          expenseByMemberId: "some-member-id",
          createdAt: "2025-10-10T14:30:00.000Z",
          updatedAt: "2025-10-15T10:00:00.000Z",
          expenseBy: { firstName: "John", lastName: "Doe" },
        },
        {
          id: "2",
          eventName: "Venue Rental",
          vendorName: "Community Hall",
          amount: 15000,
          notes: "Rent for October meetings",
          fileUploadURL: null,
          reimburseCompleted: false,
          reimbursedDate: null,
          chapterId: user.chapterId,
          meetingId: "some-meeting-id-2",
          expenseByMemberId: "another-member-id",
          createdAt: "2025-10-05T11:00:00.000Z",
          updatedAt: "2025-10-05T11:00:00.000Z",
          expenseBy: { firstName: "Jane", lastName: "Smith" },
        },
      ]);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user, isTreasurer]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const expenseData = {
      eventName: newEventName,
      vendorName: newVendorName,
      amount: parseFloat(newAmount),
      notes: newNotes,
      chapterId: user.chapterId,
      expenseByMemberId: user.memberId,
      // TODO: Add meetingId if applicable
    };

    try {
      if (editingExpense) {
        // Update logic
        await axiosInstance.put(`/api/expense/${editingExpense.id}`, expenseData);
        toast.success("Expense updated successfully!");
      } else {
        // Create logic
        await axiosInstance.post("/api/expense", expenseData);
        toast.success("Expense added successfully!");
      }
      fetchExpenses();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save expense:", error);
      toast.error("Failed to save expense.");
    }
  };

  const resetForm = () => {
    setNewEventName("");
    setNewVendorName("");
    setNewAmount("");
    setNewNotes("");
    setNewFile(null);
    setEditingExpense(null);
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setNewEventName(expense.eventName);
    setNewVendorName(expense.vendorName || "");
    setNewAmount(expense.amount.toString());
    setNewNotes(expense.notes || "");
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="eventName">Event/Expense Name</Label>
                <Input id="eventName" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required />
              </div>
              {isTreasurer && (
                <>
                  <div>
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input id="vendorName" value={newVendorName} onChange={(e) => setNewVendorName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="fileUpload">File Upload</Label>
                    <Input id="fileUpload" type="file" onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)} />
                  </div>
                </>
              )}
              <Button type="submit">{editingExpense ? "Update" : "Save"} Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            {isTreasurer && <TableHead>Member</TableHead>}
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.eventName}</TableCell>
              {isTreasurer && <TableCell>{`${expense.expenseBy.firstName} ${expense.expenseBy.lastName}`}</TableCell>}
              <TableCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expense.amount)}</TableCell>
              <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{expense.reimburseCompleted ? "Reimbursed" : "Pending"}</TableCell>
              <TableCell>
                {isTreasurer && (
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(expense)}>
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTracker;
