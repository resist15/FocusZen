'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { DashboardSummaryDTO } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [summary, setSummary] = useState<DashboardSummaryDTO | null>(null);

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => setSummary(res.data)).catch(console.error);
  }, []);

  if (!summary) return <p className="text-center p-8">Loading dashboard...</p>;

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card><CardContent>Total Tasks: {summary.totalTasks}</CardContent></Card>
      <Card><CardContent>Completed Tasks: {summary.completedTasks}</CardContent></Card>
      <Card><CardContent>Total Goals: {summary.totalGoals}</CardContent></Card>
      <Card><CardContent>Breaks Logged: {summary.breakCount}</CardContent></Card>
      <Card><CardContent>Mindfulness Logs: {summary.mindfulnessCount}</CardContent></Card>
      <Card><CardContent>Weekly Routine %: {summary.weeklyRoutineCompletion}%</CardContent></Card>
    </div>
  );
}
