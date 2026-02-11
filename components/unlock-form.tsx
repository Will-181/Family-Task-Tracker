"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unlockSchema, type UnlockInput } from "@/lib/validations/unlock";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function UnlockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/tasks";
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<UnlockInput>({
    resolver: zodResolver(unlockSchema),
    defaultValues: { passcode: "" },
  });

  async function onSubmit(values: UnlockInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitting(false);
        form.setError("passcode", { message: data.error ?? "Invalid passcode" });
        return;
      }
      // Full page redirect so the browser sends the new cookie on the next request.
      // router.push() can run before the cookie is committed, causing middleware to redirect back to /unlock.
      window.location.href = from;
    } catch {
      setSubmitting(false);
      form.setError("passcode", { message: "Something went wrong" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="passcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passcode</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter family passcode"
                  autoComplete="current-password"
                  autoFocus
                  aria-label="Passcode"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </Form>
  );
}
