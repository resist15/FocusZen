"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      await api.put(`/tasks/${editingId}`, {
        ...editForm,
        dueDate: editForm.dueDate.toISOString(),
      });

      toast.success("Task updated");
      setEditingId(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <AddTaskDialog onTaskAdded={fetchTasks} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) =>
          editingId === task.id ? (
            <Card key={task.id}>
              <CardContent className="space-y-2 p-4">
                <Input
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
                <Calendar
                  mode="single"
                  selected={editForm.dueDate}
                  onSelect={(date) =>
                    setEditForm((prev) => ({
                      ...prev,
                      dueDate: date || new Date(),
                    }))
                  }
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={task.id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold text-lg">{task.title}</div>
                <div className="text-muted-foreground">{task.description}</div>
                <div className="text-sm text-muted-foreground">
                  Due: {format(new Date(task.dueDate), "PPP")}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => startEdit(task)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
