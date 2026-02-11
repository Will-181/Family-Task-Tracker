import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scheduleSchema } from "@/lib/validations/task";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        scheduledStart: new Date(parsed.data.scheduledStart),
        scheduledEnd: new Date(parsed.data.scheduledEnd),
      },
      include: { materials: true, tools: true },
    });
    return NextResponse.json(task);
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("POST /api/tasks/[id]/schedule:", err);
    return NextResponse.json(
      { error: "Failed to schedule task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.update({
      where: { id },
      data: { scheduledStart: null, scheduledEnd: null },
      include: { materials: true, tools: true },
    });
    return NextResponse.json(task);
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("DELETE /api/tasks/[id]/schedule:", err);
    return NextResponse.json(
      { error: "Failed to clear schedule" },
      { status: 500 }
    );
  }
}
