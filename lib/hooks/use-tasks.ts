"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskStatus } from "@prisma/client";

async function fetchTasks(params: {
  status?: TaskStatus | null;
  q?: string | null;
  requester?: string | null;
}) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.requester) sp.set("requester", params.requester);
  const res = await fetch(`/api/tasks?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json() as Promise<
    Array<{
      id: string;
      summary: string;
      description: string | null;
      notes: string | null;
      requester: string | null;
      location: string | null;
      estimatedMinutes: number | null;
      status: TaskStatus;
      started: boolean;
      startedAt: Date | null;
      completed: boolean;
      completedAt: Date | null;
      scheduledStart: Date | null;
      scheduledEnd: Date | null;
      createdAt: Date;
      updatedAt: Date;
      materials: unknown[];
      tools: unknown[];
    }>
  >;
}

async function fetchTask(id: string) {
  const res = await fetch(`/api/tasks/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Task not found");
    throw new Error("Failed to fetch task");
  }
  return res.json();
}

export function useTasks(params: {
  status?: TaskStatus | null;
  q?: string | null;
  requester?: string | null;
} = {}) {
  return useQuery({
    queryKey: ["tasks", params.status ?? null, params.q ?? null, params.requester ?? null],
    queryFn: () => fetchTasks(params),
  });
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(id!),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          details?: { fieldErrors?: Record<string, string[]> };
        };
        const msg =
          data.error === "Validation failed" && data.details?.fieldErrors
            ? Object.entries(data.details.fieldErrors)
                .flatMap(([k, v]) => (v ?? []).map((m) => `${k}: ${m}`))
                .join("; ") || data.error
            : data.error ?? "Failed to create task";
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

type UpdateTaskPayload = Record<string, unknown> & { id?: string };

export function useUpdateTask(id: string | null = null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateTaskPayload) => {
      const taskId = body.id ?? id;
      if (!taskId) throw new Error("No task id");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- id is omitted from PATCH body
      const { id: _omitId, ...rest } = body;
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update task");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      const taskId = variables.id ?? id;
      if (taskId) qc.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete task");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useStartTask(id: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No task id");
      const res = await fetch(`/api/tasks/${id}/start`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to start task");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      if (id) qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useCompleteTask(id: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No task id");
      const res = await fetch(`/api/tasks/${id}/complete`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to complete task");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      if (id) qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useScheduleTask(id: string | null = null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { id?: string; scheduledStart: string; scheduledEnd: string }) => {
      const taskId = body.id ?? id;
      if (!taskId) throw new Error("No task id");
      const res = await fetch(`/api/tasks/${taskId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledStart: body.scheduledStart, scheduledEnd: body.scheduledEnd }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to schedule task");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      const taskId = variables.id ?? id;
      if (taskId) qc.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}

export function useClearSchedule(id: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No task id");
      const res = await fetch(`/api/tasks/${id}/schedule`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to clear schedule");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      if (id) qc.invalidateQueries({ queryKey: ["task", id] });
    },
  });
}

export function useAddMaterial(taskId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { description: string; quantity?: number; unit?: string; unitPrice?: number; vendor?: string; link?: string; haveIt?: boolean }) => {
      if (!taskId) throw new Error("No task id");
      const res = await fetch(`/api/tasks/${taskId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to add material");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateMaterial(taskId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/materials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update material");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteMaterial(taskId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete material");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAddTool(taskId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string }) => {
      if (!taskId) throw new Error("No task id");
      const res = await fetch(`/api/tasks/${taskId}/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to add tool");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTool(taskId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete tool");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
