"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { NewTaskForm } from "@/components/new-task-form";
import { useCreateTask } from "@/lib/hooks/use-tasks";
import { toast } from "sonner";
import type { TaskCreateMinimalInput } from "@/lib/validations/task";

export default function NewTaskPage() {
  const router = useRouter();
  const createTask = useCreateTask();

  const handleSubmit = async (data: TaskCreateMinimalInput) => {
    try {
      await createTask.mutateAsync(data);
      toast.success("Task created");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">Back</Link>
          </Button>
          <h1 className="text-xl font-semibold">New task</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add a task with the basics. Another user can fill in notes, materials, and tools on the task detail or edit screen.
        </p>
        <NewTaskForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/tasks")}
          submitLabel="Create task"
        />
      </main>
    </div>
  );
}
