"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";

interface GoalDTO {
  id?: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalDTO[]>([]);
  const [newGoal, setNewGoal] = useState<Partial<GoalDTO>>({
    title: "",
    description: "",
    targetValue: 1,
    deadline: "",
  });
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<GoalDTO>>({});

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch {
      toast.error("Failed to fetch goals");
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.deadline) {
      toast.warning("Title and deadline are required");
      return;
    }
    try {
      const res = await api.post("/goals", {
        ...newGoal,
        currentValue: 0,
        completed: false,
      });
      setGoals([...goals, res.data]);
      setNewGoal({ title: "", description: "", targetValue: 1, deadline: "" });
      toast.success("Goal added");
    } catch {
      toast.error("Failed to add goal");
    }
  };

  const handleSliderChange = async (goal: GoalDTO, value: number) => {
    try {
      const updatedGoal = {
        ...goal,
        currentValue: value,
        completed: value >= goal.targetValue,
      };

      const res = await api.put(`/goals/${goal.id}`, updatedGoal);
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? res.data : g)));
      toast.success("Progress updated");
    } catch {
      toast.error("Failed to update progress");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g.id !== id));
      toast.success("Goal deleted");
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  const startEditing = (goal: GoalDTO) => {
    setEditingGoalId(goal.id!);
    setEditForm({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue,
      deadline: goal.deadline,
    });
  };

  const handleSaveEdit = async (goalId: number) => {
    try {
      const res = await api.put(`/goals/${goalId}`, editForm);
      setGoals((prev) => prev.map((g) => (g.id === goalId ? res.data : g)));
      setEditingGoalId(null);
      toast.success("Goal updated");
    } catch {
      toast.error("Failed to update goal");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Goals</h2>

      {/* New Goal Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-6">
        <div>
          <Label>Title</Label>
          <Input
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Target</Label>
          <Input
            type="number"
            min={1}
            value={newGoal.targetValue || 1}
            onChange={(e) => setNewGoal({ ...newGoal, targetValue: +e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Input
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
        </div>
        <div>
          <Label>Deadline</Label>
          <Input
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          />
        </div>
        <Button className="col-span-full" onClick={handleAddGoal}>
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const percent = goal.targetValue
            ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
            : 0;

          return (
            <div
              key={goal.id}
              className="p-4 border rounded-md shadow-sm bg-white dark:bg-zinc-900"
            >
              {editingGoalId === goal.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editForm.title || ""}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Target</Label>
                    <Input
                      type="number"
                      min={1}
                      value={editForm.targetValue || 1}
                      onChange={(e) =>
                        setEditForm({ ...editForm, targetValue: +e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={editForm.deadline || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, deadline: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-full flex gap-2 mt-2">
                    <Button onClick={() => handleSaveEdit(goal.id!)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingGoalId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        Deadline: {goal.deadline}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEditing(goal)}
                      >
                        ✏️
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(goal.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <Slider
                      min={0}
                      max={goal.targetValue}
                      step={1}
                      value={[goal.currentValue]}
                      onValueChange={([val]) => {
                        setGoals((prev) =>
                          prev.map((g) =>
                            g.id === goal.id ? { ...g, currentValue: val } : g
                          )
                        );
                      }}
                      onValueCommit={([val]) => handleSliderChange(goal, val)}
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {goal.currentValue} / {goal.targetValue} ({percent}%)
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
