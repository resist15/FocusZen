"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface BreakDTO {
  id?: number;
  type: string;
  startTime: number;
  durationInMinutes: number;
}

export default function BreaksPage() {
  const [breaks, setBreaks] = useState<BreakDTO[]>([]);
  const [type, setType] = useState("Short");
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
      const startTime = Date.now();
      const res = await api.post("/breaks", {
        type,
        startTime,
        durationInMinutes: duration,
      });
      setBreaks([res.data, ...breaks]);
      toast.success("Break logged!");
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
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold pb-2">Log your Breaks</h1>
        <p className="text-muted-foreground">
          Track your short or long breaks to balance productivity and recovery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Logging Form */}
        <Card>
          <CardHeader>
            <CardTitle>Log a Break</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select break type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short</SelectItem>
                  <SelectItem value="Long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>

            <Button disabled={loading} onClick={handleAddBreak} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Log Break
            </Button>
          </CardContent>
        </Card>

        {/* Break List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Breaks</h2>
          <AnimatePresence>
            {breaks.length === 0 ? (
              <p className="text-muted-foreground">No breaks logged yet.</p>
            ) : (
              breaks.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="flex justify-between items-start p-4">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{b.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Start: {new Date(b.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {b.durationInMinutes} minutes
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(b.id!)}
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
