"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { format } from "date-fns";

interface Routine {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchData = async () => {
    try {
      const [routinesRes, completedRes] = await Promise.all([
        api.get("/routines"),
        api.get(`/routines/completed?date=${today}`),
      ]);
      setRoutines(routinesRes.data);
      setCompletedIds(completedRes.data);
    } catch {
      toast.error("Failed to load routines");
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Routine name required");
    try {
      await api.post("/routines", { name, description, active: true });
      toast.success("Routine created");
      setName("");
      setDescription("");
      fetchData();
    } catch {
      toast.error("Failed to create routine");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/routines/${id}`);
      toast.success("Routine deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete routine");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await api.post(`/routines/${id}/toggle?date=${today}`);
      fetchData();
    } catch {
      toast.error("Toggle failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Routine</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Name</Label>
            <Input
              placeholder="e.g., Workout"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              placeholder="Optional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Routine
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => {
          const completed = completedIds.includes(routine.id);
          return (
            <Card
              key={routine.id}
              className={`border-l-4 ${completed ? "border-green-500 opacity-60" : "border-muted"}`}
            >
              <CardHeader>
                <CardTitle>{routine.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{routine.description}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <Button
                  variant={completed ? "outline" : "default"}
                  onClick={() => handleToggle(routine.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {completed ? "Completed" : "Mark Done"}
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(routine.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
