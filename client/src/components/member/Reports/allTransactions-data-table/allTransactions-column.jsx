import formatDateDDMMYYYY from '@/utils/dateUtility';

export const AllTransactionsColumns = [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <div className>Member Name</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'paidAmount',
    header: () => <div className>Amount Paid</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.paidAmount}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'balanceAmount',
    header: () => <div className>Balance</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.balanceAmount}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'packageName',
    header: () => <div className>Package Name</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.packageName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'paymentType',
    header: () => <div className>Payment Type</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.paymentType}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'paymentReceivedByName',
    header: () => <div className>Collected By</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.paymentReceivedByName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'approvedByName',
    header: () => <div className>Approved By</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.approvedByName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'transactionDate',
    header: () => <div className>Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.original.transactionDate);
      return (
      <p className='text-sm font-medium'>
        {formatDateDDMMYYYY(date)}
      </p>
    )},
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'approvalStatus',
    header: () => <div className>Approval Status</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.approvalStatus}
      </p>
    ),
  }
];
