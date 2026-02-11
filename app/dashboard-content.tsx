"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/lib/hooks/use-tasks";
import dayjs from "dayjs";

export function DashboardContent() {
  const { data: allTasks, isLoading } = useTasks();
  const now = dayjs();
  const in7Days = now.add(7, "day");
  const upcoming =
    allTasks?.filter((t) => {
      const start = t.scheduledStart ? dayjs(t.scheduledStart) : null;
      return start && start.isAfter(now) && start.isBefore(in7Days);
    }) ?? [];
  const newOpen =
    allTasks?.filter((t) => t.status === "NEW") ?? [];

  return (
    <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-2">Upcoming (next 7 days)</h2>
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tasks/${t.id}`}
                      className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{t.summary}</span>
                      {t.scheduledStart && (
                        <span className="text-muted-foreground text-sm ml-2">
                          {dayjs(t.scheduledStart).format("MMM D, h:mm A")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2">New / Open</h2>
            {newOpen.length === 0 ? (
              <p className="text-muted-foreground text-sm">No new tasks.</p>
            ) : (
              <ul className="space-y-2">
                {newOpen.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tasks/${t.id}`}
                      className="block rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{t.summary}</span>
                      {t.requester && (
                        <span className="text-muted-foreground text-sm ml-2">
                          — {t.requester}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/tasks">Tasks</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/calendar">Calendar</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
