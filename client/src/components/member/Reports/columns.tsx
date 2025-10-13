import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

type MemberDueData = {
  memberCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  packageName: string;
  dueAmount: number;
  status: string;
};

export const PaymentDueBroadcastColumns: ColumnDef<MemberDueData>[] = [
  {
    accessorKey: "memberCode",
    header: () => <span>Member Code</span>,
  },
  {
    accessorKey: "firstName",
    header: () => <span>First Name</span>,
  },
  {
    accessorKey: "lastName",
    header: () => <span>Last Name</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <span>Phone Number</span>,
  },
  {
    accessorKey: "packageName",
    header: () => <span>Package</span>,
  },
  {
    accessorKey: "dueAmount",
    header: () => <span>Due Amount</span>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("dueAmount"));
      if (isNaN(amount)) return "N/A";
      return formatCurrency(amount);
    },
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "destructive" | "secondary" | "outline" = "default";

      switch (status?.toLowerCase()) {
        case "approved":
          variant = "outline";
          break;
        case "rejected":
          variant = "destructive";
          break;
        case "pending":
          variant = "secondary";
          break;
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// Export both column configurations
export const MemberDueSummaryColumns = PaymentDueBroadcastColumns;