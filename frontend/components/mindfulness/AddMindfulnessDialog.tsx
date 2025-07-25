"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export function AddMindfulnessDialog({
  onLogAdded,
}: {
  onLogAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState<number>(10);

  const handleSubmit = async () => {
    try {
      await axios.post("/mindfulness", {
        activityType,
        startTime: Date.now(),
        durationInMinutes: duration,
      });
      toast.success("Mindfulness activity logged");
      setOpen(false);
      setActivityType("");
      setDuration(10);
      onLogAdded();
    } catch (err) {
      toast.error("Failed to log activity");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Mindfulness Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Activity Type (e.g., Meditation)"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
          <Button
            onClick={handleSubmit}
            disabled={!activityType || duration <= 0}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
