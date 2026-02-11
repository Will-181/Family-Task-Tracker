import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.tool.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }
    console.error("DELETE /api/tools/[id]:", err);
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    );
  }
}
