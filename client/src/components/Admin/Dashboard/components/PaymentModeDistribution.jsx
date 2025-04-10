import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

// Dummy fallback data
const dummyPaymentDistribution = [
  { name: "Cash", value: 45 },
  { name: "UPI", value: 30 },
  { name: "Bank Transfer", value: 25 },
];

const COLORS = ["#4f46e5", "#facc15", "#10b981"];

export default function PaymentModeDistribution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchDistribution() {
      try {
        const res = await axios.get("/api/admin/payment-distribution");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching distribution, using dummy data", err);
        setData(dummyPaymentDistribution);
      }
    }
    fetchDistribution();
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Payment Mode Distribution</h3>
        <div className="flex items-center justify-center space-x-8">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>

          <ul className="text-sm space-y-2">
            {data.map((entry, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium">
                  {entry.name}: {entry.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
