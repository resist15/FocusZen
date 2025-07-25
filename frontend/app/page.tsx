'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { DashboardSummaryDTO } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2, ListTodo, CheckCircle, Goal,
  Timer, HeartPulse, PercentCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Task } from '@/types/Task';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [summary, setSummary] = useState<DashboardSummaryDTO | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('User');
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        JSON.parse(atob(token.split('.')[1])); // optional token validation

        const [userRes, summaryRes, taskRes] = await Promise.all([
          api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUserName(userRes.data.name || 'User');
        setSummary(summaryRes.data);
        setTasks(taskRes.data || []);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchData();
  }, [router]);

  if (!authChecked) return null;

  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Hello, {userName} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back to FocusZen — here's a snapshot of your progress.
        </p>
      </motion.div>

      {/* Dashboard Summary */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <StatCard title="Total Tasks" icon={<ListTodo />} value={summary?.totalTasks} color="bg-blue-500" />
          <StatCard title="Completed Tasks" icon={<CheckCircle />} value={summary?.completedTasks} color="bg-green-500" />
          <StatCard title="Total Goals" icon={<Goal />} value={summary?.totalGoals} color="bg-purple-500" />
          <StatCard title="Breaks Logged" icon={<Timer />} value={summary?.breakCount} color="bg-orange-500" />
          <StatCard title="Mindfulness Logs" icon={<HeartPulse />} value={summary?.mindfulnessCount} color="bg-pink-500" />
          <StatCard
            title="Weekly Routine %"
            icon={<PercentCircle />}
            value={
              typeof summary?.weeklyRoutineCompletion === 'number'
                ? `${summary.weeklyRoutineCompletion.toFixed(1)}%`
                : '0%'
            }
            color="bg-yellow-500"
          />
        </motion.div>
      )}

      {/* Pending Tasks Preview */}
      {pendingTasks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Top Pending Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold text-lg">{task.title}</div>
                  <div className="text-muted-foreground">{task.description}</div>
                  <div className="text-sm text-muted-foreground">
                    Due: {format(new Date(task.dueDate), 'PPP')}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push('/tasks')}>
                    Go to Tasks
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}


function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string | null | undefined;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-card"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Card className="rounded-2xl border-none bg-gradient-to-br from-muted/30 to-background/80">
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`p-3 ${color} text-white rounded-full`}>
            {icon}
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-semibold">
              {value ?? <Loader2 className="animate-spin h-5 w-5 inline" />}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
