import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const materialSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().positive().default(1),
  unit: z.string().optional(),
  unitPrice: z.coerce.number().min(0).optional(),
  vendor: z.string().optional(),
  link: z.string().url().optional().or(z.literal("")),
  haveIt: z.boolean().default(false),
});

export const toolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
});

/** Minimal payload for creating a new task (only required fields). */
export const taskCreateMinimalSchema = z.object({
  summary: z.string().min(3, "Summary must be at least 3 characters").max(120),
  description: z.string().min(1, "Description is required"),
  requester: z.string().min(1, "Requested by is required").max(120),
});

export const taskCreateSchema = z.object({
  summary: z.string().min(3, "Summary must be at least 3 characters").max(120),
  description: z.string().optional(),
  notes: z.string().optional(),
  requester: z.string().max(120).optional(),
  location: z.string().optional(),
  estimatedMinutes: z.coerce.number().int().positive().max(100_000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  materials: z.array(materialSchema).optional().default([]),
  tools: z.array(toolSchema).optional().default([]),
});

export const taskUpdateSchema = taskCreateSchema.partial().extend({
  summary: z.string().min(3).max(120).optional(),
  materials: z.array(materialSchema).optional(),
  tools: z.array(toolSchema).optional(),
});

export const scheduleSchema = z.object({
  scheduledStart: z.string().min(1),
  scheduledEnd: z.string().min(1),
}).refine(
  (data) => new Date(data.scheduledStart).getTime() < new Date(data.scheduledEnd).getTime(),
  { message: "End must be after start", path: ["scheduledEnd"] }
);

export const materialCreateSchema = materialSchema;

export const materialUpdateSchema = materialSchema.partial();

export const toolCreateSchema = z.object({ name: z.string().min(1, "Name is required") });

export type TaskCreateMinimalInput = z.infer<typeof taskCreateMinimalSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type MaterialCreateInput = z.infer<typeof materialCreateSchema>;
export type MaterialUpdateInput = z.infer<typeof materialUpdateSchema>;
export type ToolCreateInput = z.infer<typeof toolCreateSchema>;
