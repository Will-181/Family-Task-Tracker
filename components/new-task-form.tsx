"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskCreateMinimalSchema, type TaskCreateMinimalInput } from "@/lib/validations/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getRequestors } from "@/lib/requestors";

type NewTaskFormProps = {
  onSubmit: (data: TaskCreateMinimalInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};

export function NewTaskForm({
  onSubmit,
  onCancel,
  submitLabel = "Create task",
}: NewTaskFormProps) {
  const requestors = getRequestors();

  const form = useForm<TaskCreateMinimalInput>({
    resolver: zodResolver(taskCreateMinimalSchema),
    defaultValues: {
      summary: "",
      description: "",
      requester: "",
    },
  });

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
                <Input
                  placeholder="Short task title"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  aria-label="Summary"
                />
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
              <FormLabel>Requested by *</FormLabel>
              <FormControl>
                <div className="space-y-0">
                  <Input
                    placeholder="Select or type name (e.g. Chris, Will)"
                    list="requestors-list"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || "")}
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
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What needs to be done?"
                  rows={4}
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

        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating…" : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
