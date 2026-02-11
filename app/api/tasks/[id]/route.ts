import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/validations/task";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { materials: true, tools: true },
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (err) {
    console.error("GET /api/tasks/[id]:", err);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { materials, tools, ...taskData } = parsed.data;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        ...(Array.isArray(materials)
          ? {
              materials: {
                deleteMany: {},
                create: materials,
              },
            }
          : {}),
        ...(Array.isArray(tools)
          ? {
              tools: {
                deleteMany: {},
                create: tools,
              },
            }
          : {}),
      },
      include: { materials: true, tools: true },
    });

    return NextResponse.json(task);
  } catch (err) {
    console.error("PATCH /api/tasks/[id]:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
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
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("DELETE /api/tasks/[id]:", err);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
