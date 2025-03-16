import formatDateDDMMYYYY from '@/utils/dateUtility';

export const OrgColumns = [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'organisationName',
    header: () => <div className>Organisation Name</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.organisationName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'numberOfChapters',
    header: () => <div className>Number of Chapters</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.numberOfChapters}
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
