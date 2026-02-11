"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useScheduleTask } from "@/lib/hooks/use-tasks";
import { toast } from "sonner";
import dayjs from "dayjs";

type ScheduleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  initialStart?: string;
  initialEnd?: string;
};

export function ScheduleModal({
  open,
  onOpenChange,
  taskId,
  initialStart,
  initialEnd,
}: ScheduleModalProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const scheduleTask = useScheduleTask(taskId);

  useEffect(() => {
    if (open) {
      const s = initialStart ? dayjs(initialStart).format("YYYY-MM-DDTHH:mm") : dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm");
      const e = initialEnd ? dayjs(initialEnd).format("YYYY-MM-DDTHH:mm") : dayjs().add(2, "hour").format("YYYY-MM-DDTHH:mm");
      setStart(s);
      setEnd(e);
    }
  }, [open, initialStart, initialEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = dayjs(start).toISOString();
    const endDate = dayjs(end).toISOString();
    if (dayjs(start).isAfter(dayjs(end))) {
      toast.error("End must be after start");
      return;
    }
    try {
      await scheduleTask.mutateAsync({ scheduledStart: startDate, scheduledEnd: endDate });
      toast.success("Schedule updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update schedule");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="schedule-start">Start</Label>
            <Input
              id="schedule-start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              aria-label="Schedule start"
            />
          </div>
          <div>
            <Label htmlFor="schedule-end">End</Label>
            <Input
              id="schedule-end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              aria-label="Schedule end"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={scheduleTask.isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
