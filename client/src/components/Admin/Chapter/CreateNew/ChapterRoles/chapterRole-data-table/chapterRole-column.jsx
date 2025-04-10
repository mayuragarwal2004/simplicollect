import { CheckIcon, XIcon } from "lucide-react";

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
      <p className="text-sm font-medium">{row.original.featureNames}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'removable',
    header: () => <div>Removable</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.removable ? (
          <CheckIcon className="h-5 w-5 text-green-500" />
        ) : (
          <XIcon className="h-5 w-5 text-red-500" />
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'default',
    header: () => <div>Default</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.default ? (
          <CheckIcon className="h-5 w-5 text-green-500" />
        ) : (
          <XIcon className="h-5 w-5 text-red-500" />
        )}
      </div>
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
