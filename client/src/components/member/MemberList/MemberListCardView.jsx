import React from 'react';
import { Card } from '@/components/ui/card';
import { flexRender } from '@tanstack/react-table';

export function MemberListCardView({ rows }) {
  if (!rows.length) {
    return <div className="text-center py-8 text-gray-500">No results.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => {
        const m = row.original;
        const actionsCell = row.getVisibleCells ? row.getVisibleCells().find(cell => cell.column.id === 'actions') : null;
        return (
          <Card key={row.id} className="p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-lg text-primary">{m.firstName} {m.lastName}</div>
            </div>
            <div className="mb-1 text-sm"><span className="font-semibold">Email:</span> {m.email}</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Phone:</span> {m.phoneNumber}</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Role:</span> {m.roleNames}</div>
            <div className="mb-1 text-sm"><span className="font-semibold">Due:</span> <span className={Number(m.balance) > 0 ? 'text-red-600' : 'text-green-600'}>{m.balance}</span></div>
            {/* Actions at the bottom */}
            {actionsCell && (
              <div className="mt-3 flex gap-2">
                {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
