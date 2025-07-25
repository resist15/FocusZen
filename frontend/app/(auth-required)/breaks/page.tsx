"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronUp, Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";

interface BreakDTO {
  id?: number;
  type: string;
  startTime: number;
  durationInMinutes: number;
  timestamp?: string;
}

export default function BreaksPage() {
  const [breaks, setBreaks] = useState<BreakDTO[]>([]);
  const [type, setType] = useState("Short");
  const [startTime, setStartTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  const fetchBreaks = async () => {
    try {
      const res = await api.get("/breaks");
      setBreaks(res.data);
    } catch (err) {
      toast.error("Failed to load breaks");
    }
  };

  const handleAddBreak = async () => {
    try {
      setLoading(true);
      const res = await api.post("/breaks", {
        type,
        startTime,
        durationInMinutes: duration,
      });
      setBreaks([res.data, ...breaks]);
      toast.success("Break logged!");
      setStartTime(0);
      setDuration(5);
    } catch {
      toast.error("Failed to log break");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/breaks/${id}`);
      setBreaks(breaks.filter((b) => b.id !== id));
      toast.success("Break deleted");
    } catch {
      toast.error("Failed to delete break");
    }
  };

  useEffect(() => {
    fetchBreaks();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Break Logger</h1>

      <div className="space-y-2">
        <Label>Type</Label>
        <Input value={type} onChange={(e) => setType(e.target.value)} />
        <Label>Start Time (epoch ms)</Label>
        <Input
          type="number"
          value={startTime}
          onChange={(e) => setStartTime(Number(e.target.value))}
        />
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <Button disabled={loading} onClick={handleAddBreak}>
          <Plus className="w-4 h-4 mr-2" />
          Log Break
        </Button>
      </div>

      <div className="space-y-4">
        {breaks.map((b) => (
          <div
            key={b.id}
            className="border rounded-md p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{b.type}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(b.startTime).toLocaleString()}
              </p>
              <Progress value={(b.durationInMinutes / 60) * 100} className="mt-2" />
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(b.id!)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
