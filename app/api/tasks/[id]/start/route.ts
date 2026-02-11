import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.update({
      where: { id },
      data: {
        started: true,
        startedAt: new Date(),
        status: TaskStatus.IN_PROGRESS,
      },
      include: { materials: true, tools: true },
    });
    return NextResponse.json(task);
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("POST /api/tasks/[id]/start:", err);
    return NextResponse.json(
      { error: "Failed to start task" },
      { status: 500 }
    );
  }
}
