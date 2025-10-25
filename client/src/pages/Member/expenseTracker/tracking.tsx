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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { axiosInstance } from "../../../utils/config";
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
  category: string;
  createdAt: string;
  updatedAt: string;
  expenseBy: {
    firstName: string;
    lastName: string;
  };
};

type ChapterMember = {
  memberId: string;
  firstName: string;
  lastName: string;
};

type Meeting = {
  meetingId: string;
  meetingName: string;
  meetingDate: string;
};

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chapterMembers, setChapterMembers] = useState<ChapterMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { memberData, chapterData } = useData();
  // console.log("memberData:", memberData);
  // console.log("chapterData:", chapterData);
  const isTreasurer = useMemo(
    () => memberData?.role?.includes("treasurer"),
    [memberData]
  );

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [newEventName, setNewEventName] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newCategory, setNewCategory] = useState("OTHER");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!isAuthenticated || !memberData) return;
    try {
      const endpoint = isTreasurer
        ? `/api/expense/chapter/${chapterData.chapterId}`
        : `/api/expense/member/${memberData.memberId}`;
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
            chapterId: memberData.chapterId,
            meetingId: "some-meeting-id",
            expenseByMemberId: "some-member-id",
            category: "Food",
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
            chapterId: memberData.chapterId,
            meetingId: "some-meeting-id-2",
            expenseByMemberId: "another-member-id",
            category: "Rental",
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
          chapterId: memberData.chapterId,
          meetingId: "some-meeting-id",
          category: "Food",
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
          chapterId: memberData.chapterId,
          meetingId: "some-meeting-id-2",
          category: "Rental",
          expenseByMemberId: "another-member-id",
          createdAt: "2025-10-05T11:00:00.000Z",
          updatedAt: "2025-10-05T11:00:00.000Z",
          expenseBy: { firstName: "Jane", lastName: "Smith" },
        },
      ]);
    }
  };

  const fetchChapterMembers = async () => {
    try {
      const response = await axiosInstance.get('/api/member/all', {
        params: { chapterId: chapterData?.chapterId },
      });
      setChapterMembers(response.data);
      // setFilteredMembers(response.data); // Initialize filtered list
    } catch (error) {
      toast.error('Error fetching members');
    }
  };

  const fetchMeetings = async () => {
    if (chapterData?.chapterId) {
      try {
        const response = await axiosInstance.get(
          `/api/meetings/${chapterData.chapterId}`
        );
        setMeetings(response.data);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
        toast.error("Could not load meetings for the chapter.");
      }
    }
  };

  useEffect(() => {
    if (memberData) {
      fetchExpenses();
      fetchChapterMembers();
      fetchMeetings();
    }
  }, [memberData, isTreasurer]);

  // Effect to handle event name default when meeting is selected
  useEffect(() => {
    if (selectedMeetingId && selectedMeetingId !== "none") {
      setNewEventName("Chapter Meeting");
    } else if (selectedMeetingId === "none") {
      setNewEventName("");
    }
  }, [selectedMeetingId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberData) return;

    const expenseByMemberId = isTreasurer ? selectedMemberId : memberData.memberId;

    if (!expenseByMemberId) {
      toast.error("Please select a member.");
      return;
    }

    const expenseData = {
      eventName: newEventName,
      vendorName: newVendorName,
      amount: parseFloat(newAmount),
      notes: newNotes,
      category: newCategory,
      meetingId: selectedMeetingId === "none" || !selectedMeetingId ? null : selectedMeetingId,
      chapterId: memberData.chapterId,
      expenseByMemberId: expenseByMemberId,
    };

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMeetingId("");
    setNewEventName("");
    setNewVendorName("");
    setNewAmount("");
    setNewNotes("");
    setNewCategory("OTHER");
    setNewFile(null);
    setEditingExpense(null);
    setSelectedMemberId(null);
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setSelectedMeetingId(expense.meetingId || "none");
    setNewEventName(expense.eventName);
    setNewVendorName(expense.vendorName || "");
    setNewAmount(expense.amount.toString());
    setNewNotes(expense.notes || "");
    setNewCategory(expense.category || "OTHER");
    setSelectedMemberId(expense.expenseByMemberId);
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
              {isTreasurer && (
                <div>
                  <Label htmlFor="member">Expense By</Label>
                  <Select
                    value={selectedMemberId || ""}
                    onValueChange={setSelectedMemberId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="chapter"><b>{chapterData.chapterName}</b></SelectItem>
                        {chapterMembers.map((member) => (
                        <SelectItem key={member.memberId} value={member.memberId}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="meeting">Meeting</Label>
                <Select
                  value={selectedMeetingId}
                  onValueChange={setSelectedMeetingId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meeting or none" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific meeting</SelectItem>
                    {meetings.map((meeting) => (
                      <SelectItem key={meeting.meetingId} value={meeting.meetingId}>
                        {meeting.meetingName} - {new Date(meeting.meetingDate).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input 
                  id="eventName" 
                  value={newEventName} 
                  onChange={(e) => setNewEventName(e.target.value)} 
                  placeholder={selectedMeetingId === "none" || !selectedMeetingId ? "Enter event name" : "Chapter Meeting"}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newCategory}
                  onValueChange={setNewCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOOD">Food</SelectItem>
                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                    <SelectItem value="VENUE_RENTAL">Venue Rental</SelectItem>
                    <SelectItem value="PRINTING_AND_STATIONERY">Printing & Stationery</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required />
              </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingExpense
                  ? "Update Expense"
                  : "Save Expense"}
              </Button>
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
