import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const MemberListColumns = ({ onChangeRole, onDueWaiveOff, onRemove }) => [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Full Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <p>{row.original.email}</p>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
    cell: ({ row }) => <p>{row.original.phoneNumber}</p>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'roleNames',
    header: 'Role',
    cell: ({ row }) => <p>{row.original.roleNames}</p>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'balance',
    header: 'Due',
    cell: ({ row }) => <p>{row.original.balance}</p>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChangeRole(row.original)}
        >
          Change Role
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDueWaiveOff(row.original)}
        >
          Due Waive Off
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(row.original)}
        >
          Remove
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
