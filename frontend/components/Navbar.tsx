"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        JSON.parse(atob(token.split('.')[1])); // optional token validation

        const [userRes] = await Promise.all([
          api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUserName(userRes.data.name || 'User');
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) router.push('/login');
      } finally {
      }
    };
    fetchData();
  }, [router]);


  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background/95 shadow-sm">
      {/* You can dynamically replace this with current page title */}
      <h1 className="text-lg md:text-xl font-semibold text-muted-foreground">
        Welcome Back
      </h1>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <Avatar>
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
