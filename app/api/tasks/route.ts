import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskCreateSchema } from "@/lib/validations/task";
import { TaskStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as TaskStatus | null;
    const q = searchParams.get("q") ?? "";
    const requester = searchParams.get("requester") ?? "";

    const where: Prisma.TaskWhereInput = {};

    if (status && Object.values(TaskStatus).includes(status)) {
      where.status = status;
    }
    if (q.trim()) {
      where.OR = [
        { summary: { contains: q.trim(), mode: "insensitive" } },
        { description: { contains: q.trim(), mode: "insensitive" } },
      ];
    }
    if (requester.trim()) {
      where.requester = requester.trim();
    }

    const tasks = await prisma.task.findMany({
      where,
      include: { materials: true, tools: true },
      orderBy: [{ updatedAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks:", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = taskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { materials, tools, ...taskData } = parsed.data;
    const task = await prisma.task.create({
      data: {
        ...taskData,
        materials: materials?.length
          ? { create: materials }
          : undefined,
        tools: tools?.length
          ? { create: tools }
          : undefined,
      },
      include: { materials: true, tools: true },
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error("POST /api/tasks:", err);
    const message = err instanceof Error ? err.message : "Failed to create task";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
