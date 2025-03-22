import { Link } from 'react-router-dom';

export const MemberColumn = [
  {
    id: 'srno',
    header: () => <p>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <div>Name</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'phone',
    header: () => <div>Phone Number</div>,
    cell: ({ row }) => (
      <p className="text-sm">{row.original.phone}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: () => <div>Email</div>,
    cell: ({ row }) => (
      <p className="text-sm">{row.original.email}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'balance',
    header: () => <div>Balance Amount</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">₹{row.original.balance}</p>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: () => <div>Actions</div>,
    cell: ({ row }) => (
      <div className="flex space-x-3">
        <button
          onClick={() => row.original.onChangeRole(row.original)}
          className="text-primary hover:underline"
        >
          Change Role
        </button>
        <button
          onClick={() => row.original.onUpdateBalance(row.original)}
          className="text-primary hover:underline"
        >
          Update Balance
        </button>
        <button
          onClick={() => row.original.onRemove(row.original.memberId)}
          className="text-warning hover:underline"
        >
          Remove
        </button>
        <button
          onClick={() => row.original.onDelete(row.original.memberId)}
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
