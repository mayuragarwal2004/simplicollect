import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.get("/api/admin/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions", err);
        // Temporary fallback
        setTransactions([
          { name: "John", amount: 120, mode: "UPI", status: "Success" },
          { name: "Jane", amount: 75, mode: "Cash", status: "Pending" },
          { name: "John", amount: 120, mode: "UPI", status: "Success" },
          { name: "Jane", amount: 75, mode: "Cash", status: "Pending" },
          { name: "John", amount: 120, mode: "UPI", status: "Success" },
          { name: "Jane", amount: 75, mode: "Cash", status: "Pending" },
        ]);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 text-lg">Recent Transactions</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pb-1">Member</th>
              <th className="pb-1">Amount</th>
              <th className="pb-1">Mode</th>
              <th className="pb-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-t hover:bg-muted/50 transition-colors">
                <td className="py-2">{t.name}</td>
                <td className="py-2">${t.amount.toFixed(2)}</td>
                <td className="py-2">{t.mode}</td>
                <td className="py-2">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
