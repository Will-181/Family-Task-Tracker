import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { materialCreateSchema } from "@/lib/validations/task";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = materialCreateSchema.safeParse(body);
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

    const material = await prisma.material.create({
      data: { taskId: id, ...parsed.data },
    });
    return NextResponse.json(material);
  } catch (err) {
    console.error("POST /api/tasks/[id]/materials:", err);
    return NextResponse.json(
      { error: "Failed to add material" },
      { status: 500 }
    );
  }
}
