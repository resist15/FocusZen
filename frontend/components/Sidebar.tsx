"use client";

import { Home, Target, ListTodo, Brain, Timer, BarChart2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/breaks", label: "Breaks", icon: Timer },
  { href: "/mindfulness", label: "Mindfulness", icon: Brain },
  { href: "/routines", label: "Routines", icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden md:flex flex-col bg-muted/20 p-6 border-r border-border shadow-lg backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-8 text-primary tracking-tight">
        Focus<span className="text-yellow-500">Zen</span>
      </h2>
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl transition-colors font-medium",
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
