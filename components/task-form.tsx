"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import { taskCreateSchema, type TaskCreateInput } from "@/lib/validations/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getRequestors } from "@/lib/requestors";
import { Plus, Trash2 } from "lucide-react";

type TaskFormProps = {
  defaultValues?: Partial<TaskCreateInput>;
  onSubmit: (data: TaskCreateInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: TaskFormProps) {
  const requestors = getRequestors();

  const form = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      summary: "",
      description: "",
      notes: "",
      requester: undefined,
      estimatedMinutes: undefined,
      materials: [],
      tools: [],
      ...defaultValues,
    },
  });

  const materials = useFieldArray({ control: form.control, name: "materials" });

  const toolsValue = form.watch("tools");
  const toolsAsString =
    Array.isArray(toolsValue) && toolsValue.length > 0
      ? toolsValue.map((t) => t.name).join(", ")
      : "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary *</FormLabel>
              <FormControl>
                <Input placeholder="Short task title" value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} aria-label="Summary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested by</FormLabel>
              <FormControl>
                <div className="space-y-0">
                  <Input
                    placeholder="Select or type name (e.g. Chris, Will)"
                    list="requestors-list"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                    aria-label="Requested by"
                  />
                  <datalist id="requestors-list">
                    {requestors.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Details…"
                  rows={3}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-label="Description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes…"
                  rows={2}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-label="Notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated time (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 60"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  aria-label="Estimated minutes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="mb-2 block">Materials</FormLabel>
          {materials.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end mb-2 p-3 border rounded-md"
            >
              <FormField
                control={form.control}
                name={`materials.${index}.description`}
                render={({ field: f }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-xs">Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Item" value={f.value ?? ""} onChange={f.onChange} onBlur={f.onBlur} ref={f.ref} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`materials.${index}.quantity`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step="any"
                        value={f.value !== undefined && f.value !== null ? String(f.value) : ""}
                        onChange={(e) => f.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        onBlur={f.onBlur}
                        ref={f.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`materials.${index}.unitPrice`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Unit $</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        value={f.value !== undefined && f.value !== null ? String(f.value) : ""}
                        onChange={(e) => f.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        onBlur={f.onBlur}
                        ref={f.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`materials.${index}.haveIt`}
                render={({ field: f }) => (
                  <FormItem className="flex items-end gap-2 pb-2">
                    <FormControl>
                      <Checkbox
                        checked={f.value === true}
                        onCheckedChange={f.onChange}
                        aria-label="Have it?"
                      />
                    </FormControl>
                    <FormLabel className="text-xs">Have it?</FormLabel>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => materials.remove(index)}
                aria-label="Remove material"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              materials.append({
                description: "",
                quantity: 1,
                unitPrice: undefined,
                haveIt: false,
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add material
          </Button>
        </div>

        <FormField
          control={form.control}
          name="tools"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tools (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Drill, Saw, Hammer"
                  value={toolsAsString ?? ""}
                  onChange={(e) => {
                    const names = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    field.onChange(names.map((name) => ({ name })));
                  }}
                  aria-label="Tools"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
