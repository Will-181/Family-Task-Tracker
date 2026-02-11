"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanColumn } from "@/components/kanban-column";
import { useTasks, useUpdateTask } from "@/lib/hooks/use-tasks";
import { getRequestors } from "@/lib/requestors";
import { TaskStatus } from "@prisma/client";
import { toast } from "sonner";

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: TaskStatus.NEW, title: "New / Open" },
  { status: TaskStatus.IN_PROGRESS, title: "In Progress" },
  { status: TaskStatus.COMPLETED, title: "Completed" },
];

export default function TasksPage() {
  const [q, setQ] = useState("");
  const [requester, setRequester] = useState<string>("all");
  const { data: tasks = [], isLoading } = useTasks({
    q: q || undefined,
    requester: requester && requester !== "all" ? requester : undefined,
  });
  const updateTask = useUpdateTask(null);

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      try {
        await updateTask.mutateAsync({ id: taskId, status: newStatus });
        toast.success("Task moved");
      } catch {
        toast.error("Failed to move task");
      }
    },
    [updateTask]
  );

  const requestors = getRequestors();
  const byStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Search tasks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
            aria-label="Search tasks"
          />
          <Select value={requester} onValueChange={setRequester}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by requester">
              <SelectValue placeholder="Requester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {requestors.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(({ status, title }) => (
              <KanbanColumn
                key={status}
                status={status}
                title={title}
                tasks={byStatus(status)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
