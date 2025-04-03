import { format } from 'date-fns';

export const MemberLedgerReportcolumn = [
  {
    id: 'srno',
    header: () => <p>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'transactionDate',
    header: () => <p>Date</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {format(new Date(row.original.transactionDate), 'dd-MM-yyyy')}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: () => <p>Type</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.type}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: () => <p>Description</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.description}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'debit',
    header: () => <p>Debit</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.debit}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'credit',
    header: () => <p>Credit</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.credit}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'balance',
    header: () => <p>Balance</p>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.balance}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
