import formatDateDDMMYYYY from '@/utils/dateUtility';
import { Button } from '@/components/ui/button';

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
        {row.original.firstName} {row.original.lastName}
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
        <Button
          variant="secondary"
                size="sm"
               
          onClick={() => row.original.onView(row.original)}
          
        >
          View
        </Button>
        <Button
        variant="secondary"
                size="sm"
          onClick={() => row.original.onEdit(row.original)}
           className="text-yellow-600 border-yellow-600 "
        >
          Edit
        </Button>
        <Button
        variant="destructive"
                size="sm"
          onClick={() => row.original.onDelete(row.original.memberId)}
         
        >
          Delete
        </Button>
        <Button
          onClick={() => row.original.onChangePassword(row.original.memberId)}
          variant="secondary"
                size="sm"
                className="text-green-600 border-yellow-600 "           
        >
          Change Password
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }
];
