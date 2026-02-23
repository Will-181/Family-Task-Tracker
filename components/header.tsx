"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderMenu } from "@/components/header-menu";
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
          <ThemeToggle className="ml-auto md:ml-0" />
          <HeaderMenu />
          <Button size="icon" variant="default" className="ml-2 shrink-0" asChild>
            <Link href="/tasks/new" aria-label="New task">
              <Plus className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
