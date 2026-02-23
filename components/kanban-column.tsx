"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskCard } from "@/components/task-card";
import type { TaskStatus } from "@prisma/client";

type Task = {
  id: string;
  summary: string;
  requester: string | null;
  estimatedMinutes: number | null;
  status: TaskStatus;
  scheduledStart: string | Date | null;
  scheduledEnd: string | Date | null;
  startedAt: string | Date | null;
  completedAt: string | Date | null;
};

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
};

export function KanbanColumn({ title, status, tasks, onStatusChange }: KanbanColumnProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      try {
        const raw = e.dataTransfer.getData("application/json");
        const data = JSON.parse(raw) as { id: string; status: TaskStatus };
        if (data.status !== status) {
          onStatusChange(data.id, status);
        }
      } catch {
        // ignore
      }
    },
    [status, onStatusChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <Card className="flex flex-col min-w-[280px] max-w-[360px] flex-1">
      <CardHeader className="py-3 px-4 border-b">
        <h3 className="font-semibold text-sm">{title} ({tasks.length})</h3>
      </CardHeader>
      <CardContent
        className="flex-1 p-3 space-y-2 min-h-[200px] overflow-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} draggable />
        ))}
      </CardContent>
    </Card>
  );
}
