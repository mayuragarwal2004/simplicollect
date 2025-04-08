import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

// Dummy fallback data
const dummyTrendData = [
  { month: "Jan", amount: 420 },
  { month: "Feb", amount: 480 },
  { month: "Mar", amount: 610 },
  { month: "Apr", amount: 500 },
  { month: "May", amount: 700 },
  { month: "Jun", amount: 670 },
  { month: "Jul", amount: 820 },
  { month: "Aug", amount: 790 },
  { month: "Sep", amount: 910 },
  { month: "Oct", amount: 860 },
  { month: "Nov", amount: 980 },
  { month: "Dec", amount: 930 },
];

export default function CollectionTrend() {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrend() {
      try {
        const res = await axios.get("/api/admin/collection-trend");
        if (isMounted) setTrendData(res.data);
      } catch (err) {
        console.error("Error fetching /api/admin/collection-trend:", err.message);
        if (isMounted) setTrendData(dummyTrendData);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTrend();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <h3 className="font-semibold mb-2">Collection Trend</h3>
        {loading ? (
          <div className="text-center text-muted-foreground text-sm mt-6">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
