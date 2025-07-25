"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import axios from "@/lib/axios"

export function AddTaskDialog({ onTaskAdded }: { onTaskAdded: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    try {
      await axios.post("/tasks", {
        title,
        description,
        dueDate,
        completed: false,
      })
      setOpen(false)
      onTaskAdded()
      setTitle("")
      setDescription("")
    } catch (err) {
      console.error("Failed to add task:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          + Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Due Date</label>
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
            <p className="text-xs text-muted-foreground mt-1">
              Selected: {dueDate ? format(dueDate, "PPP") : "None"}
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={!title || !dueDate}>
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
