
import formatDateDDMMYYYY from '@/utils/dateUtility';

export const ChapterColumn = [
  {
    id: 'srno',
    header: () => <p className>Sr. No.</p>,
    cell: (info) => <p>{info.row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'chapterName',
    header: () => <div className>Chapter Name</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.chapterName}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'numberOfMembers',
    header: () => <div className>Number of Members</div>,
    cell: ({ row }) => (
      <p className="text-sm font-medium">{row.original.numberOfMembers}</p>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: () => <div className>Actions</div>,
    cell: ({ row }) => (
      <div className="flex space-x-3">
        <button>view</button>
        <button
          onClick={() => row.original.onEdit(row.original)}
          className="text-primary hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => row.original.onDelete(row.original.chapterId)}
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
