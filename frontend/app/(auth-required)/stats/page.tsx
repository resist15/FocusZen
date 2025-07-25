"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Coffee, Brain } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface StatsResponse {
  completedTasks: number;
  totalBreakMinutes: number;
  totalMindfulnessMinutes: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats/weekly");
      setStats(response.data);
    } catch {
      toast.error("Failed to fetch weekly stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Weekly Stats</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <CheckCircle2 className="text-green-600" />
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-center">
                {stats.completedTasks}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-2">
              <Coffee className="text-yellow-600" />
              <CardTitle>Break Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-center">
                {stats.totalBreakMinutes} mins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-2">
              <Brain className="text-purple-600" />
              <CardTitle>Mindfulness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-center">
                {stats.totalMindfulnessMinutes} mins
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-muted-foreground text-center">No stats available.</p>
      )}
    </div>
  );
}
