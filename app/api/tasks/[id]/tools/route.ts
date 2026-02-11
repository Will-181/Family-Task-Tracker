import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toolCreateSchema } from "@/lib/validations/task";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = toolCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const tool = await prisma.tool.create({
      data: { taskId: id, name: parsed.data.name },
    });
    return NextResponse.json(tool);
  } catch (err) {
    console.error("POST /api/tasks/[id]/tools:", err);
    return NextResponse.json(
      { error: "Failed to add tool" },
      { status: 500 }
    );
  }
}
