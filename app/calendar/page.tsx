"use client";

import { useRef, useState, useCallback } from "react";
import { Header } from "@/components/header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg, DateSelectArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import { useTasks, useScheduleTask } from "@/lib/hooks/use-tasks";
import { ScheduleModal } from "@/components/schedule-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { toast } from "sonner";

export default function CalendarPage() {
  const router = useRouter();
  const { data: tasks = [], isLoading } = useTasks();
  const scheduleTask = useScheduleTask(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTaskId, setScheduleTaskId] = useState<string | null>(null);
  const [selectRange, setSelectRange] = useState<{ start: string; end: string } | null>(null);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  const scheduledTasks = tasks.filter((t) => t.scheduledStart && t.scheduledEnd);
  const unscheduledTasks = tasks.filter((t) => !t.scheduledStart || !t.scheduledEnd);

  const events = scheduledTasks.map((t) => ({
    id: t.id,
    title: t.summary,
    start: t.scheduledStart ? new Date(t.scheduledStart).toISOString() : "",
    end: t.scheduledEnd ? new Date(t.scheduledEnd).toISOString() : "",
    extendedProps: { taskId: t.id },
  }));

  const handleEventDrop = useCallback(
    async (info: EventDropArg) => {
      const taskId = info.event.id;
      if (!taskId) return;
      try {
        await scheduleTask.mutateAsync({
          id: taskId,
          scheduledStart: info.event.start!.toISOString(),
          scheduledEnd: info.event.end!.toISOString(),
        });
        toast.success("Event moved");
      } catch {
        info.revert();
        toast.error("Failed to move event");
      }
    },
    [scheduleTask]
  );

  const handleEventResize = useCallback(
    async (info: EventResizeDoneArg) => {
      const taskId = info.event.id;
      if (!taskId) return;
      try {
        await scheduleTask.mutateAsync({
          id: taskId,
          scheduledStart: info.event.start!.toISOString(),
          scheduledEnd: info.event.end!.toISOString(),
        });
        toast.success("Event resized");
      } catch {
        info.revert();
        toast.error("Failed to resize event");
      }
    },
    [scheduleTask]
  );

  const handleSelect = useCallback((arg: DateSelectArg) => {
    setSelectRange({
      start: arg.start.toISOString(),
      end: arg.end.toISOString(),
    });
    setSelectModalOpen(true);
  }, []);

  const handleScheduleTaskFromSelect = useCallback(
    async (taskId: string) => {
      if (!selectRange) return;
      try {
        await scheduleTask.mutateAsync({
          id: taskId,
          scheduledStart: selectRange.start,
          scheduledEnd: selectRange.end,
        } as Parameters<typeof scheduleTask.mutateAsync>[0]);
        toast.success("Task scheduled");
        setSelectModalOpen(false);
        setSelectRange(null);
      } catch {
        toast.error("Failed to schedule task");
      }
    },
    [selectRange, scheduleTask]
  );

  const handleEventClick = useCallback((arg: EventClickArg) => {
    router.push(`/tasks/${arg.event.id}`);
  }, [router]);

  const openScheduleModal = (taskId: string) => {
    setScheduleTaskId(taskId);
    setScheduleModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-h-[400px] rounded-lg border bg-card p-2">
          {isLoading ? (
            <p className="text-muted-foreground p-4">Loading calendar…</p>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              editable
              selectable
              select={handleSelect}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              eventClick={handleEventClick}
              height="auto"
              nowIndicator
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
            />
          )}
        </div>

        <aside className="w-full lg:w-72 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unscheduled tasks</CardTitle>
              <p className="text-xs text-muted-foreground">Click to schedule on calendar</p>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[300px] overflow-auto">
              {unscheduledTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">None.</p>
              ) : (
                unscheduledTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded border p-2 text-sm"
                  >
                    <span className="truncate font-medium">{t.summary}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => openScheduleModal(t.id)}
                    >
                      Schedule
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </aside>
      </main>

      {scheduleTaskId && (
        <ScheduleModal
          open={scheduleModalOpen}
          onOpenChange={(open) => {
            setScheduleModalOpen(open);
            if (!open) setScheduleTaskId(null);
          }}
          taskId={scheduleTaskId}
        />
      )}

      <Dialog open={selectModalOpen} onOpenChange={setSelectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a task</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Choose a task to schedule for {selectRange && dayjs(selectRange.start).format("MMM D, h:mm A")} – {selectRange && dayjs(selectRange.end).format("h:mm A")}.
          </p>
          <Select
            onValueChange={(taskId) => {
              handleScheduleTaskFromSelect(taskId);
            }}
          >
            <SelectTrigger aria-label="Select task">
              <SelectValue placeholder="Select task…" />
            </SelectTrigger>
            <SelectContent>
              {unscheduledTasks.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.summary}
                </SelectItem>
              ))}
              {unscheduledTasks.length === 0 && (
                <SelectItem value="_none" disabled>
                  No unscheduled tasks
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => router.push("/tasks/new")}>
            Create new task and schedule
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
