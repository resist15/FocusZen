"use client";

import { useEffect, useState } from "react";
import { MindfulnessLog } from "@/types/Mindfulness";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import { AddMindfulnessDialog } from "@/components/mindfulness/AddMindfulnessDialog";
import { toast } from "sonner";

export default function MindfulnessLogsPage() {
  const [logs, setLogs] = useState<MindfulnessLog[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/mindfulness");
      setLogs(res.data);
    } catch (err) {
      toast.error("Failed to fetch mindfulness logs");
    }
  };

  const deleteLog = async (id: number) => {
    try {
      await axios.delete(`/mindfulness/${id}`);
      toast.success("Log deleted");
      fetchLogs();
    } catch (err) {
      toast.error("Failed to delete log");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mindfulness Logs</h2>
        <AddMindfulnessDialog onLogAdded={fetchLogs} />
      </div>

      <div className="grid gap-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{log.activityType}</h3>
                <p className="text-muted-foreground text-sm">
                  Duration: {log.durationInMinutes} min
                </p>
                <p className="text-xs text-muted-foreground">
                  Logged at: {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteLog(log.id)}
              >
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
