export const ChapterRoleColumns = (handleOpenModal, handleDelete) => [
  {
    id: 'srno',
    header: () => <p>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'roleName',
    header: () => <div>Role Name</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.roleName}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'roleDescription',
    header: () => <div>Role Description</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.roleDescription}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'rights',
    header: () => <div>Rights</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.rights}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: () => <div>Actions</div>,
    cell: ({ row }) => (
      <div className="flex space-x-3">
        <button
          onClick={() => handleOpenModal(row.original)}
          className="text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(row.original.roleId)}
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
