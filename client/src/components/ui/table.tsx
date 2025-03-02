import * as React from "react";

const Table = ({ className, ...props }) => (
  <table className={`w-full text-left border border-gray-200 ${className}`} {...props} />
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-100 text-gray-700 uppercase text-sm">{children}</thead>
);

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableRow = ({ className, ...props }) => (
  <tr className={`border-b border-gray-200 ${className}`} {...props} />
);

const TableHead = ({ children }) => (
  <th className="px-4 py-2 font-medium">{children}</th>
);

const TableCell = ({ className, ...props }) => (
  <td className={`px-4 py-2 ${className}`} {...props} />
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
