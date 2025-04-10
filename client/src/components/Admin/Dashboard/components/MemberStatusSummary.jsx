import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

const dummyStatus = { active: 120, inactive: 30, suspended: 10 };
const dummyDue = { members: 40, inactive: 15, suspended: 5 };

export default function MemberStatusSummary() {
  const [status, setStatus] = useState({ active: 0, inactive: 0, suspended: 0 });
  const [due, setDue] = useState({ members: 0, inactive: 0, suspended: 0 });

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await axios.get("/api/admin/member-status");
        setStatus(res.data.status);
        setDue(res.data.due);
      } catch (err) {
        console.error("Error fetching status, using dummy data", err);
        setStatus(dummyStatus);
        setDue(dummyDue);
      }
    }
    fetchStatus();
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="flex-1">
        <CardContent className="p-4 h-full flex flex-col justify-center">
          <h3 className="font-semibold mb-2">Due Payments Summary</h3>
          <ul className="space-y-1">
            <li>Members: {due.members}</li>
            <li>Inactive: {due.inactive}</li>
            <li>Suspended: {due.suspended}</li>
          </ul>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="p-4 h-full flex flex-col justify-center">
          <h3 className="font-semibold mb-2">Member Status Breakdown</h3>
          <ul className="space-y-1">
            <li>Active: {status.active}</li>
            <li>Inactive: {status.inactive}</li>
            <li>Suspended: {status.suspended}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
