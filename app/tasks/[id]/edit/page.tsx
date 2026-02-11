"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/task-form";
import { useTask, useUpdateTask } from "@/lib/hooks/use-tasks";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TaskCreateInput } from "@/lib/validations/task";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: task, isLoading, error } = useTask(id);
  const updateTask = useUpdateTask(id);

  const handleSubmit = async (data: TaskCreateInput) => {
    try {
      await updateTask.mutateAsync(data);
      toast.success("Task updated");
      router.push(`/tasks/${id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  };

  if (error || (!isLoading && !task)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4">
          <p className="text-destructive">Task not found.</p>
          <Button asChild variant="link">
            <Link href="/tasks">Back to Tasks</Link>
          </Button>
        </main>
      </div>
    );
  }

  if (isLoading || !task) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
        </main>
      </div>
    );
  }

  type TaskMaterial = { description: string; quantity: number; unit?: string | null; unitPrice?: number | null; vendor?: string | null; link?: string | null; haveIt: boolean };
  type TaskTool = { name: string };
  const t = task as typeof task & { materials: TaskMaterial[]; tools: TaskTool[] };

  const defaultValues: Partial<TaskCreateInput> = {
    summary: t.summary,
    description: t.description ?? "",
    notes: t.notes ?? "",
    requester: t.requester ?? undefined,
    estimatedMinutes: t.estimatedMinutes ?? undefined,
    materials: t.materials.map((m: TaskMaterial) => ({
      description: m.description,
      quantity: m.quantity,
      unit: m.unit ?? undefined,
      unitPrice: m.unitPrice ?? undefined,
      vendor: m.vendor ?? undefined,
      link: m.link ?? undefined,
      haveIt: m.haveIt,
    })),
    tools: t.tools.map((tool: TaskTool) => ({ name: tool.name })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/tasks/${id}`}>Back</Link>
          </Button>
          <h1 className="text-xl font-semibold">Edit task</h1>
        </div>
        <TaskForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/tasks/${id}`)}
          submitLabel="Save changes"
        />
      </main>
    </div>
  );
}
