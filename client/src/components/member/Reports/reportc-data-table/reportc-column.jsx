import formatDateDDMMYYYY from '@/utils/dateUtility';

export const ReportCColumns = [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'memberName',
    header: () => <div className>Member Name</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.memberName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'amountTotal',
    header: () => <div className>Amount Paid</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.amountTotal}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'totalDues',
    header: () => <div className>Due</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.totalDues}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  }
];
