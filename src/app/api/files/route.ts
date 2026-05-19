import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3_BUCKET } from "@/lib/s3";

const Body = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1).max(255),
  originalName: z.string().min(1).max(255),
  s3Key: z.string().min(1).max(500),
  mimeType: z.string().max(200).optional(),
  sizeBytes: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parse = Body.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parse.error.issues },
      { status: 400 }
    );
  }

  const file = await prisma.file.create({
    data: {
      projectId: parse.data.projectId,
      name: parse.data.name,
      originalName: parse.data.originalName,
      s3Key: parse.data.s3Key,
      s3Bucket: S3_BUCKET,
      mimeType: parse.data.mimeType ?? null,
      sizeBytes: parse.data.sizeBytes,
      uploadedById: session.user.id,
    },
  });

  revalidatePath(`/dashboard/projects/${parse.data.projectId}`);

  return NextResponse.json({ file });
}
