import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { materialUpdateSchema } from "@/lib/validations/task";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = materialUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const material = await prisma.material.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(material);
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }
    console.error("PATCH /api/materials/[id]:", err);
    return NextResponse.json(
      { error: "Failed to update material" },
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
    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }
    console.error("DELETE /api/materials/[id]:", err);
    return NextResponse.json(
      { error: "Failed to delete material" },
      { status: 500 }
    );
  }
}
