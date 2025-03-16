export const ChapterRuleColumns = [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'roleName',
    header: () => <div className>Role Name</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.roleName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'roleDescription',
    header: () => <div className>Role Description</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.roleDescription}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'removable',
    header: () => <div className>Removable</div>,
    cell: ({ row }) => (
      <div className="flex space-x-3">
        
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'rights',
    header: () => <div className>Role Description</div>,
    cell: ({ row }) => (
      <p className='text-sm font-medium'>
        {row.original.rights}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },,
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
  },
];
