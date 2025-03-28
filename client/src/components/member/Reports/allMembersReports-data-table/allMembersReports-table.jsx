import * as React from 'react'
import {
 flexRender,
 useReactTable,
 getCoreRowModel,
} from '@tanstack/react-table'

import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'

import { useLocation, useNavigate } from 'react-router-dom'
import { createQueryString } from '@/utils/helper'
import { usePagination } from '../../../../hooks/usePagination.jsx'
import { AllMembersReportsPagination } from './allMembersReports-pagination.jsx'

export function AllMembersReportsTable({
 columns,
 data,
 searchInputField,
 filterField,
 filterFieldName,
 filterCategoriesList,
 totalRecord,
 children,
}) {
 const navigate = useNavigate()
 const { rows, onPaginationChange, page, pagination } = usePagination()
 const location = useLocation()

 const updateUrlQuery = () => {
  const searchParams = new URLSearchParams(location.search)
  const queryString = createQueryString({ rows, page }, searchParams)

  navigate(`?${queryString}`, { replace: true })
 }

 // Trigger `updateUrlQuery` whenever `rows` or `page` changes
 React.useEffect(() => {
  updateUrlQuery()
 }, [rows, page])

 const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  onPaginationChange,
  state: {
   pagination,
  },
  rowCount: totalRecord,
 })

 // Clone children (DataToolbar) and pass `table` as a prop
 const childrenWithProps = React.Children.map(children, (child) => {
  if (React.isValidElement(child)) {
   return React.cloneElement(child, {
    table,
    searchInputField,
    filterField,
    filterFieldName,
    filterCategoriesList,
   })
  }
  return child
 })

 return (
  <div className="space-y-4">
   {childrenWithProps}
   <div className="overflow-y-auto rounded-md border">
    <Table>
     <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
       <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
         <TableHead
          className="px-4 py-2 bg-newprimaryColor text-white font-raleway"
          key={header.id}
          colSpan={header.colSpan}
         >
          {header.isPlaceholder
           ? null
           : flexRender(header.column.columnDef.header, header.getContext())}
         </TableHead>
        ))}
       </TableRow>
      ))}
     </TableHeader>
     <TableBody className="bg-adminBreadCrumbsBg font-raleway">
      {table.getRowModel().rows?.length ? (
       table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
         {row.getVisibleCells().map((cell) => (
          <TableCell className="px-4 py-2" key={cell.id}>
           {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
         ))}
        </TableRow>
       ))
      ) : (
       <TableRow>
        <TableCell
         colSpan={columns.length}
         className="h-24 text-center bg-adminBreadCrumbsBg font-raleway"
        >
         No results.
        </TableCell>
       </TableRow>
      )}
     </TableBody>
    </Table>
   </div>
   <AllMembersReportsPagination table={table} totalRecord={totalRecord} />
  </div>
 )
}
