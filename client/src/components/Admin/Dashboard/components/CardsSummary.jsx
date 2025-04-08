import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CardsSummary() {
  const [stats, setStats] = useState({
    total: 600,
    active: 200,
    pending: 40,
    collected: 50,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card><CardContent className="p-4"><p>Total Members</p><h2 className="text-xl font-bold">{stats.total}</h2></CardContent></Card>
      <Card><CardContent className="p-4"><p>Active Members</p><h2 className="text-xl font-bold">{stats.active}</h2></CardContent></Card>
      <Card><CardContent className="p-4"><p>Pending Payments</p><h2 className="text-xl font-bold">{stats.pending}</h2></CardContent></Card>
      <Card><CardContent className="p-4"><p>Total Collected</p><h2 className="text-xl font-bold">${stats.collected}</h2></CardContent></Card>
    </div>
  );
}