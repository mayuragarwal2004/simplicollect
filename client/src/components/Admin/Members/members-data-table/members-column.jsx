import formatDateDDMMYYYY from '@/utils/dateUtility';

export const MembersColumns = [
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
    accessorKey: 'email',
    header: () => <div className>Email</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.email}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: () => <div className>Phone Number</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.phoneNumber}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'numberOfChapter',
    header: () => <div className>Number of Chapters</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.numberOfChapter}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: () => <div className>Actions</div>,
    cell: ({ row }) => (
      <div className="flex space-x-3">
        <button
          onClick={() => row.original.onView(row.original)}
          className="text-primary hover:underline"
        >
          View
        </button>
        <button
          onClick={() => row.original.onEdit(row.original)}
          className="text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => row.original.onDelete(row.original.organisationId)}
          className="text-danger hover:underline"
        >
          Delete
        </button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }
];
