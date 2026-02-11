"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListTodo, Calendar, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold mr-6">
          <ListTodo className="h-6 w-6" aria-hidden />
          <span className="hidden sm:inline">Family Task Tracker</span>
        </Link>
        <nav className="flex items-center gap-2 flex-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <LayoutDashboard className="h-4 w-4 sm:mr-2" aria-hidden />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">
              <ListTodo className="h-4 w-4 sm:mr-2" aria-hidden />
              <span className="hidden sm:inline">Tasks</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/calendar">
              <Calendar className="h-4 w-4 sm:mr-2" aria-hidden />
              <span className="hidden sm:inline">Calendar</span>
            </Link>
          </Button>
          <Button size="sm" className="ml-auto" asChild>
            <Link href="/tasks/new">
              <Plus className="h-4 w-4 sm:mr-2" aria-hidden />
              <span className="hidden sm:inline">New Task</span>
            </Link>
          </Button>
        </nav>
      </div>
      {/* Mobile: sticky bottom bar for New Task */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 md:hidden bg-background/95 border-t">
        <Button className="w-full max-w-sm" asChild>
          <Link href="/tasks/new">
            <Plus className="h-4 w-4 mr-2" aria-hidden />
            New Task
          </Link>
        </Button>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </header>
  );
}
