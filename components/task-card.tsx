"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
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

export function TaskCard({ task, draggable }: { task: Task; draggable?: boolean }) {
  return (
    <Card
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ id: task.id, status: task.status }));
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <Link href={`/tasks/${task.id}`} className="block" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-3">
          <p className="font-medium text-sm line-clamp-2">{task.summary}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            {task.requester && (
              <span>{task.requester}</span>
            )}
            {task.estimatedMinutes != null && (
              <span>· {task.estimatedMinutes} min</span>
            )}
            {task.scheduledStart && (
              <Badge variant="secondary" className="text-xs">
                {dayjs(task.scheduledStart).format("MMM D")}
              </Badge>
            )}
          </div>
          {(task.startedAt || task.completedAt) && (
            <div className="mt-1 text-xs text-muted-foreground">
              {task.startedAt && <span>Started {dayjs(task.startedAt).format("M/D")}</span>}
              {task.startedAt && task.completedAt && " · "}
              {task.completedAt && <span>Done {dayjs(task.completedAt).format("M/D")}</span>}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
