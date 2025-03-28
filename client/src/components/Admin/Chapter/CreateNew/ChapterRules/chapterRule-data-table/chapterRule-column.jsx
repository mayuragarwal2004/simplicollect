import { Switch } from '@/components/ui/switch';

export const ChapterRuleColumns = [
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
    accessorKey: 'removable',
    header: () => <div>Removable</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <label
          htmlFor={`removable-${row.id}`}
          className="text-sm font-medium text-gray-700"
        >
          {row.original.removable ? 'Yes' : 'No'}
        </label>
        <Switch
          id={`removable-${row.id}`}
          checked={row.original.removable}
          onCheckedChange={() => row.original.onToggleRemovable(row.original)}
        />
      </div>
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
          onClick={() => row.original.onEdit(row.original)}
          className="text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => row.original.onDelete(row.original.roleId)}
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
