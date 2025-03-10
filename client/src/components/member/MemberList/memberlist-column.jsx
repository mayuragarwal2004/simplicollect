import {Button} from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const MemberListColumns = [
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
    accessorKey: 'roleName',
    header: 'Role',
    cell: ({ row }) => <p>{row.original.roleName}</p>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'due',
    header: 'Due',
    cell: ({ row }) => <p>{row.original.due}</p>,
    enableSorting: true,
    enableHiding: false,
  },
];
