import { Link } from 'react-router-dom';
import { Eye, Upload } from 'lucide-react';

export const MemberLedgerReportcolumn = [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Date',
    header: () => <p>Date</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.Date}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <p>Full Name</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Type',
    header: () => <p>Type</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.Type}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Description',
    header: () => <p>Description</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.Description}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Debit',
    header: () => <p>Debit</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.Debit}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Credit',
    header: () => <p>Credit</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.Credit}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Balance',
    header: () => <p>Balance</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.Balace}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];