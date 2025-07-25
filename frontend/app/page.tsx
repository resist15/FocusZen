'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { DashboardSummaryDTO } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Loader2, ListTodo, CheckCircle, Goal,
  Timer, HeartPulse, PercentCircle, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [summary, setSummary] = useState<DashboardSummaryDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(payload.sub || payload.email || 'User');
    } catch (err) {
      console.error('Invalid token', err);
      router.push('/login');
      return;
    }

    // Fetch dashboard summary
    api.get('/dashboard/summary', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
        setAuthChecked(true);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Wait until auth is checked before rendering
  if (!authChecked) return null;

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-background border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">FocusZen</h1>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="text-muted-foreground text-sm hidden sm:inline">
              Hi, {userEmail}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </nav>

      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Summary</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Tasks"
              icon={<ListTodo className="text-blue-500" />}
              value={summary?.totalTasks}
            />
            <StatCard
              title="Completed Tasks"
              icon={<CheckCircle className="text-green-500" />}
              value={summary?.completedTasks}
            />
            <StatCard
              title="Total Goals"
              icon={<Goal className="text-purple-500" />}
              value={summary?.totalGoals}
            />
            <StatCard
              title="Breaks Logged"
              icon={<Timer className="text-orange-500" />}
              value={summary?.breakCount}
            />
            <StatCard
              title="Mindfulness Logs"
              icon={<HeartPulse className="text-pink-500" />}
              value={summary?.mindfulnessCount}
            />
            <StatCard
              title="Weekly Routine %"
              icon={<PercentCircle className="text-yellow-500" />}
              value={`${summary?.weeklyRoutineCompletion ?? 0}%`}
            />
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string | null | undefined;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="p-3 bg-muted rounded-full">{icon}</div>
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-xl font-semibold">
            {value ?? <Loader2 className="animate-spin h-4 w-4 inline" />}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
