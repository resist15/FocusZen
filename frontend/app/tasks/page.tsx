"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { Task } from "@/types/Task"
import axios from "@/lib/axios"
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks")
      setTasks(res.data)
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <AddTaskDialog onTaskAdded={fetchTasks} />
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Button variant={task.completed ? "outline" : "default"}>
                    {task.completed ? "Completed" : "Mark Done"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}