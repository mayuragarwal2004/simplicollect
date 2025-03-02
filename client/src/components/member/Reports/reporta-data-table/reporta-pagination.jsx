import {
 ChevronLeftIcon,
 ChevronRightIcon,
 DoubleArrowLeftIcon,
 DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select'

// eslint-disable-next-line react/prop-types
export function ReportAPagination({ table, totalRecord }) {
 return (
  <div className="flex flex-col items-center justify-between space-y-4 px-2 lg:flex-row lg:space-y-0">
   <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
    <div className="text-sm text-muted-foreground">
     {/* eslint-disable-next-line react/prop-types */}
     {table.getFilteredRowModel().rows.length} row(s).
    </div>
    <div className="flex items-center space-x-2">
     <p className="text-sm font-medium">Rows per page</p>
     <Select
      value={`${table.getState().pagination.pageSize}`}
      onValueChange={(value) => {
       // eslint-disable-next-line react/prop-types
       table.setPageSize(Number(value))
      }}
     >
      <SelectTrigger className="h-8 w-[70px]">
       {/* eslint-disable-next-line react/prop-types */}
       <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
      <SelectContent side="top">
       {[5, 10, 20, 30, 40, 50].map((pageSize) => (
        <SelectItem key={pageSize} value={`${pageSize}`}>
         {pageSize}
        </SelectItem>
       ))}
      </SelectContent>
     </Select>
    </div>
   </div>
   <div className="text-sm text-muted-foreground">
    Total Record: {totalRecord}
   </div>
   <div className="flex items-center space-x-2">
    <div className="flex items-center justify-center text-sm font-medium">
     Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </div>
    <div className="flex items-center space-x-2">
     <Button
      variant="outline"
      className="h-8 w-8 p-0"
      disabled={!table.getCanPreviousPage()}
      onClick={() => table.setPageIndex(0)}
     >
      <span className="sr-only">Go to first page</span>
      <DoubleArrowLeftIcon className="h-4 w-4" />
     </Button>
     <Button
      variant="outline"
      className="h-8 w-8 p-0"
      disabled={!table.getCanPreviousPage()}
      onClick={table.previousPage}
     >
      <span className="sr-only">Go to previous page</span>
      <ChevronLeftIcon className="h-4 w-4" />
     </Button>
     <Button
      variant="outline"
      className="h-8 w-8 p-0"
      disabled={!table.getCanNextPage()}
      onClick={table.nextPage}
     >
      <span className="sr-only">Go to next page</span>
      <ChevronRightIcon className="h-4 w-4" />
     </Button>
     <Button
      variant="outline"
      className="h-8 w-8 p-0"
      disabled={!table.getCanNextPage()}
      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
     >
      <span className="sr-only">Go to last page</span>
      <DoubleArrowRightIcon className="h-4 w-4" />
     </Button>
    </div>
   </div>
  </div>
 )
}
