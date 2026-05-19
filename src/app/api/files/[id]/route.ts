import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteObject } from "@/lib/s3";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await deleteObject(file.s3Key);
  } catch {
    // Continue with DB delete even if S3 delete fails
  }
  await prisma.file.delete({ where: { id } });
  revalidatePath(`/dashboard/projects/${file.projectId}`);

  return NextResponse.json({ ok: true });
}
