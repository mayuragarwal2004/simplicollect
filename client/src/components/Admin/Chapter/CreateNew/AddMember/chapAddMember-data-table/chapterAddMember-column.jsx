export const ChapterAddMemberColumns = [
  {
    id: 'srno',
    header: () => <p>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'memberName',
    header: () => <div>Member Name</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.memberName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'role',
    header: () => <div>Role</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.role}
      </p>
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
          onClick={() => row.original.onEdit(row.original)}
          className="text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => row.original.onDelete(row.original.memberId)} // Updated to use memberId
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