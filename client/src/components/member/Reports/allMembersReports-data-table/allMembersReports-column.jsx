export const AllMembersReportsColumns = [
  {
    id: 'srno',
    header: () => <p className="font-semibold">Sr. No.</p>,
    cell: (info) => <p className="text-muted-foreground">{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: () => <div className="font-semibold">Member Name</div>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </p>
        {row.original.email && (
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];