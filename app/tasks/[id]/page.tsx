"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useTask,
  useUpdateTask,
  useStartTask,
  useCompleteTask,
  useDeleteTask,
  useAddMaterial,
  useUpdateMaterial,
  useDeleteMaterial,
  useAddTool,
  useDeleteTool,
} from "@/lib/hooks/use-tasks";
import { ScheduleModal } from "@/components/schedule-modal";
import dayjs from "dayjs";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaterialRow } from "@/components/material-row";
import { AddMaterialForm } from "@/components/add-material-form";
import { AddToolForm } from "@/components/add-tool-form";

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: task, isLoading, error } = useTask(id);
  const startTask = useStartTask(id);
  const completeTask = useCompleteTask(id);
  const deleteTask = useDeleteTask();
  const addMaterial = useAddMaterial(id);
  const updateMaterial = useUpdateMaterial(id);
  const deleteMaterial = useDeleteMaterial(id);
  const addTool = useAddTool(id);
  const deleteTool = useDeleteTool(id);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [uncompleteConfirmOpen, setUncompleteConfirmOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted");
      router.push("/tasks");
      router.refresh();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const updateTask = useUpdateTask(id);

  const handleUncomplete = async () => {
    try {
      await updateTask.mutateAsync({
        completed: false,
        completedAt: null,
        status: "NEW",
      });
      toast.success("Task marked not completed");
      setUncompleteConfirmOpen(false);
    } catch {
      toast.error("Failed to update");
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

  type TaskMaterial = { id: string; description: string; quantity: number; unit: string | null; unitPrice: number | null; vendor: string | null; link: string | null; haveIt: boolean };
  type TaskTool = { id: string; name: string };
  const t = task as typeof task & { materials: TaskMaterial[]; tools: TaskTool[] };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">{t.summary}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              {t.requester && <span>Requested by {t.requester}</span>}
              {t.estimatedMinutes != null && <span>· {t.estimatedMinutes} min</span>}
              <span>· Updated {dayjs(t.updatedAt).format("MMM D, YYYY")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tasks/${id}/edit`}>
                <Pencil className="h-4 w-4 mr-1" aria-hidden />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4 mr-1" aria-hidden />
              Delete
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={t.status === "COMPLETED" ? "success" : t.status === "IN_PROGRESS" ? "warning" : "secondary"}>
            {STATUS_LABELS[t.status] ?? t.status}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {t.status !== "IN_PROGRESS" && t.status !== "COMPLETED" && (
            <Button
              size="sm"
              onClick={() => startTask.mutate()}
              disabled={startTask.isPending}
            >
              {startTask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start"}
            </Button>
          )}
          {t.status !== "COMPLETED" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => completeTask.mutate()}
              disabled={completeTask.isPending}
            >
              {completeTask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete"}
            </Button>
          )}
          {t.status === "COMPLETED" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUncompleteConfirmOpen(true)}
            >
              Mark not completed
            </Button>
          )}
        </div>

        {(t.description || t.notes) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Description & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {t.description && <p className="whitespace-pre-wrap">{t.description}</p>}
              {t.notes && (
                <p className="text-muted-foreground whitespace-pre-wrap border-t pt-2 mt-2">
                  {t.notes}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Materials</CardTitle>
            <AddMaterialForm onAdd={addMaterial.mutateAsync} />
          </CardHeader>
          <CardContent>
            {t.materials.length === 0 ? (
              <p className="text-sm text-muted-foreground">No materials listed.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Materials">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Description</th>
                      <th className="text-left py-2 font-medium">Qty</th>
                      <th className="text-left py-2 font-medium">Unit Price</th>
                      <th className="text-left py-2 font-medium">Vendor</th>
                      <th className="text-left py-2 font-medium">Link</th>
                      <th className="text-left py-2 font-medium">Have it?</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {t.materials.map((m: TaskMaterial) => (
                      <MaterialRow
                        key={m.id}
                        material={m}
                        onUpdate={(body) => updateMaterial.mutateAsync({ id: m.id, ...body })}
                        onDelete={() => deleteMaterial.mutateAsync(m.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Tools</CardTitle>
            <AddToolForm onAdd={(name) => addTool.mutateAsync({ name })} />
          </CardHeader>
          <CardContent>
            {t.tools.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tools listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {t.tools.map((tool: TaskTool) => (
                  <Badge
                    key={tool.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {tool.name}
                    <button
                      type="button"
                      onClick={() => deleteTool.mutate(tool.id)}
                      className="rounded p-0.5 hover:bg-muted"
                      aria-label={`Remove ${tool.name}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Schedule</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
              {t.scheduledStart ? "Edit" : "Set"} schedule
            </Button>
          </CardHeader>
          <CardContent>
            {t.scheduledStart && t.scheduledEnd ? (
              <p className="text-sm">
                {dayjs(t.scheduledStart).format("MMM D, YYYY h:mm A")} –{" "}
                {dayjs(t.scheduledEnd).format("MMM D, YYYY h:mm A")}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Not scheduled.</p>
            )}
          </CardContent>
        </Card>

        <ScheduleModal
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          taskId={id}
          initialStart={t.scheduledStart ? dayjs(t.scheduledStart).toISOString() : undefined}
          initialEnd={t.scheduledEnd ? dayjs(t.scheduledEnd).toISOString() : undefined}
        />
      </main>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The task and its materials and tools will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteTask.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uncompleteConfirmOpen} onOpenChange={setUncompleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as not completed?</DialogTitle>
            <DialogDescription>
              This will clear the completed date and set status back to New.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUncompleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUncomplete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
